// ============================================================
//  Clockwork Everlasting — Anna's Adventure Journal (achievements & titles)
// ============================================================

const ACHIEVEMENTS = [
  { id: 'harvest1',  icon: '🌾', name: 'First Harvest',       desc: 'Harvest your first crop.',                  reward: 20,   title: 'Greenhorn',        check: () => S.stats.harvested >= 1 },
  { id: 'harvest50', icon: '🧺', name: 'Bountiful',           desc: 'Harvest 50 crops.',                         reward: 300,  title: 'Master Farmer',    check: () => S.stats.harvested >= 50 },
  { id: 'art1',      icon: '🏺', name: 'Curious Find',        desc: 'Recover your first artifact.',              reward: 25,   check: () => S.artifacts.length >= 1 },
  { id: 'art20',     icon: '🏛️', name: 'Curator',             desc: 'Own 20 artifacts.',                         reward: 300,  title: 'Curator',          check: () => S.artifacts.length >= 20 },
  { id: 'artall',    icon: '👑', name: 'Keeper of Ages',      desc: 'Own every artifact, including festival keepsakes.', reward: 1000, title: 'Keeper of Ages', check: () => Object.keys(ARTIFACTS).every(id => S.artifacts.includes(id)) },
  { id: 'boss1',     icon: '⚔️', name: 'Guardian Slayer',     desc: 'Defeat your first boss.',                   reward: 100,  title: 'Guardian Slayer',  check: () => Object.keys(S.bosses).length >= 1 },
  { id: 'erasall',   icon: '🌀', name: 'Master of Time',      desc: 'Defeat the guardian of every era.',         reward: 600,  title: 'Master of Time',   check: () => ERAS.filter(e => !e.final).every(e => S.bosses[e.id]) },
  { id: 'villains',  icon: '🏴‍☠️', name: 'Heist Breaker',      desc: 'Defeat Peter Winters and Lady Jane.',       reward: 800,  title: 'Heist Breaker',    check: () => S.bosses.winters && S.bosses.jane },
  { id: 'cards25',   icon: '🃏', name: 'Card Sharp',          desc: 'Own 25 different battle cards.',            reward: 250,  title: 'Card Sharp',       check: () => Object.keys(S.cards).filter(id => S.cards[id]).length >= 25 },
  { id: 'upgrade',   icon: '🎓', name: 'Star Pupil',          desc: 'Upgrade a card in Lady Alice\'s Masterclass.', reward: 80, check: () => Object.keys(S.upgrades).length >= 1 },
  { id: 'tycoon',    icon: '💰', name: 'Tycoon',              desc: 'Have 5,000 coins between your purse and the bank.', reward: 500, title: 'Tycoon',  check: () => S.coins + S.bank >= 5000 },
  { id: 'venture',   icon: '📈', name: 'Shrewd Investor',     desc: 'Complete a successful trade venture.',      reward: 100,  check: () => S.stats.ventureWins >= 1 },
  { id: 'partner',   icon: '💍', name: 'Beloved',             desc: 'Become partners with someone special.',     reward: 200,  title: 'Beloved',          check: () => !!S.partner },
  { id: 'protege',   icon: '🎖️', name: 'Protégé',             desc: 'Reach 8★ rapport with a mentor.',           reward: 300,  title: 'Protégé',          check: () => hearts('alice') >= 8 || hearts('quinn') >= 8 },
  { id: 'fest1',     icon: '🎉', name: 'Festival Goer',       desc: 'Attend a seasonal festival.',               reward: 50,   check: () => S.stats.festivals >= 1 },
  { id: 'fest4',     icon: '🎊', name: 'Festival Spirit',     desc: 'Attend four festivals.',                    reward: 300,  title: 'Life of the Party', check: () => S.stats.festivals >= 4 },
  { id: 'chess',     icon: '♟️', name: 'Grandmaster',         desc: 'Solve 3 chess puzzles.',                    reward: 200,  title: 'Grandmaster',      check: () => (S.stats.puzzleTypes.chess || 0) >= 3 },
  { id: 'recall',    icon: '🧠', name: 'Photographic Memory', desc: 'Solve 2 Memory Palace puzzles.',            reward: 150,  check: () => (S.stats.puzzleTypes.recall || 0) >= 2 },
  { id: 'banquet',   icon: '🍽️', name: 'Perfect Host',        desc: 'Solve 2 Banquet Table puzzles.',            reward: 150,  title: 'Perfect Host',     check: () => (S.stats.puzzleTypes.banquet || 0) >= 2 },
  { id: 'puzzles',   icon: '🧩', name: 'Puzzle Sage',         desc: 'Clear every puzzle in every era.',          reward: 600,  title: 'Puzzle Sage',      check: () => ERAS.every(e => e.puzzles.every(p => S.puzzles[p.id])) },
  { id: 'level10',   icon: '⭐', name: 'Seasoned Hero',       desc: 'Reach level 10.',                           reward: 200,  check: () => S.hero.level >= 10 },
  { id: 'winter',    icon: '⛄', name: 'First Snow',          desc: 'Reach your first winter.',                  reward: 50,   check: () => S.day > SEASON_LEN * 3 },
  { id: 'year2',     icon: '📅', name: 'Old Hand',            desc: 'Reach Year 2.',                             reward: 300,  title: 'Old Hand',         check: () => year() >= 2 },
];

function checkAchievements() {
  let any = false;
  ACHIEVEMENTS.forEach(a => {
    if (S.achievements[a.id] || !a.check()) return;
    S.achievements[a.id] = S.day;
    S.coins += a.reward;
    any = true;
    sfx('achieve');
    toast(`📔 <b>Journal: ${a.icon} ${a.name}</b>${a.reward ? ` · 🪙 +${a.reward}` : ''}${a.title ? ` · Title unlocked: “${a.title}”` : ''}`, 4500);
  });
  if (any) { saveGame(); renderHeader(); }
}

function setTitle(t) { S.title = t || null; saveGame(); renderAll(); }

function journalHtml() {
  const done = ACHIEVEMENTS.filter(a => S.achievements[a.id]);
  const titles = done.filter(a => a.title).map(a => a.title);
  return `
    <section class="panel journal">
      <div class="journal-head">
        ${portraitSVG('anna', 'smile', { crop: 'head', cls: 'mini' })}
        <div><h3>📔 Anna's Adventure Journal</h3><p class="muted small">"I write down every remarkable thing you do. It's becoming a very thick book!" · ${done.length}/${ACHIEVEMENTS.length} entries</p></div>
        <label class="title-pick">🎖️ Title
          <select onchange="setTitle(this.value)"><option value="">(none)</option>${titles.map(t => `<option ${S.title === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
        </label>
      </div>
      <div class="progress"><div style="width:${(done.length / ACHIEVEMENTS.length) * 100}%"></div></div>
      <div class="ach-grid">
        ${ACHIEVEMENTS.map(a => `<div class="ach ${S.achievements[a.id] ? 'got' : ''}">
          <span class="ach-icon">${S.achievements[a.id] ? a.icon : '🔒'}</span>
          <div><b>${a.name}</b><small>${a.desc}</small><small class="ach-reward">${a.reward ? `🪙${a.reward}` : ''}${a.title ? ` · “${a.title}”` : ''}${S.achievements[a.id] ? ` · Day ${S.achievements[a.id]}` : ''}</small></div>
        </div>`).join('')}
      </div>
    </section>`;
}
