// ============================================================
//  Clockwork Everlasting — homestead expansion: fishing, buildings, decor, requests
// ============================================================

// ---------- Fishing ----------
const FISH = {
  minnow:  { name: 'Time Minnow',       emoji: '🐟', value: 20,  rarity: 0.9,  seasons: null },
  shrimp:  { name: 'Glass Shrimp',      emoji: '🦐', value: 35,  rarity: 0.8,  seasons: null },
  trout:   { name: 'Rainbow Trout',     emoji: '🐠', value: 45,  rarity: 0.7,  seasons: ['spring', 'summer'] },
  crab:    { name: 'Chrono Crab',       emoji: '🦀', value: 55,  rarity: 0.65, seasons: ['autumn', 'winter'] },
  puffer:  { name: 'Puffer of Ages',    emoji: '🐡', value: 70,  rarity: 0.55, seasons: ['summer'] },
  squid:   { name: 'Ink Scholar Squid', emoji: '🦑', value: 90,  rarity: 0.45, seasons: ['autumn'], req: 'greece' },
  lobster: { name: 'Pharaoh Lobster',   emoji: '🦞', value: 110, rarity: 0.4,  seasons: ['winter'], req: 'egypt' },
  shark:   { name: 'Megalodon Pup',     emoji: '🦈', value: 250, rarity: 0.2,  seasons: ['summer'], req: 'renaissance' },
  octopus: { name: 'Kraken Hatchling',  emoji: '🐙', value: 160, rarity: 0.22, seasons: null, req: 'jane' },
  whale:   { name: 'Leviathan Calf',    emoji: '🐋', value: 400, rarity: 0.08, seasons: null, req: 'end' },
};
const FISH_ENERGY = 2;
let FG = null;

function fishAvailable() {
  return Object.keys(FISH).filter(id => { const f = FISH[id]; return (!f.seasons || f.seasons.includes(season().id)) && (!f.req || S.bosses[f.req]); });
}

function rollFish() {
  const pool = fishAvailable();
  const total = pool.reduce((s, id) => s + FISH[id].rarity, 0);
  let r = Math.random() * total;
  for (const id of pool) { r -= FISH[id].rarity; if (r <= 0) return id; }
  return pool[0];
}

function openFishing() {
  if (FG && FG.raf) cancelAnimationFrame(FG.raf);
  FG = { phase: 'idle', msg: 'Cast your line into the time-stream!' };
  drawFishing();
}

function drawFishing() {
  const caught = Object.keys(FISH).filter(id => S.fishdex[id]);
  openStage(`
    <div class="stage-card intro wide" style="--era:#2f6f9a">
      <h2>🎣 Gilded Gull Dock</h2>
      <div class="pond ${FG.phase}">
        <span class="bobber">${FG.phase === 'bite' ? '❗' : '🔴'}</span>
        ${FG.phase === 'reel' ? '<div class="row-meter fish-meter"><div class="zone perfect" id="fishZone"></div><div class="marker" id="fishMarker"></div></div>' : ''}
        ${FG.catch ? `<div class="catch">${FISH[FG.catch].emoji}</div>` : ''}
      </div>
      <p class="rune-status">${FG.msg}</p>
      <div class="btn-row">
        ${FG.phase === 'idle' ? `<button class="btn primary big-btn" ${S.energy < FISH_ENERGY ? 'disabled' : ''} onclick="castLine()">🎣 Cast (⚡${FISH_ENERGY})</button>` : ''}
        ${FG.phase === 'wait' || FG.phase === 'bite' ? '<button class="btn primary big-btn" onclick="hookFish()">🪝 Hook!</button>' : ''}
        ${FG.phase === 'reel' ? '<button class="btn primary big-btn" onclick="reelFish()">🌀 Reel!</button>' : ''}
        <button class="btn ghost" onclick="stopFishing()">Leave dock</button>
      </div>
      <p class="muted small">In season now: ${fishAvailable().map(id => FISH[id].emoji).join(' ')} · Energy ⚡${S.energy}</p>
      <h3>📘 Fish Collection <small class="muted">${caught.length}/${Object.keys(FISH).length}</small></h3>
      <div class="fishdex">${Object.entries(FISH).map(([id, f]) => `<div class="fd ${S.fishdex[id] ? 'got' : ''}" title="${S.fishdex[id] ? `${f.name}: 🪙${f.value}` : '???'}"><span>${S.fishdex[id] ? f.emoji : '❔'}</span><small>${S.fishdex[id] ? `${f.name} ×${S.fishdex[id]}` : '???'}</small></div>`).join('')}</div>
    </div>`, 'linear-gradient(160deg,#e6f6ff,#7cc4ec 50%,#1f4f7a)');
}

function castLine() {
  if (!spendEnergy(FISH_ENERGY)) return;
  renderHeader();
  FG.catch = null;
  FG.phase = 'wait';
  FG.msg = 'Waiting for a bite… don\'t hook too early!';
  drawFishing();
  FG.t = setTimeout(() => {
    if (!FG || FG.phase !== 'wait') return;
    FG.phase = 'bite'; FG.msg = '❗ A BITE! Hook it now!'; sfx('pop'); drawFishing();
    FG.t = setTimeout(() => { if (FG && FG.phase === 'bite') { FG.phase = 'idle'; FG.msg = 'Too slow… it got away.'; sfx('wrong'); drawFishing(); } }, 900);
  }, 1200 + Math.random() * 2500);
}

function hookFish() {
  if (!FG) return;
  clearTimeout(FG.t);
  if (FG.phase === 'wait') { FG.phase = 'idle'; FG.msg = 'Too early! You scared the fish away.'; sfx('wrong'); return drawFishing(); }
  FG.target = rollFish();
  FG.phase = 'reel';
  FG.msg = `Something's on the line! Reel when the marker is in the green.`;
  drawFishing();
  const size = 10 + FISH[FG.target].rarity * 28;
  const zone = document.getElementById('fishZone');
  zone.style.width = `${size}%`;
  const t0 = performance.now();
  const loop = now => {
    if (!FG || FG.phase !== 'reel') return;
    const t = (now - t0) / 1000;
    FG.zonePos = 50 + Math.sin(t * 1.3) * 30;
    FG.pos = 50 + Math.sin(t * (2.6 + (1 - FISH[FG.target].rarity) * 2)) * 48;
    FG.size = size;
    const z = document.getElementById('fishZone'), m = document.getElementById('fishMarker');
    if (z) z.style.left = `${FG.zonePos}%`;
    if (m) m.style.left = `${FG.pos}%`;
    FG.raf = requestAnimationFrame(loop);
  };
  FG.raf = requestAnimationFrame(loop);
}

function reelFish() {
  if (!FG || FG.phase !== 'reel') return;
  cancelAnimationFrame(FG.raf);
  if (Math.abs(FG.pos - FG.zonePos) <= FG.size / 2 + 2) {
    const id = FG.target, f = FISH[id];
    S.fish[id] = (S.fish[id] || 0) + 1;
    const first = !S.fishdex[id];
    S.fishdex[id] = (S.fishdex[id] || 0) + 1;
    S.stats.fished++;
    FG.catch = id;
    FG.msg = `${first ? '✨ NEW! ' : ''}You caught a <b>${f.emoji} ${f.name}</b> (worth 🪙${f.value})!`;
    sfx(first ? 'win' : 'success');
  } else {
    FG.msg = 'The line snapped… it got away!';
    sfx('wrong');
  }
  FG.phase = 'idle';
  saveGame();
  drawFishing();
}

function stopFishing() {
  if (FG) { clearTimeout(FG.t); cancelAnimationFrame(FG.raf); }
  FG = null;
  closeStage();
}

// ---------- Carpenter: buildings & decor ----------
const BUILDINGS = {
  greenhouse: { name: 'Greenhouse', icon: '🌿', cost: 1800, desc: '8 extra tiles where any crop grows in any season, watered automatically.' },
  coop:       { name: 'Chicken Coop', icon: '🐔', cost: 1000, desc: 'Comes with 2 chickens. Each lays an egg every morning. Rarely, a golden one…' },
};
const DECOR = {
  lantern:  { name: 'Paper Lantern', emoji: '🏮', cost: 60,  bonus: { gold: 1 },      desc: '+1 coin per day.' },
  flowers:  { name: 'Tulip Bed',     emoji: '🌷', cost: 40,  bonus: {},               desc: 'Pure loveliness.' },
  bench:    { name: 'Garden Bench',  emoji: '🪑', cost: 80,  bonus: { energy: 1 },    desc: '+1 max energy. A place to rest.' },
  statue:   { name: 'Hero Statue',   emoji: '🗿', cost: 300, bonus: { def: 1 },       desc: '+1 DEF. Looks oddly like you.' },
  fountain: { name: 'Fountain',      emoji: '⛲', cost: 500, bonus: { sprinkler: 1 }, desc: 'Waters the 8 tiles around it each morning.' },
  path:     { name: 'Stone Path',    emoji: '🟫', cost: 15,  bonus: {},               desc: 'A tidy path between fields.' },
};
const EXPANSION_COST = [1500, 3000];

function buyBuilding(id) {
  const b = BUILDINGS[id];
  const cost = price(b.cost);
  if (S.buildings[id] || S.coins < cost) return;
  S.coins -= cost;
  S.buildings[id] = true;
  if (id === 'greenhouse') S.gh = [...Array(8)].map(() => ({ t: 'soil', wet: true, crop: null }));
  if (id === 'coop') S.chickens = 2;
  sfx('win');
  toast(`${b.icon} The carpenter built your <b>${b.name}</b>!`);
  saveGame(); renderAll();
}

function buyChicken() {
  const cost = price(150);
  if (!S.buildings.coop || S.chickens >= 8 || S.coins < cost) return;
  S.coins -= cost; S.chickens++;
  toast('🐔 A new chicken joins the coop!');
  saveGame(); renderAll();
}

function buyExpansion() {
  const n = S.buildings.expansions;
  if (n >= EXPANSION_COST.length) return;
  const cost = price(EXPANSION_COST[n]);
  if (S.coins < cost) return;
  S.coins -= cost;
  S.buildings.expansions++;
  for (let i = 0; i < PLOT_W; i++) S.plot.push(Math.random() < 0.25 ? { t: 'rock', kind: Math.random() < 0.5 ? '🪨' : '🪵' } : { t: 'grass' });
  syncPlotSize();
  toast('🪓 Your land grows by a whole new row!');
  saveGame(); renderAll();
}

function buyDecor(id) {
  const cost = price(DECOR[id].cost);
  if (S.coins < cost) return;
  S.coins -= cost;
  S.decor[id] = (S.decor[id] || 0) + 1;
  toast(`${DECOR[id].emoji} ${DECOR[id].name} added to your decor box. Place it with 🏛️ Display.`);
  saveGame(); renderAll();
}

function carpenterHtml() {
  const n = S.buildings.expansions;
  return `
    <section class="panel">
      <h3>🔨 Carpenter</h3>
      ${Object.entries(BUILDINGS).map(([id, b]) => `<div class="shop-row"><span>${b.icon} <b>${b.name}</b><small>${b.desc}</small></span>
        ${S.buildings[id] ? '<span class="tag on">Built ✓</span>' : `<button class="btn small" ${S.coins < price(b.cost) ? 'disabled' : ''} onclick="buyBuilding('${id}')">🪙${price(b.cost)}</button>`}</div>`).join('')}
      ${S.buildings.coop ? `<div class="shop-row"><span>🐔 <b>Chicken</b><small>${S.chickens}/8 in the coop</small></span><button class="btn small" ${S.chickens >= 8 || S.coins < price(150) ? 'disabled' : ''} onclick="buyChicken()">🪙${price(150)}</button></div>` : ''}
      <div class="shop-row"><span>🪓 <b>Land Expansion</b><small>Adds a new row of 8 tiles (${n}/${EXPANSION_COST.length} bought).</small></span>
        ${n >= EXPANSION_COST.length ? '<span class="tag on">Max ✓</span>' : `<button class="btn small" ${S.coins < price(EXPANSION_COST[n]) ? 'disabled' : ''} onclick="buyExpansion()">🪙${price(EXPANSION_COST[n])}</button>`}</div>
      <h4>Decorations</h4>
      ${Object.entries(DECOR).map(([id, d]) => `<div class="shop-row"><span>${d.emoji} <b>${d.name}</b><small>${d.desc} · in box ×${S.decor[id] || 0}</small></span><button class="btn small" ${S.coins < price(d.cost) ? 'disabled' : ''} onclick="buyDecor('${id}')">🪙${price(d.cost)}</button></div>`).join('')}
    </section>`;
}

// Era sets: display every artifact from one era for a bonus
function completedSets() {
  const placed = new Set(placedArtifacts());
  return ERAS.filter(e => { const ids = Object.keys(ARTIFACTS).filter(id => ARTIFACTS[id].era === e.id); return ids.length && ids.every(id => placed.has(id)); }).map(e => e.id);
}

// ---------- Greenhouse ----------
function handleGh(i) {
  const t = S.gh[i];
  if (!t) return;
  if (t.crop && t.crop.age >= CROPS[t.crop.id].days) {
    const c = CROPS[t.crop.id];
    stash('produce', t.crop.id, 1);
    S.stats.harvested++;
    sfx('harvest');
    t.crop = null;
    toast(`Harvested ${c.emoji} ${c.name} from the greenhouse!`);
  } else if (farmUI.tool === 'seed' && !t.crop) {
    const id = farmUI.seed;
    if (!S.seeds[id]) return toast(`No ${CROPS[id].name} seeds.`);
    S.seeds[id]--;
    S.stats.planted++;
    t.crop = { id, age: 0 };
  } else if (farmUI.tool === 'clear' && t.crop) {
    t.crop = null;
  } else return;
  saveGame(); renderAll();
}

function greenhouseHtml() {
  if (!S.buildings.greenhouse) return '';
  return `<div class="greenhouse"><h4>🌿 Greenhouse <small class="muted">any season · auto-watered</small></h4>
    <div class="farm-grid gh-grid" style="grid-template-columns:repeat(8,1fr)">${S.gh.map((t, i) => {
      let content = '';
      if (t.crop) { const c = CROPS[t.crop.id]; const ready = t.crop.age >= c.days; content = `<span class="obj ${ready ? 'ready' : ''}">${ready ? c.emoji : t.crop.age === 0 ? '🌱' : '🌿'}</span><span class="grow">${Math.min(t.crop.age, c.days)}/${c.days}</span>`; }
      return `<button class="tile soil wet" onclick="handleGh(${i})">${content}</button>`;
    }).join('')}</div></div>`;
}

// ---------- Morning chores (called from endDay) ----------
function homesteadMorning() {
  const msgs = [];
  S.gh.forEach(t => { if (t.crop && t.crop.age < CROPS[t.crop.id].days) t.crop.age++; });
  if (S.buildings.coop && S.chickens) {
    S.pantry.egg = (S.pantry.egg || 0) + S.chickens;
    msgs.push(`🥚 +${S.chickens} eggs.`);
    if (!S.artifacts.includes('goldenegg') && Math.random() < 0.02 * S.chickens) { grantArtifact('goldenegg'); msgs.push('✨ A chicken laid a GOLDEN CHRONO EGG!'); }
  }
  refreshRequests();
  return msgs.join(' ');
}

// ---------- Village request board ----------
const VILLAGERS = BANQUET_GUESTS;

function makeRequest() {
  const who = VILLAGERS[Math.floor(Math.random() * VILLAGERS.length)];
  const opts = [];
  Object.keys(CROPS).filter(cropUnlocked).forEach(id => opts.push({ kind: 'produce', id, qty: 2 + Math.floor(Math.random() * 3), value: CROPS[id].sell }));
  if (S.buildings.coop) opts.push({ kind: 'egg', id: 'egg', qty: 3 + Math.floor(Math.random() * 4), value: 15 });
  fishAvailable().slice(0, 4).forEach(id => opts.push({ kind: 'fish', id, qty: 1, value: FISH[id].value }));
  Object.keys(DISHES).forEach(id => opts.push({ kind: 'dish', id, qty: 1, value: 220 }));
  const o = opts[Math.floor(Math.random() * opts.length)];
  return { who, kind: o.kind, id: o.id, qty: o.qty, reward: Math.round(o.value * o.qty * 1.6 + 30), done: false };
}

function refreshRequests() {
  S.requests = S.requests.filter(r => !r.done);
  while (S.requests.length < 3) S.requests.push(makeRequest());
}

function reqLabel(r) {
  if (r.kind === 'produce') return `${CROPS[r.id].emoji} ${CROPS[r.id].name}`;
  if (r.kind === 'egg') return '🥚 Eggs';
  if (r.kind === 'fish') return `${FISH[r.id].emoji} ${FISH[r.id].name}`;
  return `${DISHES[r.id].emoji} ${DISHES[r.id].name}`;
}
function reqHave(r) {
  if (r.kind === 'produce') return totalOf('produce', r.id);
  if (r.kind === 'egg') return S.pantry.egg || 0;
  if (r.kind === 'fish') return S.fish[r.id] || 0;
  return S.dishes[r.id] || 0;
}

function fulfilRequest(i) {
  const r = S.requests[i];
  if (!r || r.done || reqHave(r) < r.qty) return;
  if (r.kind === 'produce') takeFrom('produce', r.id, r.qty);
  else if (r.kind === 'egg') S.pantry.egg -= r.qty;
  else if (r.kind === 'fish') S.fish[r.id] -= r.qty;
  else S.dishes[r.id] -= r.qty;
  r.done = true;
  S.coins += r.reward;
  S.stats.requests++;
  sfx('coin');
  toast(`📋 ${r.who[0]} ${r.who[1]} thanks you! 🪙 +${r.reward}`);
  saveGame(); renderAll();
}

function requestBoardHtml() {
  if (!S.requests.length) refreshRequests();
  return `<section class="panel">
    <h3>📋 Village Request Board</h3>
    ${S.requests.map((r, i) => `<div class="shop-row ${r.done ? 'locked' : ''}"><span>${r.who[0]} <b>${r.who[1]}</b><small>Wants ${r.qty}× ${reqLabel(r)} · you have ${reqHave(r)}</small></span>
      ${r.done ? '<span class="tag on">Done ✓</span>' : `<button class="btn small primary" ${reqHave(r) >= r.qty ? '' : 'disabled'} onclick="fulfilRequest(${i})">Deliver · 🪙${r.reward}</button>`}</div>`).join('')}
    <p class="muted small">New requests are posted every morning.</p>
  </section>`;
}

function sellFish() {
  let total = 0;
  for (const id in S.fish) { total += S.fish[id] * FISH[id].value; S.fish[id] = 0; }
  total += (S.pantry.egg || 0) * 15; S.pantry.egg = 0;
  if (mentorMet('peter') && hearts('peter') >= 2) total = Math.round(total * 1.25);
  S.coins += total;
  sfx('coin');
  toast(`Sold fish and eggs for 🪙 ${total}!`);
  saveGame(); renderAll();
}
