@echo off
title Push Smart Waste System to GitHub
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\ucrt64\bin;%PATH%"
cd /d "C:\Users\ANKITA PANDEY\.gemini\antigravity\scratch\smart-waste-iot-system"

echo ====================================================================
echo   ECO-SORT AIoT // GitHub Repository Publisher
echo   Target: https://github.com/AnkitaPandey2301/smart-waste-segregation-system
echo ====================================================================
echo.
echo [1/3] Verifying Git & Credential Manager...
git --version
git-credential-manager --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Git Credential Manager active.
) else (
    echo [WARN] Proceeding with standard authentication.
)
echo.
echo [2/3] Connecting to GitHub ^& initiating push...
echo (A GitHub login pop-up window or browser tab will appear now)
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ====================================================================
    echo   [SUCCESS] Code successfully pushed to GitHub!
    echo   Visit: https://github.com/AnkitaPandey2301/smart-waste-segregation-system
    echo ====================================================================
) else (
    echo.
    echo --------------------------------------------------------------------
    echo [NOTE] If browser sign-in did not pop up, you can also paste a 
    echo GitHub Personal Access Token (PAT).
    echo --------------------------------------------------------------------
    echo.
    set /p "GITHUB_TOKEN=Enter your GitHub Personal Access Token (or press Enter to exit): "
    if defined GITHUB_TOKEN (
        echo Pushing with Token...
        git push -u https://%GITHUB_TOKEN%@github.com/AnkitaPandey2301/smart-waste-segregation-system.git main
    )
)
echo.
pause
