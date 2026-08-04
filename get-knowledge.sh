#!/bin/sh
# get-knowledge.sh — download a Kiwix ZIM knowledge archive (Wikipedia,
# Project Gutenberg, WikiMed, etc.) into ./zim, with no setup beyond curl.
#
# Built for archives that take HOURS OR DAYS on a home connection: it
# checkpoints progress to disk, resumes exactly where it left off after a
# crash/reboot/Ctrl-C, retries transient network failures with backoff, and
# verifies the finished file against the SHA-256 Kiwix publishes for it (via
# the HTTP Digest header on download.kiwix.org) — not just a size check.
#
#   sh get-knowledge.sh wikipedia-maxi           # the one-button case:
#                                                 # full English Wikipedia
#                                                 # w/ images (~115 GB) -> ./zim/
#   sh get-knowledge.sh list                      # see all presets + live sizes
#   sh get-knowledge.sh gutenberg ./zim            # any other preset
#   sh get-knowledge.sh <raw-zim-url> [dest]       # anything not in the list
#   sh get-knowledge.sh --recheck [dest]           # re-verify files already
#                                                   # on disk, no downloading
#
# Safe to Ctrl-C and re-run any time — it picks up the partial file and
# keeps going. Re-running after a full, verified download is a no-op.
#
# For the *whole* curated library (Wikipedia + WikiMed + Gutenberg + more) in
# one run, see get-library.sh — it calls this script preset by preset.
#
# See also: expansion.html (the same catalogue, browsable in the app).

DEST_DEFAULT="./zim"
BASE="https://download.kiwix.org/zim"
MAX_ATTEMPTS=100        # ~ generous — a truly dead URL fails fast at resolve time
STALL_SECS=180          # abort+retry a connection stuck below 1 B/s this long

# ---------------------------------------------------------------------------
# Preset catalogue: name -> "category|filename-glob|label"
# Filenames on download.kiwix.org are date-stamped (…_2026-02.zim) and roll
# forward every few months, so we resolve the newest match at run time
# instead of hardcoding a date that would go stale.
# ---------------------------------------------------------------------------
preset_info() {
  case "$1" in
    wikipedia-maxi)    echo "wikipedia|wikipedia_en_all_maxi_*.zim|Wikipedia — full, with images" ;;
    wikipedia-nopic)   echo "wikipedia|wikipedia_en_all_nopic_*.zim|Wikipedia — full, no images" ;;
    wikipedia-mini)    echo "wikipedia|wikipedia_en_all_mini_*.zim|Wikipedia — mini (intros only)" ;;
    wikipedia-simple)  echo "wikipedia|wikipedia_en_simple_all_maxi_*.zim|Simple English Wikipedia" ;;
    wikimed)           echo "wikipedia|wikipedia_en_medicine_maxi_*.zim|Medical Wikipedia (WikiMed)" ;;
    gutenberg)         echo "gutenberg|gutenberg_en_all_*.zim|Project Gutenberg — full library" ;;
    wikibooks)         echo "wikibooks|wikibooks_en_all_maxi_*.zim|Wikibooks (open textbooks)" ;;
    wikivoyage)        echo "wikivoyage|wikivoyage_en_all_maxi_*.zim|Wikivoyage (travel/terrain guide)" ;;
    wiktionary)        echo "wiktionary|wiktionary_en_all_nopic_*.zim|Wiktionary (dictionary)" ;;
    wikisource)        echo "wikisource|wikisource_en_all_maxi_*.zim|Wikisource (primary texts)" ;;
    ifixit)            echo "ifixit|ifixit_en_all_*.zim|iFixit repair guides" ;;
    survival-post-disaster) echo "other|zimgit-post-disaster_en_*.zim|Post-Disaster Guide (Zimgit)" ;;
    survival-medicine) echo "other|zimgit-medicine_en_*.zim|Where There Is No Doctor et al. (Zimgit)" ;;
    survival-water)    echo "other|zimgit-water_en_*.zim|Water/sanitation guide (Zimgit)" ;;
    survival-knots)    echo "other|zimgit-knots_en_*.zim|Knots reference (Zimgit)" ;;
    *) return 1 ;;
  esac
}

ALL_PRESETS="wikipedia-maxi wikipedia-nopic wikipedia-mini wikipedia-simple wikimed gutenberg wikibooks wikivoyage wiktionary wikisource ifixit survival-post-disaster survival-medicine survival-water survival-knots"

usage() {
  echo "Usage:"
  echo "  sh get-knowledge.sh <preset|URL> [destination-folder]   (default: $DEST_DEFAULT)"
  echo "  sh get-knowledge.sh list"
  echo "  sh get-knowledge.sh --recheck [destination-folder]"
  echo ""
  echo "Presets:"
  for p in $ALL_PRESETS; do
    info=$(preset_info "$p")
    label=$(printf '%s' "$info" | cut -d'|' -f3)
    printf "  %-22s %s\n" "$p" "$label"
  done
  echo ""
  echo "Full catalogue, browsable: https://library.kiwix.org  or  expansion.html"
}

human() {
  # bytes -> human string, no bc/awk-float dependence beyond POSIX awk
  awk -v n="$1" 'BEGIN{
    split("B KB MB GB TB", u, " ");
    i=1; while (n>=1024 && i<5) { n/=1024; i++ }
    printf "%.1f %s", n, u[i]
  }'
}

# ---------------------------------------------------------------------------
# Resolve a preset to today's actual filename by reading the Kiwix directory
# listing (an autoindex page) and taking the lexicographically-last match —
# filenames sort by date, so "last" is "newest".
# ---------------------------------------------------------------------------
resolve_filename() {
  category="$1"; glob="$2"
  pattern=$(printf '%s' "$glob" | sed -e 's/[.]/\\./g' -e 's/\*/.*/g')
  curl -fsSL --max-time 30 "$BASE/$category/" 2>/dev/null \
    | grep -oE 'href="[A-Za-z0-9_.-]+\.zim"' \
    | sed -e 's/^href="//' -e 's/"$//' \
    | grep -E "^${pattern}\$" \
    | sort \
    | tail -1
}

# ---------------------------------------------------------------------------
# HEAD the full redirect chain (download.kiwix.org -> lb.download.kiwix.org
# -> a geo mirror) to get the real Content-Length and the SHA-256 the load
# balancer publishes via the HTTP Digest header, without downloading anything.
# ---------------------------------------------------------------------------
resolve_meta() {
  url="$1"
  headers=$(curl -sIL --max-time 30 "$url" 2>/dev/null) || return 1
  RESOLVED_SIZE=$(printf '%s\n' "$headers" | tr -d '\r' | grep -i '^content-length:' | tail -1 | sed -E 's/^[Cc]ontent-[Ll]ength: *//')
  b64=$(printf '%s\n' "$headers" | tr -d '\r' | grep -i '^digest:.*sha-256=' | tail -1 | sed -n -E 's/.*[Ss][Hh][Aa]-256=([A-Za-z0-9+/=]+).*/\1/p')
  RESOLVED_SHA256=""
  if [ -n "$b64" ] && command -v python3 >/dev/null 2>&1; then
    RESOLVED_SHA256=$(python3 -c "import base64,sys; print(base64.b64decode(sys.argv[1]).hex())" "$b64" 2>/dev/null)
  fi
  [ -n "$RESOLVED_SIZE" ]
}

zim_magic_ok() {
  magic=$(head -c4 "$1" 2>/dev/null | od -An -tx1 2>/dev/null | tr -d ' \n')
  [ "$magic" = "5a494d04" ]
}

sha_tool() {
  if command -v shasum >/dev/null 2>&1; then echo "shasum -a 256";
  elif command -v sha256sum >/dev/null 2>&1; then echo "sha256sum";
  else echo ""; fi
}

sha_of() {
  t=$(sha_tool)
  [ -n "$t" ] || return 1
  $t "$1" | awk '{print $1}'
}

free_kb() { df -Pk "$1" 2>/dev/null | awk 'NR==2{print $4}'; }

state_get() { grep -m1 "^$2=" "$1" 2>/dev/null | sed "s/^$2=//"; }
state_set() {
  file="$1"; shift
  tmp="$file.tmp.$$"
  : > "$tmp"
  for kv in "$@"; do echo "$kv" >> "$tmp"; done
  mv "$tmp" "$file"
}

# ---------------------------------------------------------------------------
# Verify one on-disk ZIM: magic header + size + (if known) SHA-256.
# Prints "OK" / "FAIL: <reason>" and returns 0/1.
# ---------------------------------------------------------------------------
verify_zim() {
  f="$1"; expected_size="$2"; expected_sha="$3"
  [ -f "$f" ] || { echo "FAIL: missing"; return 1; }
  zim_magic_ok "$f" || { echo "FAIL: bad ZIM header (not a valid/complete ZIM file)"; return 1; }
  if [ -n "$expected_size" ]; then
    actual_size=$(wc -c < "$f" | tr -d ' ')
    [ "$actual_size" = "$expected_size" ] || { echo "FAIL: size $actual_size != expected $expected_size"; return 1; }
  fi
  if [ -n "$expected_sha" ]; then
    actual_sha=$(sha_of "$f") || { echo "OK (header+size only — no shasum/sha256sum on this system)"; return 0; }
    [ "$actual_sha" = "$expected_sha" ] || { echo "FAIL: SHA-256 mismatch (corrupt download)"; return 1; }
  fi
  echo "OK"
  return 0
}

# ---------------------------------------------------------------------------
# --recheck: verify every .zim already on disk against its checkpoint, no
# network needed beyond what's already cached in the state files.
# ---------------------------------------------------------------------------
do_recheck() {
  dest="${1:-$DEST_DEFAULT}"
  [ -d "$dest" ] || { echo "No such folder: $dest"; exit 2; }
  echo "Rechecking ZIM files in $dest …"
  bad=0; total=0
  for f in "$dest"/*.zim; do
    [ -e "$f" ] || continue
    total=$((total + 1))
    base=$(basename "$f")
    st="$dest/.state/$base.state"
    exp_size=""; exp_sha=""
    [ -f "$st" ] && { exp_size=$(state_get "$st" EXPECTED_SIZE); exp_sha=$(state_get "$st" EXPECTED_SHA256); }
    printf "  %-55s " "$base"
    result=$(verify_zim "$f" "$exp_size" "$exp_sha")
    echo "$result"
    case "$result" in FAIL*) bad=$((bad + 1)) ;; esac
  done
  echo ""
  if [ "$total" -eq 0 ]; then
    echo "No .zim files found in $dest."
  elif [ "$bad" -eq 0 ]; then
    echo "✓ All $total ZIM file(s) verified readable."
  else
    echo "⚠ $bad of $total ZIM file(s) failed verification — re-run"
    echo "  'sh get-knowledge.sh <preset>' to resume/re-download them."
    exit 1
  fi
}

# ---------------------------------------------------------------------------
# Download + verify one archive (preset name or raw URL).
# ---------------------------------------------------------------------------
do_get() {
  arg="$1"; dest="${2:-$DEST_DEFAULT}"
  mkdir -p "$dest/.state" || { echo "Can't create $dest"; exit 2; }

  case "$arg" in
    http://*|https://*)
      url="$arg"
      filename=$(basename "$arg")
      label="$filename"
      ;;
    *)
      info=$(preset_info "$arg") || { echo "Unknown preset: $arg"; echo "Run 'sh get-knowledge.sh list' to see options, or pass a full URL."; exit 2; }
      category=$(printf '%s' "$info" | cut -d'|' -f1)
      glob=$(printf '%s' "$info" | cut -d'|' -f2)
      label=$(printf '%s' "$info" | cut -d'|' -f3)
      echo "Resolving latest '$arg' from $BASE/$category/ …"
      filename=$(resolve_filename "$category" "$glob")
      [ -n "$filename" ] || { echo "✗ Couldn't find a file matching $glob in $category/ — the catalogue may have moved. Check https://library.kiwix.org"; exit 1; }
      url="$BASE/$category/$filename"
      ;;
  esac

  target="$dest/$filename"
  part="$target.part"
  state="$dest/.state/$filename.state"
  lock="$dest/.state/$filename.lock"

  # Already done?
  if [ -f "$state" ] && [ "$(state_get "$state" STATUS)" = "verified" ] && [ -f "$target" ]; then
    echo "✓ Already have $filename ($label) — skipping. Use --recheck to re-verify."
    return 0
  fi

  # Simple mkdir-based lock so two runs against the same file don't race.
  if ! mkdir "$lock" 2>/dev/null; then
    echo "✗ $filename looks like it's already being downloaded elsewhere (lock: $lock)."
    echo "  If that's not true (a previous run crashed), remove $lock and retry."
    exit 1
  fi
  trap 'rmdir "$lock" 2>/dev/null' EXIT INT TERM

  echo "Archive:     $label"
  echo "File:        $filename"

  # Resolve size + checksum once and pin them for the life of this download,
  # so a multi-day resume doesn't chase a newer file that appears mid-way.
  if [ -f "$state" ] && [ -n "$(state_get "$state" EXPECTED_SIZE)" ]; then
    expected_size=$(state_get "$state" EXPECTED_SIZE)
    expected_sha=$(state_get "$state" EXPECTED_SHA256)
  else
    echo "Checking size and checksum on download.kiwix.org …"
    if resolve_meta "$url"; then
      expected_size="$RESOLVED_SIZE"
      expected_sha="$RESOLVED_SHA256"
    else
      echo "✗ Couldn't reach $url to check its size. Check your connection and retry — it's safe to re-run."
      exit 1
    fi
    state_set "$state" "URL=$url" "EXPECTED_SIZE=$expected_size" "EXPECTED_SHA256=$expected_sha" "STATUS=downloading" "ATTEMPTS=0"
  fi

  echo "Size:        $(human "$expected_size") ($expected_size bytes)"
  if [ -n "$expected_sha" ]; then echo "SHA-256:     $expected_sha (from Kiwix)"; else echo "SHA-256:     (not published for this file — will verify by header+size only)"; fi

  # Disk space check (5% margin) against whatever's still needed.
  have_bytes=0
  [ -f "$part" ] && have_bytes=$(wc -c < "$part" | tr -d ' ')
  need_bytes=$(( (expected_size - have_bytes) + expected_size / 20 ))
  avail_kb=$(free_kb "$dest")
  if [ -n "$avail_kb" ] && [ "$avail_kb" -gt 0 ]; then
    avail_bytes=$((avail_kb * 1024))
    if [ "$need_bytes" -gt "$avail_bytes" ]; then
      echo "✗ Not enough free space at $dest: need ~$(human "$need_bytes"), have $(human "$avail_bytes")."
      exit 1
    fi
  fi

  attempts=$(state_get "$state" ATTEMPTS); [ -n "$attempts" ] || attempts=0
  echo "Downloading to $part (resumable — safe to Ctrl-C) …"
  ok=0
  while [ "$attempts" -lt "$MAX_ATTEMPTS" ]; do
    attempts=$((attempts + 1))
    state_set "$state" "URL=$url" "EXPECTED_SIZE=$expected_size" "EXPECTED_SHA256=$expected_sha" "STATUS=downloading" "ATTEMPTS=$attempts" "UPDATED=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    if curl -fL --continue-at - \
         --connect-timeout 20 --speed-limit 1 --speed-time "$STALL_SECS" \
         --retry 3 --retry-delay 5 \
         -o "$part" "$url"; then
      ok=1
      break
    fi
    if [ "$attempts" -ge "$MAX_ATTEMPTS" ]; then break; fi
    backoff=$((attempts * 15)); [ "$backoff" -gt 300 ] && backoff=300
    echo "  attempt $attempts failed — retrying in ${backoff}s (Ctrl-C is safe; re-run this command later to resume)…"
    sleep "$backoff"
  done

  if [ "$ok" -ne 1 ]; then
    state_set "$state" "URL=$url" "EXPECTED_SIZE=$expected_size" "EXPECTED_SHA256=$expected_sha" "STATUS=failed" "ATTEMPTS=$attempts"
    echo "✗ Gave up after $attempts attempts. Your progress is saved in $part —"
    echo "  re-run the same command whenever your connection is back to resume."
    exit 1
  fi

  echo "Download complete. Verifying …"
  mv "$part" "$target"
  result=$(verify_zim "$target" "$expected_size" "$expected_sha")
  echo "  $result"
  case "$result" in
    OK*)
      state_set "$state" "URL=$url" "EXPECTED_SIZE=$expected_size" "EXPECTED_SHA256=$expected_sha" "STATUS=verified" "ATTEMPTS=$attempts" "UPDATED=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      echo "✓ $filename verified and readable."
      ;;
    *)
      state_set "$state" "URL=$url" "EXPECTED_SIZE=$expected_size" "EXPECTED_SHA256=$expected_sha" "STATUS=failed" "ATTEMPTS=$attempts"
      echo "✗ Verification failed — the file is likely corrupt. Delete $target and re-run to fetch it fresh."
      exit 1
      ;;
  esac
}

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
case "$1" in
  ""|-h|--help)
    usage; exit 0 ;;
  list)
    echo "Presets (sizes fetched live — this makes one small network request per line):"
    for p in $ALL_PRESETS; do
      info=$(preset_info "$p")
      category=$(printf '%s' "$info" | cut -d'|' -f1)
      glob=$(printf '%s' "$info" | cut -d'|' -f2)
      label=$(printf '%s' "$info" | cut -d'|' -f3)
      filename=$(resolve_filename "$category" "$glob")
      if [ -n "$filename" ] && resolve_meta "$BASE/$category/$filename"; then
        printf "  %-22s %-10s %s\n" "$p" "$(human "$RESOLVED_SIZE")" "$label"
      else
        printf "  %-22s %-10s %s (unavailable right now)\n" "$p" "?" "$label"
      fi
    done
    exit 0 ;;
  --recheck)
    do_recheck "$2"; exit $? ;;
  *)
    do_get "$1" "$2" ;;
esac
