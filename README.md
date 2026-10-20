# Doigtés clarinette / Clarinet Fingering Trainer

Application web (FR/EN) pour s'entraîner aux doigtés de la clarinette en si♭ : elle écoute le micro, identifie la note jouée (lettres et noms français), propose des notes à jouer et donne un verdict, avec une marge d'accord réglable. Fonctionne sur Windows, macOS, Linux, ChromeOS, Android et iPadOS/iOS, avec Chrome, Edge, Firefox ou Safari. Aucune donnée n'est envoyée : le son est analysé localement dans le navigateur.

Web app (FR/EN) to practise B♭ clarinet fingerings: it listens to the microphone, identifies the note played (letter and French names), suggests notes to play and gives a verdict, with an adjustable tuning tolerance. Works on Windows, macOS, Linux, ChromeOS, Android and iPadOS/iOS. No data leaves your device: audio is analysed locally in the browser.

## Utiliser en ligne (recommandé) / Use online (recommended)

Adresse / URL : `https://glorget.github.io/clarinet/`

Le micro exige une page en HTTPS (ou `localhost`). / The microphone requires HTTPS (or `localhost`).

**Installer comme une application (hors ligne) / Install as an app (offline)**
- Chrome / Edge (Windows, ChromeOS, Android) : icône « Installer » dans la barre d'adresse, ou menu ⋮ > *Installer l'application*.
- Safari (iPad/iPhone) : Partager > *Sur l'écran d'accueil*.

## Lancer en local (secours) / Run locally (fallback)

Nécessite Python 3. / Requires Python 3. Ouvrir ensuite `http://localhost:8765/`.

| Système | Méthode |
|---|---|
| macOS | double-cliquer `lancer.command` (ou `python3 -m http.server 8765`) |
| Windows | double-cliquer `lancer.bat` (ou `py -m http.server 8765`) |
| Linux | `python3 -m http.server 8765` |
| ChromeOS | activer Linux (Paramètres > Développeurs), puis `python3 -m http.server 8765` ; ouvrir `http://localhost:8765/` dans Chrome |

Ne pas ouvrir `index.html` par double-clic (`file://`) : le micro y est souvent bloqué.

## Mode Gammes / Scales mode

**FR.** Onglet « Gammes » : l'application tire au hasard une tonique naturelle (do, ré, mi, fa, sol, la, si), à l'octave la plus basse jouable (chalumeau), et vous demande de jouer la gamme **majeure** ou **mineure** (harmonique, naturelle ou mélodique) en montant puis en descendant, en legato. Chaque note doit être juste (marge d'accord réglable). Une courte respiration au sommet est acceptée.

Avec le **métronome** (30 à 180 battements/min, 4 temps de décompte) : une note par temps, et l'application vérifie que chaque note commence sur le temps, avec une tolérance de 0 à 20 % de la durée d'un temps. La note la plus haute peut être écourtée de 50 % au plus (respiration). **Utilisez un casque**, sinon le micro capte le clic. Le décalage moyen entre vos notes et le clic (réaction, latence du casque ou du micro) est **mesuré et affiché**, et chaque note est jugée par rapport à votre propre pulsation : un décalage constant n'est pas une faute de régularité, une dérive ou des irrégularités le sont. Au-delà de 45 % d'un temps, le décalage est considéré comme trop important. La tolérance inclut 25 ms de résolution de mesure.

**EN.** “Scales” tab: the app picks a random natural root note (C, D, E, F, G, A, B) in the lowest playable octave (chalumeau) and asks you to play the **major** or **minor** scale (harmonic, natural or melodic) up and down, legato. Each note must be in tune (adjustable tolerance). A short breath at the top is accepted.

With the **metronome** (30–180 beats/min, 4-beat count-in): one note per beat, and the app checks that each note starts on the beat within 0–20 % of a beat. The highest note may be cut short by at most 50 % (breath). **Use headphones**, otherwise the mic picks up the click. The average offset between your notes and the click (reaction time, headphone or microphone latency) is **measured and displayed**, and each note is judged against your own pulse: a constant offset is not a timing fault, drift or irregularity is. Beyond 45% of a beat the offset is considered too large. The tolerance includes 25 ms of measurement resolution.

Logique des gammes / scale logic: `scales.js`.

## Notes

Les notes affichées sont les notes écrites (transposées d'un ton par rapport au son réel). Détection de hauteur : algorithme YIN (`pitch.js`).

Windows : si le micro n'est pas détecté, vérifier *Paramètres > Confidentialité et sécurité > Microphone*. Les casques Bluetooth appliquent parfois un traitement qui dégrade la détection : préférer un micro intégré ou USB.

## Licence : Creative Commons Attribution — Non Commercial 4.0 International
https://creativecommons.org/licenses/by-nc/4.0/

Cette licence permet de :
  - Utiliser, copier, redistribuer
  - Modifier et adapter
  - À condition de créditer l'auteur (BY)
  - Interdit toute utilisation commerciale (NC)
