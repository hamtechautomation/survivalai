#!/bin/sh
# deploy-s3.sh — publish the guide to an AWS S3 bucket (served via CloudFront).
#
# Unlike GitHub Pages, S3 has no per-file size limit, so it holds the big PDFs
# and map files too. This script just SYNCS the folder and sets sensible
# cache/content-type headers; you create the bucket + CloudFront once (see
# README → "Hosting on AWS S3").
#
#   BUCKET=my-survival-guide  CF_DIST=E123ABC  sh deploy-s3.sh
#
#   BUCKET   (required)  the S3 bucket name
#   CF_DIST  (optional)  CloudFront distribution ID — if set, the script
#                        invalidates the cache so updates go live immediately
#
# Needs the AWS CLI configured (`aws configure`) with write access to the bucket.

set -e
cd "$(dirname "$0")"

# Load your private hosting config (bucket / distribution / domain) if present.
# .env.deploy is gitignored, so your personal infra never lands in the repo.
# Copy .env.deploy.example to .env.deploy and fill it in.
if [ -f .env.deploy ]; then
  . ./.env.deploy
fi

if [ -z "$BUCKET" ]; then
  echo "No bucket set. Create .env.deploy (copy .env.deploy.example) or run:"
  echo "  BUCKET=my-bucket CF_DIST=E123 sh deploy-s3.sh"
  exit 2
fi
command -v aws >/dev/null 2>&1 || { echo "AWS CLI not found — install it and run 'aws configure'."; exit 2; }

EXCLUDES="--exclude .git/* --exclude .claude/* --exclude node_modules/* \
  --exclude .DS_Store --exclude */.DS_Store --exclude .gitignore \
  --exclude .env* --exclude *.sh --exclude TESTING.md --exclude pmtiles"

echo "1/4  Syncing site to s3://$BUCKET (default 1-hour cache)…"
# Most files: short cache so content updates show within an hour.
# delete = remove files from the bucket that no longer exist locally.
# shellcheck disable=SC2086
aws s3 sync . "s3://$BUCKET" --delete $EXCLUDES \
  --cache-control "public,max-age=3600"

echo "2/4  Long cache for big, rarely-changing assets (PDFs, maps, fonts)…"
# shellcheck disable=SC2086
aws s3 cp "s3://$BUCKET" "s3://$BUCKET" --recursive --metadata-directive REPLACE \
  --exclude "*" --include "pdfs/*.pdf" --include "maps/*.pmtiles" \
  --include "search/pdf-chunks.json" --include "assets/vendor/*" \
  --cache-control "public,max-age=2592000" >/dev/null 2>&1 || true
# .pmtiles content-type (loaded as a buffer, so octet-stream is correct)
aws s3 cp "s3://$BUCKET/maps" "s3://$BUCKET/maps" --recursive \
  --metadata-directive REPLACE --exclude "*" --include "*.pmtiles" \
  --content-type "application/octet-stream" --cache-control "public,max-age=2592000" >/dev/null 2>&1 || true

echo "3/4  No-cache for the service worker (so updates propagate)…"
# sw.js MUST revalidate every load, or users get stuck on an old version.
aws s3 cp sw.js "s3://$BUCKET/sw.js" \
  --content-type "application/javascript" --cache-control "no-cache" >/dev/null

echo "4/4  CloudFront invalidation…"
if [ -n "$CF_DIST" ]; then
  aws cloudfront create-invalidation --distribution-id "$CF_DIST" --paths "/*" >/dev/null
  echo "      invalidated /* on $CF_DIST"
else
  echo "      (skipped — set CF_DIST=<id> to auto-invalidate; otherwise the CDN may serve old files for up to an hour)"
fi

echo ""
echo "✓ Deployed to s3://$BUCKET"
echo "  Serve it over HTTPS via CloudFront (required for the offline/PWA features)."
