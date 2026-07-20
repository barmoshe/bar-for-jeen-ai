# bar-for-jeen-ai

A personalized job-application page Bar Moshe built for **Jeen.AI** (Tel Aviv),
in Jeen's real visual language, read live off jeen.ai: a cream surface, ink type
at display weight 400, 50px pills, a floating white pill nav, a deep-plum dark
band, and the signature hero "liquid" — a pastel swirl texture revealed through a
portrait radial-gradient mask that tracks the cursor (jeen's own mechanism,
rebuilt with a self-contained baked SVG, no WebGL).

One page serves **two applications** via a hero role toggle:

- **AI Solution Engineer** (Projects) — the default face. `#ai-solution-engineer`
- **Full Stack Engineer** (R&D) — `#full-stack-engineer`

The toggle swaps the hero, the fit band, the CTA/footer copy, the mailto subject,
and the document title; the brand, proof grid, and interactive demo stay shared.

Not affiliated with Jeen.AI. `robots: noindex` — a private, shareable link.

## Design

The page is a faithful reinvention of jeen.ai's actual site: a masked-swirl
cursor hero, a scrolling skill marquee (jeen's logo strip, rendered as the tools
Bar works in), a 4-up "governed foundation" principles grid, an interactive
platform-layer demo, a dark-plum band, and honest stat/proof sections. The
reinvention is landing section by section (see the workshop's living plan); the
hero, nav, mark, marquee, and foundation grid are in; the platform diagram,
dark-band, and results sections are in progress.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Plain CSS (scoped under `.ja-root`) + GSAP (ScrollTrigger)
- `next/og` share card (`app/opengraph-image.tsx`)
- Hero swirl: `public/swirl.svg` (baked `feTurbulence`), masked + cursor-tracked

## Run

```bash
npm install
npm run dev
```
