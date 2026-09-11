import { teaser } from '../shared.js';

/** 0 · cream-wordmark. Cream field, yellow or black wordmark, short teaser. */
export function mount(root) {
  const tone = Math.random() < 0.5 ? 'yellow' : 'black';
  teaser(root, {
    tone,
    eyebrow: 'Bugis+ · #01-04',
    title: 'FRAN GAME',
    lede: 'A closing-time dream. Coming soon.',
    fine: 'Yoink, haul, scoff. Nothing leaves the shelf.',
  });
}
