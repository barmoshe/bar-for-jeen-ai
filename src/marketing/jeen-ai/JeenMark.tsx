'use client';

/**
 * JeenMark — a rounded-rectangle tile trio, riffing on the visual language of
 * Jeen's actual lockup (small rounded-rect tiles beside the wordmark) and the
 * lilac/coral/amber glass tiles of their "governed foundation" hero film,
 * both read live off jeen.ai. Deliberately NOT Jeen's logo: same language,
 * different composition.
 *
 * Pure SVG, colored via jeen-ai.css tokens. `float` adds a gentle per-tile
 * bob (CSS only, disabled under prefers-reduced-motion).
 */

export default function JeenMark({
  float = false,
  className,
}: {
  float?: boolean;
  className?: string;
}) {
  const cls = ['ja-mark', float ? 'ja-mark--float' : null, className]
    .filter(Boolean)
    .join(' ');
  return (
    <svg className={cls} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {/* jeen's real lockup: one tall tile left, two smaller tiles stacked
          right (coral over amber), read live off jeen.ai. */}
      <rect className="ja-mark__tile ja-mark__tile--lilac" x="10" y="12" width="36" height="76" rx="11" />
      <rect className="ja-mark__tile ja-mark__tile--coral" x="54" y="12" width="36" height="40" rx="11" />
      <rect className="ja-mark__tile ja-mark__tile--amber" x="54" y="60" width="36" height="28" rx="9" />
    </svg>
  );
}
