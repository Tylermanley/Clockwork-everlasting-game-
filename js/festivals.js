// ============================================================
//  Clockwork Everlasting — seasonal festivals (one per season, on day 7)
// ============================================================

const FESTIVAL_DAY = 7;
const FESTIVALS = {
  spring: { name: 'Blossom & Book Fair', host: 'anna', icon: '🌸', artifact: 'bouquet',
    bg: 'linear-gradient(160deg,#ffe9f2 0%,#f7b6cf 50%,#7a5a8c 100%)',
    intro: 'Pink petals drift over the village square. Anna has filled the fair with book stalls, seed sellers and a fortune teller.',
    hostLine: ['happy', 'Welcome to the Blossom & Book Fair! I organised the book stall myself. Pick any stall you like!'] },
  summer: { name: 'Gilded Gull Regatta', host: 'cedric', icon: '⛵', artifact: 'medal',
    bg: 'linear-gradient(160deg,#e6f6ff 0%,#7cc4ec 50%,#1f4f7a 100%)',
    intro: 'Boats bob in the bay, decked with flags. Cedric is hosting the annual rowing race, and some familiar faces have entered…',
    hostLine: ['smirk', 'Grab an oar, partner! Row when the marker hits the green. Beat everyone and the gold medal is yours!'] },
  autumn: { name: 'Bluewater Harvest Gala', host: 'alice', icon: '🏵️', artifact: 'rosette',
    bg: 'linear-gradient(160deg,#fff3dc 0%,#f2b25c 50%,#2b4a86 100%)',
    intro: 'Lanterns glow across Lady Alice\'s estate. Farmers from every era have brought their finest crops to be judged.',
    hostLine: ['smile', 'Welcome to my Harvest Gala, darling. Enter your finest crop. The judges are terribly strict, and terribly fair.'] },
  winter: { name: 'Royal Treasury Auction', host: 'quinn', icon: '🔨', artifact: 'candelabra',
    bg: 'linear-gradient(160deg,#f3f7ff 0%,#b9c8e6 50%,#1f3a2b 100%)',
    intro: 'Snow falls outside the Royal Treasury, where Minister Quinn auctions rare treasures. Peter Winters is bidding too…',
    hostLine: ['happy', 'Ladies and gentlemen, the Winter Auction is open! Bid wisely. Fortune favours the bold, and the solvent.'] },
};

function festivalKey() { return `${year()}-${season().id}`; }
function isFestivalDay() { return dayOfSeason() === FESTIVAL_DAY; }
function festivalToday() { return isFestivalDay() && !S.festivals[festivalKey()] ? FESTIVALS[season().id] : null; }

function daysToFestival() {
  const d = dayOfSeason();
  return d <= FESTIVAL_DAY ? FESTIVAL_DAY - d : SEASON_LEN - d + FESTIVAL_DAY;
}

function festivalBanner() {
  const f = festivalToday();
  if (!f) return '';
  return `<div class="festival-banner" style="background:${f.bg}">${f.icon} <b>Today is the ${f.name}!</b> <button class="btn small primary" onclick="openFestival()">🎉 Join the festival</button></div>`;
}

function openFestival() {
  const f = festivalToday();
  if (!f) return;
  setMusic('festival');
  sfx('festival');
  const lines = [N(`${f.icon} ${f.intro}`)];
  if (S.rel[f.host] && S.rel[f.host].met) lines.push(L(f.host, f.hostLine[0], f.hostLine[1]));
  playScene(lines, () => FESTIVAL_GAMES[season().id]());
}

function finishFestival(resultHtml) {
  const f = FESTIVALS[season().id];
  S.festivals[festivalKey()] = true;
  S.stats.festivals++;
  if (S.rel[f.host] && S.rel[f.host].met) addAffection(f.host, 10);
  saveGame();
  openStage(`
    <div class="stage-card intro" style="--era:#e3a91f">
      <div class="intro-icon">${f.icon}</div>
      <h2>${f.name}</h2>
      ${resultHtml}
      ${S.rel[f.host] && S.rel[f.host].met ? `<p class="love-txt">💗 ${COMPANIONS[f.host].name} enjoyed spending the festival with you (+10).</p>` : ''}
      <div class="btn-row"><button class="btn primary" onclick="closeFestival()">Head home</button></div>
    </div>`, f.bg);
}

function closeFestival() { closeStage(); setMusic(backgroundMusic()); }

function festivalArtifactHtml(id) {
  if (!grantArtifact(id)) return '';
  const a = ARTIFACTS[id];
  return `<div class="artifact-reveal"><div class="big-emoji">${a.emoji}</div><h3>${a.name}</h3><p>${a.desc}</p><p class="bonus">${bonusText(a.bonus)}</p></div>`;
}

const FESTIVAL_GAMES = {
  // ---------- Spring: choose a stall ----------
  spring() {
    const f = FESTIVALS.spring;
    openStage(`
      <div class="stage-card intro wide" style="--era:#f08ab0">
        <h2>🌸 ${f.name}</h2>
        <p>Choose one stall to visit:</p>
        <div class="venture-grid">
          <button class="venture stall" onclick="springStall('seeds')"><div class="v-icon">🌱</div><b>Seed Stall</b><small>6 free packets of in-season seeds.</small></button>
          <button class="venture stall" onclick="springStall('books')"><div class="v-icon">📚</div><b>Anna's Book Stall</b><small>Read poetry with friends: +10 affection with everyone you've met.</small></button>
          <button class="venture stall" onclick="springStall('fortune')"><div class="v-icon">🔮</div><b>Fortune Teller</b><small>She draws a battle card from her deck… for you.</small></button>
        </div>
      </div>`, f.bg);
  },
  // ---------- Summer: rowing timing game ----------
  summer() { startRegatta(); },
  // ---------- Autumn: crop judging ----------
  autumn() {
    const f = FESTIVALS.autumn;
    const ids = Object.keys(CROPS).filter(id => totalOf('produce', id) > 0).sort((a, b) => CROPS[b].sell - CROPS[a].sell);
    openStage(`
      <div class="stage-card intro wide" style="--era:#2b4a86">
        <h2>🏵️ ${f.name}</h2>
        <p>Choose a crop to enter in the contest. The judges score value and quality, and the crop is kept by the Gala.</p>
        ${ids.length ? `<div class="gift-grid">${ids.map(id => `<button class="pick" onclick="enterGala('${id}')">${CROPS[id].emoji} ${CROPS[id].name} <b>×${totalOf('produce', id)}</b><small>Base value 🪙${CROPS[id].sell}</small></button>`).join('')}</div>`
          : '<p class="muted">You have no crops to enter this year. Enjoy the music and the canapés!</p><div class="btn-row"><button class="btn primary" onclick="finishFestival(\'<p>You danced the night away at the Gala. Next year, bring a crop!</p>\')">Enjoy the Gala</button></div>'}
      </div>`, f.bg);
  },
  // ---------- Winter: auction vs Peter ----------
  winter() { startAuction(); },
};

function springStall(kind) {
  let html = '';
  if (kind === 'seeds') {
    const pool = Object.keys(CROPS).filter(id => cropUnlocked(id) && inSeason(id));
    const got = {};
    for (let i = 0; i < 6; i++) { const id = pool[Math.floor(Math.random() * pool.length)]; got[id] = (got[id] || 0) + 1; S.seeds[id] = (S.seeds[id] || 0) + 1; }
    html = `<p>You received: ${Object.entries(got).map(([id, n]) => `${CROPS[id].emoji}×${n}`).join(' ')}</p>`;
  } else if (kind === 'books') {
    const met = Object.keys(COMPANIONS).filter(w => S.rel[w].met);
    met.forEach(w => addAffection(w, 10));
    html = `<p>You read poetry under the blossoms with ${met.map(w => COMPANIONS[w].name).join(', ') || 'the villagers'}. 💗 +10 affection each!</p>`;
  } else {
    const opts = ['grog', 'chart', 'cannon', 'rewind', 'anchor', 'feast', 'silkveil'];
    const id = opts[Math.floor(Math.random() * opts.length)];
    grantCard(id);
    html = `<p>"I see… a great battle in your future." She hands you a card:</p>${cardHTML(id)}`;
  }
  sfx('success');
  finishFestival(html + festivalArtifactHtml('bouquet'));
}

// ---------- Regatta ----------
let RG = null;
function startRegatta() {
  const rivals = [
    { name: 'Village Fishers', boat: '🚣', score: 8 + Math.floor(Math.random() * 4) },
    { name: S.heistStarted ? 'Lady Jane (on parole)' : 'Mysterious Old Captain', boat: '🏴‍☠️', score: 10 + Math.floor(Math.random() * 5) },
    { name: 'Peter Winters', boat: '🛶', score: 9 + Math.floor(Math.random() * 6) },
  ];
  RG = { stroke: 0, total: 0, strokes: 6, rivals, t0: performance.now(), anim: null, msg: 'Press ROW when the marker is in the green!' };
  drawRegatta();
  const loop = now => {
    if (!RG) return;
    const speed = 1.6 + RG.stroke * 0.35;
    RG.pos = (Math.sin((now - RG.t0) / 1000 * speed * Math.PI) + 1) / 2;
    const m = document.getElementById('rgMarker');
    if (m) m.style.left = `${RG.pos * 100}%`;
    RG.anim = requestAnimationFrame(loop);
  };
  RG.anim = requestAnimationFrame(loop);
}

function drawRegatta() {
  const max = RG.strokes * 3;
  const lane = (name, boat, score, you) => `<div class="lane ${you ? 'you' : ''}"><span class="lane-name">${name}</span><div class="water"><span class="boat" style="left:${Math.min(92, (score / max) * 92)}%">${boat}</span></div></div>`;
  const shown = RG.stroke / RG.strokes;
  openStage(`
    <div class="stage-card intro wide" style="--era:#1f4f7a">
      <h2>⛵ Gilded Gull Regatta</h2>
      <p class="rune-status">${RG.msg}</p>
      <div class="lanes">
        ${lane('You', '⛵', RG.total, true)}
        ${RG.rivals.map(r => lane(r.name, r.boat, Math.round(r.score * shown), false)).join('')}
      </div>
      <div class="row-meter"><div class="zone ok"></div><div class="zone good"></div><div class="zone perfect"></div><div class="marker" id="rgMarker"></div></div>
      <p class="muted">Stroke ${Math.min(RG.stroke + 1, RG.strokes)} of ${RG.strokes}</p>
      <div class="btn-row"><button class="btn primary big-btn" id="rowBtn">🚣 ROW!</button></div>
    </div>`, FESTIVALS.summer.bg);
  document.getElementById('rowBtn').onclick = rowStroke;
}

function rowStroke() {
  if (!RG || RG.stroke >= RG.strokes) return;
  const off = Math.abs(RG.pos - 0.5);
  const pts = off < 0.06 ? 3 : off < 0.15 ? 2 : off < 0.27 ? 1 : 0;
  RG.total += pts;
  RG.stroke++;
  RG.msg = ['💦 Splash! Missed the beat.', '👍 Okay stroke!', '💪 Good stroke!', '🌟 PERFECT stroke!'][pts];
  sfx(pts >= 2 ? 'success' : pts ? 'pop' : 'wrong');
  if (RG.stroke >= RG.strokes) {
    cancelAnimationFrame(RG.anim);
    const results = [{ name: 'You', score: RG.total, you: true }, ...RG.rivals].sort((a, b) => b.score - a.score);
    const place = results.findIndex(r => r.you) + 1;
    const coins = [250, 120, 50, 50][place - 1];
    S.coins += coins;
    let extra = '';
    if (place === 1) {
      const id = ['cannon', 'anchor', 'rewind', 'freeze'][Math.floor(Math.random() * 4)];
      grantCard(id);
      extra = `<p>Cedric's prize card:</p>${cardHTML(id)}${festivalArtifactHtml('medal')}`;
    }
    const table = `<ol class="results">${results.map(r => `<li class="${r.you ? 'you' : ''}">${r.name}: ${r.score} pts</li>`).join('')}</ol>`;
    RG = null;
    return finishFestival(`<h3>${place === 1 ? '🥇 First place!' : place === 2 ? '🥈 Second place!' : '🏅 Well rowed!'}</h3>${table}<p class="reward-line">🪙 +${coins}</p>${extra}`);
  }
  drawRegatta();
}

// ---------- Harvest Gala ----------
function enterGala(cropId) {
  if (!takeFrom('produce', cropId)) return;
  const c = CROPS[cropId];
  const you = Math.round(c.sell * (0.85 + Math.random() * 0.45));
  const rivals = [
    { name: 'Farmer Bess: a giant turnip', score: 90 + Math.floor(Math.random() * 80) },
    { name: 'Count Varne: a night-blooming rose', score: 120 + Math.floor(Math.random() * 90) },
    { name: 'Peter Winters: a suspiciously perfect, store-bought pumpkin', score: 130 + Math.floor(Math.random() * 90) },
  ];
  const results = [{ name: `You: ${c.emoji} ${c.name}`, score: you, you: true }, ...rivals].sort((a, b) => b.score - a.score);
  const won = results[0].you;
  let html = `<ol class="results">${results.map(r => `<li class="${r.you ? 'you' : ''}">${r.name}: ${r.score} pts</li>`).join('')}</ol>`;
  if (won) {
    const prize = c.sell * 3;
    S.coins += prize;
    html = `<h3>🏆 Blue ribbon!</h3>${html}<p class="reward-line">🪙 +${prize}</p>${festivalArtifactHtml('rosette')}`;
    sfx('win');
  } else {
    S.coins += 50;
    html = `<h3>A valiant entry!</h3>${html}<p class="reward-line">Consolation prize: 🪙 +50</p><p class="muted">Tip: more valuable crops score higher.</p>`;
  }
  finishFestival(html);
}

// ---------- Treasury Auction ----------
let AU = null;
function startAuction() {
  const cardPool = ['freeze', 'rewind', 'anchor', 'checkmate', 'hammurabi', 'iai'];
  const cardId = cardPool[Math.floor(Math.random() * cardPool.length)];
  AU = {
    lots: [
      S.artifacts.includes('candelabra')
        ? { name: '3× Royal Elixir', icon: '🍶', base: 150, give: () => { stash('items', 'hipotion', 3); return 'Three Royal Elixirs are yours.'; } }
        : { name: 'Starlight Candelabra', icon: '🕯️', base: 200, give: () => festivalArtifactHtml('candelabra') },
      { name: `Rare card: ${CARDS[cardId].name}`, icon: CARDS[cardId].art, base: 160, give: () => { grantCard(cardId); return cardHTML(cardId); } },
      { name: 'Mystery Crate', icon: '📦', base: 100, give: () => { const n = 80 + Math.floor(Math.random() * 400); S.coins += n; return `Inside: 🪙${n}!`; } },
    ],
    i: 0, won: [], log: [],
  };
  nextLot();
}

function nextLot() {
  if (AU.i >= AU.lots.length) {
    const html = AU.won.length ? `<h3>Your winnings</h3>${AU.won.join('')}` : '<p>You kept your purse closed this year. Peter Winters looks insufferably pleased.</p>';
    AU = null;
    return finishFestival(html);
  }
  const lot = AU.lots[AU.i];
  lot.price = lot.base;
  lot.rivalMax = Math.round(lot.base * (1.1 + Math.random() * 0.7));
  lot.leader = 'Peter';
  AU.log = [`Minister Quinn opens bidding at 🪙${lot.base}. Peter Winters raises his paddle.`];
  drawAuction();
}

function drawAuction() {
  const lot = AU.lots[AU.i];
  openStage(`
    <div class="stage-card intro wide" style="--era:#2f5a40">
      <h2>🔨 Royal Treasury Auction</h2>
      <p class="muted">Lot ${AU.i + 1} of ${AU.lots.length}</p>
      <div class="lot"><div class="v-icon">${lot.icon}</div><b>${lot.name}</b></div>
      <div class="auction-row">
        <div class="bidder">${portraitSVG('peter', lot.leader === 'Peter' ? 'smirk' : 'determined', { crop: 'head', cls: 'mini' })}<small>Peter</small></div>
        <div class="price">🪙 ${lot.price}<small>${lot.leader === 'Peter' ? 'Peter leads' : 'You lead'}</small></div>
        <div class="bidder">${mentorMet('quinn') ? portraitSVG('quinn', 'smile', { crop: 'head', cls: 'mini' }) : '<span class="big">🔨</span>'}<small>Auctioneer</small></div>
      </div>
      <ul class="auction-log">${AU.log.slice(-3).map(l => `<li>${l}</li>`).join('')}</ul>
      <p class="muted small">You have 🪙${S.coins}.</p>
      <div class="btn-row">
        <button class="btn" ${S.coins < lot.price + 25 ? 'disabled' : ''} onclick="auctionBid(25)">Bid +25</button>
        <button class="btn" ${S.coins < lot.price + 100 ? 'disabled' : ''} onclick="auctionBid(100)">Bid +100</button>
        <button class="btn ghost" onclick="auctionPass()">Pass</button>
      </div>
    </div>`, FESTIVALS.winter.bg);
}

function auctionBid(inc) {
  const lot = AU.lots[AU.i];
  if (S.coins < lot.price + inc) return;
  lot.price += inc;
  lot.leader = 'You';
  sfx('coin');
  if (lot.price > lot.rivalMax) {
    S.coins -= lot.price;
    AU.won.push(`<div class="won-lot"><b>${lot.icon} ${lot.name}</b>, won for 🪙${lot.price}<div>${lot.give()}</div></div>`);
    AU.log.push(`"Going once, going twice… SOLD!" Peter scowls and snaps his book shut.`);
    sfx('win');
    AU.i++;
    return setTimeout(nextLot, 400);
  }
  lot.price += 25;
  lot.leader = 'Peter';
  AU.log.push(`You bid 🪙${lot.price - 25}. Peter immediately counters with 🪙${lot.price}.`);
  drawAuction();
}

function auctionPass() {
  const lot = AU.lots[AU.i];
  AU.log.push(`Peter wins the ${lot.name} for 🪙${lot.price}.`);
  AU.i++;
  nextLot();
}
