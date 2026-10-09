#!/bin/bash
# Double-cliquez sur ce fichier pour lancer l'application (le micro exige une adresse localhost).
cd "$(dirname "$0")"
PORT=8765
( sleep 1; open "http://localhost:$PORT/" ) &
echo "Application lancée sur http://localhost:$PORT/ — fermez cette fenêtre pour l'arrêter."
python3 -m http.server $PORT
