// ============================================================
//  Clockwork Everlasting — static game data
// ============================================================

const CROPS = {
  wheat:   { name: 'Time Wheat',      emoji: '🌾', days: 2, cost: 10, sell: 24,  unlock: null,       seasons: ['spring', 'summer', 'autumn'] },
  carrot:  { name: 'Epoch Carrot',    emoji: '🥕', days: 3, cost: 15, sell: 40,  unlock: null,       seasons: ['spring', 'autumn', 'winter'] },
  grape:   { name: 'Olympian Grape',  emoji: '🍇', days: 3, cost: 25, sell: 62,  unlock: 'egypt',    seasons: ['summer', 'autumn'] },
  pumpkin: { name: 'Harvest Pumpkin', emoji: '🎃', days: 4, cost: 40, sell: 105, unlock: 'greece',   seasons: ['autumn', 'winter'] },
  blossom: { name: 'Sakura Blossom',  emoji: '🌸', days: 4, cost: 55, sell: 140, unlock: 'medieval', seasons: ['spring'] },
  melon:   { name: 'Chrono Melon',    emoji: '🍉', days: 6, cost: 80, sell: 240, unlock: 'japan',    seasons: ['summer'] },
  berry:   { name: 'Frost Lingonberry', emoji: '🫐', days: 3, cost: 45, sell: 115, unlock: 'viking', seasons: ['autumn', 'winter'] },
  peach:   { name: 'Immortal Peach',  emoji: '🍑', days: 5, cost: 70, sell: 200, unlock: 'tang',     seasons: ['spring', 'summer'] },
  corn:    { name: 'Sun Maize',       emoji: '🌽', days: 4, cost: 60, sell: 165, unlock: 'aztec',    seasons: ['summer', 'autumn'] },
};

const SEASONS = [
  { id: 'spring', name: 'Spring', icon: '🌸' },
  { id: 'summer', name: 'Summer', icon: '☀️' },
  { id: 'autumn', name: 'Autumn', icon: '🍂' },
  { id: 'winter', name: 'Winter', icon: '❄️' },
];
const SEASON_LEN = 10;

// Bonus keys: atk, def, hp, energy (max energy), gold (coins per day), sprinkler (waters 8 neighbours each morning)
const ARTIFACTS = {
  // Ancient Egypt
  scarab:    { name: 'Golden Scarab',        emoji: '🪲', era: 'egypt',       bonus: { def: 1 },              desc: 'A sacred beetle amulet said to ward off misfortune.' },
  papyrus:   { name: 'Papyrus of Thoth',     emoji: '📜', era: 'egypt',       bonus: { energy: 3 },           desc: 'A scroll of hieratic script recording the flooding of the Nile.' },
  canopic:   { name: 'Canopic Urn',          emoji: '⚱️', era: 'egypt',       bonus: { gold: 5 },             desc: 'A carved alabaster vessel from a noble\'s tomb.' },
  sundisk:   { name: 'Sun Disk of Ra',       emoji: '🌞', era: 'egypt',       bonus: { atk: 2, sprinkler: 1 }, desc: 'Relic of the Sphinx. Its warmth coaxes nearby crops to drink the morning dew.', relic: true },
  // Classical Greece
  owl:       { name: 'Owl Drachma',          emoji: '🦉', era: 'greece',      bonus: { gold: 8 },             desc: 'A silver Athenian coin stamped with Athena\'s owl.' },
  helm:      { name: 'Bronze Hoplite Helm',  emoji: '🪖', era: 'greece',      bonus: { def: 2 },              desc: 'Worn by a citizen-soldier in the phalanx.' },
  amphora:   { name: 'Painted Amphora',      emoji: '🏺', era: 'greece',      bonus: { sprinkler: 1 },        desc: 'A black-figure jar that never seems to run dry.' },
  horn:      { name: 'Horn of the Labyrinth', emoji: '📯', era: 'greece',     bonus: { atk: 3, hp: 15 },      desc: 'Relic of the Minotaur. It still echoes with the maze\'s roar.', relic: true },
  // Medieval Europe
  codex:     { name: 'Illuminated Codex',    emoji: '📖', era: 'medieval',    bonus: { energy: 4 },           desc: 'Hand-copied by monks, its margins glitter with gold leaf.' },
  shield:    { name: 'Kite Shield',          emoji: '🛡️', era: 'medieval',    bonus: { def: 3 },              desc: 'A tall Norman shield bearing a faded heraldic lion.' },
  chalice:   { name: 'Royal Chalice',        emoji: '🏆', era: 'medieval',    bonus: { hp: 20 },              desc: 'A jewelled cup from a king\'s coronation feast.' },
  scale:     { name: 'Iron Dragon Scale',    emoji: '🐲', era: 'medieval',    bonus: { atk: 4, def: 2 },      desc: 'Relic of the Iron Dragon. Warm to the touch, harder than steel.', relic: true },
  // Feudal Japan
  tea:       { name: 'Raku Tea Bowl',        emoji: '🍵', era: 'japan',       bonus: { hp: 25 },              desc: 'Hand-shaped for the tea ceremony; beautifully imperfect.' },
  dolls:     { name: 'Hina Dolls',           emoji: '🎎', era: 'japan',       bonus: { gold: 12 },            desc: 'An emperor and empress displayed each spring for good fortune.' },
  katana:    { name: 'Master\'s Katana',     emoji: '🗡️', era: 'japan',       bonus: { atk: 4 },              desc: 'Folded steel with a rippling hamon line.' },
  onimask:   { name: 'Oni Warlord Mask',     emoji: '👺', era: 'japan',       bonus: { atk: 3, hp: 20, sprinkler: 1 }, desc: 'Relic of the Oni Warlord. Rain clouds gather wherever it gazes.', relic: true },
  // Renaissance
  astrolabe: { name: 'Brass Astrolabe',      emoji: '🧭', era: 'renaissance', bonus: { energy: 5 },           desc: 'Used to chart stars and find one\'s way across the sea.' },
  sketch:    { name: 'Inventor\'s Codex',    emoji: '📐', era: 'renaissance', bonus: { sprinkler: 1, def: 1 }, desc: 'Mirror-written sketches of flying machines and water pumps.' },
  portrait:  { name: 'Lost Masterpiece',     emoji: '🖼️', era: 'renaissance', bonus: { gold: 20 },            desc: 'A portrait with an enigmatic smile, thought lost for centuries.' },
  heart:     { name: 'Clockwork Heart',      emoji: '⚙️', era: 'renaissance', bonus: { atk: 5, def: 3, hp: 30 }, desc: 'Relic of the Colossus. It ticks in time with your own pulse.', relic: true },
  // Viking Scandinavia
  chessmen:  { name: 'Lewis Chessmen',       emoji: '♟️', era: 'viking',      bonus: { def: 2, energy: 2 },  desc: 'Walrus-ivory chess pieces with wide, worried eyes, carved by Norse craftsmen.' },
  mjolnir:   { name: 'Thor\'s Hammer Amulet', emoji: '🔨', era: 'viking',     bonus: { atk: 3 },             desc: 'A silver pendant worn for protection on long sea voyages.' },
  runestone: { name: 'Carved Runestone',     emoji: '🪧', era: 'viking',      bonus: { gold: 10 },           desc: 'Its runes honour a chieftain who sailed to distant lands.' },
  gleipnir:  { name: 'Gleipnir Ribbon',      emoji: '🎀', era: 'viking',      bonus: { atk: 4, def: 3 },     desc: 'Relic of Fenrir. Woven from impossible things: a cat\'s footfall and a mountain\'s roots.', relic: true },
  // Tang Dynasty China
  silk:      { name: 'Imperial Silk Scarf',  emoji: '🧣', era: 'tang',        bonus: { hp: 20 },             desc: 'Woven on the looms of Chang\'an and traded along the Silk Road.' },
  jadeseal:  { name: 'Jade Imperial Seal',   emoji: '💠', era: 'tang',        bonus: { gold: 15 },           desc: 'Pressed in red ink onto every edict of the court.' },
  bell:      { name: 'Bronze Temple Bell',   emoji: '🔔', era: 'tang',        bonus: { energy: 4, sprinkler: 1 }, desc: 'Its deep tone was said to call down gentle rain.' },
  beads:     { name: 'Monk\'s Prayer Beads', emoji: '📿', era: 'tang',        bonus: { hp: 30, energy: 5 },  desc: 'Relic of the Monkey King, given up with a grin and a bow.', relic: true },
  // Aztec Empire
  cacao:     { name: 'Royal Cacao Vessel',   emoji: '🍫', era: 'aztec',       bonus: { energy: 4, gold: 8 }, desc: 'Frothy chocolate drinks were a luxury fit for emperors.' },
  headdress: { name: 'Quetzal Headdress',    emoji: '🪶', era: 'aztec',       bonus: { def: 3 },             desc: 'Shimmering green feathers of the sacred quetzal bird.' },
  mirror:    { name: 'Obsidian Mirror',      emoji: '🪞', era: 'aztec',       bonus: { atk: 3, hp: 15 },     desc: 'Polished volcanic glass, used by priests to see beyond the veil.' },
  mask:      { name: 'Turquoise Mosaic Mask', emoji: '🎭', era: 'aztec',      bonus: { atk: 5, sprinkler: 1 }, desc: 'Relic of the Feathered Serpent. Wind and rain follow its gaze.', relic: true },
  // Ancient Mesopotamia
  urgame:    { name: 'Royal Game of Ur',     emoji: '🎲', era: 'mesopotamia', bonus: { energy: 3, def: 2 },  desc: 'One of the oldest board games ever found, inlaid with shell and lapis.' },
  lamp:      { name: 'Babylonian Oil Lamp',  emoji: '🪔', era: 'mesopotamia', bonus: { gold: 15 },           desc: 'It lit the terraces of the legendary Hanging Gardens.' },
  tablet:    { name: 'Cuneiform Tablet',     emoji: '🧱', era: 'mesopotamia', bonus: { hp: 25, atk: 2 },     desc: 'Wedge-shaped writing pressed into clay: a recipe for beer, as it turns out.' },
  ishtar:    { name: 'Star of Ishtar',       emoji: '🌟', era: 'mesopotamia', bonus: { atk: 5, def: 5, gold: 15 }, desc: 'Relic of the Bull of Heaven. It glows like the evening star.', relic: true },
  // Festival keepsakes
  bouquet:   { name: 'Blossom Fair Bouquet', emoji: '💐', era: 'festival',    bonus: { energy: 3, gold: 5 }, desc: 'A keepsake from Anna\'s Blossom & Book Fair.' },
  medal:     { name: 'Regatta Gold Medal',   emoji: '🏅', era: 'festival',    bonus: { atk: 3 },             desc: 'First place at the Gilded Gull Regatta!' },
  rosette:   { name: 'Harvest Gala Rosette', emoji: '🏵️', era: 'festival',    bonus: { hp: 20, gold: 10 },   desc: 'Lady Alice\'s blue-ribbon prize for the finest crop in the land.' },
  candelabra:{ name: 'Starlight Candelabra', emoji: '🕯️', era: 'festival',    bonus: { def: 3, energy: 3 },  desc: 'Won at the Royal Treasury Auction, outbidding Peter Winters himself.' },
  goldenegg: { name: 'Golden Chrono Egg',    emoji: '🥚', era: 'festival',    bonus: { gold: 25, hp: 10 },   desc: 'Laid by one of your chickens. It ticks faintly, like a tiny clock.' },
  weddingbell:{ name: 'Wedding Bell',        emoji: '💒', era: 'festival',    bonus: { hp: 30, gold: 20 },   desc: 'Rung on the happiest day in the grove\'s history.' },
  spyglass:  { name: 'Jane\'s Spyglass',     emoji: '🔭', era: 'festival',    bonus: { energy: 4, def: 2 },  desc: 'Recovered from Jane\'s lost hoard. It always points toward adventure.' },
  // Final bosses
  frostcrown: { name: 'Winters Frost Crown',  emoji: '👑', era: 'winters',   bonus: { atk: 4, def: 4, energy: 5 }, desc: 'Peter\'s heirloom circlet, rimed with permanent frost. He dropped it while fleeing.', relic: true },
  blackflag:  { name: 'Jane\'s Black Flag',   emoji: '🏴‍☠️', era: 'jane',    bonus: { atk: 6, gold: 40, sprinkler: 1 }, desc: 'The old Pirate Queen\'s colours, given freely in respect. Storm clouds water your fields.', relic: true },
  // End of Time
  hourglass: { name: 'Hourglass of Eternity', emoji: '⏳', era: 'end',        bonus: { atk: 5, def: 5, hp: 50, energy: 10, gold: 50, sprinkler: 1 }, desc: 'The Devourer\'s core. With it, every moment of history is safe.', relic: true },
};

const LOCKET = { name: 'Chrono Locket', emoji: '💍', cost: 400, desc: 'A locket whose clock hands point to the same moment. Give it to a companion at 8♥ to become partners.' };

const SHOP_ITEMS = {
  potion:   { name: 'Herbal Potion', emoji: '🧪', cost: 30, desc: 'Restores 40 HP in battle.' },
  hipotion: { name: 'Royal Elixir',  emoji: '🍶', cost: 85, desc: 'Restores 120 HP in battle.' },
  tonic:    { name: 'Chrono Tonic',  emoji: '🔋', cost: 60, desc: 'Grants +3 Chrono Points in battle.' },
};

// ---------- Boss move kinds ----------
// attack: {mult, hits}   charge: telegraph   buff: {atkUp}   shield: {pct}
// burn: {mult, turns}    weaken: {mult, turns}   stance: counter if attacked   heal: {pct}

const ERAS = [
  {
    id: 'egypt', name: 'Ancient Egypt', year: 'c. 1300 BCE', icon: '🐪',
    color: '#d9a441', bg: 'linear-gradient(160deg,#f7d98b 0%,#e0a84e 55%,#9c6427 100%)',
    blurb: 'Golden sands, towering monuments and tombs sealed for millennia.',
    pool: ['🐪','🌴','☀️','🐍','🪲','🏺','📜','👁️','🐊','🦅','🐈','⚱️','🪶','💎','🌾','🦂','🐫','🌙'],
    puzzles: [
      { id: 'egypt-1', name: 'The Scribe\'s Study',    type: 'hidden',  artifact: 'scarab' },
      { id: 'egypt-2', name: 'Tomb of Echoes',         type: 'memory',  artifact: 'papyrus' },
      { id: 'egypt-3', name: 'Shattered Cartouche',    type: 'slider',  artifact: 'canopic' },
    ],
    boss: {
      name: 'The Sandstone Sphinx', emoji: '🦁', hp: 230, atk: 9, def: 1, xp: 80, coins: 120, relic: 'sundisk',
      intro: 'The Sphinx rises from the dunes. "Answer my riddle... or be buried with the kings."',
      phaseText: 'The Sphinx\'s eyes blaze! A sandstorm begins to howl!',
      moves: {
        claw:      { name: 'Stone Claw',     kind: 'attack', mult: 1.0 },
        riddle:    { name: 'Riddle of Ages', kind: 'charge', text: 'poses an ancient riddle... the air grows scorching!' },
        sunbeam:   { name: 'Sunbeam',        kind: 'attack', mult: 2.5, heavy: true },
        sandstorm: { name: 'Sandstorm',      kind: 'weaken', mult: 0.6, turns: 2 },
      },
      p1: ['claw', 'claw', 'riddle', 'sunbeam'],
      p2: ['sandstorm', 'claw', 'riddle', 'sunbeam', 'claw'],
    },
  },
  {
    id: 'greece', name: 'Classical Greece', year: 'c. 450 BCE', icon: '🏛️',
    color: '#5b8fd9', bg: 'linear-gradient(160deg,#e6f0ff 0%,#9cc0f0 50%,#3d6db5 100%)',
    blurb: 'Marble temples, philosophers in the agora and a maze beneath Crete.',
    pool: ['🏛️','🦉','🍇','🫒','⚱️','🏺','🪖','🛡️','🐂','🌿','🎭','📯','🐬','⚡','🏹','🐚','🪕','🍷'],
    puzzles: [
      { id: 'greece-1', name: 'Agora Marketplace',     type: 'hidden',   artifact: 'owl' },
      { id: 'greece-2', name: 'Oracle\'s Chant',       type: 'sequence', artifact: 'helm' },
      { id: 'greece-3', name: 'Theatre of Masks',      type: 'memory',   artifact: 'amphora' },
    ],
    boss: {
      name: 'The Labyrinth Minotaur', emoji: '🐂', hp: 390, atk: 13, def: 3, xp: 130, coins: 200, relic: 'horn',
      intro: 'Hooves thunder through the dark corridors. The Minotaur has found you.',
      phaseText: 'The Minotaur bellows in fury — it is ENRAGED!',
      moves: {
        gore:    { name: 'Gore',            kind: 'attack', mult: 1.0 },
        stomp:   { name: 'Double Stomp',    kind: 'attack', mult: 0.7, hits: 2 },
        horns:   { name: 'Lower Horns',     kind: 'charge', text: 'paws the ground and lowers its horns...' },
        charge:  { name: 'Labyrinth Charge', kind: 'attack', mult: 3.0, heavy: true },
        enrage:  { name: 'Blood Rage',      kind: 'buff',   atkUp: 0.4 },
      },
      p1: ['gore', 'stomp', 'horns', 'charge'],
      p2: ['enrage', 'gore', 'stomp', 'horns', 'charge'],
    },
  },
  {
    id: 'medieval', name: 'Medieval Europe', year: 'c. 1190 CE', icon: '🏰',
    color: '#7d5ba6', bg: 'linear-gradient(160deg,#d9cbe9 0%,#8f73b5 50%,#3e2c5c 100%)',
    blurb: 'Stone castles, candlelit scriptoriums and a dragon hoarding a kingdom\'s gold.',
    pool: ['🏰','🛡️','⚔️','🐉','👑','🏆','📖','🕯️','🗝️','🐴','🍺','🧙','🦄','🪓','🍗','🎻','🔔','📜'],
    puzzles: [
      { id: 'medieval-1', name: 'Broken Stained Glass', type: 'slider',   artifact: 'codex' },
      { id: 'medieval-2', name: 'The Great Hall',       type: 'hidden',   artifact: 'shield' },
      { id: 'medieval-3', name: 'Bells of the Abbey',   type: 'sequence', artifact: 'chalice' },
    ],
    boss: {
      name: 'The Iron Dragon', emoji: '🐉', hp: 560, atk: 16, def: 4, xp: 190, coins: 300, relic: 'scale',
      intro: 'Smoke pours from the mountain keep. The Iron Dragon unfurls its wings.',
      phaseText: 'The Dragon\'s scales glow white-hot!',
      moves: {
        bite:    { name: 'Iron Bite',       kind: 'attack', mult: 1.1 },
        breath:  { name: 'Fire Breath',     kind: 'burn',   mult: 0.7, turns: 3 },
        tail:    { name: 'Tail Sweep',      kind: 'attack', mult: 0.6, hits: 2 },
        inhale:  { name: 'Deep Inhale',     kind: 'charge', text: 'draws in a vast breath — embers swirl in its throat!' },
        inferno: { name: 'Inferno',         kind: 'burn',   mult: 2.4, turns: 3, heavy: true },
        harden:  { name: 'Scale Harden',    kind: 'shield', pct: 0.15 },
      },
      p1: ['bite', 'breath', 'tail', 'bite'],
      p2: ['harden', 'inhale', 'inferno', 'bite', 'tail'],
    },
  },
  {
    id: 'japan', name: 'Feudal Japan', year: 'c. 1600 CE', icon: '⛩️',
    color: '#d9455f', bg: 'linear-gradient(160deg,#ffe3ea 0%,#f08aa0 50%,#8c1f37 100%)',
    blurb: 'Cherry blossoms, quiet tea houses and an Oni warlord besieging the castle.',
    pool: ['⛩️','🗡️','🍵','🎎','🏯','🌸','🎐','🐉','🍙','🎏','🦊','🪷','🎋','🥢','🏮','🐟','🗻','🎴'],
    puzzles: [
      { id: 'japan-1', name: 'Koi Pond Pairs',         type: 'memory', artifact: 'tea' },
      { id: 'japan-2', name: 'Lantern Festival',       type: 'hidden', artifact: 'dolls' },
      { id: 'japan-3', name: 'Folding Screen',         type: 'slider', artifact: 'katana' },
    ],
    boss: {
      name: 'The Oni Warlord', emoji: '👹', hp: 740, atk: 19, def: 5, xp: 260, coins: 420, relic: 'onimask',
      intro: 'A horned giant in lacquered armour draws an enormous blade. "Strike me, if you dare."',
      phaseText: 'The Oni\'s aura turns crimson. Its stance grows deadlier!',
      moves: {
        slash:   { name: 'Cleave',          kind: 'attack', mult: 1.0 },
        stance:  { name: 'Counter Stance',  kind: 'stance' },
        warcry:  { name: 'War Cry',         kind: 'buff',   atkUp: 0.25 },
        double:  { name: 'Twin Cut',        kind: 'attack', mult: 0.8, hits: 2 },
        focus:   { name: 'Blade Focus',     kind: 'charge', text: 'raises its blade high, perfectly still...' },
        execute: { name: 'Executioner\'s Arc', kind: 'attack', mult: 2.8, heavy: true },
      },
      p1: ['slash', 'stance', 'slash', 'warcry'],
      p2: ['stance', 'double', 'focus', 'execute', 'stance', 'slash'],
    },
  },
  {
    id: 'renaissance', name: 'Renaissance Italy', year: 'c. 1505 CE', icon: '🎨',
    color: '#3f8f6b', bg: 'linear-gradient(160deg,#e3f5ea 0%,#8fcfac 50%,#1f5c42 100%)',
    blurb: 'Workshops of genius, star charts and a clockwork giant gone haywire.',
    pool: ['🎨','🖼️','🧭','📐','⚙️','🔭','🪶','📚','🎻','🕰️','🗺️','⛵','🍷','🧪','💡','🪞','🎭','⚖️'],
    puzzles: [
      { id: 'renaissance-1', name: 'The Inventor\'s Lock', type: 'sequence', artifact: 'astrolabe' },
      { id: 'renaissance-2', name: 'Cluttered Workshop',  type: 'hidden',   artifact: 'sketch' },
      { id: 'renaissance-3', name: 'Gallery of Pairs',    type: 'memory',   artifact: 'portrait' },
    ],
    boss: {
      name: 'The Clockwork Colossus', emoji: '🤖', hp: 960, atk: 22, def: 7, xp: 340, coins: 560, relic: 'heart',
      intro: 'Gears grind. Steam hisses. A towering automaton turns its lens toward you.',
      phaseText: 'WARNING: OVERCLOCK PROTOCOL ENGAGED. The Colossus glows red!',
      moves: {
        punch:   { name: 'Gear Punch',      kind: 'attack', mult: 1.0 },
        barrier: { name: 'Deploy Barrier',  kind: 'shield', pct: 0.16 },
        steam:   { name: 'Steam Vent',      kind: 'burn',   mult: 0.6, turns: 2 },
        overclock: { name: 'Overclock',     kind: 'buff',   atkUp: 0.3 },
        lens:    { name: 'Focus Lens',      kind: 'charge', text: 'focuses its great lens — a beam of light intensifies!' },
        laser:   { name: 'Solar Lance',     kind: 'attack', mult: 2.8, heavy: true },
        repair:  { name: 'Repair Protocol', kind: 'heal',   pct: 0.08 },
      },
      p1: ['punch', 'barrier', 'steam', 'punch'],
      p2: ['overclock', 'lens', 'laser', 'repair', 'barrier', 'punch'],
    },
  },
  {
    id: 'viking', name: 'Viking Scandinavia', year: 'c. 900 CE', icon: '🪓',
    color: '#4a7a8c', bg: 'linear-gradient(160deg,#e6f1f5 0%,#8fb3c2 50%,#2c4652 100%)',
    blurb: 'Longships, mead halls and a monstrous wolf straining at its chains.',
    pool: ['🪓','⛵','🛡️','🐺','🦌','🍺','🔥','❄️','🐟','⚓','🪶','🌲','🐻','🍖','🏔️','🦅','🌊','🪵'],
    puzzles: [
      { id: 'viking-1', name: 'The Lewis Chessmen', type: 'chess',   artifact: 'chessmen' },
      { id: 'viking-2', name: 'Mead Hall Feast',    type: 'banquet', artifact: 'mjolnir' },
      { id: 'viking-3', name: 'Longship Hoard',     type: 'hidden',  artifact: 'runestone' },
    ],
    boss: {
      name: 'Fenrir, the Great Wolf', emoji: '🐺', hp: 1300, atk: 24, def: 9, xp: 400, coins: 650, relic: 'gleipnir',
      intro: 'The ground cracks. A wolf larger than a longship tears free of its chains and howls at the sky.',
      phaseText: 'Fenrir howls, and the sun itself seems to dim. Its eyes burn like twin moons!',
      moves: {
        bite:   { name: 'Savage Bite',     kind: 'attack', mult: 1.1 },
        pack:   { name: 'Pack Fury',       kind: 'attack', mult: 0.45, hits: 4 },
        howl:   { name: 'Moon Howl',       kind: 'buff',   atkUp: 0.3 },
        pelt:   { name: 'Thick Winter Pelt', kind: 'shield', pct: 0.1 },
        crouch: { name: 'Crouch to Pounce', kind: 'charge', text: 'lowers its massive body, muscles coiling like springs…' },
        lunge:  { name: 'Ragnarök Lunge',  kind: 'attack', mult: 2.7, heavy: true },
        frost:  { name: 'Frost Breath',    kind: 'weaken', mult: 0.7, turns: 2 },
      },
      p1: ['bite', 'pack', 'pelt', 'crouch', 'lunge', 'frost'],
      p2: ['howl', 'pack', 'bite', 'crouch', 'lunge', 'pelt', 'frost'],
    },
  },
  {
    id: 'tang', name: 'Tang Dynasty China', year: 'c. 750 CE', icon: '🧧',
    color: '#c8402f', bg: 'linear-gradient(160deg,#fff1dc 0%,#e8a86a 50%,#8a2a1f 100%)',
    blurb: 'Silk Road markets, poets by lantern-light, and a mischievous immortal monkey.',
    pool: ['🧧','🏮','🐉','🍵','🎋','🐼','🥮','🪁','🍑','🐅','🏯','📜','🥢','🐓','💮','🧨','🏺','🐎'],
    puzzles: [
      { id: 'tang-1', name: 'Silk Scroll Recall',  type: 'recall',   artifact: 'silk' },
      { id: 'tang-2', name: 'The Emperor\'s Board', type: 'chess',   artifact: 'jadeseal' },
      { id: 'tang-3', name: 'Temple Bells',        type: 'sequence', artifact: 'bell' },
    ],
    boss: {
      name: 'The Stone Monkey King', emoji: '🐒', hp: 1500, atk: 25, def: 10, xp: 460, coins: 740, relic: 'beads',
      intro: 'A monkey in golden armour somersaults down on a cloud, twirling a staff. "Ha! Another challenger for the Great Sage!"',
      phaseText: 'The Monkey King plucks a hair and blows: dozens of laughing clones fill the courtyard!',
      moves: {
        staff:   { name: 'Staff Sweep',        kind: 'attack', mult: 1.0 },
        cloud:   { name: 'Cloud Somersault',   kind: 'stance' },
        clones:  { name: 'Hair Clones',        kind: 'attack', mult: 0.35, hits: 5 },
        trans:   { name: 'Seventy-Two Transformations', kind: 'shield', pct: 0.1 },
        grow:    { name: 'Staff Grows',        kind: 'charge', text: 'grins as his staff grows taller than a pagoda…' },
        smash:   { name: 'Ruyi Staff Smash',   kind: 'attack', mult: 2.7, heavy: true },
        peach:   { name: 'Steal a Peach',      kind: 'heal',   pct: 0.06 },
      },
      p1: ['staff', 'cloud', 'clones', 'grow', 'smash', 'peach'],
      p2: ['trans', 'clones', 'cloud', 'grow', 'smash', 'staff', 'peach'],
    },
  },
  {
    id: 'aztec', name: 'Aztec Empire', year: 'c. 1500 CE', icon: '🌽',
    color: '#2f9e7e', bg: 'linear-gradient(160deg,#fff4cc 0%,#7fcf9f 50%,#1e5a4a 100%)',
    blurb: 'Floating gardens, golden temples and the Feathered Serpent circling the sun.',
    pool: ['🌽','🦜','🐆','🐍','☀️','🌶️','🍫','🪶','🗿','💎','🌵','🐊','🦎','🌺','🏹','🥁','🥑','🐒'],
    puzzles: [
      { id: 'aztec-1', name: 'Feast of Flowers',  type: 'banquet', artifact: 'cacao' },
      { id: 'aztec-2', name: 'Codex of Memory',   type: 'recall',  artifact: 'headdress' },
      { id: 'aztec-3', name: 'The Sun Stone',     type: 'slider',  artifact: 'mirror' },
    ],
    boss: {
      name: 'Quetzalcoatl, the Feathered Serpent', emoji: '🐍', hp: 1700, atk: 27, def: 10, xp: 520, coins: 840, relic: 'mask',
      intro: 'Emerald feathers blot out the sky. A great serpent coils around the temple, eyes glowing like suns.',
      phaseText: 'The Feathered Serpent rises into the sky and begins to swallow the sun!',
      moves: {
        gust:    { name: 'Hurricane Wing',  kind: 'attack', mult: 1.0 },
        venom:   { name: 'Jade Venom',      kind: 'burn',   mult: 0.6, turns: 3 },
        plume:   { name: 'Feathered Shield', kind: 'shield', pct: 0.1 },
        coil:    { name: 'Serpent Coil',    kind: 'stance' },
        devour:  { name: 'Devour the Sun',  kind: 'charge', text: 'opens its jaws wide; the sky darkens as the sun slides toward its mouth…' },
        eclipse: { name: 'Solar Eclipse',   kind: 'attack', mult: 2.8, heavy: true },
        wind:    { name: 'Breath of Wind',  kind: 'weaken', mult: 0.6, turns: 2 },
      },
      p1: ['gust', 'venom', 'plume', 'devour', 'eclipse', 'wind'],
      p2: ['coil', 'venom', 'gust', 'devour', 'eclipse', 'plume', 'coil', 'wind'],
    },
  },
  {
    id: 'mesopotamia', name: 'Ancient Mesopotamia', year: 'c. 1750 BCE', icon: '🧱',
    color: '#b07a3c', bg: 'linear-gradient(160deg,#fbecc8 0%,#d9a35e 50%,#5a3a1a 100%)',
    blurb: 'The first cities, the first writing, and the Bull of Heaven from the Epic of Gilgamesh.',
    pool: ['🧱','🦁','🐂','🌙','⭐','🌴','🏺','📜','🐐','🌾','🍯','🦂','🐫','⚖️','🏹','👑','🪔','🌊'],
    puzzles: [
      { id: 'mesopotamia-1', name: 'Strategist of Ur',     type: 'chess',   artifact: 'urgame' },
      { id: 'mesopotamia-2', name: 'The Hanging Gardens',  type: 'recall',  artifact: 'lamp' },
      { id: 'mesopotamia-3', name: 'Gilgamesh\'s Banquet', type: 'banquet', artifact: 'tablet' },
    ],
    boss: {
      name: 'The Bull of Heaven', emoji: '🐃', hp: 2000, atk: 28, def: 11, xp: 580, coins: 950, relic: 'ishtar',
      intro: 'The sky splits open. A colossal bull of starlight descends upon the walls of Uruk, snorting thunder.',
      phaseText: 'Ishtar\'s fury fills the Bull! Its horns crackle with lightning!',
      moves: {
        stomp:   { name: 'Earthquake Stomp', kind: 'attack', mult: 1.0 },
        rush:    { name: 'Horn Rush',        kind: 'attack', mult: 0.6, hits: 3 },
        bellow:  { name: 'Divine Bellow',    kind: 'weaken', mult: 0.7, turns: 2 },
        bulwark: { name: 'Celestial Hide',   kind: 'shield', pct: 0.11 },
        fury:    { name: 'Ishtar\'s Fury',   kind: 'buff',   atkUp: 0.3 },
        storm:   { name: 'Gather the Storm', kind: 'charge', text: 'paws the earth as thunderclouds gather around its horns…' },
        thunder: { name: 'Heaven\'s Thunder', kind: 'burn',  mult: 2.5, turns: 2, heavy: true },
      },
      p1: ['stomp', 'rush', 'bulwark', 'storm', 'thunder', 'bellow'],
      p2: ['fury', 'rush', 'bellow', 'storm', 'thunder', 'bulwark', 'stomp'],
    },
  },
  {
    id: 'end', name: 'The End of Time', year: '∞', icon: '🌀', final: true,
    color: '#6a4bc4', bg: 'linear-gradient(160deg,#2b1e4f 0%,#4b2f8a 50%,#0d0a1f 100%)',
    blurb: 'Where all eras unravel. Something ancient is devouring history itself.',
    pool: ['⏳','⌛','🌀','🕰️','⭐','🌙','☄️','🔮','💫','🪐','⚙️','🌌'],
    puzzles: [],
    boss: {
      name: 'The Time Devourer', emoji: '🌀', hp: 2200, atk: 32, def: 11, xp: 700, coins: 1700, relic: 'hourglass',
      intro: 'A vortex with a thousand eyes opens. "Every moment you saved... I will consume."',
      phaseText: 'The Devourer splits time itself! Its attacks echo across the ages!',
      moves: {
        rend:    { name: 'Temporal Rend',   kind: 'attack', mult: 1.0 },
        stance:  { name: 'Paradox Guard',   kind: 'stance' },
        drain:   { name: 'Age Drain',       kind: 'weaken', mult: 0.8, turns: 2 },
        barrier: { name: 'Event Horizon',   kind: 'shield', pct: 0.1 },
        gather:  { name: 'Gather Eons',     kind: 'charge', text: 'pulls centuries into its core...' },
        collapse:{ name: 'Epoch Collapse',  kind: 'attack', mult: 2.6, heavy: true },
        echo:    { name: 'Echo Strike',     kind: 'attack', mult: 0.6, hits: 3 },
        flare:   { name: 'Solar Flare',     kind: 'burn',   mult: 0.8, turns: 3 },
        feast:   { name: 'Feast on Seconds', kind: 'heal',  pct: 0.06 },
      },
      p1: ['rend', 'drain', 'gather', 'collapse', 'barrier', 'flare'],
      p2: ['stance', 'echo', 'feast', 'gather', 'collapse', 'stance', 'flare', 'barrier'],
    },
  },
  {
    id: 'winters', name: 'Winters Manor', year: 'Present day', icon: '❄️', final: true, requires: 'end',
    color: '#5f86b8', bg: 'linear-gradient(160deg,#eef5ff 0%,#a9c2e2 50%,#26365c 100%)',
    blurb: 'Peter Winters has fled to his family\'s frozen estate with your stolen artifacts.',
    pool: ['❄️','👑','🧊','🎻','🕯️','🍷','🪞','⛸️'],
    puzzles: [],
    boss: {
      name: 'Peter Winters', portrait: 'peter', emoji: '❄️', hp: 2300, atk: 33, def: 12, xp: 700, coins: 1200, relic: 'frostcrown',
      intro: '"You actually came? How adorable. Do sit. I was just annotating a first edition, and this won\'t take long."',
      phaseText: 'Peter\'s perfect hair falls out of place. He is FURIOUS! "Do you have ANY idea who my family is?!"',
      supportLines: { anna: 'He froze my reading room! This is personal now!', cedric: 'Pretty boy\'s got quick fingers. Watch your deck!' },
      moves: {
        rapier:  { name: 'Rapier Flourish', kind: 'attack', mult: 1.0 },
        pocket:  { name: 'Pickpocket',      kind: 'steal',  mult: 0.5 },
        parry:   { name: 'Smug Riposte',    kind: 'stance' },
        frost:   { name: 'Frostbite',       kind: 'weaken', mult: 0.7, turns: 2 },
        mirror:  { name: 'Ice Mirror',      kind: 'shield', pct: 0.09 },
        gloat:   { name: 'Lecture',         kind: 'charge', text: 'pushes up his glasses and lectures you on your "inferior scholarship"… frost gathers on his blade!' },
        lance:   { name: 'Glacial Lance',   kind: 'attack', mult: 2.6, heavy: true },
        tantrum: { name: 'Tantrum',         kind: 'buff',   atkUp: 0.35 },
      },
      p1: ['rapier', 'pocket', 'parry', 'frost', 'gloat', 'lance'],
      p2: ['tantrum', 'pocket', 'mirror', 'parry', 'gloat', 'lance', 'rapier'],
    },
  },
  {
    id: 'jane', name: 'The Stolen Gull', year: 'The high seas', icon: '🏴‍☠️', final: true, requires: 'winters', ending: true,
    color: '#a8323a', bg: 'linear-gradient(160deg,#f7dcae 0%,#b5473a 50%,#2a1216 100%)',
    blurb: 'Lady Jane has seized the Gilded Gull and flies the black flag once more.',
    pool: ['🏴‍☠️','⚓','🦜','💰','🗺️','🍺','💣','🐙'],
    puzzles: [],
    boss: {
      name: 'Lady Jane, the Pirate Queen', portrait: 'jane', emoji: '🏴‍☠️', hp: 2800, atk: 36, def: 13, xp: 900, coins: 2000, relic: 'blackflag',
      intro: '"Welcome aboard, dearie. Mind the plank. I\'ve been robbing kings since before your grandmother was born."',
      phaseText: 'Lady Jane raises the Black Flag! "No quarter, no mercy, no retirement!"',
      supportLines: { anna: 'The Scourge of Seven Centuries… I\'ve read every tale about her. Let\'s be careful!', cedric: 'Alright, Jane. Teacher against student. Let\'s settle this.' },
      moves: {
        cutlass:   { name: 'Cutlass Slash',     kind: 'attack',  mult: 1.0 },
        volley:    { name: 'Flintlock Volley',  kind: 'attack',  mult: 0.5, hits: 3 },
        plunder:   { name: 'Plunder',           kind: 'plunder', mult: 0.8 },
        call:      { name: 'Call the Kraken',   kind: 'charge',  text: 'whistles an eerie sea shanty… enormous tentacles rise from the waves!' },
        kraken:    { name: 'Kraken\'s Embrace', kind: 'attack',  mult: 2.7, heavy: true },
        barrage:   { name: 'Cannon Barrage',    kind: 'burn',    mult: 0.7, turns: 3 },
        grog:      { name: 'Swig of Grog',      kind: 'heal',    pct: 0.05 },
        blackflag: { name: 'Raise the Black Flag', kind: 'buff', atkUp: 0.3 },
        feint:     { name: 'Old Sea Dog\'s Feint', kind: 'stance' },
      },
      p1: ['cutlass', 'volley', 'plunder', 'call', 'kraken', 'barrage'],
      p2: ['blackflag', 'plunder', 'feint', 'volley', 'call', 'kraken', 'grog', 'barrage'],
    },
  },
];

const ERA_BY_ID = Object.fromEntries(ERAS.map(e => [e.id, e]));

const DECOYS = ['🍂','🪨','🪵','🍃','🔑','🪙','🧱','🦴','🍄','🌵','🧵','🪺','🥀','🌰','🧶','🕸️'];

const PUZZLE_INFO = {
  hidden:   { title: 'Hidden Relics',  icon: '🔍', rules: 'Find every object shown in the list before time runs out. Wrong clicks cost 3 seconds.' },
  memory:   { title: 'Memory Pairs',   icon: '🃏', rules: 'Flip cards two at a time to match every pair before time runs out.' },
  slider:   { title: 'Restore the Relic', icon: '🧩', rules: 'Slide the tiles into place to reassemble the artifact. Tiles next to the gap can move.' },
  sequence: { title: 'Rune Lock',      icon: '🔮', rules: 'Watch the runes light up, then repeat the sequence. You have 3 chances.' },
  chess:    { title: 'Checkmate in One', icon: '♟️', rules: 'White to move. Find the single move that checkmates the black king. Solve each board; you have 3 lives.' },
  recall:   { title: 'Memory Palace',  icon: '🧠', rules: 'Study where the objects sit on the grid, then recall each location after they vanish. 3 lives.' },
  banquet:  { title: 'Banquet Table',  icon: '🍽️', rules: 'Seat every guest at the table so that all the clues are true. You may ring the dinner bell 3 times.' },
};
