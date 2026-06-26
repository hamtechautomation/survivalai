#!/bin/sh
# extract-map.sh — carve any region of the world out of the global OpenStreetMap
# basemap into one small offline .pmtiles file for maps.html.
#
# It pulls ONLY your bounding box from the hosted global map using HTTP range
# requests, so you download megabytes, not the whole 100 GB planet.
#
#   sh extract-map.sh <name> <minLon> <minLat> <maxLon> <maxLat> [maxzoom]
#
# Examples:
#   sh extract-map.sh ne-england -3.7 53.2 0.3 55.5 12      # the bundled demo
#   sh extract-map.sh london    -0.55 51.25 0.30 51.70 14   # street-level detail
#   sh extract-map.sh wales     -5.4  51.3 -2.6 53.5  13
#
# Higher maxzoom = more street detail = bigger file. 11≈towns, 12≈roads,
# 14≈full streets, 15≈buildings. Find any bounding box at bboxfinder.com.

cd "$(dirname "$0")" || exit 2
NAME="$1"; MINLON="$2"; MINLAT="$3"; MAXLON="$4"; MAXLAT="$5"; MAXZOOM="${6:-12}"

if [ -z "$MAXLAT" ]; then
  echo "Usage: sh extract-map.sh <name> <minLon> <minLat> <maxLon> <maxLat> [maxzoom]"
  exit 2
fi

mkdir -p maps
BIN="./pmtiles"

# --- get the pmtiles tool if we don't have it ---
if ! [ -x "$BIN" ] && ! command -v pmtiles >/dev/null 2>&1; then
  echo "Fetching the pmtiles tool…"
  OS=$(uname -s); ARCH=$(uname -m)
  case "$ARCH" in x86_64|amd64) A=x86_64;; arm64|aarch64) A=arm64;; *) A="$ARCH";; esac
  case "$OS" in Darwin) FILE="go-pmtiles-1.30.3_Darwin_${A}.zip";; Linux) FILE="go-pmtiles_1.30.3_Linux_${A}.tar.gz";; *) echo "Unsupported OS $OS — download pmtiles from github.com/protomaps/go-pmtiles/releases"; exit 2;; esac
  URL="https://github.com/protomaps/go-pmtiles/releases/download/v1.30.3/$FILE"
  curl -sL -o /tmp/pmt.pkg "$URL" || { echo "download failed"; exit 1; }
  case "$FILE" in *.zip) unzip -o -q /tmp/pmt.pkg -d . ;; *.tar.gz) tar -xzf /tmp/pmt.pkg -C . ;; esac
  chmod +x "$BIN" 2>/dev/null
fi
command -v pmtiles >/dev/null 2>&1 && BIN="pmtiles"

# --- find the latest global build (server keeps recent dated files) ---
echo "Finding latest global map build…"
SRC=""
i=0
while [ $i -le 14 ]; do
  D=$(date -v-${i}d +%Y%m%d 2>/dev/null || date -d "-$i day" +%Y%m%d 2>/dev/null)
  if curl -sI --max-time 12 -o /dev/null -w '%{http_code}' "https://build.protomaps.com/$D.pmtiles" | grep -q 200; then
    SRC="https://build.protomaps.com/$D.pmtiles"; break
  fi
  i=$((i+1))
done
[ -z "$SRC" ] && { echo "Couldn't find a recent global build. Try later."; exit 1; }
echo "Source: $SRC"

OUT="maps/$NAME.pmtiles"
echo "Extracting $NAME  (bbox $MINLON,$MINLAT,$MAXLON,$MAXLAT  maxzoom $MAXZOOM) → $OUT"
"$BIN" extract "$SRC" "$OUT" --bbox="$MINLON,$MINLAT,$MAXLON,$MAXLAT" --maxzoom="$MAXZOOM" || exit 1

echo ""
echo "✓ Done: $OUT  ($(du -h "$OUT" | cut -f1))"

# Register the region so the map page's picker lists it
if command -v python3 >/dev/null 2>&1; then
  python3 - "$NAME" "$MINLON" "$MINLAT" "$MAXLON" "$MAXLAT" <<'PY'
import json, os, sys
name, mnl, mnt, mxl, mxt = sys.argv[1], *map(float, sys.argv[2:6])
path = os.path.join('maps', 'regions.json')
data = {'regions': []}
if os.path.exists(path):
    try: data = json.load(open(path))
    except Exception: pass
clat, clon = (mnt + mxt) / 2, (mnl + mxl) / 2
span = max(mxl - mnl, mxt - mnt)
zoom = 11 if span < 0.5 else 9 if span < 1.5 else 7 if span < 4 else 6 if span < 9 else 4
entry = {'name': name, 'file': name + '.pmtiles', 'center': [round(clat, 3), round(clon, 3)], 'zoom': zoom}
regs = [r for r in data.get('regions', []) if r.get('file') != entry['file']]
regs.append(entry)
data['regions'] = regs
json.dump(data, open(path, 'w'), indent=2)
print('Registered "%s" in maps/regions.json — reload maps.html and pick it from the Region menu.' % name)
PY
else
  echo "Add it to maps/regions.json by hand to show it in the picker, or reload maps.html."
fi
