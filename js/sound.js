// ============================================================
//  Clockwork Everlasting — procedural sound effects & music (Web Audio, no files)
// ============================================================

let AC = null, master = null, musicGain = null, sfxGain = null;
let musicTrack = null, musicTimer = null, musicStep = 0, nextNoteTime = 0;

function audioReady() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return true; }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain(); master.gain.value = 0.9; master.connect(AC.destination);
    sfxGain = AC.createGain(); sfxGain.gain.value = S ? S.settings.sfxVol : 0.5; sfxGain.connect(master);
    musicGain = AC.createGain(); musicGain.gain.value = S ? S.settings.musicVol : 0.16; musicGain.connect(master);
    return true;
  } catch (e) { return false; }
}

function tone(freq, dur, opts = {}) {
  if (!AC) return;
  const t = opts.at || AC.currentTime;
  const o = AC.createOscillator();
  const g = AC.createGain();
  o.type = opts.type || 'sine';
  o.frequency.setValueAtTime(freq, t);
  if (opts.slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, opts.slide), t + dur);
  const v = opts.vol ?? 0.3;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + (opts.attack || 0.01));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(opts.out || sfxGain);
  o.start(t); o.stop(t + dur + 0.05);
}

function noise(dur, opts = {}) {
  if (!AC) return;
  const t = opts.at || AC.currentTime;
  const len = Math.floor(AC.sampleRate * dur);
  const buf = AC.createBuffer(1, len, AC.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = AC.createBufferSource(); src.buffer = buf;
  const f = AC.createBiquadFilter(); f.type = opts.filter || 'lowpass'; f.frequency.value = opts.freq || 1200;
  const g = AC.createGain(); g.gain.value = opts.vol ?? 0.3;
  src.connect(f); f.connect(g); g.connect(opts.out || sfxGain);
  src.start(t);
}

const NOTE = n => 440 * Math.pow(2, (n - 69) / 12); // MIDI note -> Hz

function sfx(name) {
  if (!S || !S.settings || !S.settings.sfx || !audioReady()) return;
  const t = AC.currentTime;
  const arp = (notes, step, type, vol) => notes.forEach((n, i) => tone(NOTE(n), step * 2.2, { at: t + i * step, type, vol }));
  switch (name) {
    case 'click':   tone(880, 0.05, { type: 'triangle', vol: 0.08 }); break;
    case 'pop':     tone(660, 0.12, { type: 'sine', vol: 0.25, slide: 1320 }); break;
    case 'harvest': arp([72, 76, 79], 0.06, 'triangle', 0.22); break;
    case 'coin':    tone(NOTE(83), 0.08, { type: 'square', vol: 0.12 }); tone(NOTE(88), 0.25, { type: 'square', vol: 0.12, at: t + 0.08 }); break;
    case 'card':    noise(0.12, { filter: 'highpass', freq: 2500, vol: 0.18 }); tone(520, 0.08, { type: 'triangle', vol: 0.1, slide: 900 }); break;
    case 'hit':     noise(0.15, { freq: 700, vol: 0.4 }); tone(140, 0.15, { type: 'square', vol: 0.15, slide: 60 }); break;
    case 'heavy':   noise(0.5, { freq: 400, vol: 0.6 }); tone(90, 0.6, { type: 'sawtooth', vol: 0.25, slide: 35 }); break;
    case 'block':   tone(300, 0.12, { type: 'square', vol: 0.12 }); tone(450, 0.1, { type: 'square', vol: 0.08, at: t + 0.04 }); break;
    case 'heal':    arp([67, 71, 74, 79, 83], 0.07, 'sine', 0.2); break;
    case 'success': arp([72, 79, 84], 0.08, 'triangle', 0.22); break;
    case 'wrong':   tone(180, 0.25, { type: 'sawtooth', vol: 0.15, slide: 120 }); break;
    case 'win':     arp([67, 72, 76, 79, 84, 88], 0.1, 'square', 0.12); break;
    case 'lose':    arp([67, 63, 60, 55], 0.16, 'triangle', 0.18); break;
    case 'level':   arp([60, 64, 67, 72, 76, 79, 84], 0.06, 'square', 0.1); break;
    case 'cutin':   noise(0.35, { filter: 'bandpass', freq: 1800, vol: 0.25 }); tone(400, 0.35, { type: 'sawtooth', vol: 0.08, slide: 1600 }); break;
    case 'heart':   arp([76, 81], 0.12, 'sine', 0.2); break;
    case 'festival':arp([72, 74, 76, 79, 81, 84, 81, 79], 0.09, 'triangle', 0.15); break;
    case 'achieve': arp([79, 84, 88, 91], 0.09, 'square', 0.1); break;
    default:
      if (name.startsWith('rune')) tone(NOTE([60, 64, 67, 72][+name.slice(4)] || 60), 0.35, { type: 'triangle', vol: 0.25 });
  }
}

// Little "voice" blips while dialogue types, pitched per character (anime visual-novel style)
const VOICE = { anna: 82, cedric: 62, alice: 76, quinn: 58, peter: 72, jane: 64, hero: 70 };
function voiceBlip(who) {
  if (!S || !S.settings.sfx || !AC || !VOICE[who]) return;
  tone(NOTE(VOICE[who] + Math.floor(Math.random() * 3)), 0.05, { type: 'square', vol: 0.04 });
}

// ---------- music: tiny procedural chiptune loops ----------
const TRACKS = {
  farm:     { bpm: 92,  lead: [72, 76, 79, 76, 74, 72, 69, 72, 74, 76, 74, 72, 69, 67, 69, null], bass: [48, 48, 55, 55, 53, 53, 50, 50], wave: 'triangle' },
  winter:   { bpm: 76,  lead: [76, null, 79, 76, 74, null, 71, 72, 74, null, 76, 74, 72, null, 69, null], bass: [45, 45, 52, 52, 50, 50, 47, 47], wave: 'sine' },
  battle:   { bpm: 138, lead: [69, 72, 76, 72, 69, 72, 77, 76, 74, 71, 67, 71, 74, 76, 74, 71], bass: [45, 45, 45, 45, 41, 41, 43, 43], wave: 'square' },
  festival: { bpm: 120, lead: [72, 74, 76, 79, 76, 74, 72, null, 74, 76, 79, 84, 81, 79, 76, null], bass: [48, 55, 53, 55, 48, 55, 50, 55], wave: 'square' },
};

function setMusic(name) {
  if (musicTrack === name && (musicTimer || !AC)) return;
  musicTrack = name;
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  if (!name || !S || !S.settings.music || !AC) return;
  musicStep = 0;
  nextNoteTime = AC.currentTime + 0.1;
  musicTimer = setInterval(scheduleMusic, 50);
}

function scheduleMusic() {
  const tr = TRACKS[musicTrack];
  if (!tr || !AC) return;
  const step = 60 / tr.bpm / 2;
  while (nextNoteTime < AC.currentTime + 0.25) {
    const n = tr.lead[musicStep % tr.lead.length];
    if (n) tone(NOTE(n), step * 1.6, { at: nextNoteTime, type: tr.wave, vol: 0.18, out: musicGain });
    if (musicStep % 2 === 0) tone(NOTE(tr.bass[(musicStep / 2) % tr.bass.length]), step * 1.9, { at: nextNoteTime, type: 'triangle', vol: 0.3, out: musicGain });
    if (musicTrack === 'battle' && musicStep % 4 === 2) noise(0.05, { at: nextNoteTime, filter: 'highpass', freq: 5000, vol: 0.12, out: musicGain });
    nextNoteTime += step;
    musicStep++;
  }
}

function backgroundMusic() {
  if (B) return 'battle';
  return season().id === 'winter' ? 'winter' : 'farm';
}

function toggleSetting(key) {
  S.settings[key] = !S.settings[key];
  saveGame();
  audioReady();
  if (key === 'music') { const want = backgroundMusic(); musicTrack = null; setMusic(S.settings.music ? want : null); }
  renderHeader();
}

// Browsers only allow audio after the first click or tap
window.addEventListener('pointerdown', () => {
  const first = !AC;
  audioReady();
  if (first && S && S.settings.music) setMusic(backgroundMusic());
}, { capture: true });
document.addEventListener('click', e => { if (e.target.closest('button')) sfx('click'); }, true);
