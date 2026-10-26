'use strict';
// Gammes (majeure / mineures) et suivi de leur exécution, avec ou sans métronome.
// Logique pure, sans accès au DOM ni à l'audio : testable seule (voir tests dans le dépôt de travail).

const NAT_PC = [0, 2, 4, 5, 7, 9, 11]; // do ré mi fa sol la si
const SCALE_UP = {
  major:    [0, 2, 4, 5, 7, 9, 11, 12],
  harmonic: [0, 2, 3, 5, 7, 8, 11, 12],
  natural:  [0, 2, 3, 5, 7, 8, 10, 12],
  melodic:  [0, 2, 3, 5, 7, 9, 11, 12],   // mineure mélodique : sixte et septième relevées à la montée…
};
const SCALE_DOWN = {
  major: SCALE_UP.major, harmonic: SCALE_UP.harmonic, natural: SCALE_UP.natural,
  melodic: SCALE_UP.natural,               // …et naturelles à la descente
};

// Orthographe d'une note : lettre (do=0 … si=6), altération (-2…2) et octave scientifique
function spell(midi, letter) {
  let best = null;
  for (let oct = Math.floor(midi / 12) - 2; oct <= Math.floor(midi / 12); oct++) {
    const acc = midi - (12 * (oct + 1) + NAT_PC[letter]);
    if (Math.abs(acc) <= 2 && (best === null || Math.abs(acc) < Math.abs(best.acc))) best = { acc, oct };
  }
  return { letter, acc: best.acc, oct: best.oct };
}

// Gamme d'une tonique naturelle (rootLetter 0…6), à l'octave la plus basse jouable (Mi3 = 52 par défaut).
// Renvoie les notes écrites : 8 à la montée puis 7 à la descente (la note la plus haute n'est pas répétée).
function buildScale(rootLetter, type, lowest) {
  let root = lowest === undefined ? 52 : lowest;
  while (((root % 12) + 12) % 12 !== NAT_PC[rootLetter]) root++;
  const notes = [];
  const add = (k, iv, dir) => notes.push(Object.assign(
    { midi: root + iv[k], deg: k, dir }, spell(root + iv[k], (rootLetter + k) % 7)));
  for (let k = 0; k <= 7; k++) add(k, SCALE_UP[type], 'up');
  for (let k = 6; k >= 0; k--) add(k, SCALE_DOWN[type], 'down');
  return { rootLetter, type, root, notes, topIdx: 7 };
}

// ---------------------------------------------------------------------------------------------
// Suivi de l'exécution.
//   o.tol      marge d'accord (cents)
//   o.hold     durée minimale (ms) pendant laquelle la bonne note doit être entendue pour être validée
//   o.wrongHold durée (ms) d'une mauvaise note stable avant de la signaler
//   o.metro    null, ou { P (ms par temps), beat0 (instant d'un temps de référence du métronome), lat (latence de
//              détection, ms), outLat (latence de sortie, ms), tolPct (0…20), floor (ms, résolution de mesure) }
// Pas de décompte : le joueur démarre quand il veut. La première note jouée juste fixe la grille : elle est rattachée
// au temps du métronome le plus proche (b0), et les notes suivantes sont attendues sur les temps suivants.
// Régularité : le décalage moyen du joueur par rapport au clic (médiane des écarts) est mesuré, puis chaque note est
// jugée par rapport à cette pulsation personnelle. Un décalage constant n'est donc pas une faute de régularité ;
// au-delà de 45 % d'un temps, il l'est (on ne sait plus sur quel temps le joueur se place).
// À appeler à chaque image : update(h, heardAt, now), où h = { wf: note écrite en midi flottant } ou null,
// heardAt = instant de la dernière détection valide.
class ScaleRun {
  constructor(scale, o) {
    this.scale = scale; this.notes = scale.notes; this.o = o;
    this.idx = 0; this.done = false; this.rev = 0;
    this.cand = null; this.wrong = null; this.live = null;
    this.res = this.notes.map(() => ({ err: null, matched: false, dev: null, rel: null, timing: null, onset: null, last: null, short: false }));
  }

  expected(k) { const m = this.o.metro; return m.beat0 + (this.b0 + k) * m.P + (m.outLat || 0); }
  _dev(h, k) { return Math.abs(h.wf - this.notes[k].midi) * 100; }

  update(h, heardAt, now) {
    if (this.done) return;
    const m = this.o.metro, n = this.notes.length, tol = this.o.tol;
    const timed = m && this.b0 !== undefined;                // la grille n'existe qu'après la première note

    // Notes dont la fenêtre de temps est dépassée : manquées (fenêtre décalée selon le retard habituel du joueur)
    if (timed) {
      const sh = this._shift();
      while (this.idx < n && now > this.expected(this.idx) + sh + 0.9 * m.P + this.o.hold) this._miss(this.idx++);
    }

    if (this.idx < n) {
      if (h) {
        // Note attendue en priorité ; la note précédente encore tenue (legato) n'est jamais prise pour une note
        // sautée (au sommet, elle a la même hauteur que la note qui suit) ; sinon, on tolère jusqu'à 2 notes sautées.
        const prevHeld = this.idx > 0 && this._dev(h, this.idx - 1) <= tol;
        let j = -1;
        if (this._dev(h, this.idx) <= tol) j = this.idx;
        else if (!prevHeld) {
          for (let k = this.idx + 1; k <= Math.min(this.idx + 2, n - 1); k++) if (this._dev(h, k) <= tol) { j = k; break; }
        }
        if (j >= 0) {
          this.wrong = null;
          if (!this.cand || this.cand.j !== j) this.cand = { j, since: now, last: now };
          this.cand.last = now;
          if (now - this.cand.since >= this.o.hold) this._validate(j, heardAt);
        } else {
          if (this.cand && now - this.cand.last > 60) this.cand = null;
          if (prevHeld) {   // note précédente encore tenue (legato)
            this.res[this.idx - 1].last = heardAt; this.wrong = null;
          } else {
            const nr = Math.round(h.wf);
            if (this.wrong && this.wrong.key === nr) {
              if (now - this.wrong.since >= this.o.wrongHold && !this.res[this.idx].err) {
                const tgt = this.notes[this.idx].midi, dev = (h.wf - tgt) * 100;
                this.res[this.idx].err = nr === tgt ? { type: 'tuning', dev } : { type: 'wrong', played: nr, up: h.wf > tgt };
                this.live = Object.assign({ idx: this.idx }, this.res[this.idx].err);
                this.rev++;
              }
            } else this.wrong = { key: nr, since: now };
          }
        }
      } else {
        if (this.cand && now - this.cand.last > 60) this.cand = null;
        this.wrong = null;
      }
    }
    if (this.idx >= n || (timed && now > this.expected(n - 1) + this._shift() + 1.2 * m.P)) this._finish();
  }

  _devs() { return this.res.filter(r => r.dev !== null).map(r => r.dev); }
  _median(a) {
    if (!a.length) return 0;
    const b = a.slice().sort((x, y) => x - y), h = b.length >> 1;
    return b.length % 2 ? b[h] : (b[h - 1] + b[h]) / 2;
  }
  _shift() {                                   // retard habituel du joueur, estimé en cours d'exercice
    const d = this._devs(); if (d.length < 2) return 0;
    const P = this.o.metro.P;
    return Math.max(-0.45 * P, Math.min(0.45 * P, this._median(d)));
  }

  _miss(k) {
    if (!this.res[k].err) this.res[k].err = { type: 'missed' };
    this.cand = null; this.wrong = null; this.rev++;
  }

  _validate(j, heardAt) {
    const since = this.cand.since;
    for (let k = this.idx; k < j; k++) this._miss(k);
    const r = this.res[j], m = this.o.metro;
    r.matched = true; r.onset = since; r.last = heardAt;
    if (m) {
      if (this.b0 === undefined) this.b0 = Math.round(((since - m.lat) - (m.outLat || 0) - m.beat0) / m.P) - j;
      r.dev = (since - m.lat) - this.expected(j);
    }
    this.idx = j + 1; this.cand = null; this.wrong = null; this.live = null; this.rev++;
  }

  _finish() {
    for (let k = this.idx; k < this.notes.length; k++) this._miss(k);
    this.idx = this.notes.length;
    const m = this.o.metro, t = this.res[this.scale.topIdx];
    if (m) {
      const d = this._devs();
      this.offset = d.length >= 3 ? this._median(d) : 0;
      this.offsetBig = Math.abs(this.offset) > 0.45 * m.P;
      const ref = this.offsetBig ? 0 : this.offset;                 // pulsation personnelle du joueur
      const tolT = m.tolPct / 100 * m.P + m.floor;
      this.res.forEach(r => { if (r.dev !== null) { r.rel = r.dev - ref; r.timing = Math.abs(r.rel) <= tolT; } });
      this.spread = d.length ? d.reduce((a, v) => a + Math.abs(v - ref), 0) / d.length : 0;
    }
    // Respiration au sommet : la note la plus haute peut être écourtée de 50 % au plus (à la tolérance de rythme près)
    if (m && t.matched && t.last !== null && (t.last - t.onset) < 0.5 * m.P - (m.tolPct / 100 * m.P + m.floor)) {
      t.short = true; t.timing = false;
    }
    this.done = true; this.rev++;
  }

  summary() {
    const pitch = this.res.filter(r => r.err).length;
    const timing = this.res.filter(r => !r.err && r.timing === false).length;
    const has = this.o.metro && this.offset !== undefined;
    return { pitch, timing, offset: has ? this.offset : null, spread: has ? this.spread : null,
             offsetBig: !!(has && this.offsetBig), short: this.res[this.scale.topIdx].short,
             ok: pitch === 0 && timing === 0 };
  }
}

if (typeof module !== 'undefined') module.exports = { buildScale, spell, ScaleRun, SCALE_UP };
