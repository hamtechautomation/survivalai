#!/bin/sh
# pi-setup.sh — turn a Raspberry Pi into a self-contained survival AI server.
#
#   curl -fsSL https://raw.githubusercontent.com/hamtechautomation/survivalai/main/pi-setup.sh | sh
#
# What it does (Raspberry Pi OS / any Debian-ish 64-bit Linux):
#   1. Downloads the full guide (~580 MB) to ~/last-light
#   2. Installs Ollama and pulls a model sized to your RAM
#   3. Sets OLLAMA_ORIGINS so the browser app can talk to it
#   4. Installs a systemd service that serves the guide on boot, port 8080
#
# After it finishes: open  http://<pi-address>:8080  from any device on your
# network. Everything — guide, books, maps, AI — then runs with zero internet.
#
# Re-running is safe: each step skips what's already done.

set -e

GUIDE_DIR="$HOME/last-light"
ZIP_URL="https://bunkerbot.co.uk/downloads/last-light-survival-guide-standard.zip"
PORT=8080

echo "── The Last Light — Raspberry Pi setup ──────────────────────"

# 0. sanity
command -v python3 >/dev/null 2>&1 || { echo "python3 not found — install it first (sudo apt install python3)"; exit 2; }
command -v curl >/dev/null 2>&1 || { echo "curl not found — install it first (sudo apt install curl)"; exit 2; }
command -v unzip >/dev/null 2>&1 || { echo "unzip not found — install it first (sudo apt install unzip)"; exit 2; }

# 1. the guide
if [ -f "$GUIDE_DIR/index.html" ]; then
  echo "1/4  Guide already at $GUIDE_DIR — skipping download."
else
  echo "1/4  Downloading the guide (~580 MB — go make a brew)…"
  TMPZIP=$(mktemp /tmp/lastlight.XXXXXX.zip)
  curl -fL --progress-bar -o "$TMPZIP" "$ZIP_URL"
  mkdir -p "$GUIDE_DIR"
  unzip -q "$TMPZIP" -d "$GUIDE_DIR.unpack"
  mv "$GUIDE_DIR.unpack/last-light-survival-guide/"* "$GUIDE_DIR"/
  rm -rf "$GUIDE_DIR.unpack" "$TMPZIP"
  echo "     Verifying the copy…"
  ( cd "$GUIDE_DIR" && sh verify.sh ) || { echo "✗ verification failed — re-run to re-download"; exit 1; }
fi

# 2. Ollama
if command -v ollama >/dev/null 2>&1; then
  echo "2/4  Ollama already installed — skipping."
else
  echo "2/4  Installing Ollama…"
  curl -fsSL https://ollama.com/install.sh | sh
fi

# 3. model sized to RAM (phi3:mini needs ~4 GB free; smaller Pis get a 1B model)
MEM_KB=$(awk '/MemTotal/ {print $2}' /proc/meminfo 2>/dev/null || echo 0)
if [ "$MEM_KB" -ge 7000000 ]; then MODEL="phi3:mini"
elif [ "$MEM_KB" -ge 3500000 ]; then MODEL="llama3.2:1b"
else MODEL="qwen2.5:0.5b"; fi
if ollama list 2>/dev/null | grep -q "$MODEL"; then
  echo "3/4  Model $MODEL already pulled — skipping."
else
  echo "3/4  Pulling $MODEL (sized to your $(( MEM_KB / 1024 / 1024 + 1 )) GB RAM)…"
  ollama pull "$MODEL"
fi

# 4. services: CORS for the browser app + serve the guide on boot
echo "4/4  Configuring services (needs sudo)…"
sudo mkdir -p /etc/systemd/system/ollama.service.d
printf '[Service]\nEnvironment="OLLAMA_ORIGINS=*"\n' | sudo tee /etc/systemd/system/ollama.service.d/override.conf >/dev/null
sudo tee /etc/systemd/system/lastlight.service >/dev/null <<EOF
[Unit]
Description=The Last Light Survival Guide (offline web server)
After=network.target

[Service]
ExecStart=/usr/bin/python3 -m http.server $PORT --directory $GUIDE_DIR
Restart=always
User=$USER

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now lastlight.service
sudo systemctl restart ollama 2>/dev/null || true

IP=$(hostname -I 2>/dev/null | awk '{print $1}')
echo ""
echo "✓ Done. The Last Light is serving on boot."
echo "  On this Pi:            http://localhost:$PORT"
[ -n "$IP" ] && echo "  From other devices:    http://$IP:$PORT"
echo "  Bunker Bot model:      $MODEL (local, offline)"
echo "  Terminal client:       python3 $GUIDE_DIR/bunkerbot.py"
