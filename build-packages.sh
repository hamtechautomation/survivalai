#!/bin/sh
# build-packages.sh — build the downloadable ZIP packages for the website.
#
#   sh build-packages.sh
#
# Produces, in downloads/ (gitignored, uploaded by deploy-s3.sh):
#   last-light-survival-guide-lite.zip      ~2 MB    — the app only (no PDFs/maps/AI index)
#   last-light-survival-guide-standard.zip  ~560 MB  — app + 29 PDFs + AI index + a regional map
#
# Both extract to a folder named last-light-survival-guide/.

set -e
cd "$(dirname "$0")"
command -v zip >/dev/null 2>&1 || { echo "zip not found — install it."; exit 2; }
command -v rsync >/dev/null 2>&1 || { echo "rsync not found — install it."; exit 2; }

NAME="last-light-survival-guide"
OUT="$(pwd)/downloads"
STAGE="$(mktemp -d)/$NAME"
mkdir -p "$OUT" "$STAGE"

echo "Staging files…"
# Everything that should ship, minus dev/infra/build artefacts.
rsync -a \
  --exclude '.git' --exclude '.claude' --exclude 'node_modules' \
  --exclude '.DS_Store' --exclude '.env*' --exclude 'downloads' \
  --exclude 'dist' --exclude 'pmtiles' --exclude '*.zip' \
  --exclude 'marketing' --exclude 'home.html' --exclude 'docs' \
  --exclude 'TESTING.md' \
  ./ "$STAGE"/

# Regenerate MANIFEST.sha256 for exactly the files in a stage, so `sh verify.sh`
# works in the extracted download. (The repo manifest lists files that are
# excluded from packages — docs/, home.html — which made verify report them missing.)
regen_manifest() {
  ( cd "$1" && find . -type f ! -name 'MANIFEST.sha256' ! -name '.DS_Store' \
      | sed 's|^\./||' | LC_ALL=C sort \
      | while IFS= read -r f; do shasum -a 256 "$f"; done > MANIFEST.sha256 )
}

# ── Standard: the full library (everything staged) ──
# Remove any existing archive first — `zip` UPDATES an existing file (adds/replaces
# entries but never removes stale ones), so rebuilding must start from a clean file
# or deleted/excluded files (e.g. marketing/) would linger from a previous build.
echo "Building standard ZIP (this includes the PDFs + map — may take a moment)…"
regen_manifest "$STAGE"
rm -f "$OUT/$NAME-standard.zip"
( cd "$STAGE/.." && zip -r -q -9 "$OUT/$NAME-standard.zip" "$NAME" )
echo "  → downloads/$NAME-standard.zip  ($(du -h "$OUT/$NAME-standard.zip" | cut -f1))"

# ── Lite: strip the big data (PDFs, maps, AI chunk index) ──
echo "Building lite ZIP (app only)…"
rm -f "$STAGE"/pdfs/*.pdf 2>/dev/null || true
rm -f "$STAGE"/maps/*.pmtiles 2>/dev/null || true
rm -f "$STAGE"/search/pdf-chunks.json 2>/dev/null || true
regen_manifest "$STAGE"
rm -f "$OUT/$NAME-lite.zip"
( cd "$STAGE/.." && zip -r -q -9 "$OUT/$NAME-lite.zip" "$NAME" )
echo "  → downloads/$NAME-lite.zip  ($(du -h "$OUT/$NAME-lite.zip" | cut -f1))"

rm -rf "$(dirname "$STAGE")"
echo ""
echo "✓ Packages built in downloads/"
echo "  They upload to your bucket on the next  sh deploy-s3.sh"
