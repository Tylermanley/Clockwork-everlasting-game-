// ============================================================
//  Clockwork Everlasting — mentors: Lady Alice (salon) & Minister Quinn (treasury)
// ============================================================

const VENTURES = {
  spice:    { name: 'Spice Route Caravan', icon: '🐫', days: 2, ret: 0.3, odds: 0.9, h: 1, desc: 'A short, safe trip for pepper and saffron.' },
  silk:     { name: 'Silk Road Convoy',    icon: '🧵', days: 4, ret: 0.8, odds: 0.75, h: 3, desc: 'Fine silks from the far east. Bandits are a risk.' },
  treasure: { name: 'Treasure Expedition', icon: '🗺️', days: 6, ret: 2.0, odds: 0.5, h: 5, desc: 'Quinn\'s mysterious map. Fortune… or nothing.' },
  janehoard:{ name: 'Jane\'s Lost Hoard',    icon: '🏴‍☠️', days: 3, ret: 1.0, odds: 1, h: 0, hidden: true, desc: 'Both halves of the map, together at last.' },
};
const MAX_VENTURES = 3;

function mentorMet(who) { return !!(S.rel[who] && S.rel[who].met); }

// Minister Quinn's Patron's Discount
function price(n) { return Math.max(1, Math.round(n * (mentorMet('quinn') && hearts('quinn') >= 2 ? 0.9 : 1))); }

function bankRate() { return hearts('quinn') >= 4 ? 0.05 : 0.03; }

// Runs each morning from endDay(); returns a short summary for the toast
function mentorMorning() {
  const msgs = [];
  if (mentorMet('quinn') && S.bank > 0) {
    const gain = Math.min(150, Math.floor(S.bank * bankRate()));
    if (gain > 0) { S.bank += gain; msgs.push(`🏦 Interest +🪙${gain}.`); }
  }
  const still = [];
  S.ventures.forEach(v => {
    if (v.due > S.day) { still.push(v); return; }
    const V = VENTURES[v.type];
    if (Math.random() < V.odds) {
      const pay = Math.round(v.amount * (1 + V.ret));
      S.coins += pay;
      S.stats.ventureWins++;
      msgs.push(`${V.icon} ${V.name} returned 🪙${pay}!`);
      if (v.type === 'janehoard') { S.quest.jane = 3; grantCard('revenge'); grantArtifact('spyglass'); if (!morningQueue.includes('jane3')) morningQueue.push('jane3'); }
    } else {
      const back = Math.round(v.amount * 0.25);
      S.coins += back;
      msgs.push(`${V.icon} ${V.name} was lost… insurance repaid 🪙${back}.`);
    }
  });
  S.ventures = still;
  return msgs.join(' ');
}

function quinnArrivalCheck() {
  if (!mentorMet('quinn') && COMPANIONS.quinn.unlock()) meetCompanion('quinn');
}

// ---------- Lady Alice's Salon ----------
function lessonXp() { return (20 + 10 * S.hero.level) * (hearts('alice') >= 5 ? 2 : 1); }
function maxUpgrade() { const h = hearts('alice'); return h >= 5 ? 2 : h >= 1 ? 1 : 0; }
function upgradeCost(id) { return price(120 * (upgradeLevel(id) + 1)); }

function takeLesson() {
  resetDailyIfNeeded();
  if (S.daily.lesson || !spendEnergy(4)) return toast(S.daily.lesson ? 'You already had a lesson today.' : '⚡ Not enough energy for a lesson.');
  S.daily.lesson = true;
  const xp = lessonXp();
  const lv = grantXp(xp);
  saveGame();
  playScene([
    L('alice', 'determined', ['Again! Lead with the left foot this time.', 'Today: the history of the Byzantine parry. Pay attention.', 'Balance a book on your head while you duel. Yes, really.'][S.day % 3]),
    L('alice', 'happy', `Splendid progress! (+${xp} XP${lv ? `, Level ${S.hero.level}!` : ''})`),
  ], () => renderAll());
}

function upgradeCard(id) {
  const cost = upgradeCost(id);
  if (upgradeLevel(id) >= maxUpgrade() || S.coins < cost || !canUpgrade(id)) return;
  S.coins -= cost;
  S.upgrades[id] = upgradeLevel(id) + 1;
  toast(`🎓 Lady Alice refines your technique: <b>${effCard(id).name}</b>! All copies are stronger.`);
  saveGame(); renderAll();
}

function renderSalon(view) {
  resetDailyIfNeeded();
  const owned = Object.keys(CARDS).filter(id => S.cards[id] && canUpgrade(id));
  const st = stats();
  const maxLv = maxUpgrade();
  view.innerHTML = `
    ${backBar('alice', 'Welcome to my salon. Tea is poured, and the lesson begins promptly.')}
    <div class="market-grid">
      <section class="panel">
        <h3>📖 Daily Lesson</h3>
        <p>Spend ⚡4 energy studying history and swordplay with Lady Alice. You'll gain <b>${lessonXp()} XP</b>.</p>
        <button class="btn primary" ${S.daily.lesson || S.energy < 4 ? 'disabled' : ''} onclick="takeLesson()">${S.daily.lesson ? '✓ Lesson complete for today' : '🎓 Take a lesson (⚡4)'}</button>
        <p class="muted small">Level ${S.hero.level} · ${S.hero.xp}/${xpToNext()} XP. Higher levels mean more HP, attack and defence.</p>
      </section>
      <section class="panel">
        <h3>🫖 Lady Alice's Counsel</h3>
        <ul class="hint-box-list">
          <li>Display artifacts on your land, since only displayed artifacts grant power.</li>
          <li>A smaller deck draws your best cards more often. Don't be afraid to remove weak ones.</li>
          <li>${S.heistStarted ? 'Peter fights like a duellist: patient, then sudden. Never attack into his Riposte.' : 'Keep a few Block cards in your deck. Every guardian telegraphs its strongest blow.'}</li>
        </ul>
      </section>
    </div>
    <section class="panel deck-panel">
      <h3>⚔️ Masterclass: Card Upgrades <span class="muted">🪙 ${S.coins}</span></h3>
      <p class="muted small">Each upgrade makes every copy of a card 25% stronger (damage, Block and healing). ${maxLv ? `Lady Alice can teach up to level ${maxLv}.` : 'Reach 1★ with Lady Alice to begin.'} ${maxLv < 2 ? 'Level 2 unlocks at 5★.' : ''}</p>
      <div class="card-row">
        ${owned.map(id => {
          const lv = upgradeLevel(id);
          const capped = lv >= maxLv;
          return `<div class="deck-card">${cardHTML(id, { st })}
            <button class="btn small primary" ${capped || S.coins < upgradeCost(id) ? 'disabled' : ''} onclick="upgradeCard('${id}')">${lv >= 2 ? '★ Mastered' : capped ? '🔒 More ★ needed' : `Upgrade 🪙${upgradeCost(id)}`}</button></div>`;
        }).join('')}
      </div>
    </section>`;
}

// ---------- Minister Quinn's Treasury ----------
function bankMove(amount) {
  if (amount > 0) { const n = Math.min(amount, S.coins); S.coins -= n; S.bank += n; }
  else { const n = Math.min(-amount, S.bank); S.bank -= n; S.coins += n; }
  saveGame(); renderAll();
}

function invest(type, amount) {
  const V = VENTURES[type];
  if (hearts('quinn') < V.h || S.coins < amount || S.ventures.length >= MAX_VENTURES) return;
  S.coins -= amount;
  S.ventures.push({ type, amount, due: S.day + V.days });
  toast(`${V.icon} Invested 🪙${amount} in the ${V.name}. Returns in ${V.days} days.`);
  saveGame(); renderAll();
}

function renderTreasury(view) {
  const h = hearts('quinn');
  view.innerHTML = `
    ${backBar('quinn', 'Welcome to the Royal Treasury. Let\'s put those coins to work, shall we?')}
    <div class="market-grid">
      <section class="panel">
        <h3>🏦 Royal Bank</h3>
        <div class="bank-figure">🪙 ${S.bank}<small>in the vault · ${Math.round(bankRate() * 100)}% interest each morning (max 🪙150/day)</small></div>
        <p class="muted small">Coins in the bank are safe and earn interest, but they can't be spent until withdrawn. You're carrying 🪙${S.coins}.</p>
        <div class="btn-row">
          ${[50, 200].map(n => `<button class="btn small" ${S.coins < 1 ? 'disabled' : ''} onclick="bankMove(${n})">Deposit ${n}</button>`).join('')}
          <button class="btn small primary" ${S.coins < 1 ? 'disabled' : ''} onclick="bankMove(${S.coins})">Deposit all</button>
        </div>
        <div class="btn-row">
          ${[50, 200].map(n => `<button class="btn small" ${S.bank < 1 ? 'disabled' : ''} onclick="bankMove(-${n})">Withdraw ${n}</button>`).join('')}
          <button class="btn small" ${S.bank < 1 ? 'disabled' : ''} onclick="bankMove(-${S.bank})">Withdraw all</button>
        </div>
      </section>
      <section class="panel">
        <h3>📈 Active Ventures <span class="muted">${S.ventures.length}/${MAX_VENTURES}</span></h3>
        ${S.ventures.length ? `<ul class="sell-list">${S.ventures.map(v => `<li>${VENTURES[v.type].icon} ${VENTURES[v.type].name} <span>🪙${v.amount} · ${Math.max(0, v.due - S.day)} day${v.due - S.day === 1 ? '' : 's'} left</span></li>`).join('')}</ul>` : '<p class="muted">No ventures running. Quinn recommends diversifying!</p>'}
        <p class="muted small">Returns arrive on the morning they're due. Failed ventures repay 25% through Treasury insurance.</p>
      </section>
    </div>
    ${S.quest.jane === 1 ? `<section class="panel quest-panel"><h3>🏴‍☠️ Jane's Lost Hoard</h3>
      <p><b>Quinn:</b> "Jane's half of the map and the Crown's half… together. Strictly as a business arrangement, I'll match your funding. 🪙500 and three days at sea, and success is guaranteed."</p>
      <button class="btn primary" ${S.coins < 500 ? 'disabled' : ''} onclick="fundJaneHoard()">Fund the expedition (🪙500)</button></section>` : ''}
    <section class="panel deck-panel">
      <h3>🌍 Trade Ventures</h3>
      <div class="venture-grid">
        ${Object.entries(VENTURES).filter(([, V]) => !V.hidden).map(([id, V]) => {
          const locked = h < V.h;
          return `<div class="venture ${locked ? 'locked' : ''}">
            <div class="v-icon">${V.icon}</div>
            <b>${V.name}</b>
            <small>${V.desc}</small>
            <div class="v-stats">⏳ ${V.days} days · 📈 +${Math.round(V.ret * 100)}% · 🎲 ${Math.round(V.odds * 100)}% success</div>
            ${locked ? `<button class="btn small" disabled>🔒 ${V.h}★ with Quinn</button>` : `<div class="btn-row">${[50, 150, 400].map(n => `<button class="btn small" ${S.coins < n || S.ventures.length >= MAX_VENTURES ? 'disabled' : ''} onclick="invest('${id}',${n})">🪙${n}</button>`).join('')}</div>`}
          </div>`;
        }).join('')}
      </div>
    </section>`;
}

function fundJaneHoard() {
  if (S.quest.jane !== 1 || S.coins < 500) return;
  S.coins -= 500;
  S.ventures.push({ type: 'janehoard', amount: 500, due: S.day + VENTURES.janehoard.days });
  S.quest.jane = 2;
  toast('🏴‍☠️ The expedition sets sail for Jane\'s hidden island! Back in 3 days.');
  saveGame(); renderAll();
}
