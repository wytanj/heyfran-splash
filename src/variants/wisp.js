import { el, teaser } from '../shared.js';

/** 4 · wisp-tease. Focus glow and drifting wisp energy. "Start dreaming soon". */
export function mount(root) {
  const stage = el('div', 'glow-stage');
  stage.append(el('div', 'glow core'));
  stage.append(el('div', 'glow halo'));
  for (let i = 0; i < 14; i += 1) {
    const mote = el('span', 'mote');
    mote.style.setProperty('--x', `${(Math.random() * 100).toFixed(1)}%`);
    mote.style.setProperty('--y', `${(Math.random() * 100).toFixed(1)}%`);
    mote.style.setProperty('--d', `${(6 + Math.random() * 8).toFixed(2)}s`);
    mote.style.setProperty('--delay', `${(-Math.random() * 10).toFixed(2)}s`);
    mote.style.setProperty('--s', `${(3 + Math.random() * 7).toFixed(0)}px`);
    stage.append(mote);
  }
  root.append(stage);

  teaser(root, {
    tone: 'white',
    eyebrow: 'heyfran',
  });
}
