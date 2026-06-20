@echo off
setlocal EnableDelayedExpansion
title Last Light Survival Guide -- Launcher
cd /d "%~dp0"

cls
echo.
echo   The Last Light Survival Guide
echo   =========================================
echo.

set PORT=8080
set OLLAMA_STARTED=0

REM ── 1. OLLAMA ─────────────────────────────────────────────
echo   [1/3] Checking Ollama AI...

where ollama >nul 2>&1
if errorlevel 1 (
  echo   ^! Ollama not installed -- ARIA assistant will be offline.
  echo     Install from: https://ollama.com
  echo.
  goto :start_server
)

REM Check if Ollama is running
curl -sf --max-time 2 http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
  echo   Ollama not running -- starting...
  goto :start_ollama
)

REM Check CORS (browser sends Origin: null from file://)
for /f %%i in ('curl -s -o NUL -w "%%{http_code}" --max-time 2 -H "Origin: null" http://localhost:11434/api/tags 2^>nul') do set CORS_CODE=%%i
if "!CORS_CODE!"=="200" (
  echo   Ollama already running with CORS enabled.
  goto :check_models
)

echo   Ollama running but blocking browser -- restarting...
taskkill /IM "ollama app.exe" /F >nul 2>&1
taskkill /IM "ollama.exe"     /F >nul 2>&1
timeout /t 2 /nobreak >nul

:start_ollama
set OLLAMA_ORIGINS=*
start /B cmd /c "ollama serve > %TEMP%\last-light-ollama.log 2>&1"
set OLLAMA_STARTED=1
echo   Waiting for Ollama to start...
timeout /t 4 /nobreak >nul

curl -sf --max-time 2 http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
  echo   WARNING: Ollama may not have started. ARIA will be offline.
  echo            Check %TEMP%\last-light-ollama.log for details.
) else (
  echo   Ollama started with CORS enabled.
)

:check_models
echo.
REM Count models
for /f %%i in ('curl -s --max-time 2 http://localhost:11434/api/tags 2^>nul ^| python -c "import json,sys; d=json.load(sys.stdin); print(len(d.get(\"models\",[])))" 2^>nul') do set MODEL_COUNT=%%i
if not defined MODEL_COUNT set MODEL_COUNT=0

if "!MODEL_COUNT!"=="0" (
  echo   No AI models installed yet.
  echo   To enable ARIA, open a new Command Prompt and run:
  echo     ollama pull phi3:mini    ^(2.2 GB, fast^)
  echo.
) else (
  echo   !MODEL_COUNT! model^(s^) available for ARIA.
  echo.
)

:start_server
REM ── 2. WEB SERVER ─────────────────────────────────────────
echo   [2/3] Starting web server on port %PORT%...

REM Free the port if in use
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORT% " 2^>nul') do (
  taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

REM Try python3 first, fall back to python
where python3 >nul 2>&1
if not errorlevel 1 (
  start /B cmd /c "python3 -m http.server %PORT% --bind 127.0.0.1 > %TEMP%\last-light-server.log 2>&1"
) else (
  where python >nul 2>&1
  if not errorlevel 1 (
    start /B cmd /c "python -m http.server %PORT% --bind 127.0.0.1 > %TEMP%\last-light-server.log 2>&1"
  ) else (
    echo   ERROR: Python not found. Install from https://python.org
    pause
    exit /b 1
  )
)

timeout /t 2 /nobreak >nul
echo   Server running on http://localhost:%PORT%

REM ── 3. BROWSER ────────────────────────────────────────────
echo.
echo   [3/3] Opening browser...
start http://localhost:%PORT%

echo.
echo   =========================================
echo   Guide:  http://localhost:%PORT%
echo   ARIA:   http://localhost:11434
echo   =========================================
echo.
echo   Close this window to stop the server.
echo   (Ollama will keep running in the background)
echo.
pause
endlocal
