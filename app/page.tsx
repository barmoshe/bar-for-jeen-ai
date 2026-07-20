import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import JeenApp from "@/src/marketing/jeen-ai/JeenApp";

// Type trio for the Jeen.AI application page, matched to the live site:
// jeen.ai sets display in BrittiSans (400) and body in AktivGrotesk — both
// commercial. Hanken Grotesk is the free near-match for the display cut,
// Inter for the body, JetBrains Mono for the console / pipeline labels.
// Exposed as --font-ja-* for jeen-ai.css.
const display = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ja-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ja-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ja-mono",
  display: "swap",
});

// Ad-hoc, personalized application page for Bar Moshe's two applications to
// Jeen.AI, on one page with a hero role toggle: AI Solution Engineer (Projects,
// the default face) and Full Stack Engineer (R&D). Speaks Jeen's own language
// (the enterprise AI operating layer: agents, workflows, governed knowledge,
// any cloud or air-gapped on-prem) and makes the case for Bar inside it. Built
// embedded in the workshop site as a sanctioned exception (ADR 0141), then
// extracted to this standalone sibling per the ADR-0132 recipe. The document
// title swaps to the active role client-side; this static metadata leads with
// the default. Noindex, a private shareable link for the Jeen team.
const ogTitle = "Bar Moshe × Jeen AI — AI Solution Engineer";
const ogDescription =
  "Bar Moshe in Tel Aviv, applying to Jeen.AI. Prompt engineering, LLM automations, and AI-output QA, with the Python and full-stack work to ship it. Open-source AI tooling on npm; featured on Temporal's Code Exchange.";

// noindex (private, shareable link) but a rich share card still renders for
// direct shares (email / DM / LinkedIn); og:image comes from the colocated
// opengraph-image.tsx.
export const metadata: Metadata = {
  title: ogTitle,
  description: ogDescription,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "Bar Moshe",
    title: ogTitle,
    description: ogDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@barmoshe1",
    creator: "@barmoshe1",
    title: ogTitle,
    description: ogDescription,
  },
};

export default function JeenPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <JeenApp />
    </div>
  );
}
