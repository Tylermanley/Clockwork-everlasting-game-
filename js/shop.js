// ============================================================
//  Clockwork Everlasting — Clockwork Boutique (cosmetic-only purchases)
//
//  Everything sold here is cosmetic: outfits, decorations without
//  gameplay bonuses, card frames, and a supporter title. No pay-to-win
//  and no random loot boxes.
//
//  PAYMENTS.mode:
//    'test' — purchases are free and only for testing (default).
//    'live' — sends the player to your checkout server, then verifies
//             the purchase when they return. See PAYMENTS.md for setup.
// ============================================================

const PAYMENTS = {
  mode: 'test',
  checkoutEndpoint: '',   // e.g. 'https://your-worker.example.workers.dev/checkout'
  verifyEndpoint: '',     // e.g. 'https://your-worker.example.workers.dev/verify'
  currency: 'USD',
};

// Colour swaps applied to a character's portrait when an outfit is equipped
const SHOP = {
  outfit_hero_royal:   { kind: 'outfit', char: 'hero',   icon: '🧭', price: 1.99, name: 'Royal Explorer Outfit',  colors: { '#8a5a32': '#2b4a86', '#6b4223': '#1d3463', '#c8453a': '#e3b341', '#a8352c': '#b88a1e' } },
  outfit_hero_ronin:   { kind: 'outfit', char: 'hero',   icon: '🥷', price: 1.99, name: 'Shadow Ronin Outfit',    colors: { '#8a5a32': '#22222c', '#6b4223': '#121218', '#c8453a': '#b3202f', '#a8352c': '#7a1520' } },
  outfit_anna_summer:  { kind: 'outfit', char: 'anna',   icon: '👗', price: 1.99, name: 'Anna: Summer Sundress',  colors: { '#3c8c86': '#f2a7a0', '#2b6b66': '#d98880', '#d6454f': '#4fa3e8', '#b8323d': '#2f7fc4' } },
  outfit_cedric_admiral:{ kind: 'outfit', char: 'cedric', icon: '⚓', price: 1.99, name: 'Cedric: Admiral\'s Whites', colors: { '#1f2d5a': '#eef1f6', '#1a2140': '#f5f7fb', '#121831': '#dfe4ee' } },
  outfit_alice_midnight:{ kind: 'outfit', char: 'alice', icon: '🌙', price: 1.99, name: 'Lady Alice: Midnight Gala Gown', colors: { '#3d6fb6': '#3b2a6b', '#4f82cc': '#4b3a80', '#2f5a99': '#2a1d52' } },
  outfit_quinn_jubilee:{ kind: 'outfit', char: 'quinn',  icon: '👑', price: 1.99, name: 'Minister Quinn: Golden Jubilee Suit', colors: { '#2f5a40': '#8a1f2a', '#1c1c24': '#2a2140' } },
  outfit_peter_formal: { kind: 'outfit', char: 'peter',  icon: '🎩', price: 1.99, name: 'Peter: Winter Formal',    colors: { '#5b4632': '#1f2a44', '#4a3826': '#16203a', '#6b2433': '#9aa6b8', '#4e1824': '#7d889a' } },
  decor_sakura:        { kind: 'decor', decor: 'sakura',     icon: '🌸', price: 0.99, name: 'Cherry Blossom Tree' },
  decor_clocktower:    { kind: 'decor', decor: 'clocktower', icon: '🕰️', price: 1.99, name: 'Clockwork Tower' },
  decor_unicorn:       { kind: 'decor', decor: 'unicorn',    icon: '🦄', price: 0.99, name: 'Unicorn Statue' },
  frame_gold:          { kind: 'frame', frame: 'gold',       icon: '✨', price: 1.49, name: 'Gilded Card Frames' },
  frame_sakura:        { kind: 'frame', frame: 'sakura',     icon: '🌺', price: 1.49, name: 'Sakura Card Frames' },
  pack_supporter:      { kind: 'pack',                       icon: '💖', price: 4.99, name: 'Supporter Pack', desc: 'Every outfit, decoration and card frame above, plus the title “Patron of Time”. Thank you for supporting the game!' },
};

const SUPPORTER_TITLE = 'Patron of Time';

function owns(id) { return !!(S.owned && (S.owned[id] || (id !== 'pack_supporter' && S.owned.pack_supporter))); }

function formatPrice(p) {
  try { return new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: PAYMENTS.currency }).format(p); }
  catch (e) { return `$${p.toFixed(2)}`; }
}

function playerId() {
  if (!S.playerId) { S.playerId = 'p_' + Math.random().toString(36).slice(2) + Date.now().toString(36); saveGame(); }
  return S.playerId;
}

function grantPurchase(id) {
  if (!SHOP[id]) return;
  S.owned[id] = true;
  const ids = id === 'pack_supporter' ? Object.keys(SHOP) : [id];
  ids.forEach(k => {
    const it = SHOP[k];
    if (it.kind === 'decor' && !S.decor[it.decor]) S.decor[it.decor] = 1;
  });
  saveGame();
  sfx('achieve');
  toast(`💎 Thank you! <b>${SHOP[id].name}</b> is yours.`, 4000);
  renderAll();
}

function purchaseCosmetic(id) {
  const it = SHOP[id];
  if (!it || owns(id)) return;
  if (PAYMENTS.mode !== 'live' || !PAYMENTS.checkoutEndpoint) {
    if (!confirm(`TEST MODE: no real money is charged.\n\nUnlock “${it.name}” (${formatPrice(it.price)}) for testing?`)) return;
    return grantPurchase(id);
  }
  // Live mode: hand over to your checkout server (e.g. Stripe Checkout). It sends the
  // player back to this page with ?purchase_session=... once payment completes.
  saveGame();
  const url = new URL(PAYMENTS.checkoutEndpoint);
  url.searchParams.set('item', id);
  url.searchParams.set('player', playerId());
  url.searchParams.set('return', location.href.split('?')[0]);
  location.href = url.toString();
}

// Called on start-up: confirms a purchase when the player returns from checkout
async function handlePurchaseReturn() {
  const params = new URLSearchParams(location.search);
  const session = params.get('purchase_session');
  if (!session || !PAYMENTS.verifyEndpoint) return;
  history.replaceState(null, '', location.pathname);
  try {
    const res = await fetch(`${PAYMENTS.verifyEndpoint}?session=${encodeURIComponent(session)}&player=${encodeURIComponent(playerId())}`);
    const data = await res.json();
    (data.items || []).forEach(id => { if (SHOP[id] && !S.owned[id]) grantPurchase(id); });
    if (!(data.items || []).length) toast('⚠️ We couldn\'t confirm that purchase. If you were charged, please contact support.', 6000);
  } catch (e) {
    toast('⚠️ Couldn\'t reach the store to confirm your purchase. Please reload to try again.', 6000);
  }
}

function equipOutfit(char, id) {
  S.outfits[char] = S.outfits[char] === id ? null : id;
  saveGame();
  renderAll();
}

function equipFrame(frame) {
  S.cardFrame = S.cardFrame === frame ? null : frame;
  saveGame();
  applyCardFrame();
  renderAll();
}

function applyCardFrame() {
  document.body.classList.toggle('frame-gold', S.cardFrame === 'gold');
  document.body.classList.toggle('frame-sakura', S.cardFrame === 'sakura');
}

// Swap an equipped outfit's colours into a portrait's SVG markup
function applyOutfit(char, html) {
  const oid = S && S.outfits && S.outfits[char];
  if (!oid || !SHOP[oid] || !owns(oid)) return html;
  for (const [from, to] of Object.entries(SHOP[oid].colors)) html = html.split(from).join(to);
  return html;
}

function resetTestPurchases() {
  if (!confirm('Remove all test purchases from this save?')) return;
  S.owned = {};
  S.outfits = {};
  S.cardFrame = null;
  ['sakura', 'clocktower', 'unicorn'].forEach(d => { delete S.decor[d]; });
  S.plot.forEach((t, i) => { if (t.t === 'deco' && DECOR[t.id] && DECOR[t.id].premium) S.plot[i] = { t: 'grass' }; });
  if (S.title === SUPPORTER_TITLE) S.title = null;
  saveGame(); applyCardFrame(); renderAll();
}

function boutiqueHtml() {
  const test = PAYMENTS.mode !== 'live' || !PAYMENTS.checkoutEndpoint;
  const card = (id) => {
    const it = SHOP[id];
    const have = owns(id);
    let action;
    if (!have) action = `<button class="btn small primary" onclick="purchaseCosmetic('${id}')">${formatPrice(it.price)}</button>`;
    else if (it.kind === 'outfit') action = `<button class="btn small ${S.outfits[it.char] === id ? 'danger' : ''}" onclick="equipOutfit('${it.char}','${id}')">${S.outfits[it.char] === id ? 'Unequip' : 'Wear'}</button>`;
    else if (it.kind === 'frame') action = `<button class="btn small ${S.cardFrame === it.frame ? 'danger' : ''}" onclick="equipFrame('${it.frame}')">${S.cardFrame === it.frame ? 'Unequip' : 'Use'}</button>`;
    else if (it.kind === 'decor') action = '<span class="tag on">In decor box</span>';
    else action = '<span class="tag on">Owned 💖</span>';
    const preview = it.kind === 'outfit'
      ? `<div class="bq-face">${portraitSVG(it.char, CHAR_STYLE[it.char].defaultExpr, { crop: 'bust', outfitPreview: id })}</div>`
      : `<div class="v-icon">${it.icon}</div>`;
    return `<div class="bq-item ${have ? 'owned' : ''} ${it.kind}">${preview}<b>${it.name}</b>${it.desc ? `<small>${it.desc}</small>` : ''}${action}</div>`;
  };
  return `<section class="panel boutique">
    <h3>💎 Clockwork Boutique <small class="muted">Cosmetics only, so they never affect gameplay.</small></h3>
    ${test ? '<p class="test-banner">🧪 <b>Test mode:</b> purchases are free and only for testing. No real money is charged.</p>' : ''}
    <div class="bq-grid">${Object.keys(SHOP).map(card).join('')}</div>
  </section>`;
}
