// ============================================================
//  Clockwork Everlasting — final villains: Peter Winters & Lady Jane
// ============================================================

const VILLAINS = {
  peter: { name: 'Peter Winters', color: '#5f86b8', bg: 'linear-gradient(160deg,#eef5ff 0%,#a9c2e2 50%,#26365c 100%)' },
  jane:  { name: 'Lady Jane',     color: '#a8323a', bg: 'linear-gradient(160deg,#f7dcae 0%,#b5473a 50%,#2a1216 100%)' },
};

function charInfo(who) { return COMPANIONS[who] || VILLAINS[who] || null; }

let pendingStory = null;

const STORY = {
  meetAlice: () => { S.rel.alice.met = true; return COMPANIONS.alice.meet; },
  // After the first Greece victory: the rival appears
  peterIntro: () => [
    N('As you step out of the portal, slow sarcastic clapping echoes across your field. Frost creeps over the grass.'),
    L('peter', 'smirk', 'Bravo. Truly. A farmer who plays archaeologist. How quaint.'),
    N('A young man in a tweed blazer and wire-rimmed glasses snaps a leather-bound book shut.'),
    L('peter', 'neutral', 'Peter Winters, of the Winters family. You\'ve surely heard of us. We were collecting history while your little grove was still a weed patch.'),
    L('peter', 'smirk', 'Relics like these are wasted in the dirt. They belong in a proper collection. Mine, naturally.'),
    L('anna', 'surprised', 'Who was THAT? He left frost all over my returned books!'),
    N('Before you can answer, Peter vanishes in a swirl of snowflakes, laughing.'),
    ...(mentorMet('alice') ? [L('alice', 'sad', 'Peter Winters… my former student at the Academy. Brilliant, and so very lost. Be on your guard, my dear.')] : []),
  ],
  // After the first Japan victory: the old pirate returns
  janeIntro: () => [
    N('A storm rolls over the village dock. A battered ship with black sails drops anchor right beside the Gilded Gull.'),
    L('jane', 'smirk', 'Well, well. Little Cedric. Still polishing my ship, I see.'),
    L('cedric', 'surprised', 'Captain Jane?! You were lost at sea twenty years ago!'),
    L('jane', 'happy', 'The sea and I came to an arrangement, dear. That gilded beauty was MY ship before you "inherited" her, lad.'),
    L('jane', 'smirk', 'And I hear your new friend keeps a garden full of priceless relics. Retirement has been terribly dull.'),
    L('cedric', 'determined', 'Stay away from the grove, Jane. I mean it.'),
    L('jane', 'wink', 'Ha! The pup learned to bark. I taught him that, you know. Sleep lightly, darlings.'),
  ],
  // After the Time Devourer: the heist
  heist: () => [
    N('You return from the End of Time, exhausted but victorious… but something is wrong. Frost glitters across your homestead.'),
    L('peter', 'smirk', 'Ah, there\'s our hero. Thank you SO much for dealing with the Devourer. You made this terribly easy.'),
    N(`Peter is holding the Hourglass of Eternity and ${Math.max(0, S.stolen.length - 1)} more artifacts torn from your land!`),
    L('jane', 'happy', 'And thank you for the ship, Cedric dear! She handles just like I remember.'),
    N('Down at the dock, the Gilded Gull is pulling away under a black flag!'),
    L('cedric', 'angry', 'My ship! Jane, you old sea witch!'),
    L('jane', 'smirk', 'Language, boy. A pirate never retires. She just waits for the right score.'),
    L('peter', 'determined', 'The artifacts are going to Winters Manor. If you want them back, come and beg. Ta-ta!'),
    L('anna', 'determined', 'They can\'t get away with this! I traced the portal frost. Winters Manor is open in the Time Portal. Let\'s take everything back!'),
    ...(mentorMet('quinn') ? [L('quinn', 'determined', 'Jane! The same pirate who sank the Crown\'s treasure fleet thirty years ago! The Treasury is posting a bounty: 🪙1,000 for the Gilded Gull\'s return.')] : []),
    ...(mentorMet('alice') ? [L('alice', 'determined', 'And Peter is my responsibility. I taught him to love history. You must teach him humility.')] : []),
    N(`⚠️ Peter stole ${S.stolen.length} artifacts and Lady Jane stole the Gilded Gull! Cedric's card shop is closed and his cannons are silent until the ship is recovered.`),
  ],
  peterDefeat: () => [
    L('peter', 'sad', 'Impossible! I had private tutors! The finest fencing masters money could buy!'),
    L('peter', 'determined', 'Fine! Take your dusty trinkets! The Winters name doesn\'t lose to farmers… it simply postpones winning.'),
    L('peter', 'blush', '…You fought well. For a farmer. Don\'t let it go to your head.'),
    N('Peter drops every stolen artifact and flees in a puff of frost. They\'re back in your storage, ready to display again.'),
    ...(mentorMet('alice') ? [L('alice', 'smile', 'There is hope for him yet. Even the most brilliant fools can learn humility. Thank you, my dear.')] : []),
    L('cedric', 'determined', 'One down. Now let\'s get my ship back. Jane\'s anchored off the storm coast, and the rift is open in the Portal.'),
  ],
  finale: () => {
    const lines = [
      L('jane', 'sad', 'Hah… haah… Twenty years, and the boy finally beats me. With a farmer, no less.'),
      L('cedric', 'smile', 'You taught me everything, Jane. Including how to lose with a little dignity.'),
      L('jane', 'smile', 'Cheeky. Fine, take her back. The Gull always liked you better anyway.'),
      L('jane', 'happy', 'And you, grove-keeper: fight like that and you\'d have made a fine pirate. Keep my old flag. You\'ve earned it.'),
      N('⚓ The Gilded Gull is yours again! Cedric\'s shop reopens and his cannons are ready.'),
    ];
    if (S.story.bountyPaid) lines.push(L('quinn', 'happy', 'As promised, the Crown\'s bounty: 🪙1,000! And a personal note of thanks from the Treasury. The fleet is finally avenged.'));
    if (S.partner === 'anna') lines.push(L('anna', 'happy', 'You saved history AND our home. I\'m writing the final chapter tonight… and starting volume two tomorrow. Together.'));
    else if (S.partner === 'cedric') lines.push(L('cedric', 'blush', 'My ship, my grove, and you. A captain couldn\'t ask for a richer treasure.'));
    else lines.push(L('anna', 'happy', 'I\'m adding a whole new shelf to the archive: "The Grove-Keeper\'s Adventures"!'), L('cedric', 'happy', 'Drinks on the Gull! Even you, Jane. Just this once.'));
    lines.push(N('🏆 THE END… of this chapter. Your grove is safe, history is whole, and your story goes on.'));
    return lines;
  },
};

function playStory(key, onDone) {
  S.story[key] = true;
  saveGame();
  playScene(STORY[key](), () => { renderAll(); if (onDone) onDone(); });
}

// Peter takes the Hourglass plus up to three displayed artifacts; Jane takes the Gilded Gull.
function triggerHeist() {
  if (S.heistStarted) return;
  S.heistStarted = true;
  if (mentorMet('quinn')) S.bounty = true;
  const placed = shuffle(S.plot.map((t, i) => (t.t === 'artifact' && t.id !== 'hourglass' ? i : -1)).filter(i => i >= 0)).slice(0, 3);
  const stolen = [];
  if (S.artifacts.includes('hourglass')) stolen.push('hourglass');
  placed.forEach(i => stolen.push(S.plot[i].id));
  S.plot.forEach((t, i) => { if (t.t === 'artifact' && stolen.includes(t.id)) S.plot[i] = { t: 'grass' }; });
  S.artifacts = S.artifacts.filter(id => !stolen.includes(id));
  S.stolen = stolen;
  S.shipStolen = true;
  saveGame();
}

function returnStolenArtifacts() {
  S.stolen.forEach(id => grantArtifact(id));
  S.stolen = [];
}

// Called from endBattle on a first victory
function storyAfterBoss(eraId) {
  if (eraId === 'egypt' && !mentorMet('alice')) return 'meetAlice';
  if (eraId === 'greece' && !S.story.peterIntro) return 'peterIntro';
  if (eraId === 'japan' && !S.story.janeIntro) return 'janeIntro';
  if (eraId === 'end' && !S.heistStarted) { triggerHeist(); return 'heist'; }
  if (eraId === 'winters') { returnStolenArtifacts(); return 'peterDefeat'; }
  if (eraId === 'jane') {
    S.shipStolen = false;
    if (S.bounty) { S.coins += 1000; S.bounty = false; S.story.bountyPaid = true; }
    return 'finale';
  }
  return null;
}

function leaveBattleResult(tab) {
  closeStage();
  setMusic(backgroundMusic());
  showTab(tab);
  if (pendingStory) { const k = pendingStory; pendingStory = null; playStory(k); }
}

function heistBanner() {
  if (!S.heistStarted || (!S.stolen.length && !S.shipStolen)) return '';
  const parts = [];
  if (S.stolen.length) parts.push(`❄️ <b>Peter Winters</b> stole ${S.stolen.map(id => ARTIFACTS[id].emoji).join(' ')} from your grove!`);
  if (S.shipStolen) parts.push('🏴‍☠️ <b>Lady Jane</b> has stolen the Gilded Gull!');
  return `<div class="heist-banner">${parts.join('<br>')} <button class="btn small danger" onclick="showTab('portal')">Get them back ⚔️</button></div>`;
}
