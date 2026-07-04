#!/bin/sh
# make-usb.sh — put a verified copy of The Last Light Survival Guide on a USB drive.
#
#   sh make-usb.sh /Volumes/MYUSB              (macOS)
#   sh make-usb.sh /media/$USER/MYUSB          (Linux)
#   sh make-usb.sh /Volumes/MYUSB --lite       (skip PDFs / maps / AI index, ~2 MB)
#
# Copies the guide into <target>/last-light-survival-guide/, writes a fresh
# SHA-256 manifest computed from the SOURCE files, then re-reads every byte on
# the stick and checks it against that manifest — so a flaky drive or a bad
# copy is caught NOW, not the day you need the guide.
#
# Zero dependencies beyond rsync + shasum/sha256sum (preinstalled on macOS and
# nearly every Linux).

set -e
cd "$(dirname "$0")"

TARGET="$1"
LITE=""
[ "$2" = "--lite" ] && LITE=1
[ "$1" = "--lite" ] && { LITE=1; TARGET="$2"; }

if [ -z "$TARGET" ]; then
  echo "Usage: sh make-usb.sh /path/to/usb-volume [--lite]"
  echo "  macOS example:  sh make-usb.sh /Volumes/MYUSB"
  echo "  Linux example:  sh make-usb.sh /media/\$USER/MYUSB"
  exit 2
fi
[ -d "$TARGET" ] || { echo "✗ $TARGET is not a directory (is the drive mounted?)"; exit 2; }
[ -w "$TARGET" ] || { echo "✗ $TARGET is not writable"; exit 2; }
command -v rsync >/dev/null 2>&1 || { echo "rsync not found — install it."; exit 2; }
if command -v shasum >/dev/null 2>&1; then SHA="shasum -a 256";
elif command -v sha256sum >/dev/null 2>&1; then SHA="sha256sum";
else echo "No shasum/sha256sum found."; exit 2; fi

DEST="$TARGET/last-light-survival-guide"
echo "1/3  Copying the guide to $DEST …"
mkdir -p "$DEST"
# Same file set as the downloadable package (dev/infra artefacts excluded).
rsync -a --delete \
  --exclude '.git' --exclude '.claude' --exclude 'node_modules' \
  --exclude '.DS_Store' --exclude '.env*' --exclude 'downloads' \
  --exclude 'dist' --exclude 'pmtiles' --exclude '*.zip' \
  --exclude 'marketing' --exclude 'home.html' --exclude 'docs' \
  --exclude 'TESTING.md' --exclude 'MANIFEST.sha256' \
  ./ "$DEST"/
if [ -n "$LITE" ]; then
  echo "     (lite: removing PDFs, maps and the AI chunk index)"
  rm -f "$DEST"/pdfs/*.pdf "$DEST"/maps/*.pmtiles "$DEST"/search/pdf-chunks.json 2>/dev/null || true
fi

echo "2/3  Hashing source files (this is what makes the copy trustworthy)…"
# Manifest is computed from the files ON THE STICK's file list but hashed from
# the SOURCE copy — verify then re-reads the stick, proving the two match.
( cd "$DEST" && find . -type f ! -name 'MANIFEST.sha256' ! -name '.DS_Store' \
    | sed 's|^\./||' | LC_ALL=C sort ) | while IFS= read -r f; do
  ( $SHA "$f" )
done > "$DEST/MANIFEST.sha256"

echo "3/3  Verifying every byte on the drive…"
sync
( cd "$DEST" && sh verify.sh )

SIZE=$(du -sh "$DEST" | cut -f1)
echo ""
echo "✓ Done — $SIZE at $DEST"
echo "  Eject the drive properly, label it, and store it somewhere safe."
echo "  To use: open last-light-survival-guide/index.html in any browser."
