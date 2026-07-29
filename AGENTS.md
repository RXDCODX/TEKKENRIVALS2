# AGENTS.md — TEKKENRIVALS2

Single-page scroll-based promotional site for TEKKEN RIVALS 2 tournament series by streamer AVICII75. Russian language (`lang="ru"`).

## Dev commands

| Command           | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| `yarn dev`        | Vite dev server (default port 5173)                         |
| `yarn build`      | `tsc -b && vite build`                                      |
| `yarn type-check` | `tsc --noEmit` (no output = pass)                           |
| `yarn lint`       | ESLint (flat config, `--fix` available via `yarn lint:fix`) |
| `yarn format`     | Prettier `--write .`                                        |
| `yarn deploy`     | Builds then deploys to gh-pages                             |

No test framework exists. No tests to run.

CI (`.github/workflows/`): `type-check -> lint -> build` on push to `master` (tekkenrivals2.ru) and `dev` (dev.tekkenrivals2.ru).

## Scroll zones and poster system

The page is a 600vh scroll-container with absolutely positioned sections. Each zone has its own background video managed by `ScrollBackgrounds.tsx` via GSAP ScrollTrigger.

| Zone          | vh      | Content                                                                | Image/Video                                  |
| ------------- | ------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| Intro         | 0-100vh | Logo centered at 50vh                                                  | `background.mp4`                             |
| Poster 1      | 100vh   | Season announcement: prizes, upcoming events, donation/twitch links    | `tk_rival_poster4.jpg` + `bg2.webm`          |
| Poster 2      | 200vh   | Tournament formats: PRIME, TAG, STREAMER BATTLE, REGIONS, WORLDWIDE    | `photo_2026-07-25_20-53-50.jpg` + `bg3.webm` |
| Poster 3      | 300vh   | PRIME rules: Double Elimination FT2, arena, WiFi ban, disqualification | `tekken_rivals2_styled_v3.png` + `bg4.webm`  |
| PRIME wizard  | 375vh   | 3-step wizard: Свободный вход → Зарабатывайте очки → Дойди до финалов  | —                                            |
| PRIME hollow  | 375vh   | Large SVG "PRIME" text (white stroke, no fill)                         | —                                            |
| PRIME date    | 400vh   | "начало возни 02.09.2026 15:00"                                        | —                                            |
| PRIME buttons | 425vh   | "Стрим" (Twitch) + "Регистрация" (challonge.com/TR2P)                  | —                                            |
| Poster 4      | 500vh   | Scoring & PRIME FINALS points table                                    | —                                            |
| Easter egg    | Bottom  | Hidden AVICII75 + RXDCODX avatars (opacity 0.15, hover to reveal)      | `avicii75.webp`                              |

## Scoring system (PRIME FINALS)

Points by placement:

```
1 место — 11    9-12 место — 4    33 место и ниже — 1
2 место — 10    13-16 место — 3
3 место — 8     17-32 место — 2
4 место — 7
5-6 место — 6
7-8 место — 5
```

Top 8 players across four tournaments qualify for PRIME FINALS (Round Robin format).

## Architecture

- **React 19** + **Vite 7** (SWC plugin) + **TypeScript 5.8** (strict mode)
- **GSAP 3.15** — all animations via ScrollTrigger + SplitText plugin (`@gsap/react` hooks)
- **SCSS** — global `main.scss` + CSS Modules (`.module.scss`) for component styles
- **No routing** — single-page, scroll-driven. All content in `App.tsx`.
- **No API calls** — fully static content
- **Audio** — background music (`sr.wav`) managed via React Context, persisted in localStorage
- **FontSwitcher** — dev-only (`import.meta.env.DEV`) panel for runtime font swapping

## Key gotchas

- **Poster positioning uses inline `style={{ top: 'Xvh' }}`**, NOT nth-of-type CSS selectors. The nth-of-type approach was removed because extra sibling elements (wizard, hollow text, buttons) broke the div count.
- **SplitText component** renders `display: inline-block` with `overflow: hidden`. Parent containers need explicit width.
- **ScrollBackgrounds** queries `document.querySelectorAll('.poster-section')` by index — if you add/remove poster sections, the video zone triggers in `ScrollBackgrounds.tsx` must be updated.
- **Scroll container height** (`main.scss` `.scroll-container { height: 600vh }`) must accommodate all positioned elements. Increase if adding more content zones.
- **No `nth-of-type` rules remain** in `main.scss` for poster positioning — all positioning is explicit via inline styles.
- **`$accent-color: #ff0000`** (red) is used for PRIME wizard step circles and hover effects.
- **`$purple-color: #a855f7`** — stream button and link hover color.
- **`$burgundy-light: #c94060`** — registration button color.

## Style tokens (SCSS variables in `main.scss`)

```scss
$bg-color: #000000;
$text-color: #ffffff;
$accent-color: #ff0000;
$purple-color: #a855f7;
$burgundy-light: #c94060;
$font-title: 'Anton', sans-serif;
$font-heading: 'Oswald', sans-serif;
$font-body: 'Unbounded', sans-serif;
```

CSS custom properties (`--font-title`, `--font-heading`, `--font-body`) allow runtime font overrides via FontSwitcher.

## Public assets

All static files in `public/`. Key ones: `logo.png`, `tk_rival_poster4.jpg`, `photo_2026-07-25_20-53-50.jpg`, `tekken_rivals2_styled_v3.png`, `background.mp4`, `bg2.webm`, `bg3.webm`, `bg4.webm`, `sr.wav`, `avicii75.webp`.

## Easter egg

At the very bottom of the scroll (after all posters): hidden avatar links to [twitch.tv/avicii75](https://twitch.tv/avicii75) and [github.com/rxdcodx](https://github.com/rxdcodx). Rendered at `opacity: 0.15`, reveals on hover. Uses `z-index: 999` and `bottom: 0`.
