@echo off
REM Setup script for Arcanima Backend + Frontend

echo.
echo ====================================
echo   ARCANIMA - Installation Script
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Installing Frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [2/3] Installing Backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo [3/3] Creating .env file...
    copy .env.example .env
)

cd ..

echo.
echo ====================================
echo   Installation complete!
echo ====================================
echo.
echo To start the application:
echo.
echo Option 1: Open two command prompts
echo   - Terminal 1: npm run dev
echo   - Terminal 2: npm run dev:backend
echo.
echo Option 2: Use npm-run-all (if installed)
echo   npm run dev:all
echo.
pause
