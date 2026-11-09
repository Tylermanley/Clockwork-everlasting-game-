// ============================================================
//  Clockwork Everlasting — animated anime-style character portraits (SVG)
//  Expressions: neutral, smile, happy, blush, surprised, sad, determined, smirk
// ============================================================

let _pid = 0;

const CHAR_STYLE = {
  anna: {
    skin: '#fde3d0', shade: '#f0c2a8', hair: '#9a4a2f', hairDark: '#6b2c1b', hairShine: '#e09372',
    irisTop: '#1d5638', irisBot: '#6fd49a', brow: '#6b2c1b', defaultExpr: 'smile',
  },
  cedric: {
    skin: '#f3c9a3', shade: '#dfa67f', hair: '#262a42', hairDark: '#14162a', hairShine: '#5c6690',
    irisTop: '#7a3e0a', irisBot: '#f5b53a', brow: '#14162a', defaultExpr: 'smirk', narrow: true,
  },
  peter: {
    skin: '#fbe9e0', shade: '#e8cbbd', hair: '#ead9a0', hairDark: '#bfa463', hairShine: '#fffbe8',
    irisTop: '#34404f', irisBot: '#b3c8dc', brow: '#a88c4c', defaultExpr: 'smirk', narrow: true,
  },
  alice: {
    skin: '#fbe4d6', shade: '#ecc3ad', hair: '#3a2a3a', hairDark: '#1f1524', hairShine: '#8a74a0',
    irisTop: '#1d3c7a', irisBot: '#7fb2ff', brow: '#2a1d2c', defaultExpr: 'smile',
  },
  quinn: {
    skin: '#f5d2b8', shade: '#d9ab8c', hair: '#c3c6ce', hairDark: '#878b95', hairShine: '#ffffff',
    irisTop: '#4a3210', irisBot: '#d4a443', brow: '#8e929c', defaultExpr: 'smile', narrow: true,
  },
  jane: {
    skin: '#e9b892', shade: '#cf946c', hair: '#cdd0d9', hairDark: '#8e93a3', hairShine: '#ffffff',
    irisTop: '#1f4f4f', irisBot: '#63b8ad', brow: '#7d8290', defaultExpr: 'smirk', narrow: true,
  },
  hero: {
    skin: '#fbe0cc', shade: '#ecbfa3', hair: '#6a4428', hairDark: '#45291a', hairShine: '#b07a4e',
    irisTop: '#1d3f8a', irisBot: '#74b8ff', brow: '#45291a', defaultExpr: 'determined',
  },
};

const EMOTES = { angry: '💢', wink: '✦', cry: '💧', happy: '♪', blush: '💗', surprised: '❗', sad: '💧', determined: '🔥', smirk: '✦' };

function eyeSVG(cx, cy, flip, st, id, expr) {
  if (expr === 'happy') {
    return `<g transform="translate(${cx} ${cy})"><path d="M-12 3 Q1 -10 14 3" transform="scale(${flip} 1)" fill="none" stroke="#2a1a1a" stroke-width="3.4" stroke-linecap="round"/></g>`;
  }
  const clip = `pc${id}${flip > 0 ? 'r' : 'l'}`;
  const sclera = 'M-12 0 Q-6 -13 6 -12 Q13 -10 14 -3 Q13 10 2 13 Q-10 12 -12 0 Z';
  const sy = st.narrow ? 0.82 : 1;
  const irisR = expr === 'surprised' ? 0.8 : 1;
  return `
  <g transform="translate(${cx} ${cy}) scale(1 ${sy})">
    <g class="eye-open">
      <defs>
        <clipPath id="${clip}"><path d="${sclera}" transform="scale(${flip} 1)"/></clipPath>
        <linearGradient id="g${clip}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${st.irisTop}"/><stop offset="1" stop-color="${st.irisBot}"/></linearGradient>
      </defs>
      <path d="${sclera}" transform="scale(${flip} 1)" fill="#fff"/>
      <g clip-path="url(#${clip})">
        <ellipse cx="${flip}" cy="1" rx="${8.5 * irisR}" ry="${11.5 * irisR}" fill="url(#g${clip})"/>
        <ellipse cx="${flip}" cy="1" rx="${8.5 * irisR}" ry="${11.5 * irisR}" fill="none" stroke="${st.irisTop}" stroke-width="1.3"/>
        <ellipse cx="${flip}" cy="2.5" rx="${4 * irisR}" ry="${6 * irisR}" fill="#120c18"/>
        <path d="M-16 -14 L16 -14 L16 -6 Q1 -10 -16 -4Z" fill="rgba(0,0,0,.2)"/>
      </g>
      <circle cx="${-3.5}" cy="-3" r="3.4" fill="#fff"/>
      <circle cx="${3.5}" cy="6" r="1.6" fill="#fff" opacity=".9"/>
      <g transform="scale(${flip} 1)">
        <path d="M-13 -1 Q-6 -15 6 -13.5 Q13 -12 16 -4" fill="none" stroke="#2a1a1a" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M14 -6 L19.5 -9.5" stroke="#2a1a1a" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M-6 12 Q3 15 10 10" fill="none" stroke="#2a1a1a" stroke-width="1.1" opacity=".55"/>
      </g>
    </g>
  </g>`;
}

function browSVG(cx, cy, flip, st, expr) {
  const d = {
    sad: 'M-11 -27 Q1 -26 13 -21',
    determined: 'M-11 -19 Q1 -23 13 -27',
    surprised: 'M-11 -28 Q1 -33 13 -28',
    smirk: flip > 0 ? 'M-11 -24 Q1 -29 13 -25' : 'M-11 -21 Q1 -24 13 -22',
  }[expr] || 'M-11 -23 Q1 -27 13 -23';
  return `<g transform="translate(${cx} ${cy}) scale(${flip} 1)"><path d="${d}" fill="none" stroke="${st.brow}" stroke-width="2.4" stroke-linecap="round"/></g>`;
}

function mouthSVG(expr) {
  const line = d => `<path d="${d}" fill="none" stroke="#9a4a3a" stroke-width="2" stroke-linecap="round"/>`;
  const shut = {
    neutral: line('M94 141 Q100 143 106 141'),
    smile: line('M92 139 Q100 146 108 139'),
    blush: line('M94 140 Q100 144 106 140'),
    smirk: line('M93 142 Q102 144 109 137'),
    determined: line('M94 142 L106 141'),
    sad: line('M94 144 Q100 139 106 144'),
    surprised: '<ellipse cx="100" cy="142" rx="3.6" ry="4.6" fill="#7a2a2a"/>',
    happy: '<path d="M91 137 Q100 153 109 137 Z" fill="#7a2a2a"/><path d="M95 145 Q100 141 105 145 Q100 151 95 145Z" fill="#ec7a80"/>',
    angry: '<path d="M93 145 Q100 138 107 145" fill="none" stroke="#7a2a2a" stroke-width="2.6" stroke-linecap="round"/>',
    wink: line('M92 139 Q100 147 108 139'),
    cry: '<path d="M92 142 Q96 138 100 142 Q104 138 108 142" fill="none" stroke="#9a4a3a" stroke-width="2" stroke-linecap="round"/>',
  }[expr] || line('M94 141 Q100 143 106 141');
  return `<g class="mouth"><g class="m-shut">${shut}</g><g class="m-open"><path d="M94 139 Q100 137 106 139 Q105 148 100 148 Q95 148 94 139Z" fill="#7a2a2a"/><path d="M96 145 Q100 143 104 145 Q100 148 96 145Z" fill="#ec7a80"/></g></g>`;
}

function blushSVG(expr) {
  const strong = expr === 'blush' || expr === 'happy';
  const op = strong ? 0.6 : 0.22;
  const hatch = strong
    ? `<g stroke="#e0607e" stroke-width="1.2" stroke-linecap="round" opacity=".8">
        <path d="M71 125 l-3 5 M76 125 l-3 5 M81 125 l-3 5"/><path d="M121 125 l-3 5 M126 125 l-3 5 M131 125 l-3 5"/></g>` : '';
  return `<g class="blush"><ellipse cx="77" cy="128" rx="10" ry="5" fill="#ff8fa3" opacity="${op}"/><ellipse cx="123" cy="128" rx="10" ry="5" fill="#ff8fa3" opacity="${op}"/>${hatch}</g>`;
}

const FACE_PATH = 'M60 92 Q59 128 78 149 Q92 163 100 164 Q108 163 122 149 Q141 128 140 92 Q140 48 100 46 Q60 48 60 92Z';

function charParts(id, st) {
  if (id === 'anna') {
    return {
      back: `<path d="M56 80 Q50 34 100 28 Q150 34 144 80 Q152 140 160 205 Q150 222 132 214 Q140 170 128 150 L72 150 Q60 170 68 214 Q50 222 40 205 Q48 140 56 80Z" fill="${st.hair}"/>
             <path d="M64 120 Q60 170 70 210" stroke="${st.hairDark}" stroke-width="2" fill="none" opacity=".5"/><path d="M136 120 Q140 170 130 210" stroke="${st.hairDark}" stroke-width="2" fill="none" opacity=".5"/>`,
      body: `<path d="M28 240 Q30 196 70 186 L88 180 L112 180 L130 186 Q170 196 172 240Z" fill="#3c8c86"/>
             <path d="M70 186 Q60 210 64 240 M130 186 Q140 210 136 240" stroke="#2b6b66" stroke-width="2" fill="none"/>
             <path d="M86 179 L100 214 L114 179 L106 177 L100 192 L94 177Z" fill="#fffaf2"/>
             <path d="M88 184 L78 192 L88 196Z M112 184 L122 192 L112 196Z" fill="#fffaf2" stroke="#ddd" stroke-width=".8"/>
             <path d="M100 186 L88 180 L88 194Z" fill="#d6454f"/><path d="M100 186 L112 180 L112 194Z" fill="#d6454f"/>
             <circle cx="100" cy="187" r="3.5" fill="#b8323d"/>
             <circle cx="82" cy="222" r="2.5" fill="#e8d9a8"/><circle cx="118" cy="222" r="2.5" fill="#e8d9a8"/>`,
      side: `<path d="M62 88 Q53 130 60 178 Q66 170 71 160 Q64 128 70 96Z" fill="${st.hair}"/><path d="M138 88 Q147 130 140 178 Q134 170 129 160 Q136 128 130 96Z" fill="${st.hair}"/>`,
      front: `<path d="M57 96 Q52 40 100 36 Q148 40 143 96 L136 78 L131 93 L121 66 L113 90 L102 62 L94 88 L84 66 L76 91 L66 76 L62 96Z" fill="${st.hair}"/>
              <path d="M84 66 L80 84 M121 66 L124 84 M102 62 L101 80" stroke="${st.hairDark}" stroke-width="1.5" opacity=".5"/>`,
      shine: `<path d="M68 58 Q100 42 132 58 Q100 50 68 63Z" fill="${st.hairShine}" opacity=".75"/>`,
      acc: `<g fill="rgba(210,235,255,.18)" stroke="#6b4a2a" stroke-width="2.2"><circle cx="80" cy="109" r="16"/><circle cx="120" cy="109" r="16"/></g>
            <path d="M96 106 Q100 102 104 106" stroke="#6b4a2a" stroke-width="2" fill="none"/>
            <path d="M70 100 L76 96 M110 100 L116 96" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
            <g transform="translate(134 60)"><circle r="7" fill="#ffb3c7"/><circle r="3" fill="#ffe27a"/><circle cx="-6" cy="5" r="5" fill="#ff9ab5"/></g>`,
    };
  }
  if (id === 'cedric') {
    return {
      back: `<path d="M58 86 Q54 40 100 34 Q146 40 142 86 Q147 114 141 136 L133 126 L131 144 L121 130 L79 130 L69 144 L67 126 L59 136 Q53 114 58 86Z" fill="${st.hair}"/>`,
      body: `<path d="M24 240 Q28 194 68 184 L88 178 L112 178 L132 184 Q172 194 176 240Z" fill="#1f2d5a"/>
             <path d="M88 178 L96 240 M112 178 L104 240" stroke="#e3b341" stroke-width="3"/>
             <path d="M90 178 Q100 194 110 178 L107 200 Q100 208 93 200Z" fill="#fff"/>
             <g fill="#e3b341"><ellipse cx="50" cy="194" rx="16" ry="7"/><ellipse cx="150" cy="194" rx="16" ry="7"/>
             <circle cx="84" cy="216" r="3"/><circle cx="116" cy="216" r="3"/><circle cx="86" cy="232" r="3"/><circle cx="114" cy="232" r="3"/></g>
             <path d="M38 198 l-2 10 M44 200 l-1 10 M50 201 l0 10 M56 200 l1 10 M62 198 l2 10 M138 198 l-2 10 M144 200 l-1 10 M150 201 l0 10 M156 200 l1 10 M162 198 l2 10" stroke="#e3b341" stroke-width="1.6"/>`,
      side: `<path d="M61 92 Q57 118 62 136 L68 124 Q64 108 67 96Z" fill="${st.hair}"/><path d="M139 92 Q143 118 138 136 L132 124 Q136 108 133 96Z" fill="${st.hair}"/>`,
      front: `<path d="M58 98 Q54 52 100 46 Q146 52 142 98 L135 82 L129 98 L119 72 L111 95 L100 68 L91 94 L82 74 L73 99 L66 84Z" fill="${st.hair}"/>
              <path d="M100 68 L96 86 M119 72 L122 88" stroke="${st.hairDark}" stroke-width="1.5" opacity=".6"/>`,
      shine: `<path d="M74 62 Q100 54 126 62 Q100 58 74 66Z" fill="${st.hairShine}" opacity=".8"/>`,
      acc: `<path d="M56 68 Q60 22 100 16 Q140 22 144 68Z" fill="#1a2140"/>
            <path d="M28 72 Q100 40 172 72 Q162 84 140 72 Q100 58 60 72 Q38 84 28 72Z" fill="#121831" stroke="#e3b341" stroke-width="2.5"/>
            <path d="M58 62 Q100 50 142 62" stroke="#e3b341" stroke-width="3" fill="none"/>
            <g transform="translate(100 40)" fill="#e3b341"><path d="M0 -9 L2.6 -3 L9 -3 L4 1 L6 8 L0 4 L-6 8 L-4 1 L-9 -3 L-2.6 -3Z"/></g>
            <circle cx="58" cy="120" r="2.8" fill="none" stroke="#e3b341" stroke-width="1.8"/>
            <path d="M126 125 L134 119" stroke="#c98a6a" stroke-width="1.8" stroke-linecap="round"/>`,
    };
  }
  if (id === 'peter') {
    // Dark-academia scholar: tousled fringe, wire glasses, tweed blazer, burgundy vest, striped tie
    return {
      back: `<path d="M58 88 Q54 40 100 34 Q146 40 142 88 Q146 114 140 132 L60 132 Q54 114 58 88Z" fill="${st.hair}"/>`,
      body: `<path d="M24 240 Q28 194 68 184 L88 178 L112 178 L132 184 Q172 194 176 240Z" fill="#5b4632"/>
             <g stroke="#7a6248" stroke-width="1" opacity=".45"><path d="M40 214 l8 -8 M48 222 l8 -8 M140 206 l8 8 M150 216 l8 8 M36 232 l8 -8 M152 230 l8 8"/></g>
             <path d="M86 182 L100 208 L114 182 L116 240 L84 240Z" fill="#6b2433"/>
             <path d="M88 186 L100 210 L112 186" stroke="#4e1824" stroke-width="2" fill="none"/>
             <path d="M88 178 L83 189 L98 193Z M112 178 L117 189 L102 193Z" fill="#f6f1e6"/>
             <path d="M96 186 L104 186 L103 193 L97 193Z" fill="#23284a"/>
             <path d="M97 193 L103 193 L106 224 L100 232 L94 224Z" fill="#23284a"/>
             <path d="M96 200 L104 203 M95 210 L105 213 M95 220 L105 223" stroke="#d9c79a" stroke-width="1.6"/>
             <path d="M88 178 L70 193 L80 205 L74 212 L92 240 L97 240 L99 208Z" fill="#4a3826"/>
             <path d="M112 178 L130 193 L120 205 L126 212 L108 240 L103 240 L101 208Z" fill="#4a3826"/>
             <rect x="122" y="208" width="3" height="14" rx="1" fill="#d9b44a" transform="rotate(8 123 215)"/>
             <g transform="translate(80 210)" stroke="#e8f4ff" stroke-width="1.6" stroke-linecap="round"><path d="M0 -6 L0 6 M-5 -3 L5 3 M-5 3 L5 -3"/></g>`,
      side: `<path d="M61 90 Q56 114 62 132 L68 120 Q64 104 67 94Z" fill="${st.hair}"/><path d="M139 90 Q144 114 138 132 L132 120 Q136 104 133 94Z" fill="${st.hair}"/>`,
      front: `<path d="M58 96 Q52 44 100 38 Q148 44 142 96 L138 80 Q134 90 127 95 Q130 80 122 71 Q114 88 98 93 Q108 80 104 68 Q92 86 74 90 Q81 80 80 71 Q68 84 62 98Z" fill="${st.hair}"/>
              <path d="M104 68 Q110 78 98 93 M122 71 Q128 84 127 95 M80 71 Q78 82 74 90" stroke="${st.hairDark}" stroke-width="1.4" fill="none" opacity=".55"/>`,
      shine: `<path d="M70 56 Q100 44 130 54 Q100 49 70 60Z" fill="${st.hairShine}" opacity=".85"/>`,
      acc: `<g fill="rgba(220,235,255,.14)" stroke="#b8975a" stroke-width="1.8"><ellipse cx="80" cy="109" rx="16" ry="13.5"/><ellipse cx="120" cy="109" rx="16" ry="13.5"/></g>
            <path d="M96 107 Q100 104 104 107 M64 106 L59 104 M136 106 L141 104" stroke="#b8975a" stroke-width="1.8" fill="none"/>
            <path d="M70 101 L75 98 M110 101 L115 98" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/>`,
    };
  }
  if (id === 'alice') {
    // Aristocratic mentor in a blue gown: elegant updo, tiara, pearls, sapphire brooch
    return {
      back: `<circle cx="100" cy="32" r="20" fill="${st.hair}"/><path d="M84 30 Q100 18 116 30" stroke="${st.hairDark}" stroke-width="2" fill="none" opacity=".6"/>
             <path d="M58 88 Q54 42 100 36 Q146 42 142 88 Q144 112 138 126 L62 126 Q56 112 58 88Z" fill="${st.hair}"/>`,
      body: `<path d="M24 240 Q28 196 66 186 L88 180 L112 180 L134 186 Q172 196 176 240Z" fill="#3d6fb6"/>
             <ellipse cx="52" cy="198" rx="21" ry="13" fill="#4f82cc"/><ellipse cx="148" cy="198" rx="21" ry="13" fill="#4f82cc"/>
             <path d="M80 188 L100 240 L120 188" fill="#2f5a99"/>
             <path d="M80 188 L100 240 L120 188 M40 214 Q100 226 160 214" stroke="#e3c872" stroke-width="1.6" fill="none"/>
             <path d="M86 170 Q100 180 114 170 L117 182 Q100 195 83 182Z" fill="#f4f6ff"/>
             <path d="M84 182 q4 4 8 1 q4 4 8 1 q4 4 8 1 q4 4 8 1" stroke="#cfd6ec" stroke-width="1.2" fill="none"/>
             <g fill="#fffdf6" stroke="#d9d2bf" stroke-width=".6">${[...Array(9)].map((_, i) => { const a = Math.PI * (0.15 + 0.7 * i / 8); return `<circle cx="${100 - 22 * Math.cos(a)}" cy="${186 + 10 * Math.sin(a)}" r="2.1"/>`; }).join('')}</g>
             <path d="M100 196 L107 204 L100 212 L93 204Z" fill="#1f4fa8" stroke="#e3c872" stroke-width="1.8"/><path d="M98 200 L101 199" stroke="#fff" stroke-width="1.2"/>`,
      side: `<path d="M63 92 Q56 122 63 152 Q68 142 66 132 Q61 114 69 96Z" fill="${st.hair}"/><path d="M137 92 Q144 122 137 152 Q132 142 134 132 Q139 114 131 96Z" fill="${st.hair}"/>`,
      front: `<path d="M58 98 Q54 44 100 40 Q146 44 142 98 Q136 74 116 64 Q106 70 100 60 Q94 70 84 64 Q64 74 58 98Z" fill="${st.hair}"/>
              <path d="M100 60 Q98 52 100 42 M116 64 Q128 72 136 86 M84 64 Q72 72 64 86" stroke="${st.hairDark}" stroke-width="1.4" fill="none" opacity=".6"/>`,
      shine: `<path d="M72 56 Q100 44 128 56 Q100 50 72 60Z" fill="${st.hairShine}" opacity=".8"/>`,
      acc: `<path d="M76 50 L82 40 L88 47 L94 36 L100 44 L106 36 L112 47 L118 40 L124 50 Q100 42 76 50Z" fill="#e8ecf5" stroke="#b9c2d6" stroke-width="1"/>
            <path d="M100 38 L104 43 L100 48 L96 43Z" fill="#3a7bff" stroke="#fff" stroke-width=".8"/>
            <circle cx="58" cy="124" r="3" fill="#fffdf6" stroke="#d9d2bf" stroke-width=".6"/><circle cx="142" cy="124" r="3" fill="#fffdf6" stroke="#d9d2bf" stroke-width=".6"/>`,
    };
  }
  if (id === 'quinn') {
    // Minister of the Treasury: silver hair, moustache, monocle, tailcoat, money-green waistcoat, gold coin pin
    return {
      back: `<path d="M60 86 Q56 42 100 36 Q144 42 140 86 Q142 108 136 120 L64 120 Q58 108 60 86Z" fill="${st.hair}"/>`,
      body: `<path d="M24 240 Q28 194 68 184 L88 178 L112 178 L132 184 Q172 194 176 240Z" fill="#1c1c24"/>
             <path d="M84 186 L92 240 L108 240 L116 186 L100 212Z" fill="#2f5a40"/>
             <g fill="#e3b341"><circle cx="96" cy="222" r="2.2"/><circle cx="104" cy="222" r="2.2"/><circle cx="97" cy="233" r="2.2"/><circle cx="103" cy="233" r="2.2"/></g>
             <path d="M90 228 Q100 236 112 224" stroke="#e3b341" stroke-width="1.6" fill="none"/>
             <path d="M88 178 L72 194 L82 206 L76 212 L90 240 L92 240 L84 186Z M112 178 L128 194 L118 206 L124 212 L110 240 L108 240 L116 186Z" fill="#2a2a34" stroke="#c9a54a" stroke-width=".8"/>
             <path d="M88 176 L100 190 L112 176 L110 171 L100 182 L90 171Z" fill="#fff"/>
             <path d="M94 186 Q100 180 106 186 Q104 200 100 202 Q96 200 94 186Z" fill="#d9b44a"/>
             <circle cx="100" cy="193" r="3.6" fill="#f6d77a" stroke="#a87f1e" stroke-width="1"/>
             <circle cx="70" cy="214" r="5.5" fill="#e3b341" stroke="#a87f1e" stroke-width="1.2"/><circle cx="70" cy="214" r="2.6" fill="none" stroke="#a87f1e" stroke-width="1"/>`,
      side: `<path d="M61 92 Q58 112 64 128 L68 112 Q65 102 66 94Z" fill="${st.hair}"/><path d="M139 92 Q142 112 136 128 L132 112 Q135 102 134 94Z" fill="${st.hair}"/>`,
      front: `<path d="M60 96 Q56 46 100 40 Q144 46 140 96 Q138 76 126 66 Q100 58 80 64 Q66 72 60 96Z" fill="${st.hair}"/>
              <path d="M80 64 Q100 56 126 66 M74 72 Q100 62 132 76" stroke="${st.hairDark}" stroke-width="1.3" fill="none" opacity=".6"/>`,
      shine: `<path d="M74 54 Q100 44 126 52 Q100 49 74 58Z" fill="${st.hairShine}" opacity=".8"/>`,
      acc: `<g stroke="${st.shade}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".9"><path d="M84 76 Q100 72 116 76"/><path d="M70 121 Q78 124 86 121 M114 121 Q122 124 130 121"/></g>
            <path d="M85 134 Q93 128 100 132 Q107 128 115 134 Q110 140 100 137 Q90 140 85 134Z" fill="${st.hairDark}"/>
            <circle cx="120" cy="109" r="15" fill="rgba(220,240,255,.18)" stroke="#d9b44a" stroke-width="2.4"/>
            <path d="M112 100 L117 97" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <path d="M134 116 Q146 140 138 176" stroke="#d9b44a" stroke-width="1.3" fill="none"/>`,
    };
  }
  if (id === 'jane') {
    return {
      back: `<path d="M54 84 Q48 36 100 30 Q152 36 146 84 Q154 130 158 190 Q148 204 134 196 Q140 160 130 146 L70 146 Q60 160 66 196 Q52 204 42 190 Q46 130 54 84Z" fill="${st.hair}"/>
             <path d="M60 110 Q54 150 60 190 M140 110 Q146 150 140 190" stroke="${st.hairDark}" stroke-width="2" fill="none" opacity=".6"/>`,
      body: `<path d="M22 240 Q26 192 66 182 L88 178 L112 178 L134 182 Q174 192 178 240Z" fill="#8e1f2a"/>
             <path d="M66 182 Q56 210 60 240 M134 182 Q144 210 140 240" stroke="#e3b341" stroke-width="3" fill="none"/>
             <path d="M86 178 Q78 190 86 196 Q78 204 88 210 L100 222 L112 210 Q122 204 114 196 Q122 190 114 178Z" fill="#fffaf2" stroke="#e5d9c3" stroke-width="1"/>
             <path d="M94 186 Q100 190 106 186 M93 198 Q100 202 107 198" stroke="#d8cbb2" stroke-width="1.2" fill="none"/>
             <path d="M24 226 Q100 206 176 226 L178 240 L22 240Z" fill="#2b1a12"/><rect x="92" y="219" width="16" height="12" rx="2" fill="#e3b341"/>`,
      side: `<path d="M60 88 Q50 134 58 182 Q66 172 70 160 Q62 128 68 96Z" fill="${st.hair}"/><path d="M140 88 Q150 134 142 182 Q134 172 130 160 Q138 128 132 96Z" fill="${st.hair}"/>`,
      front: `<path d="M57 98 Q52 46 100 40 Q148 46 143 98 Q138 80 126 70 Q118 84 104 88 Q112 76 108 66 Q92 84 70 86 Q78 78 80 70 Q64 80 57 98Z" fill="${st.hair}"/>
              <path d="M108 66 Q118 74 126 70 M80 70 Q74 80 70 86" stroke="${st.hairDark}" stroke-width="1.5" fill="none" opacity=".6"/>`,
      shine: `<path d="M76 56 Q100 46 124 54 Q100 50 76 60Z" fill="${st.hairShine}" opacity=".7"/>`,
      acc: `<g stroke="${st.shade}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".9">
              <path d="M85 131 Q82 139 87 146"/><path d="M115 131 Q118 139 113 146"/>
              <path d="M136 104 l5 -2 M136 109 l6 0 M136 114 l5 2"/><path d="M110 120 Q120 123 130 119"/></g>
            <path d="M118 124 L132 132" stroke="#b9774f" stroke-width="2" stroke-linecap="round"/>
            <path d="M92 101 L120 70" stroke="#1a1012" stroke-width="2.4"/><path d="M67 104 L56 99" stroke="#1a1012" stroke-width="2.4"/>
            <ellipse cx="80" cy="109" rx="15" ry="13" fill="#1a1012"/><ellipse cx="76" cy="104" rx="5" ry="3" fill="#4a3a3c" opacity=".7"/>
            <circle cx="141" cy="122" r="4.5" fill="none" stroke="#e3b341" stroke-width="2.2"/>
            <path d="M48 70 Q56 26 100 22 Q144 26 152 70Z" fill="#4a1520"/>
            <path d="M22 74 Q60 40 100 52 Q140 40 178 74 Q164 86 142 74 Q100 60 58 74 Q36 86 22 74Z" fill="#3a0f18" stroke="#e3b341" stroke-width="2.5"/>
            <path d="M52 64 Q100 50 148 64" stroke="#e3b341" stroke-width="3" fill="none"/>
            <path d="M126 48 Q160 10 186 22 Q166 24 150 40 Q170 30 182 38 Q160 40 142 56Z" fill="#d6454f"/>
            <path d="M132 50 Q158 26 180 26" stroke="#9e2a33" stroke-width="1.4" fill="none"/>
            <g transform="translate(100 40)"><circle r="7" fill="#f3efe6"/><circle cx="-2.5" cy="-1" r="1.6" fill="#3a0f18"/><circle cx="2.5" cy="-1" r="1.6" fill="#3a0f18"/><path d="M-9 9 L9 -2 M9 9 L-9 -2" stroke="#f3efe6" stroke-width="2"/></g>`,
    };
  }
  // hero
  return {
    back: `<path d="M58 88 Q54 40 100 34 Q146 40 142 88 Q144 118 136 138 L64 138 Q56 118 58 88Z" fill="${st.hair}"/>`,
    body: `<path d="M26 240 Q30 196 68 186 L132 186 Q170 196 174 240Z" fill="#8a5a32"/>
           <path d="M68 186 L84 240 M132 186 L116 240" stroke="#6b4223" stroke-width="3"/>
           <path d="M78 176 Q100 192 122 176 L126 193 Q100 207 74 193Z" fill="#c8453a"/>
           <path d="M110 194 L122 232 L131 228 L120 192Z" fill="#a8352c"/>
           <circle cx="70" cy="214" r="5" fill="#d9a441"/><circle cx="70" cy="214" r="2.2" fill="#fff4c9"/>`,
    side: `<path d="M61 92 Q57 118 63 138 L69 124 Q65 108 68 96Z" fill="${st.hair}"/><path d="M139 92 Q143 118 137 138 L131 124 Q135 108 132 96Z" fill="${st.hair}"/>`,
    front: `<path d="M58 98 Q55 46 100 40 Q145 46 142 98 L135 82 L128 96 L120 70 L110 92 L101 66 L92 91 L82 70 L74 96 L66 80Z" fill="${st.hair}"/>
            <path d="M102 41 Q94 16 116 10 Q104 24 109 41Z" fill="${st.hair}"/>`,
    shine: `<path d="M70 60 Q100 48 130 60 Q100 54 70 64Z" fill="${st.hairShine}" opacity=".8"/>`,
    acc: `<path d="M57 66 Q100 50 143 66 L143 75 Q100 60 57 75Z" fill="#5a3a20"/>
          <g stroke="#c9a043" stroke-width="3"><circle cx="83" cy="64" r="10" fill="#8fd3ff"/><circle cx="117" cy="64" r="10" fill="#8fd3ff"/></g>
          <path d="M78 59 L82 56 M112 59 L116 56" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  };
}

// opts: { talking, crop: 'head' | 'bust' | undefined, cls }
function portraitSVG(id, expr, opts = {}) {
  const st = CHAR_STYLE[id];
  expr = expr || st.defaultExpr;
  const n = ++_pid;
  const p = charParts(id, st);
  const vb = opts.crop === 'head' ? '48 22 104 118' : opts.crop === 'bust' ? '20 10 160 230' : '0 0 200 240';
  const emote = EMOTES[expr] ? `<span class="emote">${EMOTES[expr]}</span>` : '';
  return `<div class="portrait expr-${expr} char-${id} ${opts.talking ? 'talking' : ''} ${opts.cls || ''}">
  <svg viewBox="${vb}" class="portrait-svg" aria-label="${id}">
    <g class="fig">
      <g class="tilt">${p.back}</g>
      <path d="M88 148 L88 184 L112 184 L112 148Z" fill="${st.skin}"/>
      <path d="M88 152 Q100 168 112 152 L112 162 Q100 174 88 162Z" fill="${st.shade}"/>
      ${p.body}
      ${seasonalOutfit(id)}
      <g class="tilt">
        <ellipse cx="59" cy="110" rx="5.5" ry="9" fill="${st.skin}"/><ellipse cx="141" cy="110" rx="5.5" ry="9" fill="${st.skin}"/>
        <path d="${FACE_PATH}" fill="${st.skin}"/>
        <path d="M62 100 Q66 70 100 66 Q80 76 74 100Z" fill="${st.shade}" opacity=".35"/>
        ${blushSVG(expr)}
        ${eyeSVG(80, 108, -1, st, n, expr === 'wink' ? 'smile' : expr)}
        ${eyeSVG(120, 108, 1, st, n, expr === 'wink' ? 'happy' : expr)}
        ${expr === 'cry' ? '<g fill="#8fd3ff" opacity=".9"><path d="M72 118 Q69 128 72 134 Q76 128 72 118Z"/><path d="M128 118 Q125 128 128 134 Q132 128 128 118Z"/></g>' : ''}
        <path d="M101 123 L99 129 L102.5 129" fill="none" stroke="${st.shade}" stroke-width="1.4" stroke-linecap="round"/>
        ${mouthSVG(expr)}
        <g class="sway-side">${p.side}</g>
        ${p.front}
        ${p.shine}
        ${browSVG(80, 108, -1, st, { angry: 'determined', cry: 'sad', wink: 'smirk' }[expr] || expr)}
        ${browSVG(120, 108, 1, st, { angry: 'determined', cry: 'sad', wink: 'smirk' }[expr] || expr)}
        ${p.acc}
      </g>
    </g>
  </svg>${emote}
  <span class="sparkle s1">✦</span><span class="sparkle s2">✧</span><span class="sparkle s3">✦</span>
</div>`;
}

// ---------- Seasonal outfits ----------
const SCARF = { anna: '#d6454f', cedric: '#e3b341', alice: '#f4f6ff', quinn: '#3f7a52', peter: '#6b2433', jane: '#2b1a12' };
function seasonalOutfit(id) {
  if (typeof S === 'undefined' || !S || typeof season !== 'function') return '';
  const se = season().id;
  if (se === 'winter' && SCARF[id]) {
    const c = SCARF[id];
    return `<path d="M80 171 Q100 188 120 171 L124 186 Q100 203 76 186Z" fill="${c}"/>
      <path d="M108 189 L114 222 L125 217 L117 186Z" fill="${c}"/>
      <path d="M82 178 Q100 193 118 178 M112 200 L120 198 M113 208 L121 206" stroke="rgba(255,255,255,.4)" stroke-width="2" fill="none"/>`;
  }
  const pin = { spring: '🌸', summer: '🌻', autumn: '🍁' }[se];
  return pin && id !== 'hero' ? `<text x="118" y="222" font-size="13">${pin}</text>` : '';
}
