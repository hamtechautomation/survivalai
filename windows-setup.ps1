# windows-setup.ps1 - one command: install Ollama, pick a model sized to THIS
# PC's real RAM/GPU, pull it, and prove it actually answers a prompt.
#
#   irm https://raw.githubusercontent.com/hamtechautomation/survivalai/main/windows-setup.ps1 | iex
#
# Or from a clone of this repo:
#   powershell -ExecutionPolicy Bypass -File windows-setup.ps1
#   powershell -ExecutionPolicy Bypass -File windows-setup.ps1 -Model llama3:8b
#
# Safe to re-run: skips the install/pull if already done.
#
# This script only handles Ollama + the model (the same job as mac-setup.sh's
# --ai-only mode / pi-setup.sh's model step). For the big Expansion Library
# downloads (Wikipedia/Gutenberg), use Git Bash or WSL from a clone of this
# repo and run get-knowledge.sh / get-library.sh there - they're POSIX shell
# scripts with checkpointing/resume logic that doesn't need reimplementing
# in PowerShell to work fine under Git Bash/WSL.

param(
  [string]$Model = ""
)

$ErrorActionPreference = "Stop"

Write-Host "==============================================================="
Write-Host "  Step 0 - What are we working with?"
Write-Host "==============================================================="
$ramGB = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB)
$hasNvidia = $false
try {
  Get-CimInstance Win32_VideoController -ErrorAction Stop | ForEach-Object {
    if ($_.Name -match "NVIDIA|GeForce|RTX|Quadro") { $hasNvidia = $true }
  }
} catch {}

$osVer = [System.Environment]::OSVersion.Version
$is64 = [System.Environment]::Is64BitOperatingSystem

Write-Host "  RAM:  $ramGB GB"
Write-Host "  GPU:  $(if ($hasNvidia) { 'NVIDIA detected - Ollama will use it automatically' } else { 'no NVIDIA GPU detected - CPU inference (still works, just slower)' })"
Write-Host "  OS:   Windows, version $osVer, $(if ($is64) { '64-bit' } else { '32-bit' })"
Write-Host ""

if (-not $is64) {
  Write-Host "X This is a 32-bit Windows install - Ollama only ships 64-bit builds,"
  Write-Host "  so it can't run here. The guide itself still works fine in any"
  Write-Host "  browser; for cited answers with no AI, see bunkerbot.py's"
  Write-Host "  search-only mode (needs Python, run via Git Bash/WSL or python.org)."
  exit 2
}
if ($osVer.Major -lt 10) {
  Write-Host "X This looks like Windows $($osVer.Major) - Ollama's installer targets"
  Write-Host "  Windows 10/11 and likely won't run here. The guide itself still works"
  Write-Host "  fine in any browser; for cited answers with no AI, see bunkerbot.py's"
  Write-Host "  search-only mode (needs Python)."
  exit 2
}

Write-Host "==============================================================="
Write-Host "  Step 1 - Ollama"
Write-Host "==============================================================="

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "Installing Ollama via winget..."
    winget install --id Ollama.Ollama -e --silent --accept-package-agreements --accept-source-agreements
    # winget installs land in the current user's PATH after a new shell; refresh it for this session.
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
  } else {
    Write-Host "winget not found. Download and run the installer manually:"
    Write-Host "  https://ollama.com/download/OllamaSetup.exe"
    Write-Host "Then re-run this script."
    exit 2
  }
} else {
  Write-Host "Ollama already installed ($(ollama --version))."
}

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "X Ollama installed but not yet on PATH in this session - open a new PowerShell window and re-run this script."
  exit 1
}

# The Windows installer registers Ollama to start automatically (system tray),
# so unlike macOS/Linux we don't need to hand-roll a service. Just make sure
# it's actually up before we try to talk to it.
$env:OLLAMA_ORIGINS = "*"
[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")

$running = $false
try { Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 2 | Out-Null; $running = $true } catch {}
if (-not $running) {
  Write-Host "Starting Ollama..."
  Start-Process -WindowStyle Hidden ollama -ArgumentList "serve"
  $tries = 0
  while ($tries -lt 30) {
    Start-Sleep -Seconds 1
    try { Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 2 | Out-Null; $running = $true; break } catch {}
    $tries++
  }
}
if (-not $running) {
  Write-Host "X Ollama didn't come up after 30s."
  exit 1
}
Write-Host "OK - Ollama is running."

if ([string]::IsNullOrEmpty($Model)) {
  if ($hasNvidia -and $ramGB -ge 16) { $Model = "llama3:8b" }
  elseif ($ramGB -ge 8) { $Model = "phi3:mini" }
  elseif ($ramGB -ge 4) { $Model = "llama3.2:1b" }
  elseif ($ramGB -ge 2) { $Model = "qwen2.5:0.5b" }
  else { $Model = "smollm2:135m" }
}
if ($ramGB -le 2) {
  Write-Host "Note: ${ramGB}GB RAM is tight for any local model alongside Windows -"
  Write-Host "picking the smallest option ($Model). If it feels too slow, Bunker Bot"
  Write-Host "still works with no model running (search-only mode, still cites the"
  Write-Host "books) via bunkerbot.py or the browser panel showing 'Offline'."
}

$already = ollama list | Select-String -SimpleMatch $Model
if ($already) {
  Write-Host "Model $Model already pulled - skipping."
} else {
  Write-Host "Pulling $Model (sized to ${ramGB}GB RAM$(if ($hasNvidia) { ', NVIDIA GPU' }))..."
  ollama pull $Model
  if ($LASTEXITCODE -ne 0) { Write-Host "X ollama pull $Model failed."; exit 1 }
}

Write-Host "Testing that $Model actually answers..."
$body = @{ model = $Model; prompt = "Reply with exactly one word: OK"; stream = $false } | ConvertTo-Json
try {
  $resp = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 120
} catch {
  Write-Host "X Request to Ollama failed: $($_.Exception.Message)"
  exit 1
}
if ($resp.response -and $resp.response.Trim().Length -gt 0) {
  Write-Host "OK - $Model is working. Sample reply: $($resp.response.Trim())"
} else {
  Write-Host "X $Model didn't return a usable reply. Try 'ollama run $Model' directly to see the error."
  exit 1
}

Write-Host ""
Write-Host "==============================================================="
Write-Host "  Done"
Write-Host "==============================================================="
Write-Host "AI: $Model, running on http://localhost:11434"
Write-Host "Open index.html (or the guide's URL) in a browser and try Bunker Bot."
Write-Host "For Wikipedia/Gutenberg (Expansion Library), use Git Bash or WSL and run:"
Write-Host "  sh get-library.sh core"
