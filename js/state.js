// ============================================================
//  Clockwork Everlasting — game state, saving and derived stats
// ============================================================

const SAVE_KEY = 'chronoGrove.save.v1';
const PLOT_W = 8;
let PLOT_H = 6;
function syncPlotSize() { PLOT_H = Math.ceil(S.plot.length / PLOT_W); }
let S = null;

function newState() {
  const plot = [];
  for (let i = 0; i < PLOT_W * 6; i++) plot.push({ t: "grass" });
  const starter = [19, 20, 27, 28];
  let placed = 0;
  while (placed < 14) {
    const k = Math.floor(Math.random() * plot.length);
    if (starter.includes(k) || plot[k].t !== 'grass') continue;
    plot[k] = { t: 'rock', kind: Math.random() < 0.55 ? '🪨' : '🪵' };
    placed++;
  }
  starter.forEach(k => { plot[k] = { t: 'soil', wet: false, crop: null }; });
  return {
    version: 1,
    day: 1,
    weather: 'sunny',
    coins: 60,
    energy: 20,
    seeds: { wheat: 6, carrot: 2 },
    produce: {},
    items: { potion: 2, hipotion: 0, tonic: 0 },
    artifacts: [],            // owned artifact ids
    hero: { level: 1, xp: 0, forgeAtk: 0, forgeDef: 0 },
    puzzles: {},              // puzzleId -> times cleared
    bosses: {},               // eraId -> true
    plot,
    introSeen: false,
    won: false,
    // Companions & cards
    library: { items: {}, produce: {} },
    cards: Object.assign({}, STARTER_DECK),
    deck: Object.assign({}, STARTER_DECK),
    rel: { anna: { pts: 0, met: false, events: [] }, cedric: { pts: 0, met: false, events: [] }, alice: { pts: 0, met: false, events: [] }, quinn: { pts: 0, met: false, events: [] }, peter: { pts: 0, met: false, events: [] } },
    partner: null,
    support: null,
    locket: 0,
    daily: { day: 1, talked: {}, gifted: {} },
    // Final villains
    stolen: [],
    shipStolen: false,
    heistStarted: false,
    story: {},
    // Mentors
    bank: 0,
    ventures: [],
    upgrades: {},
    bounty: false,
    // Seasons, journal, settings
    festivals: {},
    achievements: {},
    title: null,
    stats: { harvested: 0, puzzleTypes: {}, ventureWins: 0, festivals: 0, tilled: 0, planted: 0, watered: 0, fished: 0, cooked: 0, requests: 0 },
    settings: { sfx: true, music: true, sfxVol: 0.5, musicVol: 0.16, textSpeed: 'normal', colorblind: false, reducedMotion: false, difficulty: 'normal' },
    // Homestead expansion, cooking, fishing
    pantry: { egg: 0 },
    fish: {},
    fishdex: {},
    dishes: {},
    meal: null,
    buildings: { greenhouse: false, coop: false, expansions: 0 },
    chickens: 0,
    gh: [],
    decor: {},
    requests: [],
    // Battles & modes
    golden: {},
    elite: {},
    rift: { best: 0, run: null },
    dailyChallenge: { last: null, streak: 0 },
    // Story & meta
    seen: {},
    quest: { jane: 0 },
    wedding: null,
    tutorial: { dismissed: false, done: {} },
  };
}

function currentSlot() { try { return +(localStorage.getItem('chronoGrove.slot') || 1); } catch (e) { return 1; } }
function slotKey(n = currentSlot()) { return n === 1 ? SAVE_KEY : `${SAVE_KEY}.s${n}`; }

function saveGame() {
  try { localStorage.setItem(slotKey(), JSON.stringify(S)); } catch (e) { /* storage unavailable */ }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(slotKey());
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.version === 1 && Array.isArray(data.plot)) return syncProgress(Object.assign(newState(), data));
    }
  } catch (e) { /* ignore corrupt save */ }
  return newState();
}

function resetGame() {
  try { localStorage.removeItem(slotKey()); } catch (e) { /* ignore */ }
  S = newState();
  syncPlotSize();
}

// ---------- derived values ----------
function placedArtifacts() {
  return S.plot.filter(t => t.t === 'artifact').map(t => t.id);
}

function unplacedArtifacts() {
  const placed = new Set(placedArtifacts());
  return S.artifacts.filter(id => !placed.has(id));
}

function bonuses() {
  const b = { atk: 0, def: 0, hp: 0, energy: 0, gold: 0, sprinkler: 0, sets: 0 };
  placedArtifacts().forEach(id => {
    const a = ARTIFACTS[id];
    if (!a) return;
    for (const k in a.bonus) b[k] += a.bonus[k];
  });
  S.plot.forEach(t => { if (t.t === 'deco' && DECOR[t.id]) for (const k in DECOR[t.id].bonus) b[k] += DECOR[t.id].bonus[k]; });
  b.sets = completedSets().length;
  b.atk += 3 * b.sets; b.def += 3 * b.sets; b.gold += 10 * b.sets;
  return b;
}

function stats() {
  const b = bonuses();
  const L = S.hero.level - 1;
  return {
    maxHp: 50 + L * 12 + b.hp,
    atk: 9 + L * 2 + S.hero.forgeAtk * 2 + b.atk,
    def: 2 + L + S.hero.forgeDef + b.def,
    maxEnergy: 20 + b.energy,
    gold: b.gold,
  };
}

function xpToNext() { return 50 * S.hero.level; }

function grantXp(n) {
  S.hero.xp += n;
  let gained = 0;
  while (S.hero.xp >= xpToNext()) {
    S.hero.xp -= xpToNext();
    S.hero.level++;
    gained++;
  }
  if (gained && typeof sfx === 'function') sfx('level');
  return gained;
}

function grantArtifact(id) {
  if (!S.artifacts.includes(id)) { S.artifacts.push(id); return true; }
  return false;
}

function eraIndex(eraId) { return ERAS.findIndex(e => e.id === eraId); }

function eraUnlocked(era) {
  if (S.bosses[era.id]) return true;
  const i = eraIndex(era.id);
  if (i === 0) return true;
  if (era.requires) return !!S.bosses[era.requires];
  if (era.final) return ERAS.filter(e => !e.final).every(e => S.bosses[e.id]);
  return !!S.bosses[ERAS[i - 1].id];
}

function bossUnlocked(era) {
  return era.puzzles.every(p => S.puzzles[p.id]);
}

function cropUnlocked(id) {
  const c = CROPS[id];
  return !c.unlock || !!S.bosses[c.unlock];
}

function spendEnergy(n) {
  if (S.energy < n) return false;
  S.energy -= n;
  return true;
}

// Older saves: hand out cards for puzzles and bosses already cleared
function syncProgress(st) {
  const fresh = newState();
  st.stats = Object.assign(fresh.stats, st.stats || {});
  st.settings = Object.assign(fresh.settings, st.settings || {});
  st.buildings = Object.assign(fresh.buildings, st.buildings || {});
  st.quest = Object.assign(fresh.quest, st.quest || {});
  st.tutorial = Object.assign(fresh.tutorial, st.tutorial || {});
  st.pantry = Object.assign(fresh.pantry, st.pantry || {});
  ['anna', 'cedric', 'alice', 'quinn', 'peter'].forEach(w => { if (!st.rel[w]) st.rel[w] = { pts: 0, met: false, events: [] }; });
  for (const pid in st.puzzles) {
    const cid = PUZZLE_CARDS[pid];
    if (cid && !st.cards[cid]) { st.cards[cid] = 1; if (deckSize(st) < DECK_MAX) st.deck[cid] = (st.deck[cid] || 0) + 1; }
  }
  for (const eid in st.bosses) {
    const cid = BOSS_CARDS[eid];
    if (cid && !st.cards[cid]) { st.cards[cid] = 1; if (deckSize(st) < DECK_MAX) st.deck[cid] = (st.deck[cid] || 0) + 1; }
  }
  return st;
}

// ---------- cards ----------
function deckSize(st = S) { return Object.values(st.deck).reduce((a, b) => a + b, 0); }

function deckList() {
  const out = [];
  for (const id in S.deck) for (let i = 0; i < S.deck[id]; i++) out.push(id);
  return out.length ? out : Object.keys(STARTER_DECK).flatMap(id => Array(STARTER_DECK[id]).fill(id));
}

function grantCard(id) {
  S.cards[id] = (S.cards[id] || 0) + 1;
  if (deckSize() < DECK_MAX) S.deck[id] = (S.deck[id] || 0) + 1;
}

// ---------- satchel & Anna's archive ----------
function satchelCap() {
  return 10 + (hearts('anna') >= 4 ? 5 : 0) + (S.partner === 'anna' ? 5 : 0);
}

function satchelCount() {
  const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
  return sum(S.items) + sum(S.produce);
}

// kind: 'items' | 'produce'. Fills the satchel first; anything that won't fit goes to Anna's archive.
function stash(kind, id, n = 1) {
  const room = Math.max(0, satchelCap() - satchelCount());
  const toBag = Math.min(room, n);
  const toLib = n - toBag;
  if (toBag) S[kind][id] = (S[kind][id] || 0) + toBag;
  if (toLib) S.library[kind][id] = (S.library[kind][id] || 0) + toLib;
  return { toBag, toLib };
}

function totalOf(kind, id) { return (S[kind][id] || 0) + (S.library[kind][id] || 0); }

// Takes from the satchel first, then the archive
function takeFrom(kind, id, n = 1) {
  if (totalOf(kind, id) < n) return false;
  const fromBag = Math.min(S[kind][id] || 0, n);
  S[kind][id] = (S[kind][id] || 0) - fromBag;
  if (n - fromBag) S.library[kind][id] -= n - fromBag;
  return true;
}

// ---------- relationships ----------
function hearts(who) { return Math.min(10, Math.floor((S.rel[who] ? S.rel[who].pts : 0) / 10)); }

function addAffection(who, pts) {
  const before = hearts(who);
  S.rel[who].pts = Math.min(100, S.rel[who].pts + pts);
  return hearts(who) - before;
}

function resetDailyIfNeeded() {
  if (S.daily.day !== S.day) S.daily = { day: S.day, talked: {}, gifted: {} };
}

// ---------- calendar ----------
function seasonIndex(day = S.day) { return Math.floor((day - 1) / SEASON_LEN) % 4; }
function season(day = S.day) { return SEASONS[seasonIndex(day)]; }
function dayOfSeason(day = S.day) { return ((day - 1) % SEASON_LEN) + 1; }
function year(day = S.day) { return Math.floor((day - 1) / (SEASON_LEN * 4)) + 1; }
function inSeason(cropId, day = S.day) { return CROPS[cropId].seasons.includes(season(day).id); }
