#!/bin/bash
# =============================================================
#  THE LAST LIGHT SURVIVAL GUIDE — Launcher
#  Double-click in Finder (macOS) or run from terminal
#  Works on macOS and Linux
# =============================================================

# Move to the directory this script lives in
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PORT=8080
WE_STARTED_OLLAMA=false
SERVER_PID=""

# ── Terminal colours ──────────────────────────────────────────
GREEN='\033[0;32m'
AMBER='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo ""
echo -e "${BOLD}${AMBER}  ⚡ The Last Light Survival Guide${NC}"
echo -e "  ─────────────────────────────────────────"
echo ""

# ── Cleanup on Ctrl-C ────────────────────────────────────────
cleanup() {
  echo ""
  echo -e "${AMBER}  Shutting down...${NC}"
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  if [ "$WE_STARTED_OLLAMA" = true ]; then
    pkill -f "ollama serve" 2>/dev/null || true
    echo -e "  Ollama stopped."
  fi
  echo -e "${GREEN}  Done. Goodbye.${NC}"
  echo ""
  exit 0
}
trap cleanup INT TERM

# ── 1. OLLAMA ─────────────────────────────────────────────────
echo -e "${CYAN}  [1/3] Checking Ollama AI...${NC}"

# Detect if Ollama CLI is available at all
if ! command -v ollama &>/dev/null; then
  echo -e "${AMBER}  ⚠  Ollama not installed — ARIA assistant will be offline.${NC}"
  echo -e "     Install from: https://ollama.com"
  echo ""
else
  # Is it running?
  OLLAMA_RUNNING=false
  if curl -sf --max-time 2 http://localhost:11434/api/tags >/dev/null 2>&1; then
    OLLAMA_RUNNING=true
  fi

  if [ "$OLLAMA_RUNNING" = true ]; then
    # Check if CORS is open (browser from file:// sends Origin: null → 403 if blocked)
    CORS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 \
      -H "Origin: null" http://localhost:11434/api/tags 2>/dev/null)

    if [ "$CORS_STATUS" = "200" ]; then
      echo -e "${GREEN}  ✓  Ollama already running with CORS enabled.${NC}"
    else
      echo -e "${AMBER}  →  Ollama is running but blocking the browser (403).${NC}"
      echo -e "     Restarting with CORS open..."
      # Quit macOS menu bar app gracefully first
      osascript -e 'quit app "Ollama"' 2>/dev/null || true
      pkill -f "ollama serve"          2>/dev/null || true
      sleep 2

      export OLLAMA_ORIGINS="*"
      ollama serve >/tmp/last-light-ollama.log 2>&1 &
      WE_STARTED_OLLAMA=true
      sleep 3
      echo -e "${GREEN}  ✓  Ollama restarted with CORS enabled.${NC}"
    fi
  else
    echo -e "     Ollama not running — starting..."
    # Quit any stale menu bar app first
    osascript -e 'quit app "Ollama"' 2>/dev/null || true
    sleep 1

    export OLLAMA_ORIGINS="*"
    ollama serve >/tmp/last-light-ollama.log 2>&1 &
    WE_STARTED_OLLAMA=true

    # Wait for it to be ready (up to 10s)
    TRIES=0
    until curl -sf --max-time 1 http://localhost:11434/api/tags >/dev/null 2>&1; do
      sleep 1
      TRIES=$((TRIES + 1))
      [ $TRIES -ge 10 ] && break
    done

    if curl -sf --max-time 1 http://localhost:11434/api/tags >/dev/null 2>&1; then
      echo -e "${GREEN}  ✓  Ollama started with CORS enabled.${NC}"
    else
      echo -e "${RED}  ✗  Ollama failed to start — check /tmp/last-light-ollama.log${NC}"
    fi
  fi

  # ── Check for models ────────────────────────────────────────
  MODEL_JSON=$(curl -s --max-time 2 http://localhost:11434/api/tags 2>/dev/null)
  MODEL_COUNT=$(echo "$MODEL_JSON" | python3 -c \
    "import json,sys; d=json.load(sys.stdin); print(len(d.get('models',[])))" 2>/dev/null || echo "0")
  MODELS_LIST=$(echo "$MODEL_JSON" | python3 -c \
    "import json,sys; d=json.load(sys.stdin); [print('  •',m['name']) for m in d.get('models',[])]" 2>/dev/null)

  if [ "$MODEL_COUNT" = "0" ]; then
    echo ""
    echo -e "${AMBER}  ⚠  No AI models installed yet.${NC}"
    echo -e "     To enable ARIA, run in another terminal:"
    echo -e "       ${BOLD}ollama pull phi3:mini${NC}   (2.2 GB, fast on Apple Silicon)"
    echo -e "     Or: ollama pull llama3:8b (better quality, needs 8 GB RAM)"
    echo ""
  else
    echo -e "  Models available (${MODEL_COUNT}):"
    echo "$MODELS_LIST"
    echo ""
  fi
fi

# ── 2. WEB SERVER ─────────────────────────────────────────────
echo -e "${CYAN}  [2/3] Starting web server...${NC}"

# Free the port if something else is on it
EXISTING=$(lsof -ti ":$PORT" 2>/dev/null)
if [ -n "$EXISTING" ]; then
  echo -e "     Port $PORT in use — freeing it..."
  echo "$EXISTING" | xargs kill -9 2>/dev/null || true
  sleep 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/last-light-server.log 2>&1 &
SERVER_PID=$!
sleep 1

if kill -0 "$SERVER_PID" 2>/dev/null; then
  echo -e "${GREEN}  ✓  Server running on http://localhost:${PORT}${NC}"
else
  echo -e "${RED}  ✗  Server failed to start. Is python3 installed?${NC}"
  exit 1
fi

# ── 3. BROWSER ────────────────────────────────────────────────
echo -e "${CYAN}  [3/3] Opening browser...${NC}"
sleep 0.5

if command -v open &>/dev/null; then
  open "http://localhost:${PORT}"        # macOS
elif command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:${PORT}"   # Linux
fi

echo ""
echo -e "  ─────────────────────────────────────────"
echo -e "${BOLD}${GREEN}  ⚡ Guide:  http://localhost:${PORT}${NC}"
echo -e "     ARIA:  http://localhost:11434"
echo -e "  ─────────────────────────────────────────"
echo -e "  Press ${BOLD}Ctrl-C${NC} to stop everything."
echo ""

# ── Keep alive ────────────────────────────────────────────────
wait "$SERVER_PID"
