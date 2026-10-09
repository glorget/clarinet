@echo off
cd /d "%~dp0"
set PORT=8765
echo Application sur http://localhost:%PORT%/ - fermez cette fenetre pour l'arreter.
start "" "http://localhost:%PORT%/"
where py >nul 2>nul && (py -m http.server %PORT%) || (python -m http.server %PORT%)
