// ============================================================
//  Clockwork Everlasting — puzzles (hidden object, memory, slider, rune lock)
// ============================================================

const PUZZLE_ENERGY = 3;
const PUZZLE_RUNNERS = { hidden: (...a) => runHidden(...a), memory: (...a) => runMemory(...a), slider: (...a) => runSlider(...a), sequence: (...a) => runSequence(...a), chess: (...a) => runChess(...a), recall: (...a) => runRecall(...a), banquet: (...a) => runBanquet(...a) };
let P = null; // active puzzle session

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function rand(min, max) { return min + Math.random() * (max - min); }

function stopPuzzleTimers() {
  if (!P) return;
  if (P.timer) clearInterval(P.timer);
  (P.timeouts || []).forEach(clearTimeout);
  P.timer = null;
  P.timeouts = [];
}

function puzzleTimeout(fn, ms) {
  const id = setTimeout(fn, ms);
  if (P) P.timeouts.push(id);
  return id;
}

// ---------- entry point ----------
function openPuzzle(eraId, puzzleId) {
  const era = ERA_BY_ID[eraId];
  const puzzle = era.puzzles.find(p => p.id === puzzleId);
  const info = PUZZLE_INFO[puzzle.type];
  const art = ARTIFACTS[puzzle.artifact];
  const cleared = S.puzzles[puzzle.id];
  openStage(`
    <div class="stage-card intro" style="--era:${era.color}">
      <div class="intro-icon">${info.icon}</div>
      <h2>${puzzle.name}</h2>
      <p class="muted">${era.name} · ${info.title}</p>
      <p>${info.rules}</p>
      <div class="reward-line">
        ${cleared
          ? `<span>Replay reward: 🪙 ${replayCoins(era)} · ✨ ${replayXp(era)} XP</span>`
          : `<span>Reward: <b>${art.emoji} ${art.name}</b> + Cedric's card <b>${CARDS[PUZZLE_CARDS[puzzle.id]].art} ${CARDS[PUZZLE_CARDS[puzzle.id]].name}</b> · 🪙 ${firstCoins(era)} · ✨ ${firstXp(era)} XP</span>`}
      </div>
      <p class="muted">Costs ⚡ ${PUZZLE_ENERGY} energy (you have ${S.energy}).</p>
      <div class="btn-row">
        <button class="btn ghost" onclick="closeStage()">Back</button>
        <button class="btn primary" id="beginPuzzle" ${S.energy < PUZZLE_ENERGY ? 'disabled' : ''}>Travel &amp; Begin</button>
      </div>
      ${S.energy < PUZZLE_ENERGY ? '<p class="warn">Not enough energy — end the day on your homestead to rest.</p>' : ''}
    </div>`, era.bg);
  const btn = document.getElementById('beginPuzzle');
  if (btn) btn.onclick = () => {
    if (!spendEnergy(PUZZLE_ENERGY)) return;
    saveGame();
    renderHeader();
    P = { era, puzzle, timer: null, timeouts: [], diff: eraIndex(era.id) };
    PUZZLE_RUNNERS[puzzle.type]();
  };
}

const firstCoins = era => 25 + 15 * eraIndex(era.id);
const firstXp = era => 25 + 10 * eraIndex(era.id);
const replayCoins = era => 12 + 8 * eraIndex(era.id);
const replayXp = era => 12 + 6 * eraIndex(era.id);

function finishPuzzle(success, detail) {
  stopPuzzleTimers();
  sfx(success ? 'win' : 'lose');
  if (P.puzzle.daily) return finishDaily(success, detail);
  const { era, puzzle } = P;
  let body;
  if (success) {
    S.stats.puzzleTypes[puzzle.type] = (S.stats.puzzleTypes[puzzle.type] || 0) + 1;
    const first = !S.puzzles[puzzle.id];
    S.puzzles[puzzle.id] = (S.puzzles[puzzle.id] || 0) + 1;
    const coins = first ? firstCoins(era) : replayCoins(era);
    const xp = first ? firstXp(era) : replayXp(era);
    S.coins += coins;
    const levels = grantXp(xp);
    let artLine = '';
    if (first) {
      grantArtifact(puzzle.artifact);
      const a = ARTIFACTS[puzzle.artifact];
      artLine = `<div class="artifact-reveal"><div class="big-emoji">${a.emoji}</div><h3>${a.name}</h3><p>${a.desc}</p><p class="bonus">${bonusText(a.bonus)}</p><p class="muted">Display it on your homestead to activate its power!</p></div>`;
      const cardId = PUZZLE_CARDS[puzzle.id];
      if (cardId) {
        grantCard(cardId);
        artLine += `<div class="card-gift">${portraitSVG('cedric', 'happy', { crop: 'head', cls: 'mini' })}<div><p><b>Cedric:</b> "What a find! I've forged you a new battle card from it."</p>${cardHTML(cardId)}</div></div>`;
      }
    }
    const bossNow = first && bossUnlocked(era) && !era.final;
    body = `
      <h2>✨ Puzzle Complete!</h2>
      ${detail ? `<p class="muted">${detail}</p>` : ''}
      ${artLine}
      <p class="reward-line">🪙 +${coins} &nbsp; ✨ +${xp} XP ${levels ? `&nbsp; <b>⬆️ Level ${S.hero.level}!</b>` : ''}</p>
      ${bossNow && !S.bosses[era.id] ? `<p class="warn">⚔️ ${era.boss.name} has awakened in ${era.name}!</p>` : ''}`;
  } else {
    body = `<h2>⌛ Time Slipped Away</h2><p>${detail || 'The rift closed before you could finish.'}</p><p class="muted">Try again whenever you like.</p>`;
  }
  saveGame();
  openStage(`
    <div class="stage-card intro" style="--era:${era.color}">
      ${body}
      <div class="btn-row">
        <button class="btn ghost" onclick="closeStage(); showTab('portal')">Return to Portal</button>
        <button class="btn primary" onclick="openPuzzle('${era.id}','${puzzle.id}')">Play Again</button>
      </div>
    </div>`, era.bg);
  P = null;
  renderAll();
}

function abandonPuzzle() {
  if (!P) return;
  finishPuzzle(false, 'You stepped back through the rift.');
}

function puzzleShell(title, extraHud, inner) {
  return `
    <div class="puzzle" style="--era:${P.era.color}">
      <div class="puzzle-hud">
        <div><b>${title}</b><span class="muted"> · ${P.era.name}</span></div>
        <div class="hud-right">${extraHud}<button class="btn small ghost" onclick="abandonPuzzle()">Give up</button></div>
      </div>
      ${inner}
    </div>`;
}

function startCountdown(seconds, onTick, onEnd) {
  P.timeLeft = seconds;
  onTick(P.timeLeft);
  P.timer = setInterval(() => {
    P.timeLeft -= 1;
    if (P.timeLeft <= 0) { P.timeLeft = 0; onTick(0); clearInterval(P.timer); P.timer = null; onEnd(); return; }
    onTick(P.timeLeft);
  }, 1000);
}

function fmtTime(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

// ============================================================
//  1. Hidden object
// ============================================================
function runHidden() {
  const d = P.diff;
  const nTargets = Math.min(4 + d, 8);
  const nDecoys = 26 + d * 5;
  const time = 80 - d * 5;
  const targets = shuffle(P.era.pool).slice(0, nTargets);
  const decoyPool = P.era.pool.filter(e => !targets.includes(e)).concat(DECOYS);
  const items = targets.map(e => ({ e, target: true }));
  for (let i = 0; i < nDecoys; i++) items.push({ e: decoyPool[Math.floor(Math.random() * decoyPool.length)], target: false });

  // Scatter with light overlap avoidance (percent coordinates)
  const placed = [];
  shuffle(items).forEach(it => {
    let best = null, bestDist = -1;
    for (let tries = 0; tries < 40; tries++) {
      const x = rand(4, 92), y = rand(6, 88);
      const dist = placed.reduce((m, p) => Math.min(m, Math.hypot((p.x - x) * 1.6, p.y - y)), 999);
      if (dist > bestDist) { best = { x, y }; bestDist = dist; }
      if (dist > 11) break;
    }
    placed.push(Object.assign(it, best, { size: rand(1.5, 2.6), rot: rand(-30, 30) }));
  });

  P.found = new Set();
  P.hintUsed = false;
  openStage(puzzleShell(P.puzzle.name,
    `<span class="timer" id="pTimer"></span><button class="btn small" id="hintBtn">💡 Hint (−10s)</button>`,
    `<div class="find-list" id="findList">${targets.map((e, i) => `<span class="find-item" data-i="${i}">${e}</span>`).join('')}</div>
     <div class="scene" id="scene" style="background:${P.era.bg}">
       ${placed.map((it, k) => `<button class="scene-obj" data-k="${k}" style="left:${it.x}%;top:${it.y}%;font-size:${it.size}rem;transform:translate(-50%,-50%) rotate(${it.rot}deg)">${it.e}</button>`).join('')}
     </div>`), P.era.bg);

  const timerEl = document.getElementById('pTimer');
  startCountdown(time, t => { timerEl.textContent = '⏱ ' + fmtTime(t); timerEl.classList.toggle('low', t <= 10); },
    () => finishPuzzle(false, `You found ${P.found.size} of ${targets.length} objects.`));

  document.querySelectorAll('.scene-obj').forEach(btn => {
    btn.onclick = () => {
      if (!P) return;
      const it = placed[+btn.dataset.k];
      const ti = targets.indexOf(it.e);
      if (it.target && !P.found.has(ti)) {
        P.found.add(ti);
        sfx('pop');
        btn.classList.add('found');
        btn.disabled = true;
        document.querySelector(`.find-item[data-i="${ti}"]`).classList.add('done');
        if (P.found.size === targets.length) {
          puzzleTimeout(() => finishPuzzle(true, `Found everything with ${P.timeLeft}s to spare.`), 500);
        }
      } else if (!it.target) {
        P.timeLeft = Math.max(1, P.timeLeft - 3);
        timerEl.textContent = '⏱ ' + fmtTime(P.timeLeft);
        btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
        sfx('wrong');
      }
    };
  });

  document.getElementById('hintBtn').onclick = (ev) => {
    if (!P || P.hintUsed) return;
    const remaining = targets.map((e, i) => i).filter(i => !P.found.has(i));
    if (!remaining.length) return;
    P.hintUsed = true;
    ev.target.disabled = true;
    P.timeLeft = Math.max(1, P.timeLeft - 10);
    const k = placed.findIndex(it => it.target && it.e === targets[remaining[0]]);
    document.querySelector(`.scene-obj[data-k="${k}"]`).classList.add('hint');
  };
}

// ============================================================
//  2. Memory pairs
// ============================================================
function runMemory() {
  const d = P.diff;
  const pairs = Math.min(6 + d, 10);
  const symbols = shuffle(P.era.pool).slice(0, pairs);
  const deck = shuffle(symbols.concat(symbols));
  const time = 55 + pairs * 7 - d * 3;
  P.flipped = [];
  P.matched = 0;
  P.lock = false;
  P.moves = 0;
  const cols = deck.length <= 12 ? 4 : deck.length <= 16 ? 4 : 5;
  openStage(puzzleShell(P.puzzle.name,
    `<span class="muted" id="pMoves">Moves: 0</span><span class="timer" id="pTimer"></span>`,
    `<div class="memory-grid" style="grid-template-columns:repeat(${cols},1fr)">
      ${deck.map((e, i) => `<button class="mem-card" data-i="${i}"><span class="back">${P.era.icon}</span><span class="front">${e}</span></button>`).join('')}
    </div>`), P.era.bg);

  const timerEl = document.getElementById('pTimer');
  startCountdown(time, t => { timerEl.textContent = '⏱ ' + fmtTime(t); timerEl.classList.toggle('low', t <= 10); },
    () => finishPuzzle(false, `You matched ${P.matched} of ${pairs} pairs.`));

  document.querySelectorAll('.mem-card').forEach(card => {
    card.onclick = () => {
      if (!P || P.lock || card.classList.contains('up')) return;
      card.classList.add('up');
      P.flipped.push(card);
      if (P.flipped.length < 2) return;
      P.moves++;
      document.getElementById('pMoves').textContent = 'Moves: ' + P.moves;
      const [a, b] = P.flipped;
      if (deck[+a.dataset.i] === deck[+b.dataset.i]) {
        a.classList.add('matched'); b.classList.add('matched');
        sfx('pop');
        P.flipped = [];
        P.matched++;
        if (P.matched === pairs) puzzleTimeout(() => finishPuzzle(true, `All pairs matched in ${P.moves} moves.`), 500);
      } else {
        P.lock = true;
        puzzleTimeout(() => { a.classList.remove('up'); b.classList.remove('up'); P.flipped = []; P.lock = false; }, 750);
      }
    };
  });
}

// ============================================================
//  3. Sliding tile — reassemble the artifact picture
// ============================================================
function runSlider() {
  const d = P.diff;
  const N = 3;
  const art = ARTIFACTS[P.puzzle.artifact];
  // board[pos] = tile id (0..7), 8 = empty
  let board = [...Array(N * N).keys()];
  let empty = N * N - 1;
  const neighbors = p => {
    const r = Math.floor(p / N), c = p % N, out = [];
    if (r > 0) out.push(p - N); if (r < N - 1) out.push(p + N);
    if (c > 0) out.push(p - 1); if (c < N - 1) out.push(p + 1);
    return out;
  };
  // Shuffle with legal moves so the puzzle is always solvable
  let prev = -1;
  const steps = 40 + d * 25;
  for (let i = 0; i < steps; i++) {
    const opts = neighbors(empty).filter(n => n !== prev);
    const pick = opts[Math.floor(Math.random() * opts.length)];
    [board[empty], board[pick]] = [board[pick], board[empty]];
    prev = empty; empty = pick;
  }
  if (board.every((t, i) => t === i)) { // extremely unlikely, but never start solved
    const pick = neighbors(empty)[0];
    [board[empty], board[pick]] = [board[pick], board[empty]];
    empty = pick;
  }
  P.moves = 0;
  const tile = Math.floor(Math.min(110, (Math.min(window.innerWidth, 520) - 64) / N));

  openStage(puzzleShell(P.puzzle.name,
    `<span class="muted" id="pMoves">Moves: 0</span><button class="btn small" id="peekBtn">👁 Peek</button>`,
    `<div class="slider-wrap">
       <div class="slider" id="slider" style="width:${tile * N}px;height:${tile * N}px"></div>
       <p class="muted">Reassemble the <b>${art.name}</b>.</p>
     </div>`), P.era.bg);

  const el = document.getElementById('slider');
  const draw = () => {
    el.innerHTML = board.map((t, pos) => {
      if (t === N * N - 1) return '';
      const r = Math.floor(pos / N), c = pos % N, tr = Math.floor(t / N), tc = t % N;
      return `<button class="slide-tile" data-pos="${pos}" style="width:${tile - 4}px;height:${tile - 4}px;left:${c * tile + 2}px;top:${r * tile + 2}px">
        <span class="slice" style="width:${tile * N}px;height:${tile * N}px;left:${-tc * tile - 2}px;top:${-tr * tile - 2}px;font-size:${tile * N * 0.78}px">${art.emoji}</span>
        <span class="tile-num">${t + 1}</span></button>`;
    }).join('');
    el.querySelectorAll('.slide-tile').forEach(b => {
      b.onclick = () => {
        if (!P) return;
        const pos = +b.dataset.pos;
        if (!neighbors(empty).includes(pos)) return;
        [board[empty], board[pos]] = [board[pos], board[empty]];
        empty = pos;
        P.moves++;
        document.getElementById('pMoves').textContent = 'Moves: ' + P.moves;
        draw();
        if (board.every((t, i) => t === i)) {
          el.classList.add('solved');
          el.innerHTML += `<div class="slider-done" style="font-size:${tile * N * 0.78}px">${art.emoji}</div>`;
          puzzleTimeout(() => finishPuzzle(true, `Restored in ${P.moves} moves.`), 900);
        }
      };
    });
  };
  draw();

  const peek = document.getElementById('peekBtn');
  const showPeek = on => el.classList.toggle('peek', on);
  peek.onmousedown = peek.ontouchstart = () => showPeek(true);
  peek.onmouseup = peek.onmouseleave = peek.ontouchend = () => showPeek(false);
  el.dataset.emoji = art.emoji;
  el.style.setProperty('--peek-size', `${tile * N * 0.78}px`);
}

// ============================================================
//  4. Rune lock — repeat the sequence
// ============================================================
function runSequence() {
  const d = P.diff;
  const runes = shuffle(P.era.pool).slice(0, 4);
  const rounds = 4 + Math.floor(d / 2);
  const startLen = 3;
  const speed = Math.max(380, 650 - d * 60);
  const colors = ['#e85d5d', '#4fa3e8', '#e8c84f', '#5dc98a'];
  P.seq = [];
  for (let i = 0; i < startLen + rounds - 1; i++) P.seq.push(Math.floor(Math.random() * 4));
  P.round = 0;
  P.lives = 3;
  P.input = [];
  P.accepting = false;

  openStage(puzzleShell(P.puzzle.name,
    `<span id="pLives">❤️❤️❤️</span><span class="muted" id="pRound"></span>`,
    `<div class="rune-wrap">
       <p class="rune-status" id="runeStatus">Watch closely...</p>
       <div class="rune-grid">
         ${runes.map((r, i) => `<button class="rune" data-i="${i}" style="--c:${colors[i]}">${r}</button>`).join('')}
       </div>
     </div>`), P.era.bg);

  const status = document.getElementById('runeStatus');
  const pads = [...document.querySelectorAll('.rune')];
  const flash = (i, ms) => { if (ms > 300) sfx('rune' + i); pads[i].classList.add('lit'); puzzleTimeout(() => pads[i].classList.remove('lit'), ms); };

  const playRound = () => {
    P.accepting = false;
    P.input = [];
    const len = startLen + P.round;
    document.getElementById('pRound').textContent = `Round ${P.round + 1}/${rounds}`;
    status.textContent = 'Watch closely...';
    pads.forEach(p => p.disabled = true);
    for (let k = 0; k < len; k++) puzzleTimeout(() => flash(P.seq[k], speed * 0.7), 600 + k * speed);
    puzzleTimeout(() => {
      P.accepting = true;
      pads.forEach(p => p.disabled = false);
      status.textContent = 'Your turn — repeat the runes!';
    }, 600 + len * speed);
  };

  pads.forEach(pad => {
    pad.onclick = () => {
      if (!P || !P.accepting) return;
      const i = +pad.dataset.i;
      flash(i, 220);
      sfx('rune' + i);
      P.input.push(i);
      const k = P.input.length - 1;
      if (P.seq[k] !== i) {
        P.lives--;
        document.getElementById('pLives').textContent = '❤️'.repeat(P.lives) + '🖤'.repeat(3 - P.lives);
        P.accepting = false;
        if (P.lives <= 0) { puzzleTimeout(() => finishPuzzle(false, `The lock sealed shut on round ${P.round + 1}.`), 500); return; }
        status.textContent = '✖ Wrong rune! Watch again...';
        puzzleTimeout(playRound, 1100);
        return;
      }
      if (P.input.length === startLen + P.round) {
        P.accepting = false;
        P.round++;
        if (P.round >= rounds) { status.textContent = '✔ The lock clicks open!'; puzzleTimeout(() => finishPuzzle(true, `Unlocked with ${P.lives} chance${P.lives === 1 ? '' : 's'} left.`), 700); return; }
        status.textContent = '✔ Correct!';
        puzzleTimeout(playRound, 900);
      }
    };
  });
  playRound();
}

// ============================================================
//  5. Chess — checkmate in one
// ============================================================
const CHESS_GLYPH = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };

function parseFen(fen) {
  const board = {};
  fen.split('/').forEach((row, ri) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) { f += +ch; continue; }
      board['abcdefgh'[f] + (8 - ri)] = ch;
      f++;
    }
  });
  return board;
}

function runChess() {
  const d = P.diff;
  const rounds = d >= 7 ? 3 : 2;
  const start = Math.max(0, Math.min(CHESS_PUZZLES.length - 14, (d - 5) * 7));
  P.chess = { list: shuffle(CHESS_PUZZLES.slice(start, start + 14)).slice(0, rounds), i: 0, mistakes: 0, sel: null, hint: false, locked: false };
  drawChess();
}

function drawChess(flash) {
  const C = P.chess;
  const pz = C.list[C.i];
  const board = C.board || (C.board = parseFen(pz.fen));
  const dests = C.sel ? pz.legal.filter(m => m.startsWith(C.sel)).map(m => m.slice(2, 4)) : [];
  let cells = '';
  for (let r = 8; r >= 1; r--) {
    for (let f = 0; f < 8; f++) {
      const sq = 'abcdefgh'[f] + r;
      const pc = board[sq];
      const light = (f + r) % 2 === 1;
      const cls = ['sq', light ? 'light' : 'dark'];
      if (C.sel === sq) cls.push('sel');
      if (dests.includes(sq)) cls.push(pc ? 'capture' : 'dest');
      if (C.hint && pz.sol.startsWith(sq)) cls.push('hinted');
      if (C.last && C.last.includes(sq)) cls.push('last');
      cells += `<button class="${cls.join(' ')}" data-sq="${sq}">${pc ? `<span class="pc ${pc === pc.toUpperCase() ? 'w' : 'b'}">${CHESS_GLYPH[pc.toLowerCase()]}&#xFE0E;</span>` : ''}${f === 0 ? `<i class="rk">${r}</i>` : ''}${r === 1 ? `<i class="fl">${'abcdefgh'[f]}</i>` : ''}</button>`;
    }
  }
  openStage(puzzleShell(P.puzzle.name,
    `<span class="muted">Puzzle ${C.i + 1}/${C.list.length}</span><span>${'❤️'.repeat(3 - C.mistakes)}${'🖤'.repeat(C.mistakes)}</span><button class="btn small" id="chessHint" ${C.hint ? 'disabled' : ''}>💡 Hint</button>`,
    `<div class="chess-wrap">
       <p class="rune-status">${flash || 'White to move: find the <b>checkmate in one</b>!'}</p>
       <div class="chessboard ${C.won ? 'mated' : ''}">${cells}</div>
       <p class="muted small">Tap a white piece, then tap where it should go. Highlighted squares are legal moves.</p>
     </div>`), P.era.bg);
  document.querySelectorAll('.sq').forEach(el => el.onclick = () => chessClick(el.dataset.sq));
  document.getElementById('chessHint').onclick = () => { if (!C.hint) { C.hint = true; drawChess('💡 The glowing piece delivers the checkmate.'); } };
}

function chessClick(sq) {
  const C = P && P.chess;
  if (!C || C.locked) return;
  const pz = C.list[C.i];
  const pc = C.board[sq];
  if (pc && pc === pc.toUpperCase()) { C.sel = C.sel === sq ? null : sq; sfx('click'); return drawChess(); }
  if (!C.sel) return;
  const move = pz.legal.find(m => m.startsWith(C.sel + sq));
  if (!move) return;
  const from = C.sel;
  C.board[sq] = C.board[from];
  if (move.length === 5) C.board[sq] = 'Q';
  delete C.board[from];
  C.last = [from, sq];
  C.sel = null;
  if (move === pz.sol) {
    C.locked = true;
    C.won = true;
    sfx('success');
    drawChess('♚ <b>Checkmate!</b> Brilliant move!');
    puzzleTimeout(() => {
      C.i++; C.won = false; C.board = null; C.last = null; C.hint = false; C.locked = false;
      if (C.i >= C.list.length) finishPuzzle(true, `Solved ${C.list.length} checkmates with ${3 - C.mistakes} lives to spare.`);
      else drawChess();
    }, 1100);
  } else {
    C.mistakes++;
    C.locked = true;
    sfx('wrong');
    drawChess('✖ Not checkmate. The black king escapes!');
    puzzleTimeout(() => {
      if (C.mistakes >= 3) return finishPuzzle(false, 'The black king slipped away one time too many.');
      C.board = null; C.last = null; C.locked = false;
      drawChess('Try again. Look for a move the king can\'t escape.');
    }, 1100);
  }
}

// ============================================================
//  6. Memory Palace — memorise where things are, then recall them
// ============================================================
function runRecall() {
  const d = P.diff;
  const n = Math.max(5, Math.min(10, d + 1));
  const cells = 16;
  const items = shuffle(P.era.pool).slice(0, n);
  const pos = shuffle([...Array(cells).keys()]).slice(0, n);
  P.recall = { layout: {}, order: shuffle(items).slice(0, Math.min(6, n)), q: 0, lives: 3, phase: 'study', revealed: {} };
  items.forEach((e, i) => { P.recall.layout[pos[i]] = e; });
  const study = Math.max(5, n);
  drawRecall();
  let t = study;
  const bar = () => { const el = document.getElementById('studyBar'); if (el) el.style.width = `${(t / study) * 100}%`; const tt = document.getElementById('studyT'); if (tt) tt.textContent = t; };
  bar();
  P.timer = setInterval(() => {
    t--; bar();
    if (t <= 0) { clearInterval(P.timer); P.timer = null; P.recall.phase = 'ask'; drawRecall(); }
  }, 1000);
}

function drawRecall(msg) {
  const R = P.recall;
  const target = R.order[R.q];
  const grid = [...Array(16).keys()].map(i => {
    const e = R.layout[i];
    const show = R.phase === 'study' || R.revealed[i];
    return `<button class="recall-cell ${show && e ? 'shown' : ''} ${R.revealed[i] || ''}" data-i="${i}">${show && e ? e : R.phase === 'study' ? '' : '<span class="rc-back">?</span>'}</button>`;
  }).join('');
  openStage(puzzleShell(P.puzzle.name,
    `<span>${'❤️'.repeat(R.lives)}${'🖤'.repeat(3 - R.lives)}</span><span class="muted">${R.phase === 'study' ? 'Memorise!' : `Question ${R.q + 1}/${R.order.length}`}</span>`,
    `<div class="recall-wrap">
      ${R.phase === 'study'
        ? `<p class="rune-status">Memorise where everything is… <b id="studyT"></b></p><div class="study-bar"><div id="studyBar"></div></div>`
        : `<p class="rune-status">${msg || 'Where was this?'}</p><div class="recall-target">${target || '✨'}</div>`}
      <div class="recall-grid">${grid}</div>
    </div>`), P.era.bg);
  if (R.phase === 'ask') document.querySelectorAll('.recall-cell').forEach(el => el.onclick = () => recallClick(+el.dataset.i));
}

function recallClick(i) {
  const R = P && P.recall;
  if (!R || R.phase !== 'ask' || R.busy) return;
  const target = R.order[R.q];
  if (R.layout[i] === target) {
    R.revealed[i] = 'good';
    R.q++;
    sfx('success');
    if (R.q >= R.order.length) { R.busy = true; drawRecall('✔ Perfect recall!'); return puzzleTimeout(() => finishPuzzle(true, `Remembered ${R.order.length} locations with ${R.lives} lives left.`), 800); }
    drawRecall('✔ Correct! And where was this?');
  } else {
    R.lives--;
    sfx('wrong');
    R.revealed[i] = 'bad';
    R.busy = true;
    drawRecall(R.layout[i] ? `✖ That was the ${R.layout[i]}…` : '✖ That spot was empty…');
    puzzleTimeout(() => {
      delete R.revealed[i];
      R.busy = false;
      if (R.lives <= 0) return finishPuzzle(false, 'The memories faded away…');
      drawRecall('Try again. Where was this?');
    }, 900);
  }
}

// ============================================================
//  7. Banquet Table — seat the guests so every clue is true
// ============================================================
const BANQUET_GUESTS = [
  ['🤴', 'Prince Aldric'], ['👸', 'Princess Mira'], ['🧙', 'Sage Orin'], ['💂', 'Captain Bram'], ['🧛', 'Count Varne'],
  ['👳', 'Merchant Tariq'], ['🥷', 'Silent Kiyo'], ['🧝', 'Lady Elowen'], ['🧚', 'Fae Lumi'], ['🧞', 'Djinn Zafir'],
];

function permutations(n) {
  const out = [];
  const rec = (arr, rest) => { if (!rest.length) return out.push(arr); rest.forEach((x, i) => rec(arr.concat(x), rest.filter((_, j) => j !== i))); };
  rec([], [...Array(n).keys()]);
  return out;
}

// A seating is an array: seat index -> guest index
function clueTrue(c, seat) {
  const at = g => seat.indexOf(g);
  const n = seat.length;
  switch (c.t) {
    case 'pos': return at(c.a) === c.k;
    case 'notpos': return at(c.a) !== c.k;
    case 'end': return at(c.a) === 0 || at(c.a) === n - 1;
    case 'adj': return Math.abs(at(c.a) - at(c.b)) === 1;
    case 'nadj': return Math.abs(at(c.a) - at(c.b)) !== 1;
    case 'left': return at(c.a) < at(c.b);
  }
  return false;
}

function clueText(c, guests) {
  const g = i => `<b>${guests[i][0]} ${guests[i][1]}</b>`;
  switch (c.t) {
    case 'pos': return `${g(c.a)} sits in seat ${c.k + 1}.`;
    case 'notpos': return `${g(c.a)} refuses seat ${c.k + 1}.`;
    case 'end': return `${g(c.a)} insists on sitting at one end of the table.`;
    case 'adj': return `${g(c.a)} must sit next to ${g(c.b)}.`;
    case 'nadj': return `${g(c.a)} and ${g(c.b)} must NOT sit next to each other.`;
    case 'left': return `${g(c.a)} sits somewhere to the left of ${g(c.b)}.`;
  }
}

function makeBanquet(n) {
  const perms = permutations(n);
  const sol = shuffle([...Array(n).keys()]);
  const at = g => sol.indexOf(g);
  let clues = [];
  let cands = perms;
  for (let guard = 0; guard < 400 && cands.length > 1; guard++) {
    const a = Math.floor(Math.random() * n);
    let b = Math.floor(Math.random() * n); if (b === a) b = (a + 1) % n;
    const r = Math.random();
    let c;
    if (r < 0.08) c = { t: 'pos', a, k: at(a) };
    else if (r < 0.2) c = { t: 'notpos', a, k: Math.floor(Math.random() * n) };
    else if (r < 0.3) c = { t: 'end', a };
    else if (r < 0.52) c = { t: 'adj', a, b };
    else if (r < 0.72) c = { t: 'nadj', a, b };
    else c = { t: 'left', a, b };
    if (!clueTrue(c, sol)) continue;
    const next = cands.filter(p => clueTrue(c, p));
    if (next.length < cands.length) { clues.push(c); cands = next; }
  }
  // Remove clues that aren't needed for a unique answer
  for (let i = clues.length - 1; i >= 0; i--) {
    const without = clues.filter((_, j) => j !== i);
    if (perms.filter(p => without.every(c => clueTrue(c, p))).length === 1) clues = without;
  }
  return { sol, clues };
}

function runBanquet() {
  const n = P.diff >= 7 ? 6 : 5;
  const guests = shuffle(BANQUET_GUESTS).slice(0, n);
  const { clues } = makeBanquet(n);
  P.banquet = { n, guests, clues: shuffle(clues), seats: Array(n).fill(null), sel: null, mistakes: 0, bad: [] };
  drawBanquet();
}

function drawBanquet(msg) {
  const Q = P.banquet;
  const tray = Q.guests.map((g, i) => i).filter(i => !Q.seats.includes(i));
  const guestBtn = (i, where) => `<button class="guest ${Q.sel === i ? 'sel' : ''}" data-g="${i}" data-where="${where}"><span class="g-face">${Q.guests[i][0]}</span><small>${Q.guests[i][1]}</small></button>`;
  openStage(puzzleShell(P.puzzle.name,
    `<span>${'❤️'.repeat(3 - Q.mistakes)}${'🖤'.repeat(Q.mistakes)}</span>`,
    `<div class="banquet-wrap">
      <p class="rune-status">${msg || 'Seat every guest so that all the clues are true.'}</p>
      <div class="banquet-table">
        <div class="seats">${Q.seats.map((g, s) => `<div class="seat" data-s="${s}">${g === null ? `<span class="seat-empty">Seat ${s + 1}</span>` : guestBtn(g, 'seat')}<span class="seat-num">${s + 1}</span></div>`).join('')}</div>
        <div class="table-top">🍗 🍷 🥖 🕯️ 🍇 🧀 🕯️ 🍰</div>
      </div>
      <div class="guest-tray">${tray.map(i => guestBtn(i, 'tray')).join('') || '<span class="muted">Everyone is seated!</span>'}</div>
      <ol class="clue-list">${Q.clues.map((c, i) => `<li class="${Q.bad.includes(i) ? 'bad' : ''}">${clueText(c, Q.guests)}</li>`).join('')}</ol>
      <div class="btn-row"><button class="btn ghost small" id="bqClear">Clear table</button><button class="btn primary" id="bqCheck" ${Q.seats.includes(null) ? 'disabled' : ''}>🔔 Ring the dinner bell</button></div>
    </div>`), P.era.bg);
  document.querySelectorAll('.guest').forEach(el => el.onclick = ev => { ev.stopPropagation(); const g = +el.dataset.g; Q.sel = Q.sel === g ? null : g; sfx('click'); drawBanquet(msg); });
  document.querySelectorAll('.seat').forEach(el => el.onclick = () => {
    if (Q.sel === null) return;
    const s = +el.dataset.s;
    const from = Q.seats.indexOf(Q.sel);
    const occupant = Q.seats[s];
    if (from >= 0) Q.seats[from] = occupant; // swap seats
    Q.seats[s] = Q.sel;
    Q.sel = null; Q.bad = [];
    sfx('click');
    drawBanquet();
  });
  document.getElementById('bqClear').onclick = () => { Q.seats = Array(Q.n).fill(null); Q.bad = []; drawBanquet(); };
  document.getElementById('bqCheck').onclick = () => {
    Q.bad = Q.clues.map((c, i) => (clueTrue(c, Q.seats) ? -1 : i)).filter(i => i >= 0);
    if (!Q.bad.length) { sfx('success'); drawBanquet('🎉 A perfect seating! The feast begins!'); return puzzleTimeout(() => finishPuzzle(true, `Every guest is delighted${Q.mistakes ? '' : ', first try!'}`), 900); }
    Q.mistakes++;
    sfx('wrong');
    if (Q.mistakes >= 3) return puzzleTimeout(() => finishPuzzle(false, 'The guests stormed off in a huff…'), 700);
    drawBanquet(`✖ ${Q.bad.length} clue${Q.bad.length > 1 ? 's are' : ' is'} not satisfied (marked in red).`);
  };
}
