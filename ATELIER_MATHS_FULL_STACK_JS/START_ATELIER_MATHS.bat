@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js is not installed or not in PATH.
 echo Install the free Node.js LTS version from https://nodejs.org/
 echo Then double-click START_ATELIER_MATHS.bat again.
 pause
 exit /b 1
)
node backend\server.js
if errorlevel 1 (
 echo.
 echo Atelier Maths did not start. Please check the error message above.
 pause
)
