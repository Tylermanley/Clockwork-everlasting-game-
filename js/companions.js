// ============================================================
//  Clockwork Everlasting — companions: Anna & Cedric (support, romance, VN scenes)
// ============================================================

const L = (who, expr, text) => ({ who, expr, text });
const N = text => ({ who: 'narr', text });

const COMPANIONS = {
  anna: {
    name: 'Anna', title: 'Archivist of the Chrono Library', home: '📚 Chrono Library', icon: '📚',
    color: '#3c8c86', bg: 'linear-gradient(160deg,#3b2a4f 0%,#7a5a8c 55%,#e0b98f 100%)',
    loves: ['blossom', 'pumpkin'], likes: ['wheat', 'carrot'],
    perks: [
      { h: 0, text: 'Stores everything that doesn\'t fit in your satchel. Gives live boss hints in battle.' },
      { h: 3, text: 'Anna\'s Remedy: once per battle, heals 30% HP and cleanses ailments.' },
      { h: 4, text: 'Enchanted pockets: satchel holds +5 items.' },
      { h: 6, text: 'Anna\'s Ward: start every turn with +4 Block.' },
      { h: 8, text: 'Ready for a Chrono Locket 💍.' },
      { h: 'partner', text: 'Partner: Remedy heals 50%, +5 satchel space, and a potion every morning.' },
    ],
    meet: [
      N('A bell chimes as you push open the door of the old library at the edge of the village.'),
      L('anna', 'surprised', 'Oh! A visitor? Nobody\'s come in here since… um, sorry. Hello!'),
      L('anna', 'smile', 'I\'m Anna. I look after the Chrono Library. Your great-aunt used to bring me the strangest books… from other centuries.'),
      L('anna', 'happy', 'You have her pocket watch! Then you\'ll be travelling too. Please, let me help!'),
      L('anna', 'smile', 'Your satchel can only hold so much. Anything that doesn\'t fit, I\'ll catalogue and keep safe in the archive. Potions, crops, all of it.'),
      L('anna', 'determined', 'And I\'ve studied every guardian in the old chronicles. Bring me to a battle and I\'ll tell you exactly what they\'re about to do!'),
    ],
    talk: {
      low: [
        ['smile', 'I reorganised the history section today. Egypt is next to Greece now, which feels… correct, somehow.'],
        ['neutral', 'Did you know hieroglyphs can be read in different directions? The figures always face the start of the line.'],
        ['blush', 'Oh! You startled me. I was, um, reading. Not daydreaming. Definitely reading.'],
      ],
      mid: [
        ['happy', 'I saved you a cup of tea! It\'s probably cold now… I made it three hours ago, just in case you stopped by.'],
        ['smile', 'Every time you come back through a rift, I check you for scratches. It\'s the librarian in me. I like things… intact.'],
        ['blush', 'I started a new entry in the archive today. It\'s titled "Remarkable People". There\'s only one name in it so far.'],
      ],
      high: [
        ['blush', 'When you\'re gone through the portal, the library feels so quiet. I never minded quiet before I met you.'],
        ['happy', 'I pressed a petal from your farm into my favourite book. Now it\'s my favourite book for two reasons.'],
        ['smile', 'I used to only read about adventures. Now I get to hear about real ones… from you.'],
      ],
      love: [
        ['blush', 'Sometimes I catch myself writing your name in the margins. I\'m a librarian! Writing in books is a crime!'],
        ['happy', 'Whatever era you\'re lost in, I\'ll be right here. Always.'],
        ['happy', 'I catalogued our future today: "Volume One: Forever." Shelved right next to my heart.'],
      ],
      again: ['smile', 'Back again? Not that I mind! I just… don\'t have anything new to say yet. Come see me tomorrow?'],
    },
    events: {
      2: [
        N('You find Anna on a tall ladder, reaching for a book on the highest shelf.'),
        L('anna', 'surprised', 'Ah—! The ladder—!'),
        N('She wobbles and falls. You catch her just in time.'),
        L('anna', 'blush', 'Th-thank you. I, um… you can put me down now. …Or in a minute. Whichever.'),
        L('anna', 'happy', 'I\'m giving you a lifetime library card! It\'s the highest honour I have!'),
      ],
      4: [
        L('anna', 'smile', 'I\'ve been working on something for you. Hold out your satchel?'),
        L('anna', 'happy', 'I sewed in extra pockets, enchanted with archive magic. Now you can carry five more things!'),
        L('anna', 'blush', 'I also stitched a little heart inside one of them. You don\'t have to look for it. Please don\'t look for it.'),
        N('✨ Satchel capacity +5!'),
      ],
      6: [
        N('Late at night, candlelight glows in the library window. Anna is asleep at her desk, surrounded by notes about the guardians.'),
        L('anna', 'surprised', 'Hm…? Oh! You\'re here! I was researching protective wards. For you.'),
        L('anna', 'determined', 'From now on, when I fight beside you, I\'ll weave a ward around you every turn. Nothing\'s hurting you on my watch.'),
        L('anna', 'blush', 'Because… you matter to me. More than any book ever has.'),
        N('✨ Anna\'s Ward unlocked: +4 Block every turn when she supports you.'),
      ],
      8: [
        L('anna', 'blush', 'Can I tell you something? I\'ve read thousands of love stories.'),
        L('anna', 'smile', 'I always skipped to the last page, just to see if they found each other in the end.'),
        L('anna', 'cry', 'With you… I don\'t want to skip a single page.'),
        N('💗 Anna\'s heart is full. A Chrono Locket from the Market would mean the world to her.'),
      ],
    },
    gift: {
      love: ['happy', 'For me? Oh, it\'s perfect! I\'m going to sketch it before I do anything else!'],
      like: ['smile', 'How thoughtful! Thank you, really.'],
      neutral: ['smile', 'Oh, thank you! I\'ll find a good use for it.'],
      again: ['blush', 'You already gave me something today! Spoil me tomorrow, okay?'],
    },
    propose: [
      N('You hold out the Chrono Locket. Inside, two tiny clock hands point to the same moment.'),
      L('anna', 'surprised', 'Is that… is that for me?'),
      L('anna', 'blush', 'I\'ve read this scene a hundred times. I never imagined I\'d get to be in one.'),
      L('anna', 'happy', 'Yes! Yes, of course, yes! Let\'s write the rest of the story together!'),
      N('💍 You and Anna are now partners! She moves into the homestead, and she gives you the card "Lovers\' Promise".'),
    ],
    morning: 'Good morning, love! I tucked a potion into your things. Be careful out there!',
    battleStart: 'I\'m right here! I\'ll read its every move for you.',
    battleWin: 'You did it! I\'m writing this into the chronicles right now!',
    battleLose: 'It\'s okay… we\'ll study it together and try again.',
  },
  cedric: {
    name: 'Cedric', title: 'Captain of the Gilded Gull', home: '⚓ The Gilded Gull', icon: '⚓',
    color: '#1f2d5a', bg: 'linear-gradient(160deg,#16324f 0%,#2f6f9a 55%,#f3c27c 100%)',
    loves: ['grape', 'melon'], likes: ['wheat', 'pumpkin'],
    perks: [
      { h: 0, text: 'Forges a battle card for every puzzle you solve and sells rare cards. As support, you draw +1 card each turn.' },
      { h: 3, text: 'Broadside: once per battle, the Gull\'s cannons deal 2.5× ATK, ignoring DEF.' },
      { h: 'shop', text: 'More hearts unlock rarer cards in his shop.' },
      { h: 6, text: 'First Mate: +1 CP on your first turn.' },
      { h: 8, text: 'Ready for a Chrono Locket 💍.' },
      { h: 'partner', text: 'Partner: Broadside deals 4× ATK, and +30 coins every morning from his voyages.' },
    ],
    meet: [
      N('At the village dock, a ship with golden sails creaks against the pier. Someone swings down from the rigging and lands beside you.'),
      L('cedric', 'smirk', 'Well now! You must be the new keeper of the grove. Captain Cedric, of the Gilded Gull, at your service.'),
      L('cedric', 'smile', 'I trade in rare goods across every sea… and, between us, across a few centuries too.'),
      L('cedric', 'happy', 'Your great-aunt and I had a deal. She found relics, and I made her these. Battle cards!'),
      L('cedric', 'determined', 'Each card holds the power of a moment in history. Against those guardians, cards are your sword and your shield.'),
      L('cedric', 'smirk', 'Here\'s a starter deck, on the house. Solve puzzles out there and I\'ll forge a new card from everything you discover. Fair winds, partner!'),
    ],
    talk: {
      low: [
        ['smirk', 'The tide\'s good today. So is the company, now that you\'re here.'],
        ['smile', 'Bought a crate of "authentic Roman spoons" yesterday. Turns out they\'re from next Tuesday. Time trading is risky business.'],
        ['neutral', 'A captain\'s first rule: never sail without a full deck. Of cards, I mean. Also crew.'],
      ],
      mid: [
        ['happy', 'You should\'ve seen the Gull\'s figurehead blush when you walked up. Or maybe that was me. Hard to say.'],
        ['wink', 'I\'ve sailed every sea in seven centuries and I still can\'t predict your next move. I like that.'],
        ['smile', 'I had a card printed with your face on it. Strictly for, ah, inventory purposes.'],
      ],
      high: [
        ['blush', 'I used to chase horizons. Lately I keep finding reasons to drop anchor right here.'],
        ['smile', 'When you\'re out fighting, I keep your spot at the helm warm. Come back to it, alright?'],
        ['happy', 'The crew calls you "the Captain\'s Compass" now. Because apparently I always point toward you. Mutinous lot.'],
      ],
      love: [
        ['blush', 'I\'ve traded gold, gems and lost treasures. Never found anything worth more than you.'],
        ['happy', 'Every voyage I bring you back a souvenir. My cabin\'s running out of room. Worth it.'],
        ['smile', 'Whatever century you sail into, I\'ll find you. That\'s a captain\'s promise.'],
      ],
      again: ['smirk', 'Twice in one day? Careful, people will talk. Come back tomorrow, I\'ll have new stories.'],
    },
    events: {
      2: [
        N('Cedric is on the deck of the Gilded Gull, wrestling with a tangled sail in a gusting wind.'),
        L('cedric', 'surprised', 'Ah, perfect timing! Grab that line, would you?'),
        N('Together you haul the sail into place.'),
        L('cedric', 'happy', 'Ha! A natural sailor. I might have to make you first mate.'),
        L('cedric', 'smirk', 'Benefits include terrible pay, worse food and excellent company. Mine, specifically.'),
      ],
      4: [
        L('cedric', 'smile', 'I\'ve been saving my best stock for my best customer.'),
        L('cedric', 'smirk', 'Freeze Time cards. Pricey, rare and dangerous. I wouldn\'t sell them to just anyone.'),
        L('cedric', 'blush', 'You\'re not just anyone, though. …Forget I said that. Bad for business.'),
        N('✨ Freeze Time is now in Cedric\'s shop.'),
      ],
      6: [
        N('At sunset, Cedric shows you a battered map pinned to the wall of his cabin.'),
        L('cedric', 'neutral', 'My first voyage. I was alone out there for years. Every port felt the same.'),
        L('cedric', 'smile', 'Then I started docking here, and suddenly the port became the best part of the journey.'),
        L('cedric', 'determined', 'Next time we face a guardian, I\'ll be ready from the very first turn. Count on it.'),
        N('✨ First Mate unlocked: +1 CP on your first turn when Cedric supports you.'),
      ],
      8: [
        L('cedric', 'blush', 'I\'m not good with words unless I\'m haggling.'),
        L('cedric', 'smile', 'So I\'ll say it plain. When I look at the horizon now… I\'m hoping you\'re on it.'),
        N('💗 Cedric\'s heart is full. A Chrono Locket from the Market would mean everything to him.'),
      ],
    },
    gift: {
      love: ['happy', 'Now THAT is premium cargo! You know the way to a captain\'s heart.'],
      like: ['smile', 'Fine goods! I\'ll stow them in my personal hold.'],
      neutral: ['smirk', 'A gift from you? I\'d treasure a pebble, honestly. Thank you.'],
      again: ['smirk', 'Another gift? You\'ll sink my ship with kindness. Tomorrow, alright?'],
    },
    propose: [
      N('You hold out the Chrono Locket. Inside, two tiny clock hands point to the same moment.'),
      L('cedric', 'surprised', 'A locket? For… me?'),
      L('cedric', 'blush', 'I\'ve crossed oceans and centuries hunting treasure. Never thought one would come looking for me.'),
      L('cedric', 'happy', 'Aye! A thousand times aye! The Gilded Gull has a new co-captain!'),
      N('💍 You and Cedric are now partners! He drops anchor at the homestead for good, and he gives you the card "Lovers\' Promise".'),
    ],
    morning: 'Morning, love. Sold some cargo at dawn, so the profits are in the coin jar.',
    battleStart: 'Cards ready? Let\'s show this brute how a real crew fights!',
    battleWin: 'Victory! Drinks are on the Gull tonight!',
    battleLose: 'We\'ll regroup, refit the deck and sail back stronger.',
    quips: ['Play it like you mean it!', 'Ha! That\'s my partner.', 'Steady… wait for the right card.', 'I\'ve seen worse odds. Not many, but some.', 'A good captain knows when to raise the shields.', 'Here, an extra card from my sleeve. Don\'t tell anyone.'],
  },
  alice: {
    name: 'Lady Alice', title: 'Duchess of Bluewater, Royal Historical Society', home: '🫖 Bluewater Salon', icon: '🫖', mentor: true,
    color: '#3d6fb6', bg: 'linear-gradient(160deg,#dfe9fb 0%,#8fb0e3 50%,#2b4a86 100%)',
    loves: ['blossom', 'grape'], likes: ['carrot', 'pumpkin'],
    unlock: () => !!S.bosses.egypt, unlockText: 'Defeat the Sandstone Sphinx to attract her attention.',
    perks: [
      { h: 0, text: 'Lessons: once a day, spend ⚡4 to gain XP. As support, Poise: you take 15% less damage.' },
      { h: 1, text: 'Masterclass: upgrade your battle cards (level 1).' },
      { h: 2, text: 'Letters of Introduction: gifts to other companions give +50% affection.' },
      { h: 3, text: 'Royal Decree: once per battle, the boss loses its next action, its shield and all its power-ups.' },
      { h: 5, text: 'Masterclass level 2, and lessons give double XP.' },
      { h: 7, text: 'Perfect Poise: as support, you take 25% less damage.' },
    ],
    meet: [
      N('A blue carriage drawn by white horses stops at your gate. A lady in an elegant sapphire gown steps down, parasol in hand.'),
      L('alice', 'smile', 'Good day. I am Lady Alice, Duchess of Bluewater, and patron of the Royal Historical Society.'),
      L('alice', 'surprised', 'Word travels fast: the new grove-keeper bested the Sandstone Sphinx! Without formal training, I am told.'),
      L('alice', 'smile', 'Talent like yours deserves cultivation. Visit my salon whenever you wish. I shall give you lessons, and refine your battle technique.'),
      L('alice', 'determined', 'And should you face a guardian, I would be honoured to stand beside you. A lady never flinches.'),
    ],
    talk: {
      low: [
        ['smile', 'Posture, darling. A straight back is half of any victory.'],
        ['neutral', 'The Society\'s archives say your great-aunt once out-fenced a Venetian duke. In a ballgown.'],
        ['smile', 'Tea at four, history at five, swordplay at six. A civilised schedule.'],
      ],
      mid: [
        ['happy', 'You have improved remarkably. I may have to find harder lessons!'],
        ['smile', 'Nobility is not a matter of birth, you know. It is a matter of what one does with one\'s hands.'],
        ['neutral', 'I hear whispers at court about a young collector named Winters. Be careful whom you trust.'],
      ],
      high: [
        ['happy', 'I wrote to the Queen about you. She was most impressed.'],
        ['smile', 'Teaching you has reminded me why I fell in love with history in the first place.'],
        ['blush', 'You are the student I always hoped to have. Don\'t tell anyone I said so.'],
      ],
      love: [
        ['happy', 'If I had a child, I would wish them to be as brave as you. Now, chin up, you have work to do.'],
        ['smile', 'My salon doors are always open to you. Always.'],
      ],
      again: ['smile', 'We have already spoken today, dear. Patience is also a lesson. Return tomorrow.'],
    },
    events: {
      2: [
        N('In the Bluewater Salon, Lady Alice hands you a wooden practice sword.'),
        L('alice', 'determined', 'En garde! Show me what the Sphinx taught you.'),
        N('After a flurry of strikes, she taps your shoulder and smiles.'),
        L('alice', 'happy', 'Splendid! Raw, but splendid. I shall write letters of introduction to my friends. Everyone ought to know you.'),
        N('✨ Letters of Introduction: gifts to other companions now give +50% affection.'),
      ],
      4: [
        L('alice', 'sad', 'I must confess something. Peter Winters was once my student at the Academy.'),
        L('alice', 'neutral', 'The brightest mind I ever taught. But he came to believe history belongs only to those who can afford it.'),
        L('alice', 'determined', 'I failed him. I will not fail you.'),
      ],
      6: [
        L('alice', 'smile', 'You have mastered everything I planned to teach. So I have written new lessons, just for you.'),
        L('alice', 'happy', 'Advanced techniques of the old masters. Your cards will hit harder than ever.'),
        N('✨ Masterclass level 2 unlocked, and lessons now give double XP.'),
      ],
      8: [
        L('alice', 'blush', 'The Society has voted. You are to be named an honorary Fellow of the Royal Historical Society.'),
        L('alice', 'happy', 'I nominated you myself, of course. It is the proudest day of my teaching life.'),
        N('🎓 Lady Alice is proud to call you her student.'),
      ],
    },
    gift: {
      love: ['happy', 'How exquisite! You have impeccable taste, my dear.'],
      like: ['smile', 'How very thoughtful. Thank you.'],
      neutral: ['smile', 'A kind gesture is never wasted. Thank you.'],
      again: ['smile', 'One gift a day is generous; two would be extravagant. Tomorrow, perhaps.'],
    },
    battleStart: 'Shoulders back, blade up. We face this together, with grace.',
    battleWin: 'Magnificent! A victory worthy of a ballad.',
    battleLose: 'A setback, not a defeat. We shall study and return.',
    quips: ['Elegance, darling. Even in battle.', 'Remember your footwork!', 'Watch its intentions. A duel is a conversation.', 'Superb technique!', 'Breathe. Then strike.'],
  },
  quinn: {
    name: 'Minister Quinn', title: 'Minister of the Royal Treasury', home: '🏦 Royal Treasury', icon: '🏦', mentor: true,
    color: '#2f5a40', bg: 'linear-gradient(160deg,#f6ecd0 0%,#c9a54a 45%,#1f3a2b 100%)',
    loves: ['melon', 'pumpkin'], likes: ['grape', 'wheat'],
    unlock: () => S.day >= 3, unlockText: 'Arrives on Day 3 to inspect the grove.',
    perks: [
      { h: 0, text: 'Royal Bank: deposit coins and earn 3% interest every morning. As support, +50% coins from battles.' },
      { h: 1, text: 'Trade Ventures: invest in a Spice Route caravan.' },
      { h: 2, text: 'Patron\'s Discount: 10% off at the Market and Cedric\'s shop.' },
      { h: 3, text: 'Hire Mercenaries: once per battle, spend 🪙100 to strike for 3× ATK. Unlocks the Silk Road venture.' },
      { h: 4, text: 'Preferred Rates: bank interest rises to 5%.' },
      { h: 5, text: 'Unlocks the Treasure Expedition venture.' },
      { h: 8, text: 'Golden Parachute: losing a boss battle refunds your energy.' },
    ],
    meet: [
      N('A gentleman in an immaculate tailcoat strolls through your field, inspecting every row through a gold monocle.'),
      L('quinn', 'surprised', 'Remarkable. Positively remarkable. A grove full of priceless relics and not a single ledger in sight!'),
      L('quinn', 'smile', 'Forgive me. Minister Quinn, of the Royal Treasury. I manage the Crown\'s fortunes, and I have an eye for value.'),
      L('quinn', 'smile', 'Coins sitting in a jar are lazy coins. Deposit them with the Treasury and they\'ll earn interest every morning.'),
      L('quinn', 'happy', 'I also back trade ventures across the centuries. Risky, but rewarding. And should you need muscle in a battle, money buys excellent mercenaries.'),
    ],
    talk: {
      low: [
        ['smile', 'Compound interest is the eighth wonder of the world. The other seven I\'ve audited personally.'],
        ['neutral', 'Never spend your last coin, my friend. Spend your second-to-last, and invest the remainder.'],
        ['smile', 'Your Time Wheat is trading very well at market this season. Excellent fundamentals.'],
      ],
      mid: [
        ['happy', 'I ran the numbers on you. Your returns are extraordinary! Truly, a blue-chip investment.'],
        ['smile', 'Wealth is a tool, like a spade or a sword. What matters is what you build with it.'],
        ['neutral', 'Thirty years ago, a pirate queen sank half the Crown\'s treasure fleet. I still have the paperwork.'],
      ],
      high: [
        ['happy', 'I\'ve added you to my will. Under "assets of sentimental value." It\'s a very short list.'],
        ['smile', 'You remind me of myself at your age: ambitious, clever, and terrible at bookkeeping.'],
        ['blush', 'The Treasury staff say I smile more since I met you. Nonsense. Smiling is unprofitable.'],
      ],
      love: [
        ['happy', 'Of all my investments, you are the one I am proudest of.'],
        ['smile', 'Whatever you need, the Treasury stands behind you. And so do I.'],
      ],
      again: ['smile', 'Time is money, and we\'ve spent ours today. Same time tomorrow?'],
    },
    events: {
      2: [
        L('quinn', 'smile', 'A little secret from the Treasury: I know every merchant in the kingdom, and every one of them owes me a favour.'),
        L('quinn', 'happy', 'Mention my name and they will give you a discount. Ten percent, and not a copper less!'),
        N('✨ Patron\'s Discount: 10% off at the Market and Cedric\'s shop.'),
      ],
      4: [
        L('quinn', 'neutral', 'I began as a clerk, counting other people\'s coins in a cold back room. No title, no family name.'),
        L('quinn', 'determined', 'Everything I have, I earned one ledger line at a time. Which is why I despise thieves above all else.'),
        L('quinn', 'smile', 'I\'ve raised your bank rate to my preferred-client level. You\'ve earned it.'),
        N('✨ Bank interest is now 5% per day.'),
      ],
      6: [
        L('quinn', 'surprised', 'Ah! A map! A genuine treasure map, purchased at auction in 1702… well, next Tuesday, technically.'),
        L('quinn', 'happy', 'I can think of no one better to finance an expedition with. Shall we go halves?'),
        N('✨ The Treasure Expedition venture is now available.'),
      ],
      8: [
        L('quinn', 'smile', 'I\'ve taken out an insurance policy on you. Should a battle go badly, the Treasury covers your costs.'),
        L('quinn', 'blush', 'Purely a sound financial decision, of course. …And because I care what happens to you.'),
        N('✨ Golden Parachute: losing a boss battle refunds your energy.'),
      ],
    },
    gift: {
      love: ['happy', 'A premium commodity! I\'d estimate its value at… priceless, coming from you.'],
      like: ['smile', 'A solid, dependable gift. Much appreciated.'],
      neutral: ['smile', 'It\'s the thought that counts. And I do count everything.'],
      again: ['smile', 'Careful, one gift a day keeps your budget balanced.'],
    },
    battleStart: 'Let\'s make this profitable. I\'ve brought my chequebook.',
    battleWin: 'A splendid return on investment! The spoils are yours, with a bonus.',
    battleLose: 'Every market has downturns. We\'ll recover.',
    quips: ['Diversify your attacks!', 'Buy low, strike high!', 'That card was an excellent investment.', 'Keep a reserve. Always keep a reserve.', 'I\'m calculating our odds… they\'re improving!'],
  },
  peter: {
    name: 'Peter Winters', title: 'Reformed Scholar of the Frost Library', home: '❄️ Frost Library', icon: '❄️',
    color: '#5f86b8', bg: 'linear-gradient(160deg,#eef5ff 0%,#a9c2e2 50%,#26365c 100%)',
    loves: ['berry', 'blossom'], likes: ['grape', 'peach'],
    unlock: () => !!S.bosses.winters, unlockText: 'Defeat Peter Winters at Winters Manor… perhaps he has more to say.',
    perks: [
      { h: 0, text: 'Card Exchange: trade 2 copies of a card for one you don\'t own yet. As support: the boss starts Weakened for 2 turns.' },
      { h: 2, text: 'Frost Cellar: fish and eggs sell for 25% more.' },
      { h: 3, text: 'Absolute Zero: once per battle, freeze the boss (it loses its next action) and Expose it for 2 turns.' },
      { h: 6, text: 'Frostguard: +10 Block on your first turn when he supports you.' },
      { h: 8, text: 'Ready for a Chrono Locket 💍. (He\'ll pretend he isn\'t.)' },
      { h: 'partner', text: 'Partner: every third morning he leaves a card on your desk "by accident".' },
    ],
    meet: [
      N('A knock at your gate. Peter Winters stands there in the rain, glasses fogged, holding a tall stack of books.'),
      L('peter', 'sad', 'Before you say anything: yes, it\'s me. No, I haven\'t come to steal anything. Again.'),
      L('peter', 'neutral', 'I\'ve been thinking. Lady Alice was right. History locked in a private vault is just… dust with a price tag.'),
      L('peter', 'blush', 'So I\'ve turned the manor library into a public one. The Frost Library. Anyone may read there. Even farmers.'),
      L('peter', 'wink', 'And I\'ve far too many duplicate battle cards. Bring me your spares and I\'ll trade you something rare. Don\'t make it weird.'),
    ],
    talk: {
      low: [
        ['smirk', 'I\'ve catalogued your mistakes from our duel. It\'s a short volume. Don\'t let that go to your head.'],
        ['neutral', 'Did you know the Lewis Chessmen were found in a sand dune? Seventy-eight pieces. I\'ve read every paper on them. Twice.'],
        ['angry', 'Anna still won\'t lend me books. Apparently "frost damage" is a "pattern". Hmph.'],
      ],
      mid: [
        ['smile', 'I suppose you\'re… tolerable company. For a time traveller with dirt on their boots.'],
        ['blush', 'I made you a reading list. It\'s only forty pages long. Annotated, obviously.'],
        ['wink', 'If anyone asks, I\'m here to inspect your artifacts. Not to see you. Obviously.'],
      ],
      high: [
        ['blush', 'Everyone always expected me to be perfect. You\'re the first person who seemed to like me better when I wasn\'t.'],
        ['happy', 'The Frost Library had forty visitors this week! Forty! Children, even. One asked me to read aloud. I did voices.'],
        ['smile', 'I\'d duel you again, you know. Not to win. Just… because it was the most fun I\'ve ever had.'],
      ],
      love: [
        ['blush', 'I\'ve read a thousand love poems and they\'re all wrong. None of them mention how you laugh at my footnotes.'],
        ['happy', 'Stay. Read with me. The fire\'s warm, and for once I don\'t want to be anywhere else.'],
      ],
      again: ['smirk', 'Twice in one day? People will think we\'re friends. …Tomorrow, then.'],
    },
    events: {
      2: [
        N('Peter appears at Anna\'s library with a guilty expression and a book behind his back.'),
        L('peter', 'blush', 'I… borrowed this. Three years ago. From Anna. Without asking. Please give it back for me?'),
        L('anna', 'surprised', '"A History of Gardens"! I\'ve been looking everywhere! …Thank you, Peter.'),
        L('peter', 'smile', 'Don\'t mention it. Really. Ever.'),
        N('✨ Frost Cellar unlocked: fish and eggs sell for 25% more.'),
      ],
      4: [
        L('peter', 'sad', 'Growing up, every portrait in Winters Manor stared down at me. Generations of perfect, cold, collected Winters.'),
        L('peter', 'neutral', 'Collecting history was the only thing that made my family proud. So I collected more. Even things that weren\'t mine.'),
        L('peter', 'smile', 'You made me realise history is better shared. Thank you. I mean it… don\'t make that face.'),
      ],
      6: [
        N('The Frost Library glows with lantern light. Children sit cross-legged as Peter reads aloud, doing all the voices.'),
        L('peter', 'surprised', 'Ah! You\'re here. I was just… it\'s a reading hour. I don\'t enjoy it. At all.'),
        L('peter', 'happy', '…Fine. I love it. Next battle, I\'ll guard you myself. Consider it a footnote of gratitude.'),
        N('✨ Frostguard unlocked: +10 Block on your first turn when Peter supports you.'),
      ],
      8: [
        L('peter', 'blush', 'I have prepared a speech. Seven pages. Let me find… no. Forget the speech.'),
        L('peter', 'smile', 'You beat me in a duel and then you were kind to me anyway. Nobody has ever done that.'),
        L('peter', 'cry', 'I think I\'m rather hopelessly fond of you. There. It\'s said. I\'m going to go stand in the snow now.'),
        N('💗 Peter\'s heart is full. A Chrono Locket from the Market would leave him speechless, which is a rare thing.'),
      ],
    },
    gift: {
      love: ['blush', 'This is… actually perfect. How did you know? I\'m pressing it in my journal.'],
      like: ['smile', 'Acceptable. Very acceptable. Thank you.'],
      neutral: ['smirk', 'A gift? For me? …I\'ll pretend to be unimpressed. Thank you.'],
      again: ['smirk', 'One gift a day is generous. Two would be suspicious.'],
    },
    propose: [
      N('You hold out the Chrono Locket. For once, Peter Winters has absolutely nothing to say.'),
      L('peter', 'surprised', 'That\'s… you\'re… is this a proposal? To ME?'),
      L('peter', 'cry', 'I had a whole list of reasons why nobody would ever… and you just… ugh, my glasses are fogging up.'),
      L('peter', 'happy', 'Yes. Yes, absolutely yes. I\'ll annotate every day of our future. In the margins. With hearts.'),
      N('💍 You and Peter are now partners! He moves half the Frost Library into the homestead, and he gives you the card "Lovers\' Promise".'),
    ],
    morning: 'Morning. I may have left a card on your desk. Accidentally. Don\'t read into it.',
    battleStart: 'Try to keep up. I\'ll handle the theory, you handle the hitting.',
    battleWin: 'Textbook. Absolutely textbook. I\'m writing a paper on this.',
    battleLose: 'A setback. Even the greats lost battles. I\'ve the footnotes to prove it.',
    quips: ['Statistically, that was brilliant.', 'Watch its pattern. It\'s almost embarrassingly predictable.', 'Mind your Block, I\'m not losing you to a footnote.', 'Elegant. I approve.', 'I\'ve read about this boss. It hates being frozen.'],
  },

};

const HEART_EVENTS = [2, 4, 6, 8];
let compView = 'main';

// ---------- visual-novel dialogue ----------
let DLG = null;

function playScene(lines, onDone, key) {
  if (key && S && S.seen) { S.seen[key] = S.day; saveGame(); }
  DLG = { lines, i: -1, onDone, timer: null, who: null, full: '' };
  const el = document.getElementById('dialogue');
  el.classList.add('open');
  el.onclick = advanceScene;
  advanceScene();
}

function advanceScene() {
  if (!DLG) return;
  if (DLG.timer) { finishTyping(); return; }
  DLG.i++;
  if (DLG.i >= DLG.lines.length) {
    const done = DLG.onDone;
    DLG = null;
    const el = document.getElementById('dialogue');
    el.classList.remove('open');
    el.innerHTML = '';
    if (done) done();
    return;
  }
  renderLine();
}

function renderLine() {
  const ln = DLG.lines[DLG.i];
  const c = charInfo(ln.who);
  const el = document.getElementById('dialogue');
  if (c) DLG.bg = c.bg;
  const entering = c && DLG.who !== ln.who;
  const lively = ln.expr === 'surprised' || ln.expr === 'happy';
  el.innerHTML = `
    <div class="dlg-bg" style="background:${DLG.bg || 'linear-gradient(160deg,#2f5d3a,#1b3524)'}"></div>
    <div class="dlg-motes"></div>
    ${lively ? '<div class="speedlines"></div>' : ''}
    ${c ? `<div class="dlg-portrait ${entering ? 'enter' : ''} ${lively ? 'hop' : ''}">${portraitSVG(ln.who, ln.expr, { talking: true })}</div>` : ''}
    <div class="dlg-box ${c ? '' : 'narr'}">
      ${c ? `<div class="dlg-name" style="background:${c.color}">${c.name}</div>` : ''}
      <div class="dlg-text" id="dlgText"></div>
      <div class="dlg-next">▼</div>
    </div>
    <button class="dlg-skip" onclick="event.stopPropagation(); skipScene()">Skip ⏩</button>`;
  if (c) DLG.who = ln.who;
  DLG.full = ln.text;
  let n = 0;
  const textEl = document.getElementById('dlgText');
  const [ms, step] = TEXT_SPEEDS[S.settings.textSpeed] || TEXT_SPEEDS.normal;
  let tick = 0;
  DLG.timer = setInterval(() => {
    n += step;
    if (++tick % 3 === 0) voiceBlip(ln.who);
    textEl.textContent = DLG.full.slice(0, n);
    if (n >= DLG.full.length) finishTyping();
  }, ms);
}

function finishTyping() {
  if (!DLG) return;
  clearInterval(DLG.timer);
  DLG.timer = null;
  const t = document.getElementById('dlgText');
  if (t) t.textContent = DLG.full;
  const p = document.querySelector('.dlg-portrait .portrait');
  if (p) p.classList.remove('talking');
}

function skipScene() {
  if (!DLG) return;
  finishTyping();
  DLG.i = DLG.lines.length;
  advanceScene();
}

// ---------- romance logic ----------
function talkTier(who) {
  const h = hearts(who);
  if (S.partner === who || h >= 9) return 'love';
  if (h >= 6) return 'high';
  if (h >= 3) return 'mid';
  return 'low';
}

function heartPopup(who, gained, pts) {
  floatHearts();
  sfx('heart');
  const h = hearts(who);
  toast(`💗 ${COMPANIONS[who].name} +${pts} affection${gained ? ` — <b>${h} ♥!</b>` : ''}`);
}

function floatHearts() {
  for (let i = 0; i < 7; i++) {
    const f = document.createElement('div');
    f.className = 'heart-float';
    f.textContent = ['💗', '💖', '💕'][i % 3];
    f.style.left = `${40 + Math.random() * 20}%`;
    f.style.animationDelay = `${i * 0.08}s`;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 2000);
  }
}

function meetCompanion(who, onDone) {
  S.rel[who].met = true;
  saveGame();
  playScene(COMPANIONS[who].meet, () => { renderAll(); if (onDone) onDone(); }, `meet:${who}`);
}

function talkTo(who) {
  resetDailyIfNeeded();
  const c = COMPANIONS[who];
  if (!S.rel[who].met) return meetCompanion(who);
  const ev = HEART_EVENTS.find(t => hearts(who) >= t && !S.rel[who].events.includes(t));
  if (ev) {
    S.rel[who].events.push(ev);
    saveGame();
    return playScene(c.events[ev], () => renderAll(), `event:${who}:${ev}`);
  }
  if (S.daily.talked[who]) {
    const [e, t] = c.talk.again;
    return playScene([L(who, e, t)]);
  }
  const pool = c.talk[talkTier(who)];
  const [e, t] = pool[Math.floor(Math.random() * pool.length)];
  S.daily.talked[who] = true;
  const gained = addAffection(who, 6);
  saveGame();
  playScene([L(who, e, t)], () => { heartPopup(who, gained, 6); renderAll(); });
}

function openGiftPicker(who) {
  resetDailyIfNeeded();
  const c = COMPANIONS[who];
  if (S.daily.gifted[who]) { const [e, t] = c.gift.again; return playScene([L(who, e, t)]); }
  const ids = Object.keys(CROPS).filter(id => totalOf('produce', id) > 0);
  openStage(`
    <div class="stage-card intro" style="--era:${c.color}">
      <div class="gift-head">${portraitSVG(who, 'smile', { crop: 'head' })}</div>
      <h2>🎁 Gift for ${c.name}</h2>
      ${ids.length ? `<div class="gift-grid">${ids.map(id => {
        const pref = c.loves.includes(id) ? '💖 Loves' : c.likes.includes(id) ? '😊 Likes' : '';
        return `<button class="pick" onclick="giveGift('${who}','${id}')">${CROPS[id].emoji} ${CROPS[id].name} <b>×${totalOf('produce', id)}</b><small>${pref || '&nbsp;'}</small></button>`;
      }).join('')}</div>` : '<p class="muted">You have no crops to give. Harvest something from your homestead first!</p>'}
      ${Object.keys(DISHES).filter(id => S.dishes[id] > 0).length ? `<h4>🍽️ Dishes</h4><div class="gift-grid">${Object.keys(DISHES).filter(id => S.dishes[id] > 0).map(id => `<button class="pick" onclick="giveDish('${who}','${id}')">${DISHES[id].emoji} ${DISHES[id].name} <b>×${S.dishes[id]}</b><small>${FAV_DISH[who] === id ? '💖💖 Favourite dish!' : '😊 Likes home cooking'}</small></button>`).join('')}</div>` : ''}
      ${isBirthday(who) ? '<p class="love-txt">🎂 It\'s their birthday today! Gifts are worth double.</p>' : ''}
      <p class="muted small">One gift per day. Favourite dish: ${DISHES[FAV_DISH[who]].emoji} ${DISHES[FAV_DISH[who]].name}. Hint: ${c.name} loves ${c.loves.map(id => CROPS[id].emoji + ' ' + CROPS[id].name).join(' and ')}.</p>
      <div class="btn-row"><button class="btn ghost" onclick="closeStage()">Cancel</button></div>
    </div>`, c.bg);
}

function giveGift(who, cropId) {
  const c = COMPANIONS[who];
  if (!takeFrom('produce', cropId)) return;
  const level = c.loves.includes(cropId) ? 'love' : c.likes.includes(cropId) ? 'like' : 'neutral';
  let pts = { love: 30, like: 18, neutral: 10 }[level];
  if (who !== 'alice' && hearts('alice') >= 2) pts = Math.round(pts * 1.5);
  const bday = isBirthday(who);
  if (bday) pts *= 2;
  S.daily.gifted[who] = true;
  const gained = addAffection(who, pts);
  saveGame();
  closeStage();
  const [e, t] = c.gift[level];
  playScene([N(`You give ${c.name} a ${CROPS[cropId].emoji} ${CROPS[cropId].name}.`), L(who, e, t), ...(bday ? [L(who, 'happy', 'And you remembered my birthday! 🎂 This is the best day ever!')] : [])], () => { heartPopup(who, gained, pts); renderAll(); });
}

function canPropose(who) { return !COMPANIONS[who].mentor && !S.partner && hearts(who) >= 8 && S.locket > 0; }

function proposeTo(who) {
  if (!canPropose(who)) return;
  S.locket--;
  S.partner = who;
  addAffection(who, 20);
  grantCard('promise');
  saveGame();
  S.wedding = { who, day: S.day + 2, done: false };
  saveGame();
  playScene(COMPANIONS[who].propose, () => { floatHearts(); renderAll(); toast(`💒 The wedding is set for Day ${S.day + 2}!`, 5000); }, `propose:${who}`);
}

function setSupport(who) {
  S.support = S.support === who ? null : who;
  saveGame();
  renderAll();
}

function perkUnlocked(who, p) {
  if (p.h === 'partner') return S.partner === who;
  if (p.h === 'shop') return true;
  return hearts(who) >= p.h;
}

function heartRow(who) {
  const h = hearts(who);
  const frac = (S.rel[who].pts % 10) / 10;
  return `<div class="hearts" title="${S.rel[who].pts}/100 affection">${[...Array(10)].map((_, i) =>
    COMPANIONS[who].mentor ? `<span class="heart star ${i < h ? 'on' : ''}">${i < h ? '★' : '☆'}</span>` : `<span class="heart ${i < h ? 'on' : ''}">${i < h ? '♥' : '♡'}</span>`).join('')}
    ${h < 10 ? `<span class="heart-progress"><span style="width:${frac * 100}%"></span></span>` : ''}</div>`;
}

// ---------- companions tab ----------
function compCard(who) {
  const c = COMPANIONS[who];
  const met = S.rel[who].met;
  const available = !c.unlock || c.unlock();
  const expr = S.partner === who ? 'blush' : hearts(who) >= 6 ? 'happy' : CHAR_STYLE[who].defaultExpr;
  const visit = { anna: ['library', '📚 Visit Library'], cedric: ['ship', '⚓ Board the Gull'], alice: ['salon', '🫖 Visit Salon'], quinn: ['treasury', '🏦 Royal Treasury'], peter: ['frost', '❄️ Frost Library'] }[who];
  const unit = c.mentor ? '★' : '♥';
  return `
    <div class="comp-card ${c.mentor ? 'mentor' : ''}" style="--c:${c.color}">
      <div class="comp-scene" style="background:${c.bg}">
        <div class="comp-portrait ${met ? '' : 'silhouette'}">${portraitSVG(who, expr)}</div>
        ${S.support === who ? '<span class="comp-badge">🤝 Support</span>' : ''}
        ${S.partner === who ? '<span class="comp-badge partner">💍 Partner</span>' : ''}
        ${c.mentor ? '<span class="comp-badge partner mentor-badge">🎓 Mentor</span>' : ''}
      </div>
      <div class="comp-info">
        <h3>${met ? c.name : '???'} <small class="muted">${c.title}</small></h3>
        ${met ? heartRow(who) : `<p class="muted">${available ? `Ready to meet at the ${c.home.slice(2)}.` : c.unlockText}</p>`}
        ${met ? `<ul class="perks">${c.perks.map(p => `<li class="${perkUnlocked(who, p) ? 'on' : ''}">${perkUnlocked(who, p) ? '✔' : (p.h === 'partner' ? '💍' : `${p.h}${unit}`)} ${p.text}</li>`).join('')}</ul>` : ''}
        <div class="comp-actions">
          ${met ? `
            <button class="btn small" onclick="talkTo('${who}')">💬 Talk${S.daily.talked[who] ? ' ✓' : ''}</button>
            <button class="btn small" onclick="openGiftPicker('${who}')">🎁 Gift${S.daily.gifted[who] ? ' ✓' : ''}</button>
            <button class="btn small primary" onclick="compView='${visit[0]}';renderAll()">${visit[1]}</button>
            <button class="btn small ${S.support === who ? 'danger' : ''}" onclick="setSupport('${who}')">${S.support === who ? 'Remove support' : '🤝 Set as support'}</button>
            ${canPropose(who) ? `<button class="btn small love" onclick="proposeTo('${who}')">💍 Give Chrono Locket</button>` : ''}
          ` : `<button class="btn primary" ${available ? '' : 'disabled'} onclick="meetCompanion('${who}')">${available ? `${c.icon} Meet ${c.name}` : '🔒 Not yet'}</button>`}
        </div>
      </div>
    </div>`;
}

function renderCompanions() {
  const view = document.getElementById('view-town');
  if (compView === 'library') return renderLibrary(view);
  if (compView === 'ship') return renderShip(view);
  if (compView === 'salon') return renderSalon(view);
  if (compView === 'treasury') return renderTreasury(view);
  if (compView === 'frost') return renderFrost(view);
  resetDailyIfNeeded();
  view.innerHTML = `
    <h2 class="view-title">💞 Companions</h2>
    <p class="muted center">Bring one companion into each boss battle as support. Talk every day, give gifts, and fight side by side to grow closer.</p>
    <h3 class="section-title">💞 Companions <small class="muted">Friends and possible romance</small></h3>
    <div class="comp-list">${['anna', 'cedric', 'peter'].map(compCard).join('')}</div>
    <h3 class="section-title">🎓 Mentors <small class="muted">Aristocratic patrons who guide your journey</small></h3>
    <div class="comp-list">${['alice', 'quinn'].map(compCard).join('')}</div>`;
}

function backBar(who, line) {
  const c = COMPANIONS[who];
  return `
    <div class="place-head" style="background:${c.bg}">
      <button class="btn small ghost" onclick="compView='main';renderAll()">← Back</button>
      <div class="place-portrait">${portraitSVG(who, CHAR_STYLE[who].defaultExpr, { crop: 'bust' })}</div>
      <div class="bubble"><b>${c.name}:</b> ${line}</div>
    </div>`;
}

function renderLibrary(view) {
  const rows = [];
  Object.entries(SHOP_ITEMS).forEach(([id, it]) => { if (totalOf('items', id)) rows.push({ kind: 'items', id, label: `${it.emoji} ${it.name}` }); });
  Object.entries(CROPS).forEach(([id, c]) => { if (totalOf('produce', id)) rows.push({ kind: 'produce', id, label: `${c.emoji} ${c.name}` }); });
  const vault = unplacedArtifacts();
  const full = satchelCount() >= satchelCap();
  view.innerHTML = `
    ${backBar('anna', S.partner === 'anna' ? 'Welcome home, love! Everything\'s catalogued just the way you like it.' : 'Welcome to the archive! Your belongings are safe with me.')}
    <div class="market-grid">
      <section class="panel">
        <h3>🎒 Satchel <span class="muted">${satchelCount()} / ${satchelCap()}</span></h3>
        <div class="progress small-bar"><div style="width:${Math.min(100, satchelCount() / satchelCap() * 100)}%"></div></div>
        <p class="muted small">Only items in your satchel can be used in battle. Anything that won't fit comes straight here to the archive.</p>
        ${rows.length ? `<table class="store-table"><tr><th>Item</th><th>Satchel</th><th>Archive</th><th></th></tr>
          ${rows.map(r => `<tr><td>${r.label}</td><td>${S[r.kind][r.id] || 0}</td><td>${S.library[r.kind][r.id] || 0}</td>
            <td><button class="btn small" ${(S[r.kind][r.id] || 0) ? '' : 'disabled'} onclick="moveStore('${r.kind}','${r.id}','in')">Store ➜</button>
                <button class="btn small" ${(S.library[r.kind][r.id] || 0) && !full ? '' : 'disabled'} onclick="moveStore('${r.kind}','${r.id}','out')">⬅ Take</button></td></tr>`).join('')}
        </table>
        <div class="btn-row"><button class="btn small" onclick="storeAllProduce()">Store all crops</button></div>` : '<p class="muted">Nothing stored yet.</p>'}
      </section>
      <section class="panel">
        <h3>📜 Anna's Guardian Notes</h3>
        <p class="muted small">Anna's research on every guardian you've found so far.</p>
        ${ERAS.filter(e => eraUnlocked(e)).map(e => `
          <details class="hint-box" ${S.bosses[e.id] ? '' : 'open'}>
            <summary>${e.boss.emoji} ${e.boss.name} ${S.bosses[e.id] ? '✅' : ''}</summary>
            <ul>${BOSS_HINTS[e.id].map(h => `<li>${h}</li>`).join('')}</ul>
          </details>`).join('')}
      </section>
      <section class="panel">
        <h3>🏺 Artifacts in Storage</h3>
        ${vault.length ? `<ul class="sell-list">${vault.map(id => `<li>${ARTIFACTS[id].emoji} ${ARTIFACTS[id].name} <small class="muted">${bonusText(ARTIFACTS[id].bonus)}</small></li>`).join('')}</ul>
          <p class="muted small">Display these on your homestead to activate them.</p>` : '<p class="muted">No artifacts in storage. Everything you\'ve found is on display!</p>'}
      </section>
    </div>`;
}

function moveStore(kind, id, dir) {
  if (dir === 'in') {
    if (!S[kind][id]) return;
    S[kind][id]--;
    S.library[kind][id] = (S.library[kind][id] || 0) + 1;
  } else {
    if (!S.library[kind][id] || satchelCount() >= satchelCap()) return;
    S.library[kind][id]--;
    S[kind][id] = (S[kind][id] || 0) + 1;
  }
  saveGame(); renderAll();
}

function storeAllProduce() {
  for (const id in S.produce) {
    S.library.produce[id] = (S.library.produce[id] || 0) + S.produce[id];
    S.produce[id] = 0;
  }
  saveGame(); renderAll();
}

function renderShip(view) {
  const h = hearts('cedric');
  const st = stats();
  const owned = Object.keys(CARDS).filter(id => S.cards[id]);
  view.innerHTML = `
    ${backBar('cedric', S.shipStolen ? 'Welcome to… a borrowed rowboat. Jane took everything. I did save your deck crate, though!' : S.partner === 'cedric' ? 'Welcome aboard, co-captain. Take whatever you need.' : 'Welcome aboard the Gilded Gull! Finest cards in seven centuries.')}
    <section class="panel">
      <h3>🃏 Cedric's Card Shop <span class="muted">🪙 ${S.coins}</span></h3>
      ${S.shipStolen ? `<div class="heist-banner">🏴‍☠️ Lady Jane has stolen the Gilded Gull! "My whole stock was in the hold… Help me get her back and the shop reopens."</div>` : `
      <div class="card-row">
        ${SHOP_CARDS.map(sc => {
          const locked = h < sc.hearts;
          return `<div class="shop-card ${locked ? 'locked' : ''}">
            ${cardHTML(sc.id, { st })}
            ${locked ? `<button class="btn small" disabled>🔒 ${sc.hearts}♥</button>`
              : `<button class="btn small primary" ${S.coins < price(sc.price) ? 'disabled' : ''} onclick="buyCard('${sc.id}',${sc.price})">🪙 ${price(sc.price)}</button>`}
          </div>`;
        }).join('')}
      </div>`}
    </section>
    <section class="panel deck-panel">
      <h3>📦 Your Deck <span class="muted">${deckSize()} cards (min ${DECK_MIN}, max ${DECK_MAX})</span></h3>
      <p class="muted small">Each turn in battle you draw 5 cards and get 3 Chrono Points (CP) to play them. Solve new puzzles to have Cedric forge more cards for you.</p>
      <div class="card-row">
        ${owned.map(id => `<div class="deck-card">
          ${cardHTML(id, { st, count: S.cards[id] })}
          <div class="deck-ctrl">
            <button class="btn small" ${(S.deck[id] || 0) <= 0 || deckSize() <= DECK_MIN ? 'disabled' : ''} onclick="deckAdjust('${id}',-1)">−</button>
            <span>In deck: <b>${S.deck[id] || 0}</b></span>
            <button class="btn small" ${(S.deck[id] || 0) >= S.cards[id] || deckSize() >= DECK_MAX ? 'disabled' : ''} onclick="deckAdjust('${id}',1)">+</button>
          </div></div>`).join('')}
      </div>
    </section>`;
}

function buyCard(id, base) {
  const cost = price(base);
  if (S.coins < cost || S.shipStolen) return;
  S.coins -= cost;
  grantCard(id);
  toast(`🃏 Cedric hands you <b>${CARDS[id].name}</b>. "Pleasure doing business!"`);
  saveGame(); renderAll();
}

function deckAdjust(id, d) {
  const cur = S.deck[id] || 0;
  if (d > 0 && (cur >= S.cards[id] || deckSize() >= DECK_MAX)) return;
  if (d < 0 && (cur <= 0 || deckSize() <= DECK_MIN)) return;
  S.deck[id] = cur + d;
  saveGame(); renderAll();
}

function giveDish(who, id) {
  const c = COMPANIONS[who];
  if (!S.dishes[id]) return;
  S.dishes[id]--;
  let pts = FAV_DISH[who] === id ? 40 : 20;
  if (who !== 'alice' && hearts('alice') >= 2) pts = Math.round(pts * 1.5);
  const bday = isBirthday(who);
  if (bday) pts *= 2;
  S.daily.gifted[who] = true;
  const gained = addAffection(who, pts);
  saveGame();
  closeStage();
  const line = FAV_DISH[who] === id ? ['happy', 'My FAVOURITE! You cooked this yourself? I could cry. I might cry.'] : ['smile', 'Home cooking! Thank you, it smells wonderful.'];
  playScene([N(`You give ${c.name} a ${DISHES[id].emoji} ${DISHES[id].name}.`), L(who, line[0], line[1]), ...(bday ? [L(who, 'happy', 'On my birthday, too! 🎂')] : [])], () => { heartPopup(who, gained, pts); renderAll(); });
}

// ---------- Peter's Frost Library: card exchange ----------
function exchangeCard(id) {
  if ((S.cards[id] || 0) < 2) return;
  S.cards[id] -= 2;
  if ((S.deck[id] || 0) > S.cards[id]) S.deck[id] = S.cards[id];
  const pool = Object.keys(CARDS).filter(c => c !== 'promise' && !S.cards[c]);
  const fallback = Object.keys(CARDS).filter(c => c !== 'promise' && CARDS[c].rarity);
  const list = pool.length ? pool : fallback;
  const got = list[Math.floor(Math.random() * list.length)];
  grantCard(got);
  if (deckSize() < DECK_MIN) S.deck[got] = (S.deck[got] || 0);
  while (deckSize() < DECK_MIN) {
    const add = Object.keys(S.cards).find(c => (S.deck[c] || 0) < S.cards[c]);
    if (!add) break;
    S.deck[add] = (S.deck[add] || 0) + 1;
  }
  sfx('success');
  saveGame();
  openStage(`<div class="stage-card intro" style="--era:#5f86b8">${portraitSVG('peter', 'smirk', { crop: 'head', cls: 'mini' })}
    <h2>❄️ Exchange complete</h2><p><b>Peter:</b> "A fair trade. Well, fair-ish. In your favour, as it happens."</p>${cardHTML(got)}
    <div class="btn-row"><button class="btn primary" onclick="closeStage()">Thanks, Peter</button></div></div>`, COMPANIONS.peter.bg);
}

function renderFrost(view) {
  const st = stats();
  const dupes = Object.keys(CARDS).filter(id => (S.cards[id] || 0) >= 2);
  view.innerHTML = `
    ${backBar('peter', S.partner === 'peter' ? 'Welcome home, darling. I\'ve alphabetised your socks. Don\'t ask.' : 'Welcome to the Frost Library. Mind the icicles, and do keep your voice down.')}
    <section class="panel">
      <h3>🔄 Card Exchange</h3>
      <p class="muted small">Give Peter two copies of a card and he'll trade you one you don't own yet (or a rare card if you've collected everything).</p>
      ${dupes.length ? `<div class="card-row">${dupes.map(id => `<div class="deck-card">${cardHTML(id, { st, count: S.cards[id] })}<button class="btn small primary" onclick="exchangeCard('${id}')">Trade 2 ➜ ❓</button></div>`).join('')}</div>` : '<p class="muted">You have no duplicate cards right now. Buy extras from Cedric, or win them at festivals.</p>'}
    </section>
    <section class="panel deck-panel">
      <h3>📚 Peter's Reading Room</h3>
      <ul class="hint-box-list">
        <li>Chain cards (🌀 Flurry, 🪲 Scarab Swarm, ♛ Queen's Gambit…) deal +50% if you've already attacked that turn, so play a cheap attack first.</li>
        <li>Elite rematches (⚡ in the Time Portal) turn a boss's trophy card golden: one free upgrade level, stacking with Lady Alice's Masterclass.</li>
        <li>The Endless Rift rewards patience: resting between floors is often wiser than taking another card.</li>
      </ul>
    </section>`;
}
