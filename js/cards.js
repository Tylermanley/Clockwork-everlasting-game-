// ============================================================
//  Clockwork Everlasting — battle cards (Cedric's deck) and Anna's boss lore
// ============================================================
// Card fields: cost, dmg (×ATK), hits, pierce, shieldBreak, block (+DEF×blockDef), heal (fraction of max HP),
//              cleanse, cp, draw, burn, weak, vuln (turns on boss), freeze, exhaust (once per battle), rarity

const CARDS = {
  // Starter deck
  slash:    { name: 'Slash',            art: '🗡️', cost: 1, dmg: 1.0 },
  guard:    { name: 'Guard',            art: '🛡️', cost: 1, block: 5 },
  strike:   { name: 'Temporal Strike',  art: '⚡', cost: 2, dmg: 1.8, pierce: true, shieldBreak: true, rarity: 'rare' },
  // Puzzle rewards — Ancient Egypt
  swarm:    { name: 'Scarab Swarm',     art: '🪲', cost: 1, dmg: 0.45, hits: 3, chain: true },
  sands:    { name: 'Sands of Time',    art: '⏳', cost: 1, block: 6, draw: 1 },
  javelin:  { name: 'Sunfire Javelin',  art: '☀️', cost: 2, dmg: 1.6, burn: 3 },
  // Classical Greece
  owl:      { name: 'Owl\'s Insight',   art: '🦉', cost: 0, draw: 2 },
  phalanx:  { name: 'Phalanx Wall',     art: '🏛️', cost: 2, block: 10, blockDef: 2 },
  thunder:  { name: 'Zeus\'s Thunderbolt', art: '🌩️', cost: 2, dmg: 2.0, vuln: 2, rarity: 'rare' },
  // Medieval Europe
  knight:   { name: 'Knight\'s Charge', art: '🐴', cost: 2, dmg: 1.4, block: 5 },
  holy:     { name: 'Holy Light',       art: '✨', cost: 2, heal: 0.22, cleanse: true, exhaust: true },
  flask:    { name: 'Dragonfire Flask', art: '🔥', cost: 1, dmg: 0.6, burn: 4 },
  // Feudal Japan
  tea:      { name: 'Tea Ceremony',     art: '🍵', cost: 0, cp: 1, draw: 1 },
  lantern:  { name: 'Lantern Ward',     art: '🏮', cost: 1, block: 4, weak: 2 },
  iai:      { name: 'Iaijutsu',         art: '⚔️', cost: 3, dmg: 3.2, pierce: true, rarity: 'rare' },
  // Renaissance
  gambit:   { name: 'Clockwork Gambit', art: '⚙️', cost: 1, dmg: 0.7, hits: 2, draw: 1, chain: true },
  glider:   { name: 'Flying Machine',   art: '🪁', cost: 2, dmg: 1.0, block: 8 },
  master:   { name: 'Masterstroke',     art: '🎨', cost: 3, dmg: 2.2, vuln: 2, weak: 2, rarity: 'rare' },
  // Viking Scandinavia
  qgambit:  { name: 'Queen\'s Gambit',  art: '♛', cost: 1, dmg: 0.8, draw: 1, chain: true },
  feast:    { name: 'Mead Feast',       art: '🍖', cost: 1, heal: 0.1, block: 5 },
  axe:      { name: 'Bearded Axe',      art: '🪓', cost: 2, dmg: 2.0 },
  // Tang Dynasty China
  silkveil: { name: 'Silk Veil',        art: '🧣', cost: 1, block: 7, weak: 1 },
  checkmate:{ name: 'Checkmate',        art: '♚', cost: 3, dmg: 2.4, pierce: true, rarity: 'rare' },
  crackers: { name: 'Firecrackers',     art: '🧨', cost: 1, dmg: 0.35, hits: 4, burn: 2 },
  // Aztec Empire
  cacaoc:   { name: 'Cacao Elixir',     art: '🍫', cost: 0, heal: 0.06, cp: 1, exhaust: true },
  obsidian: { name: 'Obsidian Edge',    art: '🌑', cost: 2, dmg: 1.7, vuln: 1 },
  sunstone: { name: 'Sun Stone Ward',   art: '🔆', cost: 2, block: 9, burn: 2 },
  // Ancient Mesopotamia
  ziggurat: { name: 'Ziggurat Wall',    art: '🧱', cost: 2, block: 11, blockDef: 1.5 },
  gardens:  { name: 'Hanging Gardens',  art: '🌿', cost: 2, heal: 0.18, draw: 1 },
  hammurabi:{ name: 'Code of Hammurabi', art: '⚖️', cost: 2, dmg: 1.3, weak: 2, vuln: 2, rarity: 'rare' },
  // Boss trophies
  wolfpack: { name: 'Wolf Pack',        art: '🐺', cost: 2, dmg: 0.6, hits: 3, vuln: 1, rarity: 'legendary' },
  clones:   { name: 'Hair Clones',      art: '🐒', cost: 2, dmg: 0.4, hits: 5, rarity: 'legendary' },
  serpent:  { name: 'Serpent\'s Venom', art: '🐍', cost: 1, dmg: 0.8, burn: 4, rarity: 'legendary' },
  gilgamesh:{ name: 'Gilgamesh\'s Might', art: '💪', cost: 3, dmg: 2.6, block: 8, rarity: 'legendary' },
  ra:       { name: 'Wrath of Ra',      art: '🌞', cost: 3, dmg: 3.0, burn: 3, rarity: 'legendary' },
  fury:     { name: 'Minotaur\'s Fury', art: '🐂', cost: 2, dmg: 1.1, hits: 2, vuln: 1, chain: true, rarity: 'legendary' },
  bulwark:  { name: 'Dragonscale Bulwark', art: '🐲', cost: 2, block: 12, blockDef: 2, rarity: 'legendary' },
  oniwrath: { name: 'Oni\'s Wrath',     art: '👺', cost: 1, dmg: 1.9, exhaust: true, rarity: 'legendary' },
  overclock:{ name: 'Overclock',        art: '🔧', cost: 0, cp: 2, exhaust: true, rarity: 'legendary' },
  eternity: { name: 'Eternal Moment',   art: '⌛', cost: 0, freeze: true, exhaust: true, rarity: 'legendary' },
  glacial:  { name: 'Glacial Lance',    art: '🧊', cost: 2, dmg: 1.5, weak: 2, vuln: 1, rarity: 'legendary' },
  krakenc:  { name: 'Kraken\'s Embrace', art: '🐙', cost: 3, dmg: 2.4, block: 10, rarity: 'legendary' },
  // Cedric's wares
  grog:     { name: 'Captain\'s Grog',  art: '🍺', cost: 1, heal: 0.1, draw: 1 },
  chart:    { name: 'Navigator\'s Chart', art: '🗺️', cost: 0, draw: 2, exhaust: true },
  cannon:   { name: 'Cannon Volley',    art: '💣', cost: 2, dmg: 0.5, hits: 4, shieldBreak: true },
  rewind:   { name: 'Rewind',           art: '⏪', cost: 2, heal: 0.3, cleanse: true, exhaust: true, rarity: 'rare' },
  freeze:   { name: 'Freeze Time',      art: '❄️', cost: 3, freeze: true, exhaust: true, rarity: 'rare' },
  anchor:   { name: 'Anchor Drop',      art: '⚓', cost: 2, dmg: 1.3, block: 6, rarity: 'rare' },
  // Chain combo cards (Rift rewards & Peter's exchange)
  flurry:   { name: 'Flurry',           art: '🌀', cost: 1, dmg: 0.6, chain: true },
  followup: { name: 'Follow-Through',   art: '💫', cost: 1, dmg: 0.9, chain: true, draw: 1, rarity: 'rare' },
  crescendo:{ name: 'Crescendo',        art: '🎼', cost: 2, dmg: 1.4, chain: true, vuln: 1, rarity: 'rare' },
  revenge:  { name: 'Black Gull\'s Revenge', art: '🏴‍☠️', cost: 2, dmg: 1.2, hits: 2, burn: 2, chain: true, rarity: 'legendary' },
  frostnote:{ name: 'Frost Footnote',   art: '📘', cost: 0, draw: 1, weak: 1 },
  // Romance
  promise:  { name: 'Lovers\' Promise', art: '💞', cost: 1, heal: 0.15, block: 8, rarity: 'legendary' },
};

const STARTER_DECK = { slash: 4, guard: 4, strike: 1 };
const DECK_MIN = 8, DECK_MAX = 20;

const PUZZLE_CARDS = {
  'egypt-1': 'swarm', 'egypt-2': 'sands', 'egypt-3': 'javelin',
  'greece-1': 'owl', 'greece-2': 'phalanx', 'greece-3': 'thunder',
  'medieval-1': 'knight', 'medieval-2': 'holy', 'medieval-3': 'flask',
  'japan-1': 'tea', 'japan-2': 'lantern', 'japan-3': 'iai',
  'renaissance-1': 'gambit', 'renaissance-2': 'glider', 'renaissance-3': 'master',
  'viking-1': 'qgambit', 'viking-2': 'feast', 'viking-3': 'axe',
  'tang-1': 'silkveil', 'tang-2': 'checkmate', 'tang-3': 'crackers',
  'aztec-1': 'cacaoc', 'aztec-2': 'obsidian', 'aztec-3': 'sunstone',
  'mesopotamia-1': 'ziggurat', 'mesopotamia-2': 'gardens', 'mesopotamia-3': 'hammurabi',
};
const BOSS_CARDS = { egypt: 'ra', greece: 'fury', medieval: 'bulwark', japan: 'oniwrath', renaissance: 'overclock', viking: 'wolfpack', tang: 'clones', aztec: 'serpent', mesopotamia: 'gilgamesh', end: 'eternity', winters: 'glacial', jane: 'krakenc' };

// Cedric's shop: price and the hearts needed before he'll sell it
const SHOP_CARDS = [
  { id: 'slash', price: 35, hearts: 0 },
  { id: 'guard', price: 35, hearts: 0 },
  { id: 'grog', price: 80, hearts: 0 },
  { id: 'chart', price: 90, hearts: 1 },
  { id: 'cannon', price: 120, hearts: 2 },
  { id: 'rewind', price: 150, hearts: 3 },
  { id: 'freeze', price: 200, hearts: 4 },
  { id: 'anchor', price: 170, hearts: 5 },
];

// Anna's research notes on each guardian
const BOSS_HINTS = {
  egypt: [
    'The Sphinx always poses its riddle the turn before Sunbeam. When you see "Riddle of Ages", attack freely, then stack Guard cards the next turn.',
    'Below half health it casts Sandstorm, which weakens your attacks. Spend weakened turns blocking rather than striking.',
    'Sunfire Javelin\'s burn keeps ticking while you defend. It\'s perfect for this fight.',
  ],
  greece: [
    'The Minotaur lowers its horns before Labyrinth Charge, which is triple damage! Phalanx Wall was practically made for that moment.',
    'At half health it flies into a Blood Rage that boosts its attack for good. Save your strongest cards to finish it quickly after that.',
    'Zeus\'s Thunderbolt exposes it so it takes 50% more damage. Play it before your big hits.',
  ],
  medieval: [
    'The Iron Dragon\'s fire breath burns you for several turns. Holy Light, Rewind or my Remedy will cleanse it.',
    'In its second phase it hardens its scales into a shield. Temporal Strike and Cannon Volley break shields twice as fast.',
    'Watch for "Deep Inhale". Inferno follows immediately, so block heavily!',
  ],
  japan: [
    'Never attack the Oni while it holds Counter Stance! Attack cards get countered for heavy damage. Block, heal, or play skills instead.',
    'Its War Cry raises its attack permanently. Lantern Ward weakens it to blunt the extra power.',
    'In phase two it focuses before Executioner\'s Arc. That is the moment for Freeze Time.',
  ],
  renaissance: [
    'The Colossus deploys barriers often. Shield-breaking cards are essential, so bring Temporal Strike and Cannon Volley.',
    'It can repair itself. Burst damage with Exposed and burn will out-pace its repairs.',
    'After "Focus Lens" comes Solar Lance, its strongest attack. Freeze it or stack every Block card you have.',
  ],
  viking: [
    'Fenrir crouches before its Ragnarök Lunge. That\'s your cue to stack Block or play Freeze Time.',
    'Pack Fury is four quick bites. Block is applied to each one, so even small Block cards help a lot.',
    'Its Thick Winter Pelt is a shield. Shield-breakers like Temporal Strike and Cannon Volley cut right through.',
  ],
  tang: [
    'The Monkey King\'s Cloud Somersault is a counter stance. Don\'t attack while he\'s spinning on his cloud!',
    'He steals peaches to heal himself. Burn and Expose help you out-pace him.',
    'When his staff starts to grow, the Ruyi Staff Smash comes next. Brace yourself!',
  ],
  aztec: [
    'Quetzalcoatl\'s Jade Venom burns for three turns. Bring Holy Light, Rewind or Anna\'s Remedy to cleanse it.',
    'Before Solar Eclipse it swallows the sun, and the whole sky goes dark. Freeze Time or stack Block!',
    'In phase two it coils often. Patience: block during the coil, then strike.',
  ],
  mesopotamia: [
    'The Bull of Heaven\'s thunder both hits hard AND burns. Block heavily when it gathers the storm.',
    'Ishtar\'s Fury raises its attack permanently. Lady Alice\'s Royal Decree can wipe that away!',
    'Its Celestial Hide shield returns often. Keep shield-breaking cards in your deck.',
  ],
  end: [
    'The Devourer uses every trick we\'ve seen: shields, counters, charges, burns, healing. Build a balanced deck.',
    'Its Paradox Guard counters attacks just like the Oni. Patience wins this fight.',
    'Eternal Moment and Freeze Time can erase an Epoch Collapse entirely. Please… come back to me safely.',
  ],
  winters: [
    'Peter\'s Pickpocket steals a card from your deck for the rest of the fight. Play your strongest cards early, before he can swipe them!',
    'His Smug Riposte counters attack cards, just like the Oni. Block, heal or play skills while he poses.',
    'When he starts to Lecture, Glacial Lance comes next. Freeze him mid-sentence. He would absolutely hate that.',
  ],
  jane: [
    'Lady Jane\'s Plunder steals ALL of your Block and turns it into her own shield! When she\'s about to plunder, attack instead of blocking.',
    'She calls the Kraken before her strongest attack. That\'s the turn to stack Block or play Freeze Time.',
    'She swigs grog to heal and raises the Black Flag at half health. Burn and Expose will help you out-pace her. Cedric says she hates being out-smarted.',
  ],
};

// ---------- helpers ----------
function cardType(c) {
  if (c.dmg) return 'attack';
  if (c.block && !c.heal) return 'defend';
  return 'skill';
}

function blockAmount(c, def) { return c.block + Math.round(def * (c.blockDef || 1)); }

function cardDesc(c, st) {
  const parts = [];
  if (c.dmg) {
    const n = Math.max(1, Math.round(st.atk * c.dmg));
    parts.push(`Deal <b>${n}</b>${c.hits > 1 ? `×${c.hits}` : ''} damage${c.pierce ? ', ignores DEF' : ''}.`);
  }
  if (c.shieldBreak) parts.push('2× vs shields.');
  if (c.block) parts.push(`Gain <b>${blockAmount(c, st.def)}</b> Block.`);
  if (c.heal) parts.push(`Heal <b>${Math.round(c.heal * 100)}%</b> HP.`);
  if (c.cleanse) parts.push('Cleanse ailments.');
  if (c.cp) parts.push(`Gain <b>${c.cp}</b> CP.`);
  if (c.draw) parts.push(`Draw <b>${c.draw}</b>.`);
  if (c.burn) parts.push(`Burn <b>${c.burn}</b> turns.`);
  if (c.weak) parts.push(`Weaken <b>${c.weak}</b>.`);
  if (c.vuln) parts.push(`Expose <b>${c.vuln}</b>.`);
  if (c.freeze) parts.push('Boss loses its next action.');
  if (c.chain) parts.push('<b>Chain:</b> +50% if you already attacked this turn.');
  if (c.exhaust) parts.push('<i>Once per battle.</i>');
  return parts.join(' ');
}

// ---------- Lady Alice's Masterclass upgrades ----------
function upgradeLevel(id) { return (S && S.upgrades && S.upgrades[id]) || 0; }
function canUpgrade(id) { const c = CARDS[id]; return !!(c.dmg || c.block || c.heal); }
function effCard(id) {
  const base = CARDS[id];
  const gold = !!(S && S.golden && S.golden[id]);
  const lv = upgradeLevel(id) + (gold ? 1 : 0);
  if (!lv) return base;
  const m = 1 + 0.25 * lv;
  const c = Object.assign({}, base, { name: (gold ? '✦ ' : '') + base.name + '+'.repeat(upgradeLevel(id)) });
  if (c.dmg) c.dmg = base.dmg * m;
  if (c.block) c.block = Math.round(base.block * m);
  if (c.heal) c.heal = base.heal * m;
  return c;
}

function cardHTML(id, opts = {}) {
  const c = effCard(id);
  const st = opts.st || stats();
  const type = cardType(c);
  const attrs = opts.k !== undefined ? `data-k="${opts.k}"` : `data-card="${id}"`;
  const tag = opts.button ? 'button' : 'div';
  return `<${tag} class="card ${type} ${c.rarity || 'common'} ${upgradeLevel(id) ? 'upgraded' : ''} ${S && S.golden && S.golden[id] ? 'golden' : ''} ${opts.cls || ''}" ${attrs} ${opts.disabled ? 'disabled' : ''} ${opts.style ? `style="${opts.style}"` : ''}>
    <span class="card-cost">${c.cost}</span>
    ${opts.count !== undefined ? `<span class="card-count">×${opts.count}</span>` : ''}
    <span class="card-art">${c.art}</span>
    <span class="card-name">${c.name}</span>
    <span class="card-desc">${cardDesc(c, st)}</span>
  </${tag}>`;
}
