'use strict';

// ---------- Noms de notes ----------
const TRANSPOSE = 2; // clarinette en si♭ : note écrite = note réelle + 1 ton
const EN_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const EN_FLAT  = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const FR_SHARP = ['Do', 'Do♯', 'Ré', 'Ré♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];
const FR_FLAT  = ['Do', 'Ré♭', 'Ré', 'Mi♭', 'Mi', 'Fa', 'Sol♭', 'Sol', 'La♭', 'La', 'Si♭', 'Si'];
// Position sur la portée : [indice de la lettre (do=0…si=6), altération]
const SP_SHARP = [[0,''],[0,'♯'],[1,''],[1,'♯'],[2,''],[3,''],[3,'♯'],[4,''],[4,'♯'],[5,''],[5,'♯'],[6,'']];
const SP_FLAT  = [[0,''],[1,'♭'],[1,''],[2,'♭'],[2,''],[3,''],[4,'♭'],[4,''],[5,'♭'],[5,''],[6,'♭'],[6,'']];

const octave = m => Math.floor(m / 12) - 1;
function label(midi, sharpNames, flatNames) {
  const pc = ((midi % 12) + 12) % 12, o = octave(midi);
  const a = sharpNames[pc] + o, b = flatNames[pc] + o;
  return a === b ? a : a + ' / ' + b;
}
const labelFr = m => label(m, FR_SHARP, FR_FLAT);
const labelEn = m => label(m, EN_SHARP, EN_FLAT);

// ---------- Langue ----------
let lang = 'fr';
try { lang = localStorage.getItem('lang') === 'en' ? 'en' : 'fr'; } catch (e) {}
// Notation principale (grosse) puis secondaire, selon la langue
const labelMain = m => lang === 'en' ? labelEn(m) : labelFr(m);
const labelSub = m => lang === 'en' ? labelFr(m) : labelEn(m);
const firstName = m => labelMain(m).split(' / ')[0];

const I18N = {
  fr: {
    title: 'Doigtés clarinette', h1: 'Doigtés clarinette',
    sub: 'Clarinette en si♭ — les notes affichées sont les notes <strong>écrites</strong> (celles de la partition).',
    hSettings: 'Réglages', hTarget: 'Note à jouer', micOn: 'Activer le micro', micOff: 'Couper le micro',
    mic: 'Micro', defaultMic: 'Micro par défaut', micN: 'Micro ', refA: 'La de référence (Hz)',
    gate: 'Sensibilité', level: 'Niveau', hHeard: 'Note entendue',
    tooLow: 'trop bas', tooHigh: 'trop haut', cents: 'cents',
    hTrain: 'Entraînement', range: 'Étendue',
    r1: 'Mi3 – Do6 (étendue courante)', r2: 'Chalumeau (Mi3 – Sol♯4)', r3: 'Notes de gorge (Sol4 – Si♭4)',
    r4: 'Clairon (Si4 – Do6)', r5: 'Aigu (Do♯6 – Do7)', r6: 'Étendue complète (Mi3 – Do7)',
    tol: "Marge d'accord :", accid: 'Avec dièses / bémols', auto: 'Enchaîner automatiquement',
    trainOn: "Commencer l'entraînement", trainOff: "Arrêter l'entraînement",
    skip: 'Passer cette note', tone: 'Écouter la note',
    footer: 'Numérotation des octaves : Do4 = do du milieu du piano. La note réelle (sonore) est un ton plus bas que la note écrite.',
    realSound: 'Son réel : ', idle: 'Appuyez sur « Commencer » pour recevoir une note à jouer.',
    ended: 'Entraînement terminé.', yourTurn: 'À vous de jouer…',
    score: n => n.firstTry + ' / ' + n.done + ' réussies du premier coup',
    bravo: (name, dir) => '✓ Bravo ! ' + name + (dir ? ' (un peu ' + (dir > 0 ? 'haut' : 'bas') + ')' : ''),
    rightNote: (dev) => 'Bonne note, mais trop ' + (dev > 0 ? 'haute' : 'basse') + ' (' + (dev > 0 ? '+' : '') + dev.toFixed(0) + ' cents)',
    wrongNote: (name, up) => '✗ Vous jouez ' + name + ' (' + (up ? 'trop haut' : 'trop bas') + ') — essayez encore',
    modeNote: 'Notes', modeScale: 'Gammes',
    sMinor: 'Gamme mineure', sMinorType: 'Type de gamme mineure',
    tHarmonic: 'Harmonique', tNatural: 'Naturelle', tMelodic: 'Mélodique',
    sMetro: 'Métronome', sBpm: 'Tempo (battements/min)', sTolT: 'Tolérance de régularité',
    sHeadphones: '🎧 Utilisez un casque : sinon le micro capte le clic du métronome.',
    sTrainOn: 'Démarrer la gamme', sSkip: 'Autre gamme', sRetry: 'Recommencer',
    typeName: { major: 'majeure', harmonic: 'mineure harmonique', natural: 'mineure naturelle', melodic: 'mineure mélodique' },
    scaleTitle: (root, type, other) => 'Gamme ' + type + ' de ' + root + ' (' + other + ')',
    sIdle: 'Choisissez les options puis appuyez sur « Démarrer la gamme ».',
    sPlayUp: (i, n) => 'Jouez la gamme en montant — note ' + i + '/' + n,
    sPlayDown: (i, n) => 'Et en descendant — note ' + i + '/' + n,
    sCount: k => 'Décompte… ' + k, sGo: 'Allez-y !',
    sTuning: dev => 'Note juste mais trop ' + (dev > 0 ? 'haute' : 'basse') + ' (' + (dev > 0 ? '+' : '') + dev.toFixed(0) + ' cents)',
    sWrong: (name, up) => 'Vous jouez ' + name + ' (' + (up ? 'trop haut' : 'trop bas') + ')',
    sOk: '✓ Gamme réussie !',
    sBad: (s) => '✗ À retravailler : ' + [s.pitch ? s.pitch + ' note' + (s.pitch > 1 ? 's' : '') + ' fausse' + (s.pitch > 1 ? 's' : '') + ' ou manquée' + (s.pitch > 1 ? 's' : '') : '', s.timing ? s.timing + ' note' + (s.timing > 1 ? 's' : '') + ' hors rythme' : ''].filter(Boolean).join(', '),
    sShort: 'La note la plus haute a été écourtée de plus de 50 %.',
    sMean: (off, spread, big) => 'Décalage moyen : ' + (Math.abs(off) < 15 ? 'pile sur le clic' : Math.abs(off).toFixed(0) + ' ms ' + (off > 0 ? 'après' : 'avant') + ' le clic') + ' ; régularité : ±' + spread.toFixed(0) + ' ms.' + (big ? ' Décalage trop important : jouez plus près du clic.' : ''),
    sGoNow: '▶ Jouez !',
    sScore: n => n.firstTry + ' / ' + n.done + ' gammes réussies',
    sTipFree: 'Sans métronome : jouez legato ; une courte respiration au sommet est acceptée.',
    sTipMetro: 'Une note par temps, en legato ; une respiration au sommet est acceptée (note la plus haute écourtée de 50 % au plus).',
    micDenied: e => "Impossible d'accéder au micro (" + e + "). Autorisez le micro pour cette page dans le navigateur et dans Réglages Système > Confidentialité > Micro.",
    noMedia: "Ce navigateur n'autorise pas l'accès au micro depuis cette adresse. Lancez l'application avec lancer.command (adresse localhost).",
  },
  en: {
    title: 'Clarinet Fingering Trainer', h1: 'Clarinet Fingering Trainer',
    sub: 'B♭ clarinet — displayed notes are the <strong>written</strong> notes (as on the sheet music).',
    hSettings: 'Settings', hTarget: 'Note to play', micOn: 'Turn mic on', micOff: 'Turn mic off',
    mic: 'Mic', defaultMic: 'Default mic', micN: 'Mic ', refA: 'Reference A (Hz)',
    gate: 'Sensitivity', level: 'Level', hHeard: 'Note heard',
    tooLow: 'too flat', tooHigh: 'too sharp', cents: 'cents',
    hTrain: 'Practice', range: 'Range',
    r1: 'E3 – C6 (usual range)', r2: 'Chalumeau (E3 – G♯4)', r3: 'Throat tones (G4 – B♭4)',
    r4: 'Clarion (B4 – C6)', r5: 'Altissimo (C♯6 – C7)', r6: 'Full range (E3 – C7)',
    tol: 'Tuning tolerance:', accid: 'Include sharps / flats', auto: 'Automatically move on',
    trainOn: 'Start practice', trainOff: 'Stop practice',
    skip: 'Skip this note', tone: 'Play the note',
    footer: 'Octave numbering: C4 = middle C. The real (concert) pitch is one whole tone below the written note.',
    realSound: 'Sounding pitch: ', idle: 'Press “Start” to get a note to play.',
    ended: 'Practice stopped.', yourTurn: 'Your turn…',
    score: n => n.firstTry + ' / ' + n.done + ' correct on the first try',
    bravo: (name, dir) => '✓ Well done! ' + name + (dir ? ' (a bit ' + (dir > 0 ? 'sharp' : 'flat') + ')' : ''),
    rightNote: (dev) => 'Right note, but too ' + (dev > 0 ? 'sharp' : 'flat') + ' (' + (dev > 0 ? '+' : '') + dev.toFixed(0) + ' cents)',
    wrongNote: (name, up) => '✗ You are playing ' + name + ' (' + (up ? 'too high' : 'too low') + ') — try again',
    modeNote: 'Notes', modeScale: 'Scales',
    sMinor: 'Minor scale', sMinorType: 'Minor scale type',
    tHarmonic: 'Harmonic', tNatural: 'Natural', tMelodic: 'Melodic',
    sMetro: 'Metronome', sBpm: 'Tempo (beats/min)', sTolT: 'Timing tolerance',
    sHeadphones: '🎧 Use headphones: otherwise the mic picks up the metronome click.',
    sTrainOn: 'Start the scale', sSkip: 'Another scale', sRetry: 'Try again',
    typeName: { major: 'major', harmonic: 'harmonic minor', natural: 'natural minor', melodic: 'melodic minor' },
    scaleTitle: (root, type, other) => root + ' ' + type + ' scale (' + other + ')',
    sIdle: 'Choose the options, then press “Start the scale”.',
    sPlayUp: (i, n) => 'Play the scale going up — note ' + i + '/' + n,
    sPlayDown: (i, n) => 'And coming down — note ' + i + '/' + n,
    sCount: k => 'Count-in… ' + k, sGo: 'Go!',
    sTuning: dev => 'Right note but too ' + (dev > 0 ? 'sharp' : 'flat') + ' (' + (dev > 0 ? '+' : '') + dev.toFixed(0) + ' cents)',
    sWrong: (name, up) => 'You are playing ' + name + ' (' + (up ? 'too high' : 'too low') + ')',
    sOk: '✓ Scale completed!',
    sBad: (s) => '✗ Needs work: ' + [s.pitch ? s.pitch + ' wrong or missed note' + (s.pitch > 1 ? 's' : '') : '', s.timing ? s.timing + ' note' + (s.timing > 1 ? 's' : '') + ' off the beat' : ''].filter(Boolean).join(', '),
    sShort: 'The highest note was cut short by more than 50%.',
    sMean: (off, spread, big) => 'Average offset: ' + (Math.abs(off) < 15 ? 'right on the click' : Math.abs(off).toFixed(0) + ' ms ' + (off > 0 ? 'behind' : 'ahead of') + ' the click') + '; steadiness: ±' + spread.toFixed(0) + ' ms.' + (big ? ' Offset too large: play closer to the click.' : ''),
    sGoNow: '▶ Play!',
    sScore: n => n.firstTry + ' / ' + n.done + ' scales completed',
    sTipFree: 'No metronome: play legato; a short breath at the top is accepted.',
    sTipMetro: 'One note per beat, legato; a breath at the top is accepted (the highest note may be cut short by 50% at most).',
    micDenied: e => 'Cannot access the microphone (' + e + '). Allow microphone access for this page in the browser and in System Settings > Privacy & Security > Microphone.',
    noMedia: 'This browser does not allow microphone access from this address. Start the app with lancer.command (localhost address).',
  },
};
const t = k => I18N[lang][k];

// ---------- Éléments ----------
const $ = id => document.getElementById(id);
const el = {
  micBtn: $('micBtn'), deviceSel: $('deviceSel'), refA: $('refA'), gate: $('gate'), level: $('level'),
  msg: $('msg'), heardMain: $('heardMain'), heardSub: $('heardSub'), heardInfo: $('heardInfo'),
  needle: $('needle'), zone: $('zone'), centsTxt: $('centsTxt'),
  rangeSel: $('rangeSel'), tol: $('tol'), tolTxt: $('tolTxt'), accid: $('accid'), auto: $('auto'),
  langBtn: $('langBtn'),
  modeNote: $('modeNote'), modeScale: $('modeScale'), retryBtn: $('retryBtn'), scaleTitle: $('scaleTitle'),
  chips: $('chips'), beat: $('beat'), beatTxt: $('beatTxt'), minorChk: $('minorChk'), minorType: $('minorType'),
  metroOn: $('metroOn'), headphones: $('headphones'), bpm: $('bpm'), bpmTxt: $('bpmTxt'),
  tolT: $('tolT'), tolTTxt: $('tolTTxt'), cue: $('cue'), trainBtn: $('trainBtn'), skipBtn: $('skipBtn'), toneBtn: $('toneBtn'), score: $('score'),
  staff: $('staff'), targetMain: $('targetMain'), targetSub: $('targetSub'), verdict: $('verdict'),
};

// ---------- Audio ----------
let ctx = null, stream = null, analyser = null, buf = null, rafId = null;

async function listDevices() {
  const devs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput');
  const current = el.deviceSel.value;
  el.deviceSel.innerHTML = '<option value="">' + t('defaultMic') + '</option>';
  devs.forEach((d, i) => {
    const o = document.createElement('option');
    o.value = d.deviceId; o.textContent = d.label || t('micN') + (i + 1);
    el.deviceSel.appendChild(o);
  });
  el.deviceSel.value = current;
}

async function startMic() {
  stopMic();
  el.msg.textContent = '';
  try {
    const id = el.deviceSel.value;
    stream = await navigator.mediaDevices.getUserMedia({ audio: {
      deviceId: id ? { exact: id } : undefined,
      echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  } catch (e) {
    el.msg.textContent = t('micDenied')(e.name);
    return false;
  }
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);
  analyser = ctx.createAnalyser();
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0;
  src.connect(analyser);
  buf = new Float32Array(analyser.fftSize);
  el.micBtn.textContent = t('micOff');
  await listDevices();
  loop();
  return true;
}

function stopMic() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  if (stream) stream.getTracks().forEach(t => t.stop());
  if (ctx) ctx.close();
  stream = ctx = analyser = null; clickBuf = null;
  el.micBtn.textContent = t('micOn');
  el.level.style.width = '0';
  showHeard(null);
}

// ---------- Analyse ----------
const history = [];        // dernières fréquences détectées (ou null)
const HIST = 5;
const RECENT = 2700;       // nombre d'échantillons analysés (≈ 56 ms à 48 kHz)
let heard = null;          // { wf: midi écrit (flottant), freq: Hz réels }
let lastHeardAt = 0;
let ignoreUntil = 0;

function loop() {
  rafId = requestAnimationFrame(loop);
  analyser.getFloatTimeDomainData(buf);
  const recent = buf.subarray(buf.length - RECENT);   // échantillons les plus récents : latence minimale
  let s = 0;
  for (let i = 0; i < recent.length; i++) s += recent[i] * recent[i];
  const rms = Math.sqrt(s / recent.length);
  const db = 20 * Math.log10(rms + 1e-9);
  el.level.style.width = Math.max(0, Math.min(100, (db + 70) / 50 * 100)) + '%';

  const now = performance.now();
  let f = null;
  if (now > ignoreUntil && db > Number(el.gate.value)) {
    const r = detectPitch(recent, ctx.sampleRate, { minFreq: 135, maxFreq: 2100 });
    if (r && r.clarity > 0.8) f = r.freq;
  }
  history.push(f);
  if (history.length > HIST) history.shift();
  const valid = history.filter(x => x !== null).sort((a, b) => a - b);
  if (valid.length >= 3) {
    const freq = valid[Math.floor(valid.length / 2)];
    const ref = Number(el.refA.value) || 440;
    heard = { freq, wf: 69 + 12 * Math.log2(freq / ref) + TRANSPOSE };
    lastHeardAt = now;
  } else if (now - lastHeardAt > 200) {
    heard = null;
  }
  showHeard(heard);
  if (training) { if (mode === 'scale') scaleFrame(now); else evaluate(heard, now); }
}

function showHeard(h) {
  if (!h) {
    el.heardMain.textContent = '–'; el.heardSub.innerHTML = '&nbsp;';
    el.heardInfo.innerHTML = '&nbsp;'; el.centsTxt.innerHTML = '&nbsp;';
    el.needle.style.opacity = .2; el.needle.style.left = '50%';
    return;
  }
  const n = Math.round(h.wf), cents = (h.wf - n) * 100;
  el.heardMain.textContent = labelMain(n);
  el.heardSub.textContent = labelSub(n);
  el.heardInfo.textContent = t('realSound') + h.freq.toFixed(1) + ' Hz';
  setNeedle(cents);
}

function setNeedle(cents) {
  const c = Math.max(-50, Math.min(50, cents));
  el.needle.style.opacity = 1;
  el.needle.style.left = (50 + c) + '%';
  el.centsTxt.textContent = (cents > 0 ? '+' : '') + cents.toFixed(0) + ' ' + t('cents');
}

// ---------- Entraînement ----------
let training = false, target = null, state = 'idle';
let okSince = null, lastOkAt = 0, wrongKey = null, wrongSince = 0, failed = false, nextAt = 0;
const HOLD_MS = 400, WRONG_MS = 700;
let stats = { done: 0, firstTry: 0 };

function pickTarget() {
  const [lo, hi] = el.rangeSel.value.split('-').map(Number);
  const pool = [];
  for (let m = lo; m <= hi; m++) {
    if (!el.accid.checked && [1, 3, 6, 8, 10].includes(m % 12)) continue;
    pool.push(m);
  }
  if (!pool.length) return null;
  let m;
  do { m = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && target && m === target.midi);
  return { midi: m, spelling: Math.random() < 0.5 ? 'sharp' : 'flat' };
}

function currentTargetShown() {
  el.targetMain.textContent = labelMain(target.midi);
  el.targetSub.textContent = labelSub(target.midi);
}

function newTarget() {
  const tg = pickTarget();
  if (!tg) return;
  target = tg; state = 'play'; okSince = null; wrongKey = null; failed = false;
  currentTargetShown();
  setVerdict('wait', I18N[lang].yourTurn);
  drawStaff(tg.midi, tg.spelling);
  const tol = Number(el.tol.value);
  el.zone.style.display = 'block';
  el.zone.style.left = (50 - tol) + '%';
  el.zone.style.width = (2 * tol) + '%';
}

function setVerdict(cls, text) {
  el.verdict.className = 'verdict ' + cls;
  el.verdict.textContent = text;
}

function updateScore() {
  el.score.textContent = stats.done ? t(mode === 'scale' ? 'sScore' : 'score')(stats) : '';
}

function evaluate(h, now) {
  if (state === 'cooldown') {
    if (el.auto.checked && now >= nextAt) newTarget();
    return;
  }
  if (state !== 'play' || !target) return;
  if (!h) {
    if (now - lastOkAt > 150) okSince = null;
    wrongKey = null;
    return;
  }
  const tol = Number(el.tol.value);
  const dev = (h.wf - target.midi) * 100;
  if (Math.abs(dev) <= tol) {
    lastOkAt = now;
    wrongKey = null;
    if (okSince === null) okSince = now;
    if (now - okSince >= HOLD_MS) {
      stats.done++; if (!failed) stats.firstTry++;
      updateScore();
      setVerdict('ok', t('bravo')(firstName(target.midi), Math.abs(dev) > 20 ? dev : 0));
      state = 'cooldown'; nextAt = now + 1600;
    }
    return;
  }
  okSince = null;
  const key = Math.round(h.wf);
  if (key !== wrongKey) { wrongKey = key; wrongSince = now; return; }
  if (now - wrongSince >= WRONG_MS) {
    failed = true;
    if (key === target.midi) {
      setVerdict('bad', t('rightNote')(dev));
    } else {
      setVerdict('bad', t('wrongNote')(firstName(key), h.wf > target.midi));
    }
  }
}

async function startTraining() {
  if (!stream && !(await startMic())) return;
  training = true; stats = { done: 0, firstTry: 0 }; updateScore();
  el.trainBtn.textContent = t('trainOff');
  el.skipBtn.disabled = el.toneBtn.disabled = el.retryBtn.disabled = false;
  if (mode === 'scale') newScale(); else newTarget();
}

function stopTraining() {
  training = false; state = 'idle'; target = null; run = null; metro = null;
  el.trainBtn.textContent = trainLabel(true);
  el.skipBtn.disabled = el.toneBtn.disabled = el.retryBtn.disabled = true;
  el.chips.innerHTML = ''; el.scaleTitle.innerHTML = '&nbsp;'; el.beatTxt.textContent = ''; setCue('', false); el.beat.classList.remove('on');
  el.zone.style.display = 'none';
  setVerdict('wait', t('ended'));
  el.targetMain.textContent = '–'; el.targetSub.innerHTML = '&nbsp;';
  el.staff.innerHTML = '';
}

// Note de référence (hauteur réelle = écrite − 1 ton)
function playTone() {
  if (!target || !ctx) return;
  const ref = Number(el.refA.value) || 440;
  const freq = ref * Math.pow(2, (target.midi - TRANSPOSE - 69) / 12);
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'triangle'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
  o.connect(g).connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + 1.25);
  ignoreUntil = performance.now() + 1500;
  history.length = 0; heard = null;
}

// ---------- Mode Gammes ----------
let mode = 'note', scale = null, run = null, metro = null, lastRoot = -1, clickBuf = null, runRev = -1, shownIdx = -1;
const DETECT_LATENCY_MS = 70;   // délai moyen de la détection (fenêtre d'analyse + lissage), mesuré approximativement
const FR_L = ['Do', 'Ré', 'Mi', 'Fa', 'Sol', 'La', 'Si'], EN_L = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ACC = ['♭♭', '♭', '', '♯', '♯♯'];
const spelled = (n, names) => names[n.letter] + ACC[n.acc + 2] + n.oct;
const spelledMain = n => spelled(n, lang === 'en' ? EN_L : FR_L);
const spelledSub = n => spelled(n, lang === 'en' ? FR_L : EN_L);

const trainLabel = on => t(mode === 'scale' ? (on ? 'sTrainOn' : 'trainOff') : (on ? 'trainOn' : 'trainOff'));
const outLatency = () => ((ctx && (ctx.outputLatency || ctx.baseLatency)) || 0) * 1000;

function scaleType() { return el.minorChk.checked ? el.minorType.value : 'major'; }

function newScale() {
  let l; do { l = Math.floor(Math.random() * 7); } while (l === lastRoot);
  lastRoot = l;
  scale = buildScale(l, scaleType());
  startRun();
}

function startRun() {
  const now = performance.now();
  const useMetro = el.metroOn.checked;
  const P = 60000 / Number(el.bpm.value);
  let m = null;
  metro = null;
  if (useMetro) {
    const beat0 = now + 600;                                  // 4 temps de décompte, puis la gamme
    m = { P, t0: beat0 + 4 * P, lat: DETECT_LATENCY_MS, outLat: outLatency(),
          tolPct: Number(el.tolT.value), floor: 25 };
    metro = { P, beat0, k: 0, vk: 0, cursor: -1, total: 4 + scale.notes.length };
  }
  run = new ScaleRun(scale, {
    tol: Number(el.tol.value),
    hold: useMetro ? Math.min(150, 0.4 * P) : 250,
    wrongHold: useMetro ? Math.min(300, 0.6 * P) : 450,
    metro: m,
  });
  runRev = -1; shownIdx = -1;
  const names = scale.rootLetter;
  el.scaleTitle.textContent = t('scaleTitle')(
    (lang === 'en' ? EN_L : FR_L)[names], t('typeName')[scale.type], (lang === 'en' ? FR_L : EN_L)[names]);
  el.chips.innerHTML = scale.notes.map((n, k) =>
    `<div class="chip${k === scale.topIdx ? ' top' : ''}" data-k="${k}">${spelledMain(n)}<small>&nbsp;</small></div>`).join('');
  el.zone.style.display = 'block';
  el.zone.style.left = (50 - Number(el.tol.value)) + '%';
  el.zone.style.width = (2 * Number(el.tol.value)) + '%';
  el.beatTxt.textContent = useMetro ? t('sTipMetro') : t('sTipFree');
  setCue(useMetro ? '' : t('sGoNow'), !useMetro);
  setVerdict('wait', useMetro ? t('sCount')(1) : t('sPlayUp')(1, scale.notes.length));
  renderRun(true);
}

function setCue(text, go) { el.cue.textContent = text || '\u00a0'; el.cue.classList.toggle('go', !!go); }

// kind : 'count' (décompte), 'go' (premier temps de la gamme : plus aigu et plus fort), 'beat', 'accent'
function playClick(when, kind) {
  if (!clickBuf) {                                           // bruit bref : peu de risque d'être pris pour une note
    const n = Math.floor(ctx.sampleRate * 0.03);
    clickBuf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = clickBuf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
  }
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = clickBuf;
  f.type = 'bandpass'; f.Q.value = 1.2;
  f.frequency.value = kind === 'go' ? 3300 : kind === 'accent' ? 2400 : 1700;
  g.gain.value = kind === 'go' ? 3.4 : kind === 'accent' ? 2.8 : 1.9;
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(when);
}

function tickMetro(now) {
  const m = metro, bt = k => m.beat0 + k * m.P;
  while (m.k < m.total && bt(m.k) - now < 120) {              // programmation à l'avance sur l'horloge audio
    playClick(ctx.currentTime + Math.max(0, bt(m.k) - now) / 1000,
      m.k === 4 ? 'go' : m.k < 4 ? 'count' : (m.k - 4) % 4 === 0 ? 'accent' : 'beat');
    m.k++;
  }
  const lat = outLatency();
  while (m.vk < m.k && bt(m.vk) + lat <= now) {               // témoin visuel synchronisé sur le son
    el.beat.classList.add('on'); setTimeout(() => el.beat.classList.remove('on'), 90);
    if (m.vk < 4) { setVerdict('wait', t('sCount')(m.vk + 1)); setCue(String(m.vk + 1), false); }
    else if (m.vk === 4) setCue(t('sGoNow'), true);
    else if (m.vk === 6) setCue('', false);
    m.cursor = m.vk - 4;                                     // curseur : note attendue sur ce temps
    el.chips.querySelectorAll('.chip').forEach((c, k) => c.classList.toggle('bt', k === m.cursor));
    m.vk++;
  }
}

function scaleFrame(now) {
  if (!run) return;
  if (metro) {
    tickMetro(now);
    if (!metro.go && now >= metro.beat0 + 4 * metro.P - metro.P / 2) { metro.go = true; renderRun(true); }
  }
  const fresh = now - lastHeardAt < 80 ? heard : null;
  const wasDone = run.done;
  run.update(fresh, lastHeardAt, now);
  if (run.rev !== runRev) renderRun(false);
  if (run.done && !wasDone) finishRun();
}

function renderRun(force) {
  runRev = run.rev;
  const n = scale.notes.length, cur = Math.min(run.idx, n - 1);
  el.chips.querySelectorAll('.chip').forEach((c, k) => {
    const r = run.res[k];
    let cls = 'chip' + (k === scale.topIdx ? ' top' : '') + (metro && metro.cursor === k ? ' bt' : '');
    let small = ' ';
    if (r.matched || r.err) {
      cls += r.err ? ' bad' : r.timing === false ? ' late' : ' ok';
      const dv = r.rel !== null ? r.rel : r.dev;           // écart à sa propre pulsation, une fois l'exercice terminé
      if (dv !== null && r.matched) small = (dv > 0 ? '+' : '') + Math.round(dv) + ' ms';
      if (r.err && r.err.type === 'wrong') small = '→ ' + labelMain(r.err.played).split(' / ')[0];
      else if (r.err && r.err.type === 'tuning') small = (r.err.dev > 0 ? '+' : '') + Math.round(r.err.dev) + ' ¢';
      else if (r.err) small = '–';
      c.title = r.err ? (r.err.type === 'wrong' ? spelledMain(scale.notes[k]) + ' ✗ ' + labelMain(r.err.played)
                         : r.err.type === 'tuning' ? t('sTuning')(r.err.dev) : '✗') : '';
    }
    if (k === run.idx && !run.done) cls += ' cur';
    if (c.className !== cls) c.className = cls;
    if (c.lastElementChild.textContent !== small) c.lastElementChild.textContent = small;
  });
  if (cur !== shownIdx || force) {
    shownIdx = cur;
    const nt = scale.notes[cur];
    target = { midi: nt.midi, spelling: nt };
    el.targetMain.textContent = spelledMain(nt);
    el.targetSub.textContent = spelledSub(nt);
    drawStaff(nt.midi, nt);
  }
  if (run.done) return;
  const started = !metro || metro.go;
  if (run.live && run.live.idx === run.idx) {
    setVerdict('bad', run.live.type === 'tuning' ? t('sTuning')(run.live.dev)
      : t('sWrong')(labelMain(run.live.played).split(' / ')[0], run.live.up));
  } else if (started) {
    const nt = scale.notes[cur], i = cur + 1;
    setVerdict('wait', (nt.dir === 'up' ? t('sPlayUp') : t('sPlayDown'))(i, n));
  }
}

function finishRun() {
  const s = run.summary();
  stats.done++; if (s.ok) stats.firstTry++; updateScore();
  const extra = [s.short ? t('sShort') : '', s.offset !== null ? t('sMean')(s.offset, s.spread, s.offsetBig) : ''].filter(Boolean).join(' ');
  setCue('', false);
  el.verdict.className = 'verdict ' + (s.ok ? 'ok' : 'bad');
  el.verdict.textContent = (s.ok ? t('sOk') : t('sBad')(s) + '.') + (extra ? ' ' + extra : '');
  if (metro) el.beat.classList.remove('on');
  el.chips.querySelectorAll('.chip.bt').forEach(c => c.classList.remove('bt'));
  metro = null;
}

function setMode(m) {
  if (m === mode) return;
  if (training) stopTraining();
  mode = m;
  document.body.dataset.mode = m;
  el.modeNote.setAttribute('aria-pressed', m === 'note');
  el.modeScale.setAttribute('aria-pressed', m === 'scale');
  el.zone.style.display = 'none';
  stats = { done: 0, firstTry: 0 };
  setVerdict('wait', m === 'scale' ? t('sIdle') : t('idle'));
  refreshModeUI();
}

function refreshModeUI() {
  el.trainBtn.textContent = training ? t('trainOff') : trainLabel(true);
  el.skipBtn.textContent = t(mode === 'scale' ? 'sSkip' : 'skip');
  el.headphones.hidden = !el.metroOn.checked;
  el.minorType.disabled = !el.minorChk.checked;
  el.bpmTxt.textContent = el.bpm.value; el.tolTTxt.textContent = el.tolT.value;
  updateScore();
}

// ---------- Portée ----------
function drawStaff(midi, spelling) {
  let letter, acc, oct = octave(midi);
  if (typeof spelling === 'object') {                  // orthographe imposée (gammes)
    letter = spelling.letter; acc = ['♭♭', '♭', '', '♯', '♯♯'][spelling.acc + 2]; oct = spelling.oct;
  } else [letter, acc] = (spelling === 'flat' ? SP_FLAT : SP_SHARP)[midi % 12];
  const d = letter + 7 * (oct - 4);          // pas diatoniques depuis do4 (do4 = 0)
  const yBottom = 150, step = 6;                       // d = 2 (mi4) sur la ligne du bas
  const y = dd => yBottom - (dd - 2) * step;
  const x = 160;
  let svg = '<g stroke="currentColor" stroke-width="1.2" stroke-linecap="round">';
  for (let dd = 2; dd <= 10; dd += 2) svg += `<line x1="10" x2="225" y1="${y(dd)}" y2="${y(dd)}"/>`;
  for (let dd = 0; dd >= d; dd -= 2) svg += `<line x1="${x - 17}" x2="${x + 17}" y1="${y(dd)}" y2="${y(dd)}"/>`;
  for (let dd = 12; dd <= d; dd += 2) svg += `<line x1="${x - 17}" x2="${x + 17}" y1="${y(dd)}" y2="${y(dd)}"/>`;
  const up = d < 6;
  svg += up ? `<line x1="${x + 8}" x2="${x + 8}" y1="${y(d)}" y2="${y(d) - 36}"/>`
            : `<line x1="${x - 8}" x2="${x - 8}" y1="${y(d)}" y2="${y(d) + 36}"/>`;
  svg += '</g>';
  svg += `<ellipse cx="${x}" cy="${y(d)}" rx="9" ry="6.2" fill="currentColor" transform="rotate(-18 ${x} ${y(d)})"/>`;
  svg += `<text x="12" y="${y(2) + 12}" font-size="82" fill="currentColor" font-family="'Apple Symbols','Noto Music','Bravura Text',serif">𝄞</text>`;
  if (acc) svg += `<text x="${x - 36}" y="${y(d) + 8}" font-size="26" fill="currentColor" font-family="'Apple Symbols','Helvetica Neue',sans-serif">${acc}</text>`;
  el.staff.innerHTML = svg;
}

// ---------- Événements ----------
el.micBtn.onclick = () => stream ? (stopTraining(), stopMic()) : startMic();
el.deviceSel.onchange = () => { if (stream) startMic(); };
el.trainBtn.onclick = () => training ? stopTraining() : startTraining();
el.skipBtn.onclick = () => { if (training) (mode === 'scale' ? newScale() : newTarget()); };
el.toneBtn.onclick = playTone;
el.modeNote.onclick = () => setMode('note');
el.modeScale.onclick = () => setMode('scale');
el.retryBtn.onclick = () => { if (training && scale) startRun(); };
el.minorChk.onchange = el.metroOn.onchange = refreshModeUI;
el.bpm.oninput = el.tolT.oninput = refreshModeUI;
el.tol.oninput = () => {
  el.tolTxt.textContent = el.tol.value;
  if (target) { el.zone.style.left = (50 - el.tol.value) + '%'; el.zone.style.width = (2 * el.tol.value) + '%'; }
};
el.rangeSel.onchange = el.accid.onchange = () => { if (training) newTarget(); };


// ---------- Application de la langue ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach(n => { n.innerHTML = t(n.dataset.i18n); });
  el.langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
  el.langBtn.title = lang === 'fr' ? 'Switch to English' : 'Passer en français';
  el.micBtn.textContent = stream ? t('micOff') : t('micOn');
  refreshModeUI();
  if (!stream) el.deviceSel.options[0].textContent = t('defaultMic'); else listDevices();
  if (!training && !target) setVerdict('wait', stats.done ? t('ended') : t(mode === 'scale' ? 'sIdle' : 'idle'));
  updateScore();
  if (mode === 'scale' && run && scale) {
    const rl = scale.rootLetter;
    el.scaleTitle.textContent = t('scaleTitle')((lang === 'en' ? EN_L : FR_L)[rl], t('typeName')[scale.type], (lang === 'en' ? FR_L : EN_L)[rl]);
    el.chips.querySelectorAll('.chip').forEach((c, k) => { c.firstChild.textContent = spelledMain(scale.notes[k]); });
    shownIdx = -1; renderRun(true);
  } else if (target && mode === 'note') { currentTargetShown(); if (state === 'play') setVerdict('wait', t('yourTurn')); }
  showHeard(heard);
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) el.msg.textContent = t('noMedia');
}
el.langBtn.onclick = () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  try { localStorage.setItem('lang', lang); } catch (e) {}
  applyLang();
};
applyLang();
