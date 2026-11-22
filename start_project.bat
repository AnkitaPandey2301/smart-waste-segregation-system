@echo off
title ECO-SORT AIoT // Autonomous Smart Waste Segregation SCADA System
cd /d "%~dp0"
echo ========================================================
echo    Starting ECO-SORT AIoT System
echo ========================================================
echo.
echo Opening browser at http://localhost:3000 ...
start http://localhost:3000
echo Running development server...
call npm run dev
pause
