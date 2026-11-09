// ============================================================
//  Clockwork Everlasting — the homestead (farming + artifact display)
// ============================================================

const TOOLS = {
  hoe:      { name: 'Hoe',     icon: '⛏️', tip: 'Till grass into soil (⚡1) or clear rocks & stumps (⚡2).' },
  water:    { name: 'Water',   icon: '💧', tip: 'Water soil so crops grow overnight (⚡1).' },
  seed:     { name: 'Plant',   icon: '🌱', tip: 'Plant the selected seed in tilled soil.' },
  place:    { name: 'Display', icon: '🏛️', tip: 'Place the selected artifact on grass or empty soil.' },
  clear:    { name: 'Clear',   icon: '🧺', tip: 'Pick up an artifact, pull a crop, or turn soil back to grass.' },
};

let farmUI = { tool: 'hoe', seed: 'wheat', artifact: null };

function neighbors8(i) {
  const r = Math.floor(i / PLOT_W), c = i % PLOT_W, out = [];
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    if (!dr && !dc) continue;
    const rr = r + dr, cc = c + dc;
    if (rr >= 0 && rr < PLOT_H && cc >= 0 && cc < PLOT_W) out.push(rr * PLOT_W + cc);
  }
  return out;
}

function sprinklerTiles() {
  const set = new Set();
  S.plot.forEach((t, i) => {
    if ((t.t === 'artifact' && ARTIFACTS[t.id] && ARTIFACTS[t.id].bonus.sprinkler) || (t.t === 'deco' && DECOR[t.id] && DECOR[t.id].bonus.sprinkler)) neighbors8(i).forEach(n => set.add(n));
  });
  return set;
}

function applyMorningWater() {
  if (S.weather === 'rain') S.plot.forEach(t => { if (t.t === 'soil') t.wet = true; });
  sprinklerTiles().forEach(i => { if (S.plot[i].t === 'soil') S.plot[i].wet = true; });
}

function cropReady(t) {
  return t.t === 'soil' && t.crop && t.crop.age >= CROPS[t.crop.id].days;
}

function handleTile(i) {
  const t = S.plot[i];
  const tool = farmUI.tool;

  // Harvesting always works, whatever the tool
  if (cropReady(t)) {
    const c = CROPS[t.crop.id];
    const where = stash('produce', t.crop.id, 1);
    S.stats.harvested++;
    sfx('harvest');
    t.crop = null;
    toast(where.toLib ? `Harvested ${c.emoji} ${c.name}! Your satchel is full, so Anna stored it in the archive. 📚` : `Harvested ${c.emoji} ${c.name}! Sell it at the Market or give it as a gift.`);
    return commitFarm();
  }

  if (tool === 'hoe') {
    if (t.t === 'grass') {
      if (!spendEnergy(1)) return noEnergy();
      S.plot[i] = { t: 'soil', wet: false, crop: null };
      S.stats.tilled++;
      if (sprinklerTiles().has(i)) S.plot[i].wet = true;
    } else if (t.t === 'rock') {
      if (!spendEnergy(2)) return noEnergy();
      S.plot[i] = { t: 'grass' };
      const found = 3 + Math.floor(Math.random() * 6);
      S.coins += found;
      toast(`Cleared the ${t.kind === '🪨' ? 'rock' : 'stump'} and found 🪙 ${found}.`);
    } else return;
  } else if (tool === 'water') {
    if (t.t !== 'soil' || t.wet) return;
    if (!spendEnergy(1)) return noEnergy();
    t.wet = true;
    S.stats.watered++;
  } else if (tool === 'seed') {
    if (t.t !== 'soil' || t.crop) return;
    const id = farmUI.seed;
    if (!S.seeds[id]) return toast(`No ${CROPS[id].name} seeds — buy some at the Market.`);
    if (!inSeason(id)) return toast(`${CROPS[id].emoji} ${CROPS[id].name} can't be planted in ${season().name}. Try: ${Object.keys(CROPS).filter(c => inSeason(c) && cropUnlocked(c)).map(c => CROPS[c].emoji).join(' ')}`);
    S.seeds[id]--;
    S.stats.planted++;
    t.crop = { id, age: 0 };
  } else if (tool === 'place') {
    const id = farmUI.artifact;
    if (id && id.startsWith('deco:')) {
      const d = id.slice(5);
      if (!S.decor[d]) return toast('No more of that decoration in your box.');
      if (!(t.t === 'grass' || (t.t === 'soil' && !t.crop))) return toast('Decorations need an empty grass or soil tile.');
      S.decor[d]--;
      S.plot[i] = { t: 'deco', id: d };
      if (!S.decor[d]) farmUI.artifact = null;
      return commitFarm();
    }
    if (!id || !unplacedArtifacts().includes(id)) return toast('Choose an artifact from your vault first.');
    if (!(t.t === 'grass' || (t.t === 'soil' && !t.crop))) return toast('Artifacts need an empty grass or soil tile.');
    S.plot[i] = { t: 'artifact', id };
    const a = ARTIFACTS[id];
    toast(`${a.emoji} ${a.name} is now on display! ${bonusText(a.bonus)}`);
    farmUI.artifact = unplacedArtifacts()[0] || null;
    if (!farmUI.artifact) farmUI.tool = 'hoe';
  } else if (tool === 'clear') {
    if (t.t === 'deco') {
      S.decor[t.id] = (S.decor[t.id] || 0) + 1;
      S.plot[i] = { t: 'grass' };
    } else if (t.t === 'artifact') {
      S.plot[i] = { t: 'grass' };
      toast(`${ARTIFACTS[t.id].emoji} returned to your vault.`);
    } else if (t.t === 'soil' && t.crop) {
      t.crop = null;
    } else if (t.t === 'soil') {
      S.plot[i] = { t: 'grass' };
    } else return;
  }
  commitFarm();
}

function noEnergy() {
  toast('⚡ You\'re exhausted! End the day to restore your energy.');
}

function commitFarm() {
  const st = stats();
  if (S.energy > st.maxEnergy) S.energy = st.maxEnergy;
  saveGame();
  renderAll();
}

function endDay() {
  let grown = 0, ready = 0;
  S.plot.forEach(t => {
    if (t.t !== 'soil') return;
    if (t.crop && t.wet && t.crop.age < CROPS[t.crop.id].days) {
      t.crop.age++;
      grown++;
      if (cropReady(t)) ready++;
    }
    t.wet = false;
  });
  S.day++;
  const roll = Math.random();
  S.weather = roll < 0.22 ? (season().id === 'winter' ? 'snow' : 'rain') : roll < 0.3 ? 'cloudy' : 'sunny';
  applyMorningWater();
  const st = stats();
  S.energy = st.maxEnergy;
  if (st.gold) S.coins += st.gold;
  let partnerMsg = '';
  if (S.partner === 'anna') { stash('items', 'potion', 1); partnerMsg = ' 💗 Anna left you a potion.'; }
  if (S.partner === 'cedric') { S.coins += 30; partnerMsg = ' 💗 Cedric added 🪙 30 to the coin jar.'; }
  resetDailyIfNeeded();
  const mentorMsg = mentorMorning() + ' ' + homesteadMorning() + ' ' + storyMorning();
  saveGame();
  renderAll();
  const weatherMsg = { rain: '🌧️ It\'s raining, so every crop is watered!', cloudy: '☁️ A cloudy, calm morning.', sunny: '☀️ A bright sunny morning.', snow: '🌨️ Snow blankets the grove. Crops still need watering.' }[S.weather];
  if (dayOfSeason() === 1) { toast(`${season().icon} <b>${season().name} has arrived!</b> New crops are in season.`, 5000); setMusic(backgroundMusic()); }
  toast(`Day ${S.day}. ${weatherMsg} ${grown ? `${grown} crop${grown > 1 ? 's' : ''} grew${ready ? `, ${ready} ready to harvest` : ''}.` : ''} ${st.gold ? `Artifacts earned 🪙 ${st.gold}.` : ''}${partnerMsg} ${mentorMsg}`, 5000);
  quinnArrivalCheck();
  setTimeout(morningSequence, 600);
}

function tileView(t, i, sprinkled) {
  let cls = 'tile', content = '', title = '';
  if (t.t === 'grass') { cls += ' grass'; title = 'Grass'; }
  else if (t.t === 'rock') { cls += ' grass'; content = `<span class="obj">${t.kind}</span>`; title = t.kind === '🪨' ? 'Rock (hoe ⚡2)' : 'Stump (hoe ⚡2)'; }
  else if (t.t === 'soil') {
    cls += t.wet ? ' soil wet' : ' soil';
    if (t.crop) {
      const c = CROPS[t.crop.id];
      const ready = t.crop.age >= c.days;
      const stage = ready ? c.emoji : t.crop.age === 0 ? '🌱' : t.crop.age / c.days < 0.6 ? '🌿' : '🪴';
      content = `<span class="obj ${ready ? 'ready' : ''}">${stage}</span><span class="grow">${Math.min(t.crop.age, c.days)}/${c.days}</span>`;
      title = `${c.name}: ${ready ? 'ready! Click to harvest' : `day ${t.crop.age}/${c.days}${t.wet ? ' (watered)' : ' (needs water)'}`}`;
    } else title = t.wet ? 'Watered soil' : 'Tilled soil';
  } else if (t.t === 'deco') {
    const d = DECOR[t.id];
    cls += t.id === 'path' ? ' path' : ' grass';
    content = t.id === 'path' ? '' : `<span class="obj">${d.emoji}</span>`;
    title = `${d.name}: ${d.desc}`;
  } else if (t.t === 'artifact') {
    const a = ARTIFACTS[t.id];
    cls += ' grass display' + (a.relic ? ' relic' : '');
    content = `<span class="pedestal"></span><span class="obj art">${a.emoji}</span>`;
    title = `${a.name} — ${bonusText(a.bonus)}`;
  }
  if (sprinkled && t.t !== 'artifact') cls += ' sprinkled';
  return `<button class="${cls}" data-i="${i}" title="${title.replace(/"/g, '&quot;')}">${content}</button>`;
}

function renderFarm() {
  const view = document.getElementById('view-farm');
  const sprinkled = sprinklerTiles();
  const st = stats();
  const b = bonuses();
  const vault = unplacedArtifacts();
  const decoBox = Object.keys(DECOR).filter(id => S.decor[id] > 0);
  if (farmUI.artifact && !vault.includes(farmUI.artifact) && !(farmUI.artifact.startsWith('deco:') && S.decor[farmUI.artifact.slice(5)] > 0)) farmUI.artifact = null;
  if (!farmUI.artifact && vault.length) farmUI.artifact = vault[0];
  const seedIds = Object.keys(CROPS).filter(id => cropUnlocked(id) || S.seeds[id]);
  if (!seedIds.includes(farmUI.seed)) farmUI.seed = seedIds[0];

  view.innerHTML = `
    <div class="farm-layout">
      <div class="farm-main">
        ${tutorialHtml()}
        ${festivalBanner()}
        ${storyBanners()}
        ${heistBanner()}
        <div class="toolbar">
          ${Object.entries(TOOLS).map(([id, tl]) => `<button class="tool ${farmUI.tool === id ? 'active' : ''}" data-tool="${id}" title="${tl.tip}"><span>${tl.icon}</span>${tl.name}</button>`).join('')}
        </div>
        <p class="tool-tip">${TOOLS[farmUI.tool].tip}</p>
        <div class="farm-grid season-${season().id}" style="grid-template-columns:repeat(${PLOT_W},1fr)">
          ${S.plot.map((t, i) => tileView(t, i, sprinkled.has(i))).join('')}
        </div>
        ${greenhouseHtml()}
        <div class="farm-actions">
          <button class="btn" onclick="openKitchen()">🍳 Kitchen</button>
          <button class="btn" onclick="openFishing()">🎣 Go fishing</button>
          ${S.buildings.coop ? `<span class="coop-chip">🐔 ×${S.chickens} · 🥚 ${S.pantry.egg || 0}</span>` : ''}
        </div>
        <button class="btn primary end-day" id="endDayBtn">🌙 End Day ${S.day}</button>
      </div>
      <aside class="farm-side">
        <section class="panel calendar">
          <h3>${season().icon} ${season().name}, Year ${year()}</h3>
          <div class="cal-strip">${[...Array(SEASON_LEN)].map((_, i) => `<span class="cal-day ${i + 1 === dayOfSeason() ? 'today' : ''} ${i + 1 < dayOfSeason() ? 'past' : ''} ${i + 1 === FESTIVAL_DAY ? 'fest' : ''}">${i + 1 === FESTIVAL_DAY ? FESTIVALS[season().id].icon : birthdaysThisSeason().find(w => BIRTHDAYS[w][1] === i + 1) ? '🎂' : i + 1}</span>`).join('')}</div>
          ${birthdaysThisSeason().length ? `<p class="muted small">🎂 ${birthdaysThisSeason().map(w => `${COMPANIONS[w].name} (day ${BIRTHDAYS[w][1]})`).join(', ')}</p>` : ''}
          <p class="muted small">${daysToFestival() === 0 ? `🎉 The <b>${FESTIVALS[season().id].name}</b> is today!` : `Next festival: <b>${FESTIVALS[dayOfSeason() <= FESTIVAL_DAY ? season().id : SEASONS[(seasonIndex() + 1) % 4].id].name}</b> in ${daysToFestival()} day${daysToFestival() === 1 ? '' : 's'}.`} In season: ${Object.keys(CROPS).filter(c => inSeason(c) && cropUnlocked(c)).map(c => CROPS[c].emoji).join(' ') || '—'}</p>
        </section>
        ${S.partner ? `<section class="panel partner-panel" style="background:${COMPANIONS[S.partner].bg}">
          <div class="pp-face">${portraitSVG(S.partner, 'blush', { crop: 'bust' })}</div>
          <div class="bubble"><b>${COMPANIONS[S.partner].name}:</b> ${COMPANIONS[S.partner].morning}</div>
        </section>` : ''}
        <section class="panel">
          <h3>🌱 Seed Pouch</h3>
          <div class="pick-list">
            ${seedIds.map(id => `<button class="pick ${farmUI.seed === id ? 'active' : ''}" data-seed="${id}">${CROPS[id].emoji} ${CROPS[id].name} <b>×${S.seeds[id] || 0}</b><small>${CROPS[id].days} days · ${seasonTags(id)}${inSeason(id) ? '' : ' <b class="oos">out of season</b>'}</small></button>`).join('')}
          </div>
        </section>
        <section class="panel">
          <h3>🏺 Artifact Vault</h3>
          ${vault.length ? `<div class="pick-list">${vault.map(id => `<button class="pick ${farmUI.artifact === id ? 'active' : ''}" data-art="${id}">${ARTIFACTS[id].emoji} ${ARTIFACTS[id].name}<small>${bonusText(ARTIFACTS[id].bonus)}</small></button>`).join('')}</div>
          <p class="muted small">Pick one, then use 🏛️ Display on an empty tile.</p>`
          : `<p class="muted small">${S.artifacts.length ? 'All your artifacts are on display. ✨' : 'Travel through the Time Portal to recover artifacts!'}</p>`}
          ${decoBox.length ? `<h4>🪴 Decor Box</h4><div class="pick-list">${decoBox.map(id => `<button class="pick ${farmUI.artifact === 'deco:' + id ? 'active' : ''}" data-art="deco:${id}">${DECOR[id].emoji} ${DECOR[id].name} <b>×${S.decor[id]}</b><small>${DECOR[id].desc}</small></button>`).join('')}</div>` : ''}
        </section>
        <section class="panel">
          <h3>✨ Active Artifact Powers</h3>
          <ul class="bonus-list">
            <li>⚔️ Attack <b>+${b.atk}</b></li><li>🛡️ Defence <b>+${b.def}</b></li>
            <li>❤️ Max HP <b>+${b.hp}</b></li><li>⚡ Max Energy <b>+${b.energy}</b></li>
            <li>🪙 Coins / day <b>+${b.gold}</b></li><li>💦 Sprinklers <b>${b.sprinkler}</b></li>
          </ul>
          ${b.sets ? `<p class="set-bonus">🏆 Complete era sets on display: <b>${b.sets}</b> (+3 ATK, +3 DEF, +10 coins/day each)</p>` : '<p class="muted small">🏆 Display every artifact from one era together for a set bonus.</p>'}
          <p class="muted small">Only artifacts displayed on your land are active. Sprinkler artifacts water all 8 surrounding tiles each morning.</p>
        </section>
      </aside>
    </div>`;

  view.querySelectorAll('.tile[data-i]').forEach(el => el.onclick = () => handleTile(+el.dataset.i));
  view.querySelectorAll('.tool').forEach(el => el.onclick = () => { farmUI.tool = el.dataset.tool; renderFarm(); });
  view.querySelectorAll('[data-seed]').forEach(el => el.onclick = () => { farmUI.seed = el.dataset.seed; farmUI.tool = 'seed'; renderFarm(); });
  view.querySelectorAll('[data-art]').forEach(el => el.onclick = () => { farmUI.artifact = el.dataset.art; farmUI.tool = 'place'; renderFarm(); });
  document.getElementById('endDayBtn').onclick = endDay;
}
