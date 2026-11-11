#!/bin/sh
# make-covers.sh — render page 1 of every bundled PDF to a small cover image
# used by the Reference Library (literature.html) cards and bookshelf.
#
#   sh make-covers.sh              # uses PDFs in ./pdfs
#   sh make-covers.sh /path/pdfs   # or another folder
#
# Needs: pdftoppm (poppler-utils). Optional: ImageMagick `convert` to
# recompress (covers end up ~10–20 KB each). Output: assets/covers/<name>.jpg
# Re-run whenever a bundled PDF is added or replaced; commit the images.
set -eu
SRC="${1:-pdfs}"
OUT="$(dirname "$0")/assets/covers"
mkdir -p "$OUT"
command -v pdftoppm >/dev/null 2>&1 || { echo "pdftoppm not found — install poppler-utils"; exit 1; }

n=0
for pdf in "$SRC"/*.pdf; do
  [ -f "$pdf" ] || continue
  name=$(basename "$pdf" .pdf)
  tmp="$OUT/.$name"
  pdftoppm -f 1 -l 1 -singlefile -jpeg -jpegopt quality=85 -scale-to-x 360 -scale-to-y -1 "$pdf" "$tmp"
  if command -v convert >/dev/null 2>&1; then
    convert "$tmp.jpg" -strip -resize 240x -quality 72 -interlace JPEG "$OUT/$name.jpg"
    rm -f "$tmp.jpg"
  else
    mv "$tmp.jpg" "$OUT/$name.jpg"
  fi
  n=$((n + 1))
  echo "  cover: $name.jpg"
done
echo "Rendered $n cover(s) into $OUT"
