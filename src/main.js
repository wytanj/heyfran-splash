/**
 * heyfran.com teaser. Picks one of five renditions per page load.
 * Force one for testing with ?v=0 .. ?v=4
 */
const VARIANTS = [
  { id: 'cream-wordmark', load: () => import('./variants/cream.js') },
  { id: 'after-hours', load: () => import('./variants/afterHours.js') },
  { id: 'scrawl-field', load: () => import('./variants/scrawl.js') },
  { id: 'dollhouse-peek', load: () => import('./variants/dollhouse.js') },
  { id: 'wisp-tease', load: () => import('./variants/wisp.js') },
];

function pick() {
  const forced = Number(new URLSearchParams(location.search).get('v'));
  if (Number.isInteger(forced) && forced >= 0 && forced < VARIANTS.length) return forced;
  return Math.floor(Math.random() * VARIANTS.length);
}

const app = document.getElementById('app');
const index = pick();
const variant = VARIANTS[index];

document.documentElement.dataset.variant = variant.id;
app.dataset.variant = variant.id;

variant.load()
  .then((mod) => mod.mount(app))
  .catch((err) => {
    console.error('splash failed, falling back to cream', err);
    app.replaceChildren();
    document.documentElement.dataset.variant = 'cream-wordmark';
    app.dataset.variant = 'cream-wordmark';
    return import('./variants/cream.js').then((mod) => mod.mount(app));
  });
