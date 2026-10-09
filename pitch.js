// Détection de hauteur par l'algorithme YIN (de Cheveigné & Kawahara, 2002).
// Renvoie { freq, clarity } ou null si aucune hauteur fiable n'est trouvée.
function detectPitch(buf, sampleRate, opts) {
  const minFreq = (opts && opts.minFreq) || 130;
  const maxFreq = (opts && opts.maxFreq) || 2200;
  const threshold = (opts && opts.threshold) || 0.2;

  const tauMin = Math.max(2, Math.floor(sampleRate / maxFreq));
  const tauMax = Math.floor(sampleRate / minFreq);
  const W = Math.min(2048, buf.length - tauMax - 1);
  if (W < tauMax) return null;

  // Fonction de différence
  const d = new Float32Array(tauMax + 1);
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let j = 0; j < W; j++) {
      const diff = buf[j] - buf[j + tau];
      sum += diff * diff;
    }
    d[tau] = sum;
  }

  // Différence cumulée normalisée
  const cmnd = new Float32Array(tauMax + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    running += d[tau];
    cmnd[tau] = running === 0 ? 1 : (d[tau] * tau) / running;
  }

  // Premier minimum sous le seuil (évite les erreurs d'octave vers le bas)
  let tau = -1;
  for (let t = tauMin; t < tauMax; t++) {
    if (cmnd[t] < threshold) {
      while (t + 1 < tauMax && cmnd[t + 1] < cmnd[t]) t++;
      tau = t;
      break;
    }
  }
  if (tau === -1) return null;

  // Interpolation parabolique
  let better = tau;
  if (tau > 1 && tau < tauMax) {
    const a = cmnd[tau - 1], b = cmnd[tau], c = cmnd[tau + 1];
    const denom = a - 2 * b + c;
    if (denom !== 0) better = tau + (a - c) / (2 * denom);
  }
  return { freq: sampleRate / better, clarity: 1 - cmnd[tau] };
}

if (typeof module !== 'undefined') module.exports = { detectPitch };
