# heyfran-splash

Teaser splash for **heyfran.com** while the full FRAN GAME is being built.
Each visit picks one of five renditions at random.

| id | name | feel |
| --- | --- | --- |
| 0 | cream-wordmark | cream field, yellow or black wordmark, short teaser |
| 1 | after-hours | dark brown mall, lights low, white or yellow wordmark |
| 2 | scrawl-field | Caveat scrawls and SVG squiggles in yellow and brown behind the wordmark |
| 3 | dollhouse-peek | tiny Three.js Bugis+ floor under a slow orbit, teaser overlay |
| 4 | wisp-tease | focus glow and drifting wisp motes, "Start dreaming soon" |

Force a rendition for testing with `?v=0` through `?v=4`.

## Run

```
npm install
npm run dev       # http://localhost:5175
npm run build     # dist/
npm run preview   # http://localhost:4175
```

Three.js is only loaded for the dollhouse rendition. Every other rendition is plain DOM and CSS.

## Deploy on Vercel

1. Import `wytanj/heyfran-splash` at vercel.com/new. `vercel.json` already sets the Vite framework, build command, and `dist` output.
2. Every push to `main` deploys production.

## Point heyfran.com at it

1. In the Vercel project open **Settings > Domains** and add `heyfran.com` and `www.heyfran.com`.
2. At your registrar set these records:

   | type | host | value |
   | --- | --- | --- |
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

   If Vercel shows different values on the Domains page, use those instead.
3. Set `heyfran.com` as the primary domain so `www` redirects to it. Vercel issues the TLS certificate once DNS resolves, usually within an hour.

When the full game ships, swap the domain over to the fran-game project in the same Domains panel.

## Assets

`public/logo-2c.png` is the favicon. `public/wordmark-{yellow,black,white}.png` are the FA RGB wordmarks.
