// ============================================================
//  Clockwork Everlasting — Endless Rift (roguelike boss tower) & Daily Challenge
// ============================================================

const RIFT_ENERGY = 5;
const RIFT_MILESTONES = { 5: 300, 10: 800, 15: 1500, 20: 3000 };

function riftEras() { return ERAS.filter(e => S.bosses[e.id]); }

function riftCardHtml() {
  return `<div class="mode-card rift-card" onclick="openRift()">
    <div class="mode-icon">🌀</div>
    <div><b>Endless Rift</b><small>A tower of ever-stronger guardians. Your HP carries over between floors, and you pick new cards as you climb. Best: floor ${S.rift.best}.</small></div>
  </div>`;
}

function openRift() {
  const run = S.rift.run;
  if (!riftEras().length) return toast('Defeat at least one era guardian to open the Endless Rift.');
  openStage(`
    <div class="stage-card intro wide" style="--era:#6a4bc4">
      <div class="intro-icon boss-float">🌀</div>
      <h2>The Endless Rift</h2>
      <p>Time folds in on itself here. Guardians you've defeated return, stronger on every floor.</p>
      <ul class="hint-box-list">
        <li>Your HP <b>carries over</b> between floors (+15% heal after each win).</li>
        <li>After each floor, choose a new card for this run <i>or</i> rest to heal 40%.</li>
        <li>Earn 🪙40 × floor for each win, plus milestone bonuses at floors 5, 10, 15 and 20.</li>
        <li>Your support companion and packed meal (first floor only) come with you.</li>
      </ul>
      <p class="reward-line">🏆 Best floor: <b>${S.rift.best}</b>${run ? ` · Current run: floor ${run.floor}, ❤️ ${run.hp ?? 'full'}` : ''}</p>
      <div class="btn-row">
        <button class="btn ghost" onclick="closeStage()">Back</button>
        ${run ? '<button class="btn danger" onclick="riftNextFloor()">Continue run ➜</button><button class="btn" onclick="riftCashOut()">End run</button>'
          : `<button class="btn danger" ${S.energy < RIFT_ENERGY ? 'disabled' : ''} onclick="startRift()">Enter the Rift (⚡${RIFT_ENERGY})</button>`}
      </div>
    </div>`, 'linear-gradient(160deg,#2b1e4f,#6a4bc4 50%,#0d0a1f)');
}

function startRift() {
  if (!spendEnergy(RIFT_ENERGY)) return;
  S.rift.run = { floor: 1, hp: null, deck: deckList(), coins: 0 };
  saveGame();
  riftNextFloor();
}

function riftNextFloor() {
  const run = S.rift.run;
  if (!run) return;
  const pool = riftEras();
  const era = pool[(run.floor * 7 + run.deck.length) % pool.length];
  run.eraId = era.id;
  saveGame();
  const opts = { rift: { floor: run.floor, hpMult: 0.5 + 0.09 * run.floor, atkMult: 0.7 + 0.05 * run.floor, hp: run.hp, deck: run.deck } };
  const boss = scaledBoss(era, opts);
  openStage(`
    <div class="stage-card intro" style="--era:#6a4bc4">
      <p class="muted">Endless Rift · Floor ${run.floor}</p>
      ${boss.portrait ? `<div class="villain-intro">${portraitSVG(boss.portrait, 'smirk', { crop: 'bust' })}</div>` : `<div class="intro-icon boss-float">${boss.emoji}</div>`}
      <h2>${boss.name}</h2>
      <div class="vs-row"><div><b>You</b><br>❤️ ${run.hp ?? stats().maxHp} · 🃏 ${run.deck.length}</div><div class="vs">VS</div><div><b>Echo</b><br>❤️ ${boss.hp} · ⚔️ ${boss.atk}</div></div>
      <div class="btn-row"><button class="btn danger" id="riftFight">⚔️ Fight floor ${run.floor}</button></div>
    </div>`, 'linear-gradient(160deg,#2b1e4f,#6a4bc4 50%,#0d0a1f)');
  document.getElementById('riftFight').onclick = () => startBattle(era.id, opts);
}

function riftBattleOver(won, retreated) {
  const run = S.rift.run;
  const h = B.hero;
  let html;
  if (won && run) {
    const coins = 40 * run.floor;
    S.coins += coins;
    run.coins += coins;
    run.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * 0.15));
    let bonus = '';
    if (run.floor > S.rift.best) {
      S.rift.best = run.floor;
      if (RIFT_MILESTONES[run.floor]) { S.coins += RIFT_MILESTONES[run.floor]; bonus = `<p class="warn">🏆 Milestone! Floor ${run.floor} reached for the first time: 🪙 +${RIFT_MILESTONES[run.floor]}</p>`; }
    }
    run.floor++;
    const pool = Object.keys(CARDS).filter(c => c !== 'promise' && c !== 'eternity');
    const chainPool = ['flurry', 'followup', 'crescendo', 'frostnote'];
    run.offer = shuffle(pool).slice(0, 2).concat(chainPool[Math.floor(Math.random() * chainPool.length)]);
    saveGame();
    const st = { atk: h.atk, def: h.def };
    html = `<h2>🌀 Floor cleared!</h2><p class="reward-line">🪙 +${coins} · ❤️ ${run.hp}/${h.maxHp}</p>${bonus}
      <p>Choose one reward for this run:</p>
      <div class="card-row center-row">${run.offer.map(id => `<button class="pick-card" onclick="riftPick('${id}')">${cardHTML(id, { st })}</button>`).join('')}</div>
      <div class="btn-row"><button class="btn" onclick="riftPick('rest')">🔥 Rest instead (+40% HP)</button><button class="btn ghost" onclick="riftCashOut()">Leave the Rift</button></div>`;
  } else {
    const reached = run ? run.floor - 1 : 0;
    html = `<h2>${retreated ? '🚪 You left the Rift' : '💫 The Rift casts you out'}</h2>
      <p>You cleared <b>${reached}</b> floor${reached === 1 ? '' : 's'} and earned 🪙${run ? run.coins : 0} this run.</p>
      <p class="reward-line">🏆 Best floor: ${S.rift.best}</p>
      <div class="btn-row"><button class="btn primary" onclick="closeStage();setMusic(backgroundMusic())">Return home</button></div>`;
    S.rift.run = null;
    saveGame();
  }
  setTimeout(() => {
    openStage(`<div class="stage-card intro wide" style="--era:#6a4bc4">${html}</div>`, 'linear-gradient(160deg,#2b1e4f,#6a4bc4 50%,#0d0a1f)');
    B = null;
    renderHeader();
  }, retreated ? 0 : 700);
}

function riftPick(choice) {
  const run = S.rift.run;
  if (!run) return;
  if (choice === 'rest') run.hp = Math.min(stats().maxHp * 1.3, (run.hp || 0) + Math.round(stats().maxHp * 0.4));
  else run.deck.push(choice);
  run.hp = Math.round(run.hp);
  run.offer = null;
  saveGame();
  riftNextFloor();
}

function riftCashOut() {
  const run = S.rift.run;
  S.rift.run = null;
  saveGame();
  openStage(`<div class="stage-card intro" style="--era:#6a4bc4"><h2>🌀 Run complete</h2><p>You climbed to floor ${run ? run.floor - 1 : 0} and earned 🪙${run ? run.coins : 0}.</p><p class="reward-line">🏆 Best floor: ${S.rift.best}</p>
    <div class="btn-row"><button class="btn primary" onclick="closeStage();setMusic(backgroundMusic())">Return home</button></div></div>`, 'linear-gradient(160deg,#2b1e4f,#6a4bc4 50%,#0d0a1f)');
}

// ---------- Daily Challenge (same puzzle for everyone on a given date) ----------
function todayStr(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function hashStr(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function dailyInfo() {
  const seed = hashStr('chrono-grove:' + todayStr());
  const rng = mulberry32(seed);
  const types = Object.keys(PUZZLE_INFO);
  const type = types[Math.floor(rng() * types.length)];
  const eras = ERAS.filter(e => !e.final);
  const era = eras[Math.floor(rng() * eras.length)];
  return { seed, type, era };
}

function dailyDone() { return S.dailyChallenge.last === todayStr(); }
function dailyReward() {
  const yesterday = todayStr(new Date(Date.now() - 86400000));
  const streak = S.dailyChallenge.last === yesterday ? S.dailyChallenge.streak + 1 : 1;
  return { streak, coins: 150 + 25 * Math.min(10, streak - 1) };
}

function dailyCardHtml() {
  const d = dailyInfo();
  return `<div class="mode-card daily-card ${dailyDone() ? 'done' : ''}" onclick="openDaily()">
    <div class="mode-icon">${PUZZLE_INFO[d.type].icon}</div>
    <div><b>📅 Daily Challenge ${dailyDone() ? '✅' : ''}</b><small>Today: ${PUZZLE_INFO[d.type].title} in ${d.era.name}. Everyone gets the same puzzle! Streak: ${S.dailyChallenge.streak} 🔥</small></div>
  </div>`;
}

function openDaily() {
  const d = dailyInfo();
  const r = dailyReward();
  openStage(`
    <div class="stage-card intro" style="--era:${d.era.color}">
      <div class="intro-icon">${PUZZLE_INFO[d.type].icon}</div>
      <h2>Daily Challenge · ${todayStr()}</h2>
      <p class="muted">${d.era.name} · ${PUZZLE_INFO[d.type].title}</p>
      <p>${PUZZLE_INFO[d.type].rules}</p>
      <p class="reward-line">${dailyDone() ? 'Already completed today. Replay just for fun!' : `Reward: 🪙 ${r.coins} (streak ${r.streak} 🔥). Free, no energy needed.`}</p>
      <div class="btn-row"><button class="btn ghost" onclick="closeStage()">Back</button><button class="btn primary" onclick="startDaily()">Begin</button></div>
    </div>`, d.era.bg);
}

function startDaily() {
  const d = dailyInfo();
  P = { era: d.era, puzzle: { id: 'daily', name: `Daily ${PUZZLE_INFO[d.type].title}`, type: d.type, daily: true }, timer: null, timeouts: [], diff: 5 };
  const orig = Math.random;
  Math.random = mulberry32(d.seed);
  try { PUZZLE_RUNNERS[d.type](); } finally { Math.random = orig; }
}

function finishDaily(success, detail) {
  stopPuzzleTimers();
  const era = P.era;
  let body;
  if (success && !dailyDone()) {
    const r = dailyReward();
    S.dailyChallenge = { last: todayStr(), streak: r.streak };
    S.coins += r.coins;
    S.stats.puzzleTypes[P.puzzle.type] = (S.stats.puzzleTypes[P.puzzle.type] || 0) + 1;
    body = `<h2>📅 Daily Challenge complete!</h2><p class="muted">${detail || ''}</p><p class="reward-line">🪙 +${r.coins} · 🔥 ${r.streak}-day streak</p>`;
  } else if (success) {
    body = `<h2>📅 Solved again!</h2><p class="muted">${detail || ''}</p><p>Come back tomorrow for a new challenge.</p>`;
  } else {
    body = `<h2>⌛ Not this time…</h2><p>${detail || ''}</p><p class="muted">You can retry today's challenge as often as you like.</p>`;
  }
  saveGame();
  P = null;
  openStage(`<div class="stage-card intro" style="--era:${era.color}">${body}
    <div class="btn-row"><button class="btn ghost" onclick="closeStage()">Done</button><button class="btn primary" onclick="openDaily()">Play again</button></div></div>`, era.bg);
  renderHeader();
}
