#!/bin/bash
# VulnScanner - Startup Script for macOS/Linux

echo ""
echo "============================================"
echo "VulnScanner - Web Vulnerability Scanner"
echo "============================================"
echo ""

read -p "Choose: (1) Backend only, (2) Frontend only, (3) Both - Open in new terminals? Enter number: " choice

case $choice in
  1)
    echo "Starting Backend Server..."
    cd backend
    npm install
    npm run dev
    ;;
  2)
    echo "Starting Frontend Server..."
    cd frontend
    npm install
    npm run dev
    ;;
  3)
    echo "Starting both servers in new terminal windows..."
    echo ""
    echo "Terminal 1: Backend"
    echo "cd backend && npm install && npm run dev"
    echo ""
    echo "Terminal 2: Frontend"
    echo "cd frontend && npm install && npm run dev"
    echo ""
    echo "Then open browser: http://localhost:3000"
    
    # Open Terminal 1 (Backend)
    osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/backend && npm install && npm run dev"' &
    
    # Open Terminal 2 (Frontend) 
    osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/frontend && npm install && npm run dev"' &
    ;;
  *)
    echo "Invalid choice"
    ;;
esac
