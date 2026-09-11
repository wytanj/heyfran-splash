/** Small DOM helpers shared by every rendition. */
import { pickFortune } from './fortunes.js';

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function wordmark(tone = 'yellow') {
  const img = el('img', 'wordmark');
  img.src = `/wordmark-${tone}.png`;
  img.alt = 'fran';
  img.decoding = 'async';
  img.width = 2245;
  img.height = 1182;
  return img;
}

export function footer() {
  const p = el('p', 'footer');
  const a = el('a', null, 'heyfran.com');
  a.href = 'https://heyfran.com';
  p.append(a);
  return p;
}

/** Standard copy block: eyebrow, wordmark, fortune-cookie lede, footer. */
export function teaser(root, { tone, eyebrow, fine } = {}) {
  const card = el('section', 'card');
  if (eyebrow) card.append(el('p', 'eyebrow', eyebrow));
  card.append(wordmark(tone));
  card.append(el('p', 'lede', pickFortune()));
  if (fine) card.append(el('p', 'fine', fine));
  card.append(footer());
  root.append(card);
  return card;
}
