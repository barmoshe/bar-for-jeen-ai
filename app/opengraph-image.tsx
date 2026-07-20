import { ImageResponse } from 'next/og';

// Dynamic share card for the bar-for-jeen-ai application page, matching the
// page's look — Jeen's real brand, read live off jeen.ai: cream surface,
// ink type at display weight 400, the rounded-rect tile trio, a pastel
// pink/lilac wash, and a lilac CTA pill. Rendered at build time by next/og
// (Satori), so it uses a flexbox-only subset of CSS and plain hex colours.
// Next colocates this file with the route and wires the og:image /
// twitter:image tags automatically.

export const alt =
  'Bar Moshe for Jeen AI — AI Solution Engineer. Prompt engineering, LLM automations, and AI-output QA; open-source AI tooling on npm.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The tile-trio mark (same composition as JeenMark on the page).
function Tiles({ size: s = 46 }: { size?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <rect x="10" y="34" width="34" height="56" rx="10" fill="#e7b5ea" />
      <rect x="10" y="10" width="34" height="18" rx="8" fill="#f0a653" />
      <rect x="52" y="10" width="38" height="52" rx="11" fill="#e96a4c" />
    </svg>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fbf8f6',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Main panel over the pastel wash */}
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px 48px',
            backgroundImage:
              'radial-gradient(700px 420px at 78% 30%, rgba(231,181,234,0.75), transparent 65%), radial-gradient(560px 380px at 55% 75%, rgba(248,211,188,0.7), transparent 62%), radial-gradient(520px 340px at 92% 85%, rgba(244,188,211,0.6), transparent 60%)',
          }}
        >
          {/* Brand row */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tiles size={48} />
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 600, color: '#232122', marginLeft: 16, letterSpacing: '-0.01em' }}>
              Bar Moshe
            </div>
            <div
              style={{
                display: 'flex',
                marginLeft: 18,
                padding: '8px 18px',
                borderRadius: 999,
                border: '1.5px solid #eae4df',
                backgroundColor: '#ffffff',
                fontSize: 22,
                fontWeight: 500,
                color: '#63405e',
              }}
            >
              for Jeen.AI · Application
            </div>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 68,
                fontWeight: 400,
                color: '#232122',
                letterSpacing: '-0.015em',
                lineHeight: 1.08,
                maxWidth: '1010px',
              }}
            >
              From prompt to reliable AI output.
            </div>
            <div style={{ display: 'flex', fontSize: 30, color: '#4c4747', marginTop: '22px', maxWidth: '940px', lineHeight: 1.35 }}>
              Prompt engineering, LLM automations, and AI-output QA. Open-source AI tooling on npm, featured on Temporal Code Exchange.
            </div>
          </div>

          {/* Foot meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 26, color: '#8a8280' }}>
            <div style={{ display: 'flex' }}>github.com/barmoshe</div>
            <div
              style={{
                display: 'flex',
                padding: '10px 22px',
                borderRadius: 999,
                backgroundColor: '#e7b5ea',
                fontWeight: 600,
                fontSize: 24,
                color: '#232122',
              }}
            >
              AI Solution Engineer · Jeen.AI · Tel Aviv
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
