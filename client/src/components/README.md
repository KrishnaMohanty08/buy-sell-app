# BAZAAR — Component Library

Gold-palette buy/sell marketplace UI components.

## File Structure

```
src/
├── App.jsx                   ← Root composer
└── components/
    ├── Loader.jsx            ← Full-screen branded loader
    ├── Navbar.jsx            ← Sticky glassmorphic nav
    ├── Hero.jsx              ← Two-column landing hero
    └── Footer.jsx            ← Four-column footer
```

## Quick Start

```bash
npm create vite@latest BAZAAR -- --template react
cd BAZAAR
npm install
# Replace src/ with the provided files
npm run dev
```

## Props

### `<Loader onComplete={fn} />`
| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `() => void` | Called when the loader finishes (after ~2.2 s) |

### `<Navbar cartCount={n} />`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cartCount` | `number` | `0` | Badge count on the cart icon |

### `<Hero onShop={fn} onSell={fn} />`
| Prop | Type | Description |
|------|------|-------------|
| `onShop` | `() => void` | CTA — "Start Shopping" click |
| `onSell` | `() => void` | CTA — "List an Item" click |

### `<Footer />`
No props — all links are configurable inside the `COLUMNS` / `LEGAL` arrays in `Footer.jsx`.

## Theme Colours

```
--gold-1  : #F2B949
--gold-2  : #EDD377
--gold-3  : #F2E829
--orange  : #F27430
--dark    : #1a1208
```

## Dependencies

- React 18+
- No third-party UI libraries required
- Google Fonts (Playfair Display + DM Sans) via `@import` in component styles
