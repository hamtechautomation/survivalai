#!/bin/sh
# make-torrent.sh — build a .torrent of this whole guide for peer-to-peer,
# censorship-resistant distribution. Anyone with the .torrent (or its magnet
# link) can download the full archive from whoever is seeding — no central
# server to block or take down.
#
# This only CREATES the .torrent file. Nothing is published until you load it
# into a BitTorrent client and seed it. Seeding shares the files from YOUR
# machine to others.
#
#   sh make-torrent.sh
#
# Needs one of:  mktorrent   (brew install mktorrent / apt install mktorrent)
#           or:  transmission-create  (comes with Transmission)

cd "$(dirname "$0")" || exit 2
FOLDER="$(pwd)"
NAME="last-light-survival-guide"
OUT="../$NAME.torrent"

# Public open trackers — peers find each other through these.
TRACKERS="udp://tracker.opentrackr.org:1337/announce
udp://open.tracker.clanky.net:6969/announce
udp://tracker.torrent.eu.org:451/announce
udp://exodus.desync.com:6969/announce
udp://tracker.openbittorrent.com:6969/announce"

if command -v mktorrent >/dev/null 2>&1; then
  echo "Building $OUT with mktorrent …"
  # shellcheck disable=SC2046
  mktorrent -v -l 20 -n "$NAME" \
    $(printf -- '-a %s ' $TRACKERS) \
    -o "$OUT" "$FOLDER" || exit 1

elif command -v transmission-create >/dev/null 2>&1; then
  echo "Building $OUT with transmission-create …"
  TC=""
  for t in $TRACKERS; do TC="$TC -t $t"; done
  # shellcheck disable=SC2086
  transmission-create -o "$OUT" $TC "$FOLDER" || exit 1

else
  echo "No torrent tool found. Install one:"
  echo "  macOS:  brew install mktorrent"
  echo "  Debian/Ubuntu:  sudo apt install mktorrent"
  echo "  or install the Transmission client (provides transmission-create)"
  exit 2
fi

echo ""
echo "✓ Created $OUT"
echo "Next:"
echo "  1. Open it in a BitTorrent client (qBittorrent, Transmission) and start SEEDING."
echo "  2. Share the .torrent file, or copy its magnet link from the client, anywhere."
echo "  3. As long as one person seeds, the whole guide stays downloadable."
