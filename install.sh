#!/bin/bash

# Setup script for Arcanima Backend + Frontend

echo ""
echo "===================================="
echo "  ARCANIMA - Installation Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1/3] Installing Frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

echo "[2/3] Installing Backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "[3/3] Creating .env file..."
    cp .env.example .env
fi

cd ..

echo ""
echo "===================================="
echo "  Installation complete!"
echo "===================================="
echo ""
echo "To start the application:"
echo ""
echo "Option 1: Open two terminals"
echo "  - Terminal 1: npm run dev"
echo "  - Terminal 2: npm run dev:backend"
echo ""
echo "Option 2: Use npm-run-all (if installed)"
echo "  npm run dev:all"
echo ""
