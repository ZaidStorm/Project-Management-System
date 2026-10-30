@echo off
title PMIS - Project Management Information System
echo ========================================================
echo   Project Management Information System (PMIS)
echo ========================================================
echo.

:: 1. Ensure D:\mongodb-data directory exists
if not exist "D:\mongodb-data" (
    echo [*] Creating data directory D:\mongodb-data...
    mkdir "D:\mongodb-data"
)

:: 2. Start MongoDB Server
echo [*] Starting MongoDB Server on port 27017...
start "PMIS_MongoDB_Instance" cmd /c "D:\mongodb-win32-x86_64-windows-8.2.5\bin\mongod.exe --dbpath D:\mongodb-data"

:: Pause 3 seconds using ping (avoids batch redirection error)
echo [*] Initializing database engine...
ping -n 4 127.0.0.1 >nul

:: 3. Start Backend & Frontend Application
echo [*] Starting PMIS Backend and Frontend...
cd /d "%~dp0"
start "PMIS_FullStack_Instance" cmd /c "npm run dev"

:: Pause 4 seconds for Vite dev server to bind port 5174
echo [*] Waiting for application servers...
ping -n 5 127.0.0.1 >nul

:: 4. Launch Browser
echo [*] Opening PMIS in browser...
start http://localhost:5174

echo.
echo ========================================================
echo   PMIS Enterprise System is LIVE!
echo   Frontend  : http://localhost:5174
echo   Backend   : http://localhost:5050
echo   Database  : MongoDB (127.0.0.1:27017)
echo ========================================================
echo.
echo   [!] Keep this window OPEN while working.
echo   [!] Press ANY KEY below to cleanly STOP the database and server.
echo ========================================================
pause >nul

echo.
echo [*] Stopping PMIS Application (Backend and Frontend)...
powershell -NoProfile -Command "$ports = @(5050, 5174); Get-NetTCPConnection -LocalPort $ports -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PMIS_FullStack_Instance*" /IM cmd.exe >nul 2>&1

echo [*] Stopping MongoDB Database Server...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1
taskkill /F /IM mongod.exe >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PMIS_MongoDB_Instance*" /IM cmd.exe >nul 2>&1

echo.
echo ========================================================
echo   [OK] Database and Application closed cleanly!
echo ========================================================
ping -n 3 127.0.0.1 >nul
exit
