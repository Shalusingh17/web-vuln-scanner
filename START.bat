@echo off
REM VulnScanner - Complete Startup Guide
REM Windows Batch Script

echo.
echo ============================================
echo VulnScanner - Web Vulnerability Scanner
echo ============================================
echo.

set /p choice="Do you want to: (1) Backend only, (2) Frontend only, (3) Both? Enter number: "

if "%choice%"=="1" (
    echo Starting Backend Server...
    cd backend
    npm install
    color 0A
    node server.js
) else if "%choice%"=="2" (
    echo Starting Frontend Server...
    cd frontend
    npm install
    color 0B
    npm run dev
) else if "%choice%"=="3" (
    echo Starting both servers requires 2 terminal windows...
    echo.
    echo Terminal 1: Backend
    echo cd backend
    echo npm install
    echo npm run dev
    echo.
    echo Terminal 2: Frontend
    echo cd frontend
    echo npm install
    echo npm run dev
    echo.
    echo Open browser: http://localhost:3000
    pause
) else (
    echo Invalid choice
    pause
)
