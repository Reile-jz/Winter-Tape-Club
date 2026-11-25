# WINTER TAPE CLUB

A static, fan-made archive of memories that never quite faded — built with plain
HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

> An unofficial, non-commercial creative project. Inspired by the aesthetic of NewJeans
> A test of the front end capability of my OpenCode Setup!

## Sections

| # | Section | What it does |
|---|---------|--------------|
| — | Hero | Camcorder viewfinder HUD (REC, running timecode, battery, timestamps), handwritten margin notes, scroll cue |
| 01 | The Memory Archive | Six tape cards in an asymmetric editorial grid; each opens a lightbox |
| 02 | Side A / Side B | Tape-deck tabs that swap two readings of the same recording |
| 03 | The Dream Board | Seven pinned polaroids, captions in handwriting, pull quote |
| 04 | Letters to the Past | Three dated notes plus an "archive terminal" that prints a random memory |
| — | Footer | END OF TAPE / Until we meet again, disclaimer, credits link |

---

## Interactions

- **Smooth scroll** with a sticky, blur-backed nav and scroll-spy highlighting (the
  current section is underlined as you read).
- **Mobile menu** — full-screen sheet, `aria-expanded`, Escape to close, body scroll
  lock, focus returned to the toggle; closes automatically when a link is used or the
  viewport grows past 860px.
- **Side A / Side B deck** — proper ARIA tabs (`role="tablist"`, `aria-selected`,
  roving `tabindex`), click or arrow keys / Home / End to switch, sliding ink thumb.
- **Memory lightbox** — opens from any card, prev/next buttons, ← → arrow keys,
  Escape to close, Tab focus trap, click-outside to dismiss, focus restored to the
  card that opened it.
- **Random memory generator** — 12 original notes; never repeats the same note twice
  in a row.
- **Hover states** on every card, link and button; the archive prints straighten and
  lift, the lightbox zoom badge fades in.
- **Running tape counter** in the nav and hero — the tape's own clock, so it always
  reads like a recording in progress.

---

## Accessibility

- Every interactive element is a real `<button>`, `<a>` or ARIA tab — no div click
  handlers. Full keyboard operation, visible `:focus-visible` rings.
- Skip link to `#main`.
- Meaningful `alt` text on all 16 photographs; decorative overlays are `aria-hidden`.
- The lightbox is a labelled `role="dialog"` with `aria-modal="true"` and a focus trap.
- Contrast is kept high for body copy (charcoal `#1b222a` on off-white `#f5f2ec`);
  the low-contrast silver tones are used only for decorative metadata.
- `prefers-reduced-motion: reduce` stops the ticker marquee, the blinking REC dots,
  the scroll cue, all card rotation and every transition/animation.
- No horizontal overflow at 320, 390, 768, 1024 or 1440 px.

---

## Visual system

- **Palette** — warm off-white paper, pale sky blue, washed lavender, faded silver,
  muted navy, soft charcoal. No neon, no pure black, no pure white.
- **Type** — Cormorant Garamond (editorial serif) for display, DM Sans for text,
  Nothing You Could Do for handwriting, a monospace stack for tape metadata.
- **Texture** — a fixed SVG film-grain layer, faint scanlines, scanline wash inside
  frames, paper-tape strips, polaroid frames and slight rotation on the archive cards.
  All of it is cheap: one tiled SVG noise, one repeating gradient, no filters on
  scroll, no canvas, no WebGL.
- **Motion** — transform/opacity only, 300–900 ms, single-pass; nothing animates
  continuously except the marquee and two blinking dots.

---

## Photography

All 16 photographs are used under Creative Commons licences (CC BY 2.0 / CC BY-SA
2.0) with full attribution on [`credits.html`](credits.html). They were downloaded
from Flickr, resized to a maximum of 1500 px wide and re-encoded at JPEG quality 82.

No frame, still, logo, album cover or lyric from any music video appears in this
project. Every line of copy — captions, notes, the random memory pool, the footer
disclaimer — was written for this site.

---

## Browser support

Chrome / Edge 111+, Firefox 113+, Safari 16.4+. The layout relies on `clamp()`,
CSS grid, `aspect-ratio`, `svh` units and `:focus-visible`; `backdrop-filter` is
progressive enhancement. `scroll-behavior: smooth` degrades to instant jumps and the
JavaScript guards every optional feature (`IntersectionObserver`, `matchMedia`).

With JavaScript disabled the page still renders: all copy, all images, all sections,
and every in-page anchor works. Only the lightbox, tab switch and random note need JS,
and the `<noscript>` block says so.

---

## Notes / limitations

- The site is entirely static: there is no persistence, no accounts, no analytics.
- Fonts are loaded from Google Fonts. Offline, the typography falls back to the
  system stack — the layout is unaffected.
- The Side B photograph is lazy-loaded when the tab is first opened, so on a very slow
  connection the first switch may take a moment to fill in.
- Tested on Windows at 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 320×640.
