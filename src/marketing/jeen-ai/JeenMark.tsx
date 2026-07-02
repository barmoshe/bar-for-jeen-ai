'use client';

/**
 * JeenMark — a layered-stack motif built from scratch for this page, riffing on
 * Jeen's "enterprise AI operating layer" positioning: three floating layers
 * (apps on top, the operating layer in the middle, models and data at the base)
 * that read as one system. Deliberately NOT Jeen's logo: the environment this
 * page was built in could not load jeen.ai's live assets, so the mark
 * interprets the brand's language instead of copying its lockup.
 *
 * - `.ja-mark__layers` floats gently (pure CSS, per-layer phase offsets).
 * - `.ja-mark__solid` is the converged block the hero scroll-timeline
 *   cross-fades in (driven by GSAP in JeenApp): scattered layers collapse into
 *   one operating layer. Degrades to the static stack with no JS.
 *
 * Reduced motion: the float is disabled in jeen-ai.css and the hero never
 * builds its ScrollTrigger, so the mark renders as a calm static stack.
 *
 * `variant="hero"` is the large animated lockup; the default is the small
 * static brandmark used in the nav, footer, and CTA.
 */

// Three isometric diamond layers about (50,50), top vertex up. Coords are
// static 2dp literals so SSR and client markup match exactly.
const LAYER_TOP = '50,14 82,30 50,46 18,30';
const LAYER_MID = '50,32 82,48 50,64 18,48';
const LAYER_BASE = '50,50 82,66 50,82 18,66';

export default function JeenMark({
  variant = 'brand',
  className,
}: {
  variant?: 'brand' | 'hero';
  className?: string;
}) {
  const cls = ['ja-mark', `ja-mark--${variant}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <svg className={cls} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g className="ja-mark__layers">
        <polygon className="ja-mark__layer ja-mark__layer--base" points={LAYER_BASE} />
        <polygon className="ja-mark__layer ja-mark__layer--mid" points={LAYER_MID} />
        <polygon className="ja-mark__layer ja-mark__layer--top" points={LAYER_TOP} />
      </g>
      <polygon className="ja-mark__solid" points={LAYER_MID} />
    </svg>
  );
}
