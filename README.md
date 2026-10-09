# Doigtés clarinette / Clarinet Fingering Trainer

Application web (FR/EN) pour s'entraîner aux doigtés de la clarinette en si♭ : elle écoute le micro, identifie la note jouée (lettres et noms français), propose des notes à jouer et donne un verdict, avec une marge d'accord réglable. Fonctionne sur Windows, macOS, Linux, ChromeOS, Android et iPadOS/iOS, avec Chrome, Edge, Firefox ou Safari. Aucune donnée n'est envoyée : le son est analysé localement dans le navigateur.

Web app (FR/EN) to practise B♭ clarinet fingerings: it listens to the microphone, identifies the note played (letter and French names), suggests notes to play and gives a verdict, with an adjustable tuning tolerance. Works on Windows, macOS, Linux, ChromeOS, Android and iPadOS/iOS. No data leaves your device: audio is analysed locally in the browser.

## Utiliser en ligne (recommandé) / Use online (recommended)

Adresse / URL : `https://glorget.github.io/clarinet/`

Le micro exige une page en HTTPS (ou `localhost`). / The microphone requires HTTPS (or `localhost`).

**Installer comme une application (hors ligne) / Install as an app (offline)**
- Chrome / Edge (Windows, ChromeOS, Android) : icône « Installer » dans la barre d'adresse, ou menu ⋮ > *Installer l'application*.
- Safari (iPad/iPhone) : Partager > *Sur l'écran d'accueil*.

## Publier sur GitHub Pages

1. Créer un dépôt **public** (ex. `clarinet`) et y déposer tous les fichiers de ce dossier (y compris `.nojekyll`).
2. *Settings > Pages* > *Deploy from a branch* > branche `main`, dossier `/ (root)` > *Save*.
3. L'adresse s'affiche après 1 à 2 minutes.
4. Après une modification des fichiers, changer `VERSION` dans `service-worker.js` (`v1` → `v2`…) pour que les appareils renouvellent leur cache.

## Lancer en local (secours) / Run locally (fallback)

Nécessite Python 3. / Requires Python 3. Ouvrir ensuite `http://localhost:8765/`.

| Système | Méthode |
|---|---|
| macOS | double-cliquer `lancer.command` (ou `python3 -m http.server 8765`) |
| Windows | double-cliquer `lancer.bat` (ou `py -m http.server 8765`) |
| Linux | `python3 -m http.server 8765` |
| ChromeOS | activer Linux (Paramètres > Développeurs), puis `python3 -m http.server 8765` ; ouvrir `http://localhost:8765/` dans Chrome |

Ne pas ouvrir `index.html` par double-clic (`file://`) : le micro y est souvent bloqué.

## Notes

Les notes affichées sont les notes écrites (transposées d'un ton par rapport au son réel). Détection de hauteur : algorithme YIN (`pitch.js`).

Windows : si le micro n'est pas détecté, vérifier *Paramètres > Confidentialité et sécurité > Microphone*. Les casques Bluetooth appliquent parfois un traitement qui dégrade la détection : préférer un micro intégré ou USB.
