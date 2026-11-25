@echo off
setlocal
cd /d "%~dp0"
if exist "runtime\node.exe" (set "NODE_CMD=%~dp0runtime\node.exe") else (set "NODE_CMD=node")
"%NODE_CMD%" --version >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js LTS from nodejs.org, then try again.
  echo No Python or .venv is needed.
  pause
  exit /b 1
)
start "Atelier Maths local server" /min "%NODE_CMD%" "%~dp0server\index.js"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173"
exit /b 0
