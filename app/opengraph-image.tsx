import { ImageResponse } from 'next/og';

// Dynamic share card for the /jeen-ai application page, matching the page's
// look: a deep indigo surface, the electric blue-to-violet accent, the
// layered-stack mark, and a gradient base strip. Rendered at build time by
// next/og (Satori), so it uses a flexbox-only subset of CSS and plain hex
// colours. Next colocates this file with the route and wires the og:image /
// twitter:image tags automatically.

export const alt =
  'Bar Moshe for Jeen AI — Full Stack Engineer. React, Next.js, TypeScript, Node; Docker and Kubernetes; open-source AI tooling on npm.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The layered-stack mark: three isometric diamonds, apps over layer over data.
function Layers({ size: s = 46 }: { size?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <polygon points="50,50 82,66 50,82 18,66" fill="none" stroke="#5d6b8c" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="50,32 82,48 50,64 18,48" fill="none" stroke="#8b9cc4" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="50,14 82,30 50,46 18,30" fill="rgba(79,125,255,0.25)" stroke="#7b9dff" strokeWidth="4" strokeLinejoin="round" />
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
          backgroundColor: '#070b16',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Main panel */}
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px 48px',
            backgroundImage:
              'radial-gradient(760px 460px at 90% 2%, rgba(79,125,255,0.22), transparent 60%), radial-gradient(620px 420px at 0% 100%, rgba(139,92,246,0.24), transparent 60%)',
          }}
        >
          {/* Brand row */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Layers size={48} />
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: '#ffffff', marginLeft: 14, letterSpacing: '-0.02em' }}>
              Bar Moshe
            </div>
            <div
              style={{
                display: 'flex',
                marginLeft: 18,
                padding: '8px 16px',
                borderRadius: 999,
                border: '1px solid rgba(79,125,255,0.55)',
                backgroundColor: 'rgba(79,125,255,0.12)',
                fontSize: 22,
                fontWeight: 700,
                color: '#7b9dff',
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
                fontSize: 66,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                lineHeight: 1.06,
                maxWidth: '1010px',
              }}
            >
              Full stack engineer for AI products.
            </div>
            <div style={{ display: 'flex', fontSize: 31, color: '#a8b3c9', marginTop: '22px', maxWidth: '940px', lineHeight: 1.35 }}>
              React, Next.js, TypeScript, Node. Docker and Kubernetes. Open-source AI tooling on npm, featured on Temporal Code Exchange.
            </div>
          </div>

          {/* Foot meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 26, color: '#6c7890' }}>
            <div style={{ display: 'flex' }}>github.com/barmoshe</div>
            <div style={{ display: 'flex', fontWeight: 700, color: '#7b9dff' }}>Full Stack Engineer · R&D · Tel Aviv</div>
          </div>
        </div>

        {/* Gradient base strip */}
        <div
          style={{
            display: 'flex',
            height: '14px',
            background: 'linear-gradient(90deg, #4f7dff 0%, #6e8bfb 50%, #8b5cf6 100%)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
