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

The page is a faithful reinvention of jeen.ai's actual site (captured live in the
browser), section for section:

- **Masked-swirl cursor hero** — a baked SVG `feTurbulence` swirl (`public/swirl.svg`)
  revealed through a portrait radial-gradient mask that tracks the pointer.
- **Skill marquee** — jeen's scrolling logo strip, rendered as the tools Bar works in.
- **"A governed foundation" 4-up grid** — jeen's principles grid, mapped to how he builds.
- **"One foundation" platform-layer diagram** — an enterprise AI request descending
  through five numbered layers (prompt → routing → retrieval → governance → cited
  answer), converging on a grounded foundation. A live state machine, reduced-motion aware.
- **Dark-plum band** — jeen's industry marquee, mapped to Bar's competency domains,
  above the per-role fit cards.
- **"Proven results" stat counters** — honest, verifiable numbers with a scroll-in count-up.
- **"Recognized" callout** — jeen's testimonial slot, filled with real external
  validation (Temporal Code Exchange), then the swirl-washed close band.

Palette and type match jeen's real brand: cream/ink/lilac/plum, Hanken Grotesk +
Inter (free near-matches for BrittiSans + AktivGrotesk). All motion is gated on
`prefers-reduced-motion`.

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
