@echo off
echo Starting MentoraX Development Environment...
echo.

echo Installing server dependencies...
cd server
call npm install
echo.

echo Installing client dependencies...
cd ../client
call npm install
echo.

echo Starting servers...
echo Backend will run on http://localhost:4000
echo Frontend will run on http://localhost:3000
echo.

start cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 3 /nobreak > nul
start cmd /k "cd /d %~dp0client && npm start"

echo.
echo Both servers are starting...
echo Check the opened terminal windows for status.
pause