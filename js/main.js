// ============================================================
//  Clockwork Everlasting — UI shell: header, tabs, portal, museum, market
// ============================================================

let currentTab = 'farm';

function bonusText(b) {
  const labels = { atk: '⚔️ ATK', def: '🛡️ DEF', hp: '❤️ HP', energy: '⚡ Energy', gold: '🪙/day', sprinkler: '💦 Sprinkler' };
  return Object.entries(b).map(([k, v]) => k === 'sprinkler' ? labels[k] : `${labels[k]} +${v}`).join(' · ');
}

function toast(msg, ms = 2600) {
  const box = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = msg;
  box.appendChild(t);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => t.classList.add('out'), ms);
  setTimeout(() => t.remove(), ms + 400);
}

function openStage(html, bg) {
  const st = document.getElementById('stage');
  st.style.background = bg || '';
  document.getElementById('stageInner').innerHTML = html;
  st.classList.add('open');
  document.body.classList.add('staged');
}

function closeStage() {
  stopPuzzleTimers();
  P = null;
  document.getElementById('stage').classList.remove('open');
  document.body.classList.remove('staged');
  renderAll();
}

// ---------- header ----------
function renderHeader() {
  const st = stats();
  const weather = { sunny: '☀️', rain: '🌧️', cloudy: '☁️', snow: '🌨️' }[S.weather];
  const se = season();
  document.getElementById('hud').innerHTML = `
    <div class="hud-item" title="Day ${S.day}">${se.icon} ${se.name} <b>${dayOfSeason()}</b>, Y${year()} ${weather}</div>
    <div class="hud-item">🪙 <b>${S.coins}</b></div>
    <div class="hud-item energy" title="Energy">⚡ <div class="mini-bar"><div style="width:${(S.energy / st.maxEnergy) * 100}%"></div></div><b>${S.energy}/${st.maxEnergy}</b></div>
    <div class="hud-item" title="XP ${S.hero.xp}/${xpToNext()}">⭐ Lv <b>${S.hero.level}</b> <div class="mini-bar xp"><div style="width:${(S.hero.xp / xpToNext()) * 100}%"></div></div></div>
    <div class="hud-item" title="Satchel">🎒 ${satchelCount()}/${satchelCap()}</div>
    <div class="hud-item stats">❤️ ${st.maxHp} ⚔️ ${st.atk} 🛡️ ${st.def}</div>
    ${S.title ? `<div class="hud-item title-chip">🎖️ ${S.title}</div>` : ''}
    <button class="hud-item hud-btn" title="Sound effects" onclick="toggleSetting('sfx')">${S.settings.sfx ? '🔊' : '🔇'}</button>
    <button class="hud-item hud-btn" title="Music" onclick="toggleSetting('music')"><span class="${S.settings.music ? '' : 'off'}">🎵</span></button>`;
}

function showTab(tab) {
  if (tab === 'town' && currentTab !== 'town') compView = 'main';
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + tab));
  renderAll();
}

function renderAll() {
  renderHeader();
  if (currentTab === 'farm') renderFarm();
  if (currentTab === 'portal') renderPortal();
  if (currentTab === 'museum') renderMuseum();
  if (currentTab === 'market') renderMarket();
  if (currentTab === 'help') renderHelp();
  if (currentTab === 'town') renderCompanions();
  if (currentTab === 'settings') renderSettings();
  checkAchievements();
  checkTutorial();
}

// ---------- Time Portal ----------
function renderPortal() {
  const view = document.getElementById('view-portal');
  view.innerHTML = `
    <h2 class="view-title">🌀 The Time Portal</h2>
    <p class="muted center">Solve puzzles to recover artifacts. Recover all three in an era to awaken its boss. Defeat the boss to open the next era.</p>
    ${heistBanner()}
    ${Object.keys(S.bosses).length ? `<div class="mode-row">${dailyCardHtml()}${riftCardHtml()}</div>` : `<div class="mode-row">${dailyCardHtml()}</div>`}
    <div class="era-list">
      ${ERAS.map(era => {
        const open = eraUnlocked(era);
        const done = S.bosses[era.id];
        if (!open) {
          const lockMsg = era.requires ? `Something stirs beyond ${ERA_BY_ID[era.requires].boss.name}…` : era.final ? 'Defeat every boss to reveal this rift.' : `Defeat ${ERAS[eraIndex(era.id) - 1].boss.name} to unlock.`;
          return `<div class="era-card locked"><div class="era-icon">🔒</div><div><h3>${era.final ? '???' : era.name}</h3><p class="muted">${lockMsg}</p></div></div>`;
        }
        const bossOpen = bossUnlocked(era);
        return `
          <div class="era-card" style="--era:${era.color};background:${era.bg}">
            <div class="era-head">
              <div class="era-icon">${era.boss.portrait ? `<span class="era-villain">${portraitSVG(era.boss.portrait, done ? 'sad' : 'smirk', { crop: 'head' })}</span>` : era.icon}</div>
              <div><h3>${era.name} ${done ? '✅' : ''}</h3><p class="era-year">${era.year} — ${era.blurb}</p></div>
            </div>
            <div class="era-puzzles">
              ${era.puzzles.map(p => {
                const a = ARTIFACTS[p.artifact];
                const cleared = S.puzzles[p.id];
                return `<button class="puzzle-btn ${cleared ? 'cleared' : ''}" onclick="openPuzzle('${era.id}','${p.id}')">
                  <span class="p-icon">${PUZZLE_INFO[p.type].icon}</span>
                  <span class="p-text"><b>${p.name}</b><small>${PUZZLE_INFO[p.type].title} · ⚡${PUZZLE_ENERGY}</small></span>
                  <span class="p-art">${cleared ? a.emoji : '❔'}</span>
                </button>`;
              }).join('')}
              <button class="puzzle-btn boss-btn ${bossOpen ? '' : 'locked'} ${done ? 'cleared' : ''}" ${bossOpen ? `onclick="openBossIntro('${era.id}')"` : 'disabled'}>
                <span class="p-icon">${bossOpen ? era.boss.emoji : '🔒'}</span>
                <span class="p-text"><b>${bossOpen ? era.boss.name : 'Boss sealed'}</b><small>${bossOpen ? `Boss battle · ⚡${BOSS_ENERGY}` : `Recover all ${era.puzzles.length} artifacts first`}</small></span>
                <span class="p-art">${done ? ARTIFACTS[era.boss.relic].emoji : '⚔️'}</span>
              </button>
              ${done && !era.final ? `<button class="puzzle-btn elite-btn ${S.elite[era.id] ? 'cleared' : ''}" onclick="openBossIntro('${era.id}', true)">
                <span class="p-icon">⚡</span><span class="p-text"><b>Elite ${era.boss.name}</b><small>${S.elite[era.id] ? 'Golden card earned ✦ · rematch any time' : 'Much harder rematch · win a ✦ golden card'}</small></span><span class="p-art">${S.elite[era.id] ? '✦' : '⚡'}</span></button>` : ''}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ---------- Museum ----------
function renderMuseum() {
  const view = document.getElementById('view-museum');
  const total = Object.keys(ARTIFACTS).length;
  const placed = new Set(placedArtifacts());
  view.innerHTML = `
    <h2 class="view-title">🏛️ Museum of the Ages</h2>
    ${journalHtml()}
    ${galleryHtml()}
    <p class="muted center">Collected <b>${S.artifacts.length}</b> of <b>${total}</b> artifacts.</p>
    <div class="progress"><div style="width:${(S.artifacts.length / total) * 100}%"></div></div>
    ${ERAS.map(era => {
      const ids = Object.keys(ARTIFACTS).filter(id => ARTIFACTS[id].era === era.id);
      return `<section class="museum-era"><h3>${eraUnlocked(era) ? era.icon : '🔒'} ${eraUnlocked(era) || !era.final ? era.name : '???'}</h3>
        <div class="museum-grid">
          ${ids.map(id => {
            const a = ARTIFACTS[id];
            const own = S.artifacts.includes(id);
            return `<div class="museum-card ${own ? '' : 'missing'} ${a.relic ? 'relic' : ''}">
              <div class="m-emoji">${own ? a.emoji : '❔'}</div>
              <b>${own ? a.name : 'Undiscovered'}</b>
              <small>${own ? a.desc : (a.relic ? 'Defeat this era\'s boss.' : 'Solve a puzzle in this era.')}</small>
              ${own ? `<span class="bonus">${bonusText(a.bonus)}</span><span class="tag ${placed.has(id) ? 'on' : ''}">${placed.has(id) ? 'On display' : 'In vault'}</span>` : ''}
            </div>`;
          }).join('')}
        </div></section>`;
    }).join('')}
    <section class="museum-era"><h3>🎉 Festival Keepsakes</h3><div class="museum-grid">
      ${Object.keys(ARTIFACTS).filter(id => ARTIFACTS[id].era === 'festival').map(id => {
        const a = ARTIFACTS[id];
        const own = S.artifacts.includes(id);
        return `<div class="museum-card ${own ? '' : 'missing'}"><div class="m-emoji">${own ? a.emoji : '❔'}</div><b>${own ? a.name : 'Undiscovered'}</b><small>${own ? a.desc : 'Win a seasonal festival.'}</small>${own ? `<span class="bonus">${bonusText(a.bonus)}</span><span class="tag ${placed.has(id) ? 'on' : ''}">${placed.has(id) ? 'On display' : 'In vault'}</span>` : ''}</div>`;
      }).join('')}
    </div></section>`;
}

// ---------- Market ----------
function seasonTags(id) {
  return `<span class="season-tags">${CROPS[id].seasons.map(s => SEASONS.find(x => x.id === s).icon).join('')}</span>`;
}

function forgeCost(kind) {
  const n = kind === 'atk' ? S.hero.forgeAtk : S.hero.forgeDef;
  return price(80 + n * 70);
}

function renderMarket() {
  const view = document.getElementById('view-market');
  const produceIds = Object.keys(CROPS).filter(id => totalOf('produce', id) > 0);
  const produceValue = produceIds.reduce((s, id) => s + totalOf('produce', id) * CROPS[id].sell, 0);
  const anyMet = S.rel.anna.met || S.rel.cedric.met;
  view.innerHTML = `
    <h2 class="view-title">🛒 Village Market</h2>
    ${mentorMet('quinn') && hearts('quinn') >= 2 ? '<p class="center muted">🏦 Minister Quinn\'s Patron\'s Discount: 10% off everything.</p>' : ''}
    <div class="market-grid">
      <section class="panel">
        <h3>📦 Sell Produce</h3>
        ${produceIds.length ? `
          <ul class="sell-list">${produceIds.map(id => `<li>${CROPS[id].emoji} ${CROPS[id].name} ×${totalOf('produce', id)} <span>🪙 ${totalOf('produce', id) * CROPS[id].sell} <button class="btn small" onclick="sellOne('${id}')">Sell 1</button></span></li>`).join('')}</ul>
          <p class="muted small">Includes crops stored in Anna's archive. Remember to keep some as gifts!</p>
          <button class="btn primary" onclick="sellAll()">Sell everything for 🪙 ${produceValue}</button>`
          : '<p class="muted">Nothing to sell. Harvest crops on your homestead!</p>'}
      </section>
      <section class="panel">
        <h3>🌱 Seeds</h3>
        ${Object.entries(CROPS).map(([id, c]) => {
          const ok = cropUnlocked(id);
          return `<div class="shop-row ${ok ? '' : 'locked'}">
            <span>${c.emoji} <b>${c.name}</b> ${seasonTags(id)}<small>${ok ? `${c.days} days · sells 🪙${c.sell} · own ×${S.seeds[id] || 0}${inSeason(id) ? '' : ' · <b class="oos">out of season</b>'}` : `Unlocks after defeating the ${ERA_BY_ID[c.unlock].name} boss`}</small></span>
            ${ok ? `<span class="buy-btns"><button class="btn small" ${S.coins < price(c.cost) ? 'disabled' : ''} onclick="buySeed('${id}',1)">🪙${price(c.cost)}</button><button class="btn small" ${S.coins < price(c.cost * 5) ? 'disabled' : ''} onclick="buySeed('${id}',5)">×5</button></span>` : '<span>🔒</span>'}
          </div>`;
        }).join('')}
      </section>
      <section class="panel">
        <h3>🎒 Adventuring Supplies</h3>
        ${Object.entries(SHOP_ITEMS).map(([id, it]) => `
          <div class="shop-row"><span>${it.emoji} <b>${it.name}</b><small>${it.desc} · satchel ×${S.items[id] || 0} · archive ×${S.library.items[id] || 0}</small></span>
          <button class="btn small" ${S.coins < price(it.cost) ? 'disabled' : ''} onclick="buyItem('${id}')">🪙${price(it.cost)}</button></div>`).join('')}
      </section>
      ${anyMet ? `<section class="panel">
        <h3>💝 Jeweller</h3>
        <div class="shop-row"><span>${LOCKET.emoji} <b>${LOCKET.name}</b><small>${LOCKET.desc} · own ×${S.locket}</small></span>
          <button class="btn small love" ${S.coins < price(LOCKET.cost) || S.partner ? 'disabled' : ''} onclick="buyLocket()">🪙${price(LOCKET.cost)}</button></div>
        ${S.partner ? `<p class="muted small">💍 You and ${COMPANIONS[S.partner].name} are partners.</p>` : ''}
      </section>` : ''}
      ${requestBoardHtml()}
      ${carpenterHtml()}
      <section class="panel">
        <h3>🐟 Fishmonger</h3>
        <p class="small">Fish: ${Object.keys(S.fish).filter(id => S.fish[id] > 0).map(id => `${FISH[id].emoji}×${S.fish[id]}`).join(' ') || 'none'} · Eggs: 🥚×${S.pantry.egg || 0}</p>
        <p class="muted small">Keep some for cooking! ${mentorMet('peter') && hearts('peter') >= 2 ? '❄️ Peter\'s Frost Cellar: +25% value.' : ''}</p>
        <button class="btn small primary" ${fishCount() + (S.pantry.egg || 0) ? '' : 'disabled'} onclick="sellFish()">Sell all fish &amp; eggs</button>
      </section>
      <section class="panel">
        <h3>⚒️ Blacksmith's Forge</h3>
        <div class="shop-row"><span>🗡️ <b>Hone Chrono Blade</b><small>Permanent +2 ATK · level ${S.hero.forgeAtk}</small></span>
          <button class="btn small" ${S.coins < forgeCost('atk') ? 'disabled' : ''} onclick="forge('atk')">🪙${forgeCost('atk')}</button></div>
        <div class="shop-row"><span>🧥 <b>Reinforce Traveler's Coat</b><small>Permanent +1 DEF · level ${S.hero.forgeDef}</small></span>
          <button class="btn small" ${S.coins < forgeCost('def') ? 'disabled' : ''} onclick="forge('def')">🪙${forgeCost('def')}</button></div>
      </section>
    </div>`;
}

function sellOne(id) {
  if (!takeFrom('produce', id)) return;
  S.coins += CROPS[id].sell;
  saveGame(); renderAll();
}

function buyLocket() {
  if (S.coins < price(LOCKET.cost) || S.partner) return;
  S.coins -= price(LOCKET.cost);
  S.locket++;
  toast('💍 You bought a Chrono Locket. Give it to someone special at 8♥.');
  saveGame(); renderAll();
}

function sellAll() {
  let total = 0;
  for (const id in CROPS) { total += totalOf('produce', id) * CROPS[id].sell; S.produce[id] = 0; S.library.produce[id] = 0; }
  S.coins += total;
  toast(`Sold produce for 🪙 ${total}!`);
  saveGame(); renderAll();
}

function buySeed(id, n) {
  const cost = price(CROPS[id].cost * n);
  if (S.coins < cost || !cropUnlocked(id)) return;
  S.coins -= cost;
  S.seeds[id] = (S.seeds[id] || 0) + n;
  saveGame(); renderAll();
}

function buyItem(id) {
  const it = SHOP_ITEMS[id];
  if (S.coins < price(it.cost)) return;
  S.coins -= price(it.cost);
  const where = stash('items', id, 1);
  toast(where.toLib ? `Bought ${it.emoji} ${it.name}. Your satchel is full, so Anna stored it in the archive.` : `Bought ${it.emoji} ${it.name}.`);
  saveGame(); renderAll();
}

function forge(kind) {
  const cost = forgeCost(kind);
  if (S.coins < cost) return;
  S.coins -= cost;
  if (kind === 'atk') S.hero.forgeAtk++; else S.hero.forgeDef++;
  toast(kind === 'atk' ? '🗡️ Your blade gleams sharper! +2 ATK' : '🧥 Your coat feels sturdier! +1 DEF');
  saveGame(); renderAll();
}

// ---------- Help ----------
function renderHelp() {
  document.getElementById('view-help').innerHTML = `
    <h2 class="view-title">❔ How to Play</h2>
    <div class="help panel">
      <h3>📅 Seasons &amp; Festivals</h3>
      <p>Each season lasts ${SEASON_LEN} days: 🌸 Spring, ☀️ Summer, 🍂 Autumn, ❄️ Winter. Crops can only be <b>planted</b> in their seasons (shown by the icons in your seed pouch and the Market), but crops already in the ground keep growing. Winter brings snow instead of rain. On day ${7} of every season there's a festival: Anna's <b>Blossom & Book Fair</b>, Cedric's <b>Regatta</b>, Lady Alice's <b>Harvest Gala</b> and Minister Quinn's <b>Treasury Auction</b>.</p>
      <h3>🏡 Homestead Life</h3>
      <p>Cook dishes in the 🍳 <b>Kitchen</b> from crops, eggs and fish. Pack one before a boss fight for a buff, or give a companion their favourite dish. Go 🎣 <b>fishing</b> at the dock to fill your fish collection. The Market's <b>Carpenter</b> builds a greenhouse (any crop, any season), a chicken coop, land expansions and decorations. Display every artifact from one era together for a 🏆 <b>set bonus</b>. Villagers post requests on the 📋 <b>Request Board</b>.</p>
      <h3>⚡ Challenges</h3>
      <p><b>⛓️ Chain</b> cards deal +50% if you've already attacked that turn. Beat a boss, then try its <b>⚡ Elite</b> rematch to turn its trophy card ✦ golden. At 8♥/★ your support companion unlocks a <b>✨ Duo Finisher</b>. Try the <b>📅 Daily Challenge</b> (the same puzzle for everyone each day) and the <b>🌀 Endless Rift</b>, a tower of bosses where your HP carries over and you pick new cards as you climb. Difficulty, text speed, colour-blind mode, reduced motion and save slots are all in ⚙️ Settings.</p>
      <h3>📔 Journal &amp; Sound</h3>
      <p>Anna records your achievements in her Adventure Journal (in the Museum). Each one pays coins, and many unlock a title you can wear. Use 🔊 and 🎵 in the top bar to toggle sound effects and music.</p>
      <h3>🌱 Your Homestead</h3>
      <p>Use the <b>Hoe</b> to till grass and clear rocks, <b>Plant</b> seeds, and <b>Water</b> them. Watered crops grow one day each time you press <b>End Day</b>. Click a fully grown crop to harvest it, then sell it at the Market. Rainy days water everything for free.</p>
      <h3>🏺 Artifacts</h3>
      <p>Artifacts are recovered from puzzles and bosses. <b>Display</b> them on your land to activate their powers: more attack, defence, HP, energy, daily coins, or sprinkler effects that water the 8 tiles around them every morning.</p>
      <h3>🌀 Time Portal &amp; Puzzles</h3>
      <p>Each era has three puzzles: 🔍 hidden objects, 🃏 memory pairs, 🧩 sliding tiles, 🔮 rune sequences, ♟️ checkmate-in-one chess, 🧠 Memory Palace recall and 🍽️ Banquet Table seating. Each costs ⚡${PUZZLE_ENERGY}. The first clear grants an artifact; replays give coins and XP.</p>
      <h3>🃏 Card Battles</h3>
      <p>Battle cards are your main weapon. Cedric gives you a starter deck and forges a new card for every puzzle you solve and every boss you defeat. You can buy more on his ship and choose your deck (${DECK_MIN}–${DECK_MAX} cards).</p>
      <ul>
        <li>Each turn you draw ${HAND_SIZE} cards and get ${BASE_CP} Chrono Points (CP). Play cards by spending their CP cost, then press <b>End Turn</b>.</li>
        <li><b>Block</b> soaks up damage until your next turn. The boss's <b>Next move</b> tells you when you'll need it.</li>
        <li>⚠️ <b>Heavy</b> attacks follow a charge-up turn, so stack Block or play Freeze Time!</li>
        <li>🥋 <b>Counter Stance</b> punishes attack cards. Play Block or skill cards instead.</li>
        <li>🔰 <b>Shields</b> soak up damage, but ⚡ shield-breaking cards deal double to them.</li>
        <li>🔥 Burn, 🌀 Weaken and 🎯 Expose (+50% damage taken) work on bosses too.</li>
        <li>Items from your satchel are free actions. Bosses enter a deadlier <b>Phase 2</b> at half health.</li>
      </ul>
      <h3>💞 Companions</h3>
      <p><b>Anna</b>, the librarian, keeps everything that won't fit in your satchel in her archive and studies every guardian. As support she gives live hints each turn, and with more hearts she heals and shields you. <b>Cedric</b>, the merchant captain, forges and sells battle cards. As support he deals you an extra card each turn and later fires his ship's cannons.</p>
      <h3>🎓 Mentors</h3>
      <p><b>Lady Alice</b>, Duchess of Bluewater, arrives after your first boss victory. She gives daily lessons for XP and a <b>Masterclass</b> that upgrades your cards. As support she reduces the damage you take and can issue a <b>Royal Decree</b>. <b>Minister Quinn</b> of the Royal Treasury arrives on Day 3. He runs a <b>bank</b> that pays interest every morning and <b>trade ventures</b> that may multiply your coins, and he gets you discounts. As support he boosts battle coin rewards and can hire mercenaries. Mentors earn ★ rapport instead of romance hearts.</p>
      <h3>🦹 Rivals</h3>
      <p>Watch out for <b>Peter Winters</b>, an arrogant young collector with ice magic, and <b>Lady Jane</b>, a legendary pirate who wants her old ship back. Peter's <b>Pickpocket</b> steals cards from your deck during battle, and Jane's <b>Plunder</b> steals your Block. Ask Anna for her notes before you face them.</p>
      <p>Talk to them daily, give gifts (each has favourite crops) and bring them into battle to raise their hearts. Heart events unlock at 2, 4, 6 and 8♥. At 8♥, give a Chrono Locket from the Market to become partners.</p>
      <h3>💡 Tips</h3>
      <p>Level up by replaying puzzles, upgrade at the Forge, buy potions before boss fights, and place sprinkler artifacts in the middle of your fields.</p>
      <div class="btn-row"><button class="btn danger small" onclick="confirmReset()">Reset save</button></div>
    </div>`;
}

function confirmReset() {
  if (!confirm('Erase all progress and start a new homestead?')) return;
  resetGame();
  farmUI = { tool: 'hoe', seed: 'wheat', artifact: null };
  showTab('farm');
  showIntro();
}

function showIntro() {
  openStage(`
    <div class="stage-card intro">
      <div class="intro-icon">⏳</div>
      <h2>Welcome to Clockwork Everlasting</h2>
      <p>Your great-aunt, a famous time-travelling archaeologist, has left you her overgrown homestead — and her pocket watch, the <b>Chrono Compass</b>.</p>
      <p>Rifts to the past have torn open. Priceless artifacts are scattered across history, guarded by ancient bosses... and something is devouring time itself.</p>
      <p>Farm your land, solve puzzles across ten eras of history, defeat their guardians in turn-based card battles, and display your recovered treasures in the grove. Along the way, new friends, wise mentors and cunning rivals will be waiting… and maybe something more.</p>
      <div class="btn-row"><button class="btn primary" onclick="beginJourney()">Begin your journey</button></div>
    </div>`, 'linear-gradient(160deg,#2f5d3a,#1b3524)');
}

function beginJourney() {
  S.introSeen = true;
  saveGame();
  closeStage();
  meetCompanion('anna', () => meetCompanion('cedric', () => {
    toast('💞 Visit the Companions tab to talk, give gifts and choose a support for boss battles.', 5000);
  }));
}

// ---------- boot ----------
window.addEventListener('DOMContentLoaded', () => {
  S = loadGame();
  syncPlotSize();
  applySettings();
  if (!S.requests.length) refreshRequests();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
  if (S.day === 1 && !S.introSeen) applyMorningWater();
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => showTab(t.dataset.tab));
  showTab('farm');
  if (!S.introSeen) showIntro();
  else if (S.bosses.end && !S.heistStarted) { triggerHeist(); playStory('heist'); }
});
