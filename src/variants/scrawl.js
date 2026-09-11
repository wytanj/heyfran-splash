import { el, teaser } from '../shared.js';

/** 2 · scrawl-field. Hand-scrawled words and squiggles in yellow and brown behind the wordmark. */
const WORDS = ['yoink', 'haul', 'scoff', 'dream', 'closing time', 'sixty seconds', 'Bugis+', 'wisp', 'banked', 'lights on', 'again', 'yoink yoink'];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function squiggle(x, y, w, tone) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const h = w * 0.18;
  let d = `M ${x} ${y}`;
  const n = 5 + Math.floor(rand(0, 3));
  for (let i = 1; i <= n; i += 1) {
    const cx = x + (w / n) * (i - 0.5);
    const cy = y + (i % 2 ? -h : h);
    const ex = x + (w / n) * i;
    d += ` Q ${cx} ${cy} ${ex} ${y}`;
  }
  path.setAttribute('d', d);
  path.setAttribute('class', `sq ${tone}`);
  path.style.setProperty('--delay', `${rand(0, 3).toFixed(2)}s`);
  return path;
}

export function mount(root) {
  const field = el('div', 'field');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1000 1000');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < 14; i += 1) {
    const tone = Math.random() < 0.6 ? 'yellow' : 'brown';
    svg.append(squiggle(rand(-50, 900), rand(40, 980), rand(120, 320), tone));
  }
  field.append(svg);

  WORDS.forEach((word, i) => {
    const w = el('span', `scrawl ${Math.random() < 0.55 ? 'yellow' : 'brown'}`, word);
    w.style.left = `${rand(2, 86)}%`;
    w.style.top = `${(i / WORDS.length) * 92 + rand(0, 6)}%`;
    w.style.setProperty('--rot', `${rand(-18, 18).toFixed(1)}deg`);
    w.style.setProperty('--size', `${rand(26, 64).toFixed(0)}px`);
    w.style.setProperty('--delay', `${rand(0, 4).toFixed(2)}s`);
    field.append(w);
  });

  root.append(field);
  teaser(root, {
    tone: 'black',
    eyebrow: 'Scrawled on the shutter',
    title: 'FRAN GAME',
    lede: 'Start dreaming soon.',
    fine: 'Yoink what you can. Scoff it down. Wake up.',
  });
}
