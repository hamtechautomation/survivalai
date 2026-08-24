#!/bin/sh
# mac-setup.sh — one command, on a Mac, that:
#   1. Installs & starts Ollama (as a persistent background service — survives
#      reboots), picks a model sized to THIS machine's real RAM/CPU, pulls it,
#      and proves it actually answers a prompt before moving on.
#   2. If run from inside an actual guide checkout (this file sitting next to
#      index.html — true for a git clone or the unzipped download package),
#      serves the whole guide to your network on boot, port 8080 — the macOS
#      equivalent of pi-setup.sh's systemd service. Turns an old Mac mini into
#      a backup server other devices on your network can reach.
#   3. Downloads the full Project Gutenberg library and full Wikipedia (maxi,
#      with images) into ./zim — the two biggest Expansion Library archives —
#      using get-knowledge.sh's checkpointed/resumable/verified downloader.
#
#   sh mac-setup.sh            # asks to confirm before the ~300+ GB ZIM phase
#   sh mac-setup.sh --yes      # unattended: no prompts (e.g. running overnight)
#   sh mac-setup.sh --ai-only  # step 1 only — skip serving and Gutenberg/Wikipedia
#   sh mac-setup.sh --no-serve # skip step 2 (serving), still do 1 and 3
#
# Old Intel Macs (i5/i7, no GPU) run Ollama fine on CPU — just slower than
# Apple Silicon. This script picks a small, fast model on Intel regardless of
# how much RAM is installed, because on CPU-only hardware extra RAM buys you
# headroom for the ZIM archives, not faster inference. See the RAM/ARCH
# table below if you want to override that with --model.
#
# Safe to re-run: every step here is idempotent (skips what's already done),
# and the ZIM downloads resume from a checkpoint if interrupted — see
# get-knowledge.sh for that machinery.

cd "$(dirname "$0")" || exit 2

YES=0
AI_ONLY=0
NO_SERVE=0
MODEL_OVERRIDE=""
while [ $# -gt 0 ]; do
  case "$1" in
    -y|--yes) YES=1 ;;
    --ai-only) AI_ONLY=1 ;;
    --no-serve) NO_SERVE=1 ;;
    --model) shift; MODEL_OVERRIDE="$1" ;;
    -h|--help)
      echo "Usage: sh mac-setup.sh [--yes] [--ai-only] [--no-serve] [--model NAME]"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 2 ;;
  esac
  shift
done

if [ "$(uname)" != "Darwin" ]; then
  echo "This script is for macOS. For Linux/Raspberry Pi, use pi-setup.sh instead."
  exit 2
fi

echo "══════════════════════════════════════════════════════════"
echo "  Step 0 — What are we working with?"
echo "══════════════════════════════════════════════════════════"
ARCH=$(uname -m)
CHIP=$(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo "unknown")
RAM_BYTES=$(sysctl -n hw.memsize 2>/dev/null || echo 0)
RAM_GB=$(( RAM_BYTES / 1024 / 1024 / 1024 ))
FREE_KB=$(df -Pk . 2>/dev/null | awk 'NR==2{print $4}')
FREE_GB=$(( FREE_KB / 1024 / 1024 ))

MACOS_VER=$(sw_vers -productVersion 2>/dev/null || echo "unknown")
MACOS_MAJOR=$(printf '%s' "$MACOS_VER" | cut -d. -f1)

echo "  Chip:        $CHIP ($ARCH)"
echo "  macOS:       $MACOS_VER"
echo "  RAM:         ${RAM_GB} GB"
echo "  Free disk:   ${FREE_GB} GB at $(pwd)"
if [ "$ARCH" != "arm64" ]; then
  echo "  Note: Intel Mac — Ollama runs on CPU only here (no Metal/GPU"
  echo "  acceleration like Apple Silicon gets). It will work, just at a few"
  echo "  tokens/second rather than near-instant. That's normal, not broken."
fi
if [ "$MACOS_MAJOR" != "unknown" ] && [ "$MACOS_MAJOR" -lt 12 ] 2>/dev/null; then
  echo "  Note: macOS $MACOS_VER is old enough that Homebrew may not have a"
  echo "  precompiled Ollama for it — 'brew install' may fall back to building"
  echo "  from source, which is slow but should still work eventually."
fi
echo ""

# ---------------------------------------------------------------------------
# Step 1 — Ollama: install, start as a persistent service, pick+pull+test model
# ---------------------------------------------------------------------------
echo "══════════════════════════════════════════════════════════"
echo "  Step 1 — Ollama"
echo "══════════════════════════════════════════════════════════"

if ! command -v ollama >/dev/null 2>&1; then
  if ! command -v brew >/dev/null 2>&1; then
    echo "✗ Neither Ollama nor Homebrew is installed."
    echo "  Install Homebrew first (one line, from https://brew.sh):"
    echo "    /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "  Then re-run this script."
    exit 2
  fi
  echo "Installing Ollama via Homebrew…"
  brew install ollama || { echo "✗ brew install ollama failed — see output above."; exit 1; }
else
  echo "Ollama already installed ($(ollama --version 2>/dev/null | head -1))."
fi

OLLAMA_BIN=$(command -v ollama)

# If Ollama was installed via `brew install ollama`, Homebrew registers its own
# launchd service (homebrew.mxcl.ollama) with RunAtLoad+KeepAlive and no CORS
# env var. Our own service below binds the same port (11434) — left running,
# Homebrew's copy wins the race on every boot/crash-restart and silently
# re-blocks the browser (Bunker Bot looks "broken" with no error explaining
# why). Stop and disable it first so only our CORS-enabled copy owns the port.
if command -v brew >/dev/null 2>&1 && brew services list 2>/dev/null | grep -q "^ollama "; then
  echo "Stopping Homebrew's own Ollama service (replacing with a CORS-enabled one)…"
  brew services stop ollama >/dev/null 2>&1
fi

# Persistent background service (survives reboots), CORS open so the browser
# guide can reach it — the LaunchAgent equivalent of pi-setup.sh's systemd unit.
PLIST="$HOME/Library/LaunchAgents/uk.co.bunkerbot.ollama.plist"
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>uk.co.bunkerbot.ollama</string>
  <key>ProgramArguments</key>
  <array><string>$OLLAMA_BIN</string><string>serve</string></array>
  <key>EnvironmentVariables</key>
  <dict><key>OLLAMA_ORIGINS</key><string>*</string></dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>$HOME/Library/Logs/bunkerbot-ollama.log</string>
  <key>StandardErrorPath</key><string>$HOME/Library/Logs/bunkerbot-ollama.err.log</string>
</dict>
</plist>
EOF
launchctl unload "$PLIST" >/dev/null 2>&1
launchctl load -w "$PLIST" 2>&1 | grep -v '^$'
echo "Ollama registered as a login service (uk.co.bunkerbot.ollama) — starts on boot, restarts if it crashes."

echo "Waiting for Ollama to answer on :11434 …"
i=0
while [ "$i" -lt 30 ]; do
  if curl -fsS --max-time 2 http://localhost:11434/api/tags >/dev/null 2>&1; then break; fi
  i=$((i + 1)); sleep 1
done
if [ "$i" -ge 30 ]; then
  echo "✗ Ollama didn't come up after 30s. Check $HOME/Library/Logs/bunkerbot-ollama.err.log"
  exit 1
fi
echo "✓ Ollama is running."

# Ensure OLLAMA_ORIGINS is also set for interactive shells (documented in
# README's macOS section) — harmless if already present.
for RC in "$HOME/.zshrc" "$HOME/.bash_profile"; do
  [ -f "$RC" ] || continue
  grep -q "OLLAMA_ORIGINS" "$RC" 2>/dev/null || echo "export OLLAMA_ORIGINS='*'" >> "$RC"
done

# Pick a model sized to this machine, unless the user forced one. Old/low-RAM
# Macs (2012-era minis, 4GB MacBook Airs) still get *something* — down to a
# 270MB model — rather than the script just failing on constrained hardware.
if [ -n "$MODEL_OVERRIDE" ]; then
  MODEL="$MODEL_OVERRIDE"
elif [ "$ARCH" = "arm64" ]; then
  # Apple Silicon gets Metal acceleration — can comfortably run bigger models.
  if   [ "$RAM_GB" -ge 16 ]; then MODEL="llama3:8b"
  elif [ "$RAM_GB" -ge 8 ];  then MODEL="phi3:mini"
  elif [ "$RAM_GB" -ge 4 ];  then MODEL="qwen2.5:0.5b"
  else MODEL="smollm2:135m"; fi
else
  # Intel/CPU-only — stay small so replies remain usable regardless of RAM.
  if   [ "$RAM_GB" -ge 8 ]; then MODEL="phi3:mini"
  elif [ "$RAM_GB" -ge 4 ]; then MODEL="llama3.2:1b"
  elif [ "$RAM_GB" -ge 2 ]; then MODEL="qwen2.5:0.5b"
  else MODEL="smollm2:135m"; fi
fi
if [ "$RAM_GB" -le 2 ]; then
  echo "Note: ${RAM_GB}GB RAM is tight for any local model alongside macOS —"
  echo "picking the smallest option ($MODEL). If it feels too slow, Bunker Bot"
  echo "still works with no model running (search-only mode, still cites the"
  echo "books) via bunkerbot.py or the browser panel showing 'Offline'."
fi

if ollama list 2>/dev/null | awk '{print $1}' | grep -qx "$MODEL"; then
  echo "Model $MODEL already pulled — skipping."
else
  echo "Pulling $MODEL (sized to ${RAM_GB}GB RAM on $ARCH) …"
  ollama pull "$MODEL" || { echo "✗ ollama pull $MODEL failed."; exit 1; }
fi

echo "Testing that $MODEL actually answers …"
RESP_JSON=$(curl -fsS --max-time 120 http://localhost:11434/api/generate \
  -d "{\"model\":\"$MODEL\",\"prompt\":\"Reply with exactly one word: OK\",\"stream\":false}" 2>/dev/null)
if command -v python3 >/dev/null 2>&1; then
  RESP_TEXT=$(printf '%s' "$RESP_JSON" | python3 -c "import json,sys
try: print(json.load(sys.stdin).get('response','').strip())
except Exception: print('')" 2>/dev/null)
else
  RESP_TEXT=$(printf '%s' "$RESP_JSON" | grep -o '"response":"[^"]*"' | head -1)
fi
if [ -n "$RESP_TEXT" ]; then
  echo "✓ $MODEL is working. Sample reply: $RESP_TEXT"
else
  echo "✗ $MODEL didn't return a usable reply. Raw response:"
  echo "  $RESP_JSON" | head -c 300
  echo ""
  echo "  Ollama is running, but something's off with this model — try"
  echo "  'ollama run $MODEL' directly to see the error."
  exit 1
fi
echo ""

if [ "$AI_ONLY" -eq 1 ]; then
  echo "✓ --ai-only requested — stopping here. AI setup complete."
  exit 0
fi

# ---------------------------------------------------------------------------
# Step 2 — serve the guide to your network (the "backup server" part)
# ---------------------------------------------------------------------------
echo "══════════════════════════════════════════════════════════"
echo "  Step 2 — Serve the guide to your network"
echo "══════════════════════════════════════════════════════════"
SERVE_PORT=8080
if [ "$NO_SERVE" -eq 1 ]; then
  echo "--no-serve requested — skipping."
elif [ ! -f "index.html" ] || [ ! -f "sw.js" ]; then
  echo "Not running from inside a guide checkout (no index.html here) — skipping."
  echo "Run this script from inside the unzipped guide folder to enable serving."
else
  GUIDE_DIR=$(pwd)
  PORT_OWNER=$(lsof -nP -iTCP:"$SERVE_PORT" -sTCP:LISTEN 2>/dev/null | awk 'NR==2{print $1, $2}')
  SERVE_PLIST="$HOME/Library/LaunchAgents/uk.co.bunkerbot.guide.plist"
  ALREADY_OURS=0
  [ -f "$SERVE_PLIST" ] && grep -q "$GUIDE_DIR" "$SERVE_PLIST" 2>/dev/null && ALREADY_OURS=1

  if [ -n "$PORT_OWNER" ] && [ "$ALREADY_OURS" -ne 1 ]; then
    echo "⚠ Port $SERVE_PORT is already in use by: $PORT_OWNER"
    echo "  Skipping — free the port or edit SERVE_PORT in this script and re-run."
  else
    PY3=$(command -v python3)
    if [ -z "$PY3" ]; then
      echo "✗ python3 not found — needed to serve the guide. Skipping."
    else
      mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
      cat > "$SERVE_PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>uk.co.bunkerbot.guide</string>
  <key>ProgramArguments</key>
  <array>
    <string>$PY3</string><string>-m</string><string>http.server</string><string>$SERVE_PORT</string>
    <string>--directory</string><string>$GUIDE_DIR</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>$HOME/Library/Logs/bunkerbot-guide.log</string>
  <key>StandardErrorPath</key><string>$HOME/Library/Logs/bunkerbot-guide.err.log</string>
</dict>
</plist>
EOF
      launchctl unload "$SERVE_PLIST" >/dev/null 2>&1
      launchctl load -w "$SERVE_PLIST" 2>&1 | grep -v '^$'
      LAN_IP=$(ifconfig 2>/dev/null | awk '/inet /{print $2}' | grep -v '^127\.' | head -1)
      echo "✓ Serving $GUIDE_DIR on boot (uk.co.bunkerbot.guide), restarts if it crashes."
      echo "  On this Mac:         http://localhost:$SERVE_PORT"
      [ -n "$LAN_IP" ] && echo "  From other devices:   http://$LAN_IP:$SERVE_PORT"
    fi
  fi
fi
echo ""

# ---------------------------------------------------------------------------
# Step 3 — the two big Expansion Library archives
# ---------------------------------------------------------------------------
echo "══════════════════════════════════════════════════════════"
echo "  Step 3 — Project Gutenberg (full) + Wikipedia (maxi)"
echo "══════════════════════════════════════════════════════════"
echo "Checking current sizes on download.kiwix.org (live — no download yet) …"
LIST_OUT=$(sh get-knowledge.sh list 2>/dev/null)
echo "  gutenberg        $(printf '%s\n' "$LIST_OUT" | awk '$1=="gutenberg"{print $2, $3}')"
echo "  wikipedia-maxi   $(printf '%s\n' "$LIST_OUT" | awk '$1=="wikipedia-maxi"{print $2, $3}')"
echo "  Free disk here:  ${FREE_GB} GB"
echo ""
echo "This is commonly 250-350 GB combined and can take hours to days on a"
echo "home connection — it WILL resume automatically if interrupted."

if [ "$YES" -ne 1 ]; then
  printf "Continue with the download? [y/N] "
  read -r ans
  case "$ans" in y|Y|yes|YES) ;; *) echo "Skipped. Re-run with 'sh get-library.sh gutenberg wikipedia-maxi' whenever you're ready."; exit 0 ;; esac
fi

sh get-library.sh gutenberg wikipedia-maxi
result=$?

echo ""
echo "══════════════════════════════════════════════════════════"
echo "  Done"
echo "══════════════════════════════════════════════════════════"
echo "AI:  $MODEL, running as a login service, reachable at http://localhost:11434"
[ -n "$LAN_IP" ] && echo "Guide: serving at http://localhost:$SERVE_PORT and http://$LAN_IP:$SERVE_PORT"
echo "Zim: see ./zim — 'sh get-knowledge.sh --recheck' re-verifies anytime"
echo "Open index.html or expansion.html in a browser and try Bunker Bot."
exit $result
