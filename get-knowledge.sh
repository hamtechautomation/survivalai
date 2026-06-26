#!/bin/sh
# get-knowledge.sh — download a large Kiwix ZIM archive (Wikipedia, Project
# Gutenberg, etc.) to read offline with Kiwix. Resumes if interrupted, which
# matters for multi-gigabyte files on a flaky connection.
#
# 1. Find the file you want at https://download.kiwix.org/zim/  (or the links
#    on expansion.html). Copy its full URL.
# 2. Run:   sh get-knowledge.sh <URL> [destination-folder]
#
# Example:
#   sh get-knowledge.sh https://download.kiwix.org/zim/wikipedia/wikipedia_en_simple_all_maxi_2025-01.zim ./zim
#
# Then open the downloaded .zim in Kiwix (kiwix.org/download).

URL="$1"
DEST="${2:-./zim}"

if [ -z "$URL" ]; then
  echo "Usage: sh get-knowledge.sh <ZIM-URL> [destination-folder]"
  echo "Browse files at: https://download.kiwix.org/zim/"
  exit 2
fi

mkdir -p "$DEST" || exit 2
FILE="$DEST/$(basename "$URL")"

echo "Downloading to: $FILE"
echo "(safe to Ctrl-C and re-run — it resumes)"
echo ""

if command -v wget >/dev/null 2>&1; then
  wget -c -O "$FILE" "$URL"
elif command -v curl >/dev/null 2>&1; then
  curl -L -C - -o "$FILE" "$URL"
else
  echo "Need wget or curl installed."
  exit 2
fi

echo ""
echo "✓ Done: $FILE"
echo "Open it in Kiwix — install from https://kiwix.org/en/download/ if you haven't."
