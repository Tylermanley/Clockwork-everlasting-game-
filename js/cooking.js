// ============================================================
//  Clockwork Everlasting — cooking: recipes, packed meals (battle buffs) and dish gifts
// ============================================================

// Ingredients: crop ids, 'egg' (from the coop) and 'fish' (any fish you've caught)
const DISHES = {
  omelette:  { name: 'Fluffy Omelette',       emoji: '🍳', needs: { egg: 2 },                     effect: '+10 max HP.' },
  pie:       { name: 'Harvest Pumpkin Pie',   emoji: '🥧', needs: { pumpkin: 1, wheat: 2, egg: 1 }, effect: '+20% max HP.' },
  peachtea:  { name: 'Immortal Peach Tea',    emoji: '🍵', needs: { peach: 1, blossom: 1 },        effect: '+1 CP on your first turn.' },
  stew:      { name: 'Captain\'s Fish Stew',  emoji: '🍲', needs: { fish: 2, carrot: 1 },          effect: 'Start every turn with +3 Block.' },
  sorbet:    { name: 'Chrono Melon Sorbet',   emoji: '🍧', needs: { melon: 1, berry: 1 },          effect: '+15% ATK.' },
  cornbread: { name: 'Sun Maize Cornbread',   emoji: '🍞', needs: { corn: 1, egg: 1 },             effect: 'Once, when you drop below half HP, heal 25%.' },
  tart:      { name: 'Lingonberry Grape Tart', emoji: '🥮', needs: { berry: 1, grape: 2, wheat: 1 }, effect: 'Draw +1 card on your first turn.' },
  sushi:     { name: 'Blossom Sushi',         emoji: '🍣', needs: { fish: 1, blossom: 1, wheat: 1 }, effect: '+10% ATK and +10% max HP.' },
};
// Everyone's favourite dish (counts as a "loved" gift, worth even more than a loved crop)
const FAV_DISH = { anna: 'pie', cedric: 'stew', alice: 'peachtea', quinn: 'sorbet', peter: 'tart' };

function ingredientLabel(k) {
  if (k === 'egg') return '🥚 Egg';
  if (k === 'fish') return '🐟 Any fish';
  return `${CROPS[k].emoji} ${CROPS[k].name}`;
}

function fishCount() { return Object.values(S.fish).reduce((a, b) => a + b, 0); }

function haveIngredient(k) {
  if (k === 'egg') return S.pantry.egg || 0;
  if (k === 'fish') return fishCount();
  return totalOf('produce', k);
}

function useIngredient(k, n) {
  if (k === 'egg') { S.pantry.egg -= n; return; }
  if (k === 'fish') {
    // Use the cheapest fish first
    const ids = Object.keys(S.fish).filter(id => S.fish[id] > 0).sort((a, b) => FISH[a].value - FISH[b].value);
    for (const id of ids) { while (n > 0 && S.fish[id] > 0) { S.fish[id]--; n--; } }
    return;
  }
  takeFrom('produce', k, n);
}

function canCook(id) { return Object.entries(DISHES[id].needs).every(([k, n]) => haveIngredient(k) >= n); }

function cook(id) {
  if (!canCook(id)) return;
  Object.entries(DISHES[id].needs).forEach(([k, n]) => useIngredient(k, n));
  S.dishes[id] = (S.dishes[id] || 0) + 1;
  S.stats.cooked++;
  sfx('success');
  toast(`${DISHES[id].emoji} You cooked <b>${DISHES[id].name}</b>!`);
  saveGame();
  openKitchen();
}

function packMeal(id) {
  if (S.meal) S.dishes[S.meal] = (S.dishes[S.meal] || 0) + 1;
  if (id && S.dishes[id] > 0) { S.dishes[id]--; S.meal = id; } else S.meal = null;
  saveGame();
}

function mealPickerHtml(eraId, elite) {
  const owned = Object.keys(DISHES).filter(id => S.dishes[id] > 0 || S.meal === id);
  if (!owned.length) return '';
  return `<div class="meal-pick"><b>🍽️ Packed meal</b> <small class="muted">(eaten at the start of the fight)</small>
    <div class="support-opts">
      ${owned.map(id => `<button class="support-opt ${S.meal === id ? 'active' : ''}" onclick="packMeal('${id}');openBossIntro('${eraId}',${elite})">${DISHES[id].emoji} ${DISHES[id].name} <small>${S.meal === id ? 'packed' : `×${S.dishes[id]}`}</small></button>`).join('')}
      <button class="support-opt ${!S.meal ? 'active' : ''}" onclick="packMeal(null);openBossIntro('${eraId}',${elite})">No meal</button>
    </div>
    ${S.meal ? `<small>${DISHES[S.meal].effect}</small>` : ''}</div>`;
}

function openKitchen() {
  openStage(`
    <div class="stage-card intro wide kitchen" style="--era:#d9823b">
      <div class="intro-icon">🍳</div>
      <h2>Homestead Kitchen</h2>
      <p class="muted">Cook dishes from your crops, eggs and fish. Pack one before a boss battle for a buff, or give a companion their favourite dish.</p>
      <p class="small">Pantry: 🥚 ${S.pantry.egg || 0} · 🐟 ${fishCount()} fish ${S.meal ? `· Packed: ${DISHES[S.meal].emoji}` : ''}</p>
      <div class="recipe-grid">
        ${Object.entries(DISHES).map(([id, d]) => {
          const fans = Object.keys(FAV_DISH).filter(w => FAV_DISH[w] === id).map(w => COMPANIONS[w].name);
          return `<div class="recipe ${canCook(id) ? 'ready' : ''}">
            <div class="v-icon">${d.emoji}</div><b>${d.name}</b> <small>×${S.dishes[id] || 0}</small>
            <small class="effect">${d.effect}</small>
            <ul>${Object.entries(d.needs).map(([k, n]) => `<li class="${haveIngredient(k) >= n ? 'ok' : ''}">${ingredientLabel(k)} ${haveIngredient(k)}/${n}</li>`).join('')}</ul>
            ${fans.length ? `<small>💗 ${fans.join(', ')}'s favourite</small>` : ''}
            <button class="btn small primary" ${canCook(id) ? '' : 'disabled'} onclick="cook('${id}')">Cook</button>
          </div>`;
        }).join('')}
      </div>
      <div class="btn-row"><button class="btn ghost" onclick="closeStage()">Close</button></div>
    </div>`, 'linear-gradient(160deg,#fff3e0,#f2b27a 55%,#7a3f1d)');
}
