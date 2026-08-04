#!/bin/sh
# get-library.sh — download a whole set of Kiwix ZIM archives in one run, and
# (if kiwix-tools is installed) build the combined library.xml so kiwix-serve
# can serve all of them together with search across the lot.
#
# Thin wrapper around get-knowledge.sh: it just calls that script once per
# archive, so all the same robustness applies — checkpointing, resume,
# retries with backoff, SHA-256 verification. A crash or reboot partway
# through only costs you the archive that was mid-download; re-run the same
# command and it skips everything already verified and picks up where it
# stopped.
#
#   sh get-library.sh core            # curated bundle, no single archive over
#                                      # ~20 GB (see CORE_PRESETS below)
#   sh get-library.sh everything      # the entire catalogue, incl. full
#                                      # Wikipedia maxi — 400+ GB, needs a
#                                      # real server/NAS, asks to confirm
#   sh get-library.sh wikimed gutenberg wikibooks     # pick your own
#   sh get-library.sh --recheck       # re-verify everything already on disk
#   sh get-library.sh --index         # just (re)build library.xml, no downloads
#
# All archives land in ./zim (override with ZIM_DEST=/path sh get-library.sh …).

cd "$(dirname "$0")" || exit 2
DEST="${ZIM_DEST:-./zim}"

# The practically-useful set for a survival library without needing a NAS:
# medical + travel/terrain + textbooks + repair + dictionary + primary texts
# + the four on-theme Zimgit guides + Simple Wikipedia as a broad fallback.
# Deliberately excludes wikipedia-maxi/nopic and the 200 GB Gutenberg full
# library — pull those individually if you have the disk for them.
CORE_PRESETS="wikimed wikipedia-simple gutenberg wikibooks wikivoyage wiktionary wikisource ifixit survival-post-disaster survival-medicine survival-water survival-knots"

usage() {
  echo "Usage:"
  echo "  sh get-library.sh core                 # curated bundle (see script header)"
  echo "  sh get-library.sh everything            # the whole catalogue (400+ GB)"
  echo "  sh get-library.sh <preset> [preset...]  # pick specific archives"
  echo "  sh get-library.sh --recheck             # verify what's already on disk"
  echo "  sh get-library.sh --index               # rebuild zim/library.xml only"
  echo ""
  echo "Run 'sh get-knowledge.sh list' for the full preset catalogue with live sizes."
}

build_index() {
  if ! command -v kiwix-manage >/dev/null 2>&1; then
    echo ""
    echo "ℹ  kiwix-manage not found — skipping library.xml."
    echo "   Install kiwix-tools to get a combined catalogue + search across"
    echo "   every archive (macOS: brew install kiwix-tools · Debian/Pi: apt"
    echo "   install kiwix-tools), then re-run: sh get-library.sh --index"
    echo "   Without it, Kiwix (desktop app) can still open each .zim in"
    echo "   $DEST individually — just File > Open."
    return 0
  fi
  count=$(ls "$DEST"/*.zim 2>/dev/null | wc -l | tr -d ' ')
  if [ "$count" -eq 0 ]; then
    echo "No .zim files in $DEST yet — nothing to index."
    return 0
  fi
  echo "Building $DEST/library.xml from $count archive(s) …"
  rm -f "$DEST/library.xml"
  # shellcheck disable=SC2086
  if kiwix-manage "$DEST/library.xml" add "$DEST"/*.zim; then
    echo "✓ $DEST/library.xml written."
    echo "  Serve everything at once with:"
    echo "    kiwix-serve --port 8090 --library $DEST/library.xml"
    echo "  Then open http://localhost:8090 — one home page, search across all archives."
  else
    echo "✗ kiwix-manage failed — see output above."
  fi
}

case "$1" in
  ""|-h|--help)
    usage; exit 0 ;;
  --index)
    build_index; exit $? ;;
  --recheck)
    sh get-knowledge.sh --recheck "$DEST"; exit $? ;;
  core)
    presets="$CORE_PRESETS" ;;
  everything)
    # Keep in sync with ALL_PRESETS in get-knowledge.sh.
    presets="wikipedia-maxi wikipedia-nopic wikipedia-mini wikipedia-simple wikimed gutenberg wikibooks wikivoyage wiktionary wikisource ifixit survival-post-disaster survival-medicine survival-water survival-knots"
    echo "⚠  'everything' includes full Wikipedia maxi and the full Gutenberg"
    echo "   library — several hundred GB combined. This can take days on a"
    echo "   home connection and needs matching free disk space at $DEST."
    printf "   Continue? [y/N] "
    read -r ans
    case "$ans" in y|Y|yes|YES) ;; *) echo "Cancelled."; exit 0 ;; esac
    ;;
  *)
    presets="$*" ;;
esac

mkdir -p "$DEST" || exit 2
echo "Fetching $(printf '%s\n' $presets | wc -l | tr -d ' ') archive(s) into $DEST …"
echo ""

ok_list=""
fail_list=""
for p in $presets; do
  echo "════════════════════════════════════════════════════════════════"
  echo "  $p"
  echo "════════════════════════════════════════════════════════════════"
  if sh get-knowledge.sh "$p" "$DEST"; then
    ok_list="$ok_list $p"
  else
    fail_list="$fail_list $p"
    echo "⚠  $p failed — continuing with the rest of the list."
  fi
  echo ""
done

build_index

echo "════════════════════════════════════════════════════════════════"
echo "Summary"
echo "════════════════════════════════════════════════════════════════"
[ -n "$ok_list" ]   && echo "✓ Done:   $ok_list"
[ -n "$fail_list" ] && { echo "✗ Failed: $fail_list"; echo "  Re-run 'sh get-library.sh$fail_list' to retry just those — completed ones are skipped automatically."; }
du -sh "$DEST" 2>/dev/null | awk '{print "Total on disk: " $1}'
[ -z "$fail_list" ]
