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
    hSettings: 'Micro et réglages', micOn: 'Activer le micro', micOff: 'Couper le micro',
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
    micDenied: e => "Impossible d'accéder au micro (" + e + "). Autorisez le micro pour cette page dans le navigateur et dans Réglages Système > Confidentialité > Micro.",
    noMedia: "Ce navigateur n'autorise pas l'accès au micro depuis cette adresse. Lancez l'application avec lancer.command (adresse localhost).",
  },
  en: {
    title: 'Clarinet Fingering Trainer', h1: 'Clarinet Fingering Trainer',
    sub: 'B♭ clarinet — displayed notes are the <strong>written</strong> notes (as on the sheet music).',
    hSettings: 'Microphone & settings', micOn: 'Turn microphone on', micOff: 'Turn microphone off',
    mic: 'Microphone', defaultMic: 'Default microphone', micN: 'Microphone ', refA: 'Reference A (Hz)',
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
  langBtn: $('langBtn'), trainBtn: $('trainBtn'), skipBtn: $('skipBtn'), toneBtn: $('toneBtn'), score: $('score'),
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
  stream = ctx = analyser = null;
  el.micBtn.textContent = t('micOn');
  el.level.style.width = '0';
  showHeard(null);
}

// ---------- Analyse ----------
const history = [];        // dernières fréquences détectées (ou null)
const HIST = 5;
let heard = null;          // { wf: midi écrit (flottant), freq: Hz réels }
let lastHeardAt = 0;
let ignoreUntil = 0;

function loop() {
  rafId = requestAnimationFrame(loop);
  analyser.getFloatTimeDomainData(buf);
  let s = 0;
  for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
  const rms = Math.sqrt(s / buf.length);
  const db = 20 * Math.log10(rms + 1e-9);
  el.level.style.width = Math.max(0, Math.min(100, (db + 70) / 50 * 100)) + '%';

  const now = performance.now();
  let f = null;
  if (now > ignoreUntil && db > Number(el.gate.value)) {
    const r = detectPitch(buf, ctx.sampleRate, { minFreq: 135, maxFreq: 2100 });
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
  if (training) evaluate(heard, now);
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
  el.score.textContent = stats.done ? t('score')(stats) : '';
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
  el.skipBtn.disabled = el.toneBtn.disabled = false;
  newTarget();
}

function stopTraining() {
  training = false; state = 'idle'; target = null;
  el.trainBtn.textContent = t('trainOn');
  el.skipBtn.disabled = el.toneBtn.disabled = true;
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

// ---------- Portée ----------
function drawStaff(midi, spelling) {
  const pc = midi % 12;
  const [letter, acc] = (spelling === 'flat' ? SP_FLAT : SP_SHARP)[pc];
  const d = letter + 7 * (octave(midi) - 4);          // pas diatoniques depuis do4 (do4 = 0)
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
el.skipBtn.onclick = () => { if (training) newTarget(); };
el.toneBtn.onclick = playTone;
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
  el.trainBtn.textContent = training ? t('trainOff') : t('trainOn');
  if (!stream) el.deviceSel.options[0].textContent = t('defaultMic'); else listDevices();
  if (!training && !target) setVerdict('wait', training ? '' : (stats.done ? t('ended') : t('idle')));
  updateScore();
  if (target) { currentTargetShown(); if (state === 'play') setVerdict('wait', t('yourTurn')); }
  showHeard(heard);
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) el.msg.textContent = t('noMedia');
}
el.langBtn.onclick = () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  try { localStorage.setItem('lang', lang); } catch (e) {}
  applyLang();
};
applyLang();
