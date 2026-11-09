// ============================================================
//  Clockwork Everlasting — birthdays, wedding, Jane's side quest, memories gallery,
//  tutorial checklist, settings & save slots
// ============================================================

// ---------- Birthdays ----------
const BIRTHDAYS = { anna: ['spring', 4], cedric: ['summer', 9], alice: ['autumn', 3], quinn: ['winter', 5], peter: ['winter', 9] };
function isBirthday(who, day = S.day) { const b = BIRTHDAYS[who]; return !!b && season(day).id === b[0] && dayOfSeason(day) === b[1]; }
function birthdaysToday() { return Object.keys(BIRTHDAYS).filter(w => S.rel[w] && S.rel[w].met && isBirthday(w)); }
function birthdaysThisSeason() { return Object.keys(BIRTHDAYS).filter(w => S.rel[w] && S.rel[w].met && BIRTHDAYS[w][0] === season().id); }

// ---------- Morning story events ----------
let morningQueue = [];

function storyMorning() {
  const msgs = [];
  if (S.partner && !S.wedding) S.wedding = { who: S.partner, day: S.day, done: false };
  const queue = k => { if (!morningQueue.includes(k)) morningQueue.push(k); };
  if (S.wedding && !S.wedding.done && S.day >= S.wedding.day) queue('wedding');
  if (S.bosses.jane && S.quest.jane === 0) queue('jane1');
  if (S.partner === 'peter' && S.day % 3 === 0) {
    const pool = Object.keys(CARDS).filter(c => c !== 'promise' && CARDS[c].rarity !== 'legendary');
    const id = pool[Math.floor(Math.random() * pool.length)];
    grantCard(id);
    msgs.push(`📘 Peter left a ${CARDS[id].name} card on your desk.`);
  }
  birthdaysToday().forEach(w => msgs.push(`🎂 It's ${COMPANIONS[w].name}'s birthday! Gifts count double today.`));
  return msgs.join(' ');
}

// Plays queued scenes one after another, then the festival if it's festival day
function morningSequence() {
  if (DLG) return setTimeout(morningSequence, 800);
  const next = morningQueue.shift();
  if (next) return playMorningScene(next, morningSequence);
  if (festivalToday()) openFestival();
}

function playMorningScene(key, done) {
  if (key === 'wedding') {
    if (!S.wedding || S.wedding.done) return done && done();
    S.wedding.done = true;
    grantArtifact('weddingbell');
    S.coins += 500;
    saveGame();
  }
  if (key === 'jane1') { if (S.quest.jane !== 0) return done && done(); S.quest.jane = 1; saveGame(); }
  playScene(sceneLines(key), () => { renderAll(); done && done(); }, key);
}

function weddingLines() {
  const who = (S.wedding && S.wedding.who) || S.partner || 'anna';
  const c = COMPANIONS[who];
  const guests = Object.keys(COMPANIONS).filter(w => w !== who && S.rel[w] && S.rel[w].met);
  const toasts = {
    anna: ['happy', 'I\'ve read a thousand weddings, and none were as lovely as this one. I\'m crying! Happy tears!'],
    cedric: ['happy', 'A toast! To the finest crew in seven centuries. Drinks are on the Gull!'],
    alice: ['smile', 'My dear student. I have never been prouder. Now, the first dance. Posture!'],
    quinn: ['happy', 'A wedding gift from the Treasury: 🪙500, tax-free. Purely sentimental. Ahem.'],
    peter: ['blush', 'I wrote an ode. Fourteen stanzas. I\'ll… just read the last one. It\'s about frost. And joy.'],
  };
  return [
    N('💒 Bells ring across the grove. Petals and paper lanterns fill the homestead, and every friend you\'ve made has gathered beneath the artifacts.'),
    L(who, 'blush', `I can\'t believe this is real. Of every moment in history… this is my favourite.`),
    ...guests.map(w => L(w, toasts[w][0], toasts[w][1])),
    L(who, 'cry', 'I promise to stand by you in every era, every season, every battle. Forever.'),
    N(`💍 You and ${c.name} are married! Received the 💒 Wedding Bell keepsake and 🪙500 in wedding gifts.`),
  ];
}

const JANE_SCENES = {
  jane1: () => [
    N('A knock at dawn. Lady Jane leans on your gate, out of uniform and holding half of a scorched map.'),
    L('jane', 'smile', 'Morning, grove-keeper. No tricks today. I\'ve come to ask a favour.'),
    L('jane', 'neutral', 'Forty years ago I buried my greatest hoard on an island that isn\'t on any map. This is half the map. The Crown seized the other half.'),
    L('jane', 'smirk', 'Which means it\'s sitting in Minister Quinn\'s Treasury vault. He won\'t give it to me… but he might go halves with you.'),
    N('🗺️ New quest: Jane\'s Lost Hoard. Fund the expedition at Minister Quinn\'s Royal Treasury.'),
  ],
  jane3: () => [
    N('The expedition returns! Sailors haul a barnacled chest onto your dock as Jane and Quinn argue over the ledger.'),
    L('quinn', 'surprised', 'Gold doubloons, a jewelled spyglass, and… a battle card? Extraordinary. Fifty percent is still the Crown\'s, of course.'),
    L('jane', 'happy', 'Keep your fifty percent, Minister. The spyglass and the card go to the grove-keeper. Call it an old pirate\'s thank you.'),
    L('jane', 'smile', 'Funny. I spent forty years chasing that chest. Turns out the treasure was finding people worth sharing it with.'),
    N('🏴‍☠️ Received the 🔭 Jane\'s Spyglass keepsake, the legendary card "Black Gull\'s Revenge", and your investment doubled!'),
  ],
};

// ---------- Memories gallery ----------
const STORY_TITLES = { peterIntro: 'A Frosty Rival', janeIntro: 'The Old Captain Returns', heist: 'The Great Heist', peterDefeat: 'Peter\'s Defeat', finale: 'The Gull Comes Home', meetAlice: 'The Duchess Arrives' };

function sceneLines(key) {
  const [kind, a, b] = key.split(':');
  if (kind === 'meet') return COMPANIONS[a].meet;
  if (kind === 'event') return COMPANIONS[a].events[b];
  if (kind === 'propose') return COMPANIONS[a].propose;
  if (kind === 'story') return a === 'meetAlice' ? COMPANIONS.alice.meet : STORY[a]();
  if (kind === 'wedding') return weddingLines();
  if (JANE_SCENES[kind]) return JANE_SCENES[kind]();
  return [N('…')];
}

function sceneTitle(key) {
  const [kind, a, b] = key.split(':');
  if (kind === 'meet') return `First meeting: ${COMPANIONS[a].name}`;
  if (kind === 'event') return `${COMPANIONS[a].name} · ${b}${COMPANIONS[a].mentor ? '★' : '♥'} event`;
  if (kind === 'propose') return `The Proposal: ${COMPANIONS[a].name}`;
  if (kind === 'story') return STORY_TITLES[a] || a;
  if (kind === 'wedding') return 'The Wedding';
  if (kind === 'jane1') return 'Jane\'s Lost Map';
  if (kind === 'jane3') return 'The Hoard Returns';
  return key;
}

function sceneFace(key) {
  const [kind, a] = key.split(':');
  if (COMPANIONS[a]) return a;
  if (kind === 'wedding') return (S.wedding && S.wedding.who) || 'anna';
  if (kind.startsWith('jane') || a === 'janeIntro' || a === 'finale') return 'jane';
  if (a === 'peterIntro' || a === 'heist' || a === 'peterDefeat') return 'peter';
  return 'anna';
}

function replayScene(key) { playScene(sceneLines(key), null); }

function galleryHtml() {
  const keys = Object.keys(S.seen);
  return `<section class="panel gallery">
    <h3>🎞️ Memories <small class="muted">${keys.length} scenes · replay any story moment</small></h3>
    ${keys.length ? `<div class="gallery-grid">${keys.map(k => `<button class="memory" onclick="replayScene('${k}')">
      <span class="mem-face">${portraitSVG(sceneFace(k), 'smile', { crop: 'head' })}</span><span>${sceneTitle(k)}<small>Day ${S.seen[k]}</small></span></button>`).join('')}</div>` : '<p class="muted">Story scenes you watch will be saved here.</p>'}
  </section>`;
}

// ---------- Tutorial checklist ----------
const TUTORIAL = [
  { id: 'till', text: 'Till 3 grass tiles with the ⛏️ Hoe', check: () => S.stats.tilled >= 3 },
  { id: 'plant', text: 'Plant a seed with 🌱 Plant', check: () => S.stats.planted >= 1 },
  { id: 'water', text: 'Water a crop with 💧 Water', check: () => S.stats.watered >= 1 },
  { id: 'sleep', text: 'Press 🌙 End Day to rest', check: () => S.day >= 2 },
  { id: 'harvest', text: 'Harvest a fully grown crop', check: () => S.stats.harvested >= 1 },
  { id: 'talk', text: 'Talk to a companion (💞 Companions tab)', check: () => Object.values(S.rel).some(r => r.pts > 0) },
  { id: 'puzzle', text: 'Solve a puzzle in the 🌀 Time Portal', check: () => Object.keys(S.puzzles).length >= 1 },
  { id: 'display', text: 'Display an artifact with 🏛️ Display', check: () => placedArtifacts().length >= 1 },
  { id: 'boss', text: 'Defeat your first boss', check: () => Object.keys(S.bosses).length >= 1 },
];

function checkTutorial() {
  if (S.tutorial.dismissed) return;
  TUTORIAL.forEach(t => {
    if (!S.tutorial.done[t.id] && t.check()) {
      S.tutorial.done[t.id] = true;
      S.coins += 25;
      toast(`✅ Tutorial: ${t.text} · 🪙 +25`);
      saveGame();
    }
  });
}

function tutorialHtml() {
  if (S.tutorial.dismissed || TUTORIAL.every(t => S.tutorial.done[t.id])) return '';
  const next = TUTORIAL.find(t => !S.tutorial.done[t.id]);
  return `<div class="tutorial panel">
    <div class="tut-head"><b>📋 Getting Started</b> <small class="muted">${TUTORIAL.filter(t => S.tutorial.done[t.id]).length}/${TUTORIAL.length} · 🪙25 each</small>
      <button class="btn small ghost" onclick="S.tutorial.dismissed=true;saveGame();renderAll()">Hide</button></div>
    <ul>${TUTORIAL.map(t => `<li class="${S.tutorial.done[t.id] ? 'done' : t === next ? 'next' : ''}">${S.tutorial.done[t.id] ? '✅' : t === next ? '👉' : '⬜'} ${t.text}</li>`).join('')}</ul>
  </div>`;
}

// ---------- Banners shown on the homestead ----------
function storyBanners() {
  const out = [];
  if (S.quest.jane === 1) out.push(`🗺️ <b>Jane's Lost Hoard:</b> fund the expedition at Minister Quinn's Treasury. <button class="btn small" onclick="showTab('town');compView='treasury';renderAll()">Go</button>`);
  if (S.quest.jane === 2) out.push('🗺️ <b>Jane\'s Lost Hoard:</b> the expedition is at sea…');
  if (S.wedding && !S.wedding.done) out.push(`💒 Your wedding with ${COMPANIONS[S.wedding.who].name} is on Day ${S.wedding.day}!`);
  birthdaysToday().forEach(w => out.push(`🎂 It's <b>${COMPANIONS[w].name}</b>'s birthday today, so gifts count double!`));
  return out.map(h => `<div class="story-banner">${h}</div>`).join('');
}

// ---------- Settings ----------
const TEXT_SPEEDS = { slow: [40, 1], normal: [28, 2], fast: [16, 3], instant: [10, 999] };

function applySettings() {
  document.body.classList.toggle('cb', !!S.settings.colorblind);
  document.body.classList.toggle('reduce-motion', !!S.settings.reducedMotion);
  if (typeof sfxGain !== 'undefined' && sfxGain) sfxGain.gain.value = S.settings.sfxVol;
  if (typeof musicGain !== 'undefined' && musicGain) musicGain.gain.value = S.settings.musicVol;
}

function setSetting(key, val) {
  S.settings[key] = val;
  saveGame();
  applySettings();
  if (key === 'sfxVol') sfx('coin');
  renderAll();
}

function slotInfo(n) {
  try {
    const raw = localStorage.getItem(slotKey(n));
    if (!raw) return null;
    const d = JSON.parse(raw);
    return `Day ${d.day} · Lv ${d.hero.level} · 🪙${d.coins} · ${Object.keys(d.bosses || {}).length} bosses`;
  } catch (e) { return null; }
}

function switchSlot(n) {
  if (n === currentSlot()) return;
  saveGame();
  try { localStorage.setItem('chronoGrove.slot', n); } catch (e) { /* ignore */ }
  S = loadGame();
  syncPlotSize();
  applySettings();
  toast(`💾 Switched to save slot ${n}.`);
  showTab('farm');
  if (!S.introSeen) showIntro();
}

function exportSave() {
  const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `clockwork-everlasting-slot${currentSlot()}-day${S.day}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

function importSave(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  file.text().then(txt => {
    try {
      const d = JSON.parse(txt);
      if (!d || d.version !== 1 || !Array.isArray(d.plot)) throw new Error('bad');
      if (!confirm(`Replace save slot ${currentSlot()} with this file (Day ${d.day})?`)) return;
      S = syncProgress(Object.assign(newState(), d));
      syncPlotSize();
      saveGame();
      applySettings();
      toast('📥 Save imported!');
      showTab('farm');
    } catch (e) { toast('⚠️ That file isn\'t a Clockwork Everlasting save.'); }
  });
}

function renderSettings() {
  const st = S.settings;
  document.getElementById('view-settings').innerHTML = `
    <h2 class="view-title">⚙️ Settings</h2>
    <div class="market-grid">
      <section class="panel">
        <h3>⚔️ Difficulty</h3>
        ${Object.entries(DIFFICULTY).map(([id, d]) => `<label class="radio"><input type="radio" name="diff" ${st.difficulty === id ? 'checked' : ''} onchange="setSetting('difficulty','${id}')"> <b>${d.label}</b> <small class="muted">${id === 'story' ? 'Bosses have 30% less HP and 25% less attack. Relaxed and story-focused.' : id === 'hard' ? 'Bosses have 30% more HP and 20% more attack.' : 'The intended challenge.'}</small></label>`).join('')}
      </section>
      <section class="panel">
        <h3>🔊 Sound</h3>
        <label class="slider">Sound effects ${Math.round(st.sfxVol * 100)}% <input type="range" min="0" max="1" step="0.05" value="${st.sfxVol}" onchange="setSetting('sfxVol', +this.value)"></label>
        <label class="slider">Music ${Math.round(st.musicVol / 0.32 * 100)}% <input type="range" min="0" max="0.32" step="0.02" value="${st.musicVol}" onchange="setSetting('musicVol', +this.value)"></label>
        <div class="btn-row"><button class="btn small" onclick="toggleSetting('sfx');renderSettings()">${st.sfx ? '🔊 Effects on' : '🔇 Effects off'}</button><button class="btn small" onclick="toggleSetting('music');renderSettings()">${st.music ? '🎵 Music on' : '🎵 Music off'}</button></div>
      </section>
      <section class="panel">
        <h3>♿ Accessibility</h3>
        <label class="slider">Text speed
          <select onchange="setSetting('textSpeed', this.value)">${Object.keys(TEXT_SPEEDS).map(k => `<option ${st.textSpeed === k ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
        <label class="radio"><input type="checkbox" ${st.colorblind ? 'checked' : ''} onchange="setSetting('colorblind', this.checked)"> <b>Colour-blind friendly cards</b> <small class="muted">Distinct colours plus ⚔️/🛡️/✨ type labels.</small></label>
        <label class="radio"><input type="checkbox" ${st.reducedMotion ? 'checked' : ''} onchange="setSetting('reducedMotion', this.checked)"> <b>Reduced motion</b> <small class="muted">Turns off animations, shakes and flashes.</small></label>
      </section>
      <section class="panel">
        <h3>💾 Save Slots</h3>
        ${[1, 2, 3].map(n => `<div class="shop-row"><span><b>Slot ${n}</b> ${n === currentSlot() ? '<span class="tag on">current</span>' : ''}<small>${n === currentSlot() ? `Day ${S.day} · Lv ${S.hero.level} · 🪙${S.coins}` : (slotInfo(n) || 'Empty: start a new game')}</small></span>
          ${n === currentSlot() ? '' : `<button class="btn small" onclick="switchSlot(${n})">Load</button>`}</div>`).join('')}
        <div class="btn-row">
          <button class="btn small" onclick="exportSave()">📤 Export save</button>
          <label class="btn small">📥 Import save<input type="file" accept="application/json,.json" hidden onchange="importSave(this)"></label>
          <button class="btn small danger" onclick="confirmReset()">Reset this slot</button>
        </div>
        <p class="muted small">Saves live in this browser. Export a file to back up your grove or move it to another device.</p>
      </section>
    </div>`;
}
