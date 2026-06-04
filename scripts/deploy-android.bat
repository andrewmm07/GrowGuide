@echo off
setlocal
cd /d "%~dp0.."

echo [1/3] Building static web app for mobile...
set EXPORT_STATIC=true
call npm.cmd run build
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

echo [2/3] Syncing to Capacitor Android...
call npx.cmd cap sync android
if errorlevel 1 (
  echo Cap sync failed.
  exit /b 1
)

if "%~1"=="sync-only" (
  echo Sync only — skipping APK install.
  exit /b 0
)

if not defined JAVA_HOME (
  if exist "C:\Program Files\Android\Android Studio\jbr" (
    set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
  )
)

set "ADB=%LOCALAPPDATA%\Android\Sdk\platform-tools"
if exist "%ADB%" set "PATH=%ADB%;%PATH%"

echo [3/3] Installing debug APK on connected phone...
cd android
call gradlew.bat installDebug
if errorlevel 1 (
  echo Install failed. Plug in phone, enable USB debugging, or run from Android Studio.
  exit /b 1
)

echo.
echo Done. Open GrowGuide on your phone ^(force-close first if it was already running^).
endlocal
