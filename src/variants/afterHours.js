import { el, teaser } from '../shared.js';

/** 1 · after-hours. Dark brown mall, lights low, white or yellow wordmark. */
export function mount(root) {
  const tone = Math.random() < 0.5 ? 'white' : 'yellow';

  // Shutter lines and one low fluorescent tube that hums.
  root.append(el('div', 'shutter'));
  root.append(el('div', 'tube'));

  teaser(root, {
    tone: 'yellow',
    eyebrow: 'after hours',
  });
}
