# bar-for-jeen-ai

An ad-hoc, personalized job-application page Bar Moshe built for the **Full Stack
Engineer** role at **Jeen.AI** (R&D, Tel Aviv), in a visual language interpreted
from Jeen's positioning as the enterprise AI operating layer: a deep indigo
surface, an electric blue-to-violet accent, white type, and a layered-stack mark
that converges into one solid layer as the hero scrolls.

Not affiliated with Jeen.AI. `robots: noindex` — a private, shareable link.

Extracted from the `bar_builds` workshop site (`site/app/(en)/jeen-ai`, built
there as a sanctioned one-off exception) into this standalone sibling repo so it
deploys on its own Vercel project, matching the `bar-for-*` application-site
pattern.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Plain CSS (scoped under `.ja-root`) + GSAP (ScrollTrigger)
- `next/og` share card (`app/opengraph-image.tsx`)

## Run

```bash
npm install
npm run dev
```
