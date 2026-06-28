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
# -f (noglob): the $EXCLUDES patterns below (*.sh, *.md, .git/*) are passed
# UNQUOTED so word-splitting separates them — but without noglob the shell also
# pathname-expands them into real local filenames, which aws s3 sync then rejects
# as unknown options. Disable globbing so the patterns reach aws literally.
set -f
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
  --exclude .env* --exclude *.sh --exclude *.md --exclude docs/* \
  --exclude infra/* --exclude pmtiles"

echo "1/3  Syncing site to s3://$BUCKET (1-year cache)…"
# Long cache on everything — filenames are stable and you update rarely.
# Safe because the SERVICE WORKER is the update channel (see step 2): when you
# bump the cache version in sw.js, the new worker force-refreshes every file
# from the network, so returning visitors get the update despite the long cache.
# delete = remove files from the bucket that no longer exist locally.
# shellcheck disable=SC2086
aws s3 sync . "s3://$BUCKET" --delete $EXCLUDES \
  --cache-control "public,max-age=31536000"

echo "2/3  No-cache for the service worker (the update trigger)…"
# sw.js must always revalidate — it's how updates reach already-cached visitors.
aws s3 cp sw.js "s3://$BUCKET/sw.js" \
  --content-type "application/javascript" --cache-control "no-cache" >/dev/null

echo "3/3  CloudFront invalidation…"
if [ -n "$CF_DIST" ]; then
  aws cloudfront create-invalidation --distribution-id "$CF_DIST" --paths "/*" >/dev/null
  echo "      invalidated /* on $CF_DIST"
else
  echo "      (skipped — set CF_DIST=<id> to auto-invalidate; otherwise the CDN may serve old files for up to an hour)"
fi

echo ""
echo "ℹ  Reminder: when you change site CONTENT, bump the CACHE version in sw.js"
echo "   (e.g. last-light-v28 -> v29) before deploying, so returning visitors update."

echo ""
echo "✓ Deployed to s3://$BUCKET"
echo "  Serve it over HTTPS via CloudFront (required for the offline/PWA features)."
