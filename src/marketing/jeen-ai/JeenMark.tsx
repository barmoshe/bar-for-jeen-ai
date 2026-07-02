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
      <rect className="ja-mark__tile ja-mark__tile--lilac" x="10" y="34" width="34" height="56" rx="10" />
      <rect className="ja-mark__tile ja-mark__tile--amber" x="10" y="10" width="34" height="18" rx="8" />
      <rect className="ja-mark__tile ja-mark__tile--coral" x="52" y="10" width="38" height="52" rx="11" />
    </svg>
  );
}
