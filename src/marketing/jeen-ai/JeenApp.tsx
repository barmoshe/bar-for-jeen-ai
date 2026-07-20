'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import JeenMark from './JeenMark';
import GovernedAnswer from './GovernedAnswer';
import './marketing-base.css';
import './jeen-ai.css';

/**
 * JeenApp — an ad-hoc, personalized application page for Bar Moshe's two
 * applications to Jeen.AI, presented on one page with a hero role toggle:
 * "AI Solution Engineer" (Projects, the default face) and "Full Stack
 * Engineer" (R&D, the earlier application). A distinct role at an existing
 * company is another opportunity on the same account, so the company research,
 * brand, proof of work, and the governed-answer demo are shared; only the
 * hero, the fit band, and the closing copy swap. Deep-linkable via
 * `#full-stack-engineer` / `#ai-solution-engineer`.
 *
 * Built in Jeen's REAL visual language, read live off jeen.ai (computed styles,
 * 2026-07-02): cream surface, ink type at display weight 400, 50px pills
 * (lilac primary, white outline, ink nav pill), a floating white pill nav,
 * a deep-plum dark band, and the signature hero "liquid" — a pastel
 * pink/lilac wash revealed through a soft elliptical mask that roams the
 * hero (their exact mechanism: a JS-animated radial-gradient mask-image,
 * no WebGL). Replaces the earlier blind interpretation (ADR 0141).
 *
 * English, LTR. Self-contained: mounts `.mp-root` only to inherit the marketing
 * reset / focus base (carried locally as marketing-base.css), then overrides
 * everything via `.ja-root`. No LangProvider, no shared #work emulators, no
 * i18n coupling: every visual here is built fresh for this application. All
 * motion is gated on prefers-reduced-motion and the page is fully legible
 * with no JS. Extracted from the bar_builds site into this standalone sibling
 * (the ADR-0132 pattern); the embedded route now 308s here.
 */

const CV = '/Bar_Moshe_CV_JeenAI.pdf';
const mailto = (subject: string) =>
  `mailto:1barmoshe1@gmail.com?subject=${encodeURIComponent(subject)}`;

type Proof = {
  tag: string;
  title: string;
  desc: string;
  /** Omitted on credential cards (Joomsy: employer IP, named but never linked). */
  href?: string;
  open?: string;
  visual: React.ReactNode;
};

type ProofGroup = { label: string; items: Proof[] };

// Agent tooling: a tool panel plugging into a host through a pulsing wire.
const MdpVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <rect className="ja-vis__panel" x="14" y="26" width="78" height="68" rx="8" />
    <rect className="ja-vis__line" x="24" y="38" width="44" height="6" rx="3" />
    <rect className="ja-vis__line ja-vis__line--soft" x="24" y="52" width="58" height="4" rx="2" />
    <rect className="ja-vis__line ja-vis__line--soft" x="24" y="62" width="40" height="4" rx="2" />
    <rect className="ja-vis__line ja-vis__line--soft" x="24" y="76" width="50" height="4" rx="2" />
    <line className="ja-vis__wire" x1="94" y1="60" x2="128" y2="60" />
    <line className="ja-vis__flow" x1="94" y1="60" x2="128" y2="60" />
    <circle className="ja-vis__pulse" r="3.5" />
    <rect className="ja-vis__art" x="130" y="22" width="76" height="76" rx="8" />
    <rect className="ja-vis__art-bar" x="140" y="34" width="46" height="8" rx="3" />
    <rect className="ja-vis__line ja-vis__line--soft" x="140" y="50" width="54" height="4" rx="2" />
    <rect className="ja-vis__chip" x="140" y="74" width="22" height="14" rx="4" />
    <rect className="ja-vis__chip ja-vis__chip--b" x="168" y="74" width="22" height="14" rx="4" />
  </svg>
);

// Orchestration: three language workers feeding one durable pipeline node.
const OrchestrateVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <line className="ja-vis__edge" x1="40" y1="26" x2="110" y2="60" />
    <line className="ja-vis__edge" x1="40" y1="60" x2="110" y2="60" />
    <line className="ja-vis__edge" x1="40" y1="94" x2="110" y2="60" />
    <line className="ja-vis__edge ja-vis__edge--out" x1="110" y1="60" x2="186" y2="60" />
    <g className="ja-vis__worker"><rect x="14" y="18" width="36" height="16" rx="5" /><text x="32" y="30">Go</text></g>
    <g className="ja-vis__worker"><rect x="14" y="52" width="36" height="16" rx="5" /><text x="32" y="64">Py</text></g>
    <g className="ja-vis__worker"><rect x="14" y="86" width="36" height="16" rx="5" /><text x="32" y="98">TS</text></g>
    <circle className="ja-vis__hub" cx="110" cy="60" r="16" />
    <circle className="ja-vis__hub-ring" cx="110" cy="60" r="16" />
    <rect className="ja-vis__sink" x="186" y="50" width="20" height="20" rx="5" />
  </svg>
);

// Full-stack app: streaming rows with a now-playing accent bar.
const AppVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <rect className="ja-vis__panel" x="14" y="16" width="192" height="88" rx="9" />
    <circle className="ja-vis__disc" cx="40" cy="40" r="13" />
    <rect className="ja-vis__line" x="62" y="32" width="80" height="6" rx="3" />
    <rect className="ja-vis__line ja-vis__line--soft" x="62" y="44" width="54" height="4" rx="2" />
    <rect className="ja-vis__row" x="26" y="68" width="168" height="9" rx="4.5" />
    <rect className="ja-vis__row ja-vis__row--play" x="26" y="84" width="110" height="9" rx="4.5" />
    <g className="ja-vis__eq" aria-hidden="true">
      <rect x="150" y="82" width="4" height="12" rx="2" />
      <rect x="158" y="78" width="4" height="16" rx="2" />
      <rect x="166" y="84" width="4" height="10" rx="2" />
      <rect x="174" y="80" width="4" height="14" rx="2" />
    </g>
  </svg>
);

// Plugin others install: a plugin panel wired into a durable hub, out to done.
const PluginVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <rect className="ja-vis__panel" x="14" y="34" width="64" height="52" rx="8" />
    <rect className="ja-vis__art-bar" x="24" y="46" width="34" height="7" rx="3" />
    <rect className="ja-vis__line ja-vis__line--soft" x="24" y="60" width="44" height="4" rx="2" />
    <rect className="ja-vis__line ja-vis__line--soft" x="24" y="70" width="30" height="4" rx="2" />
    <line className="ja-vis__wire" x1="80" y1="60" x2="112" y2="60" />
    <line className="ja-vis__flow" x1="80" y1="60" x2="112" y2="60" />
    <circle className="ja-vis__hub" cx="130" cy="60" r="16" />
    <circle className="ja-vis__hub-ring" cx="130" cy="60" r="16" />
    <line className="ja-vis__edge ja-vis__edge--out" x1="148" y1="60" x2="186" y2="60" />
    <rect className="ja-vis__sink" x="186" y="50" width="20" height="20" rx="5" />
  </svg>
);

// Prompt in, validated MIDI out: request chip through a pipeline to sound bars.
const ApiVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <g className="ja-vis__worker"><rect x="14" y="50" width="42" height="18" rx="6" /><text x="35" y="63">POST</text></g>
    <line className="ja-vis__wire" x1="58" y1="60" x2="94" y2="60" />
    <line className="ja-vis__flow" x1="58" y1="60" x2="94" y2="60" />
    <rect className="ja-vis__art" x="96" y="26" width="46" height="68" rx="8" />
    <rect className="ja-vis__line ja-vis__line--soft" x="106" y="40" width="26" height="4" rx="2" />
    <rect className="ja-vis__line ja-vis__line--soft" x="106" y="52" width="20" height="4" rx="2" />
    <rect className="ja-vis__chip" x="106" y="70" width="26" height="12" rx="4" />
    <line className="ja-vis__edge ja-vis__edge--out" x1="142" y1="60" x2="164" y2="60" />
    <g className="ja-vis__eq" aria-hidden="true">
      <rect x="168" y="52" width="5" height="16" rx="2.5" />
      <rect x="178" y="46" width="5" height="22" rx="2.5" />
      <rect x="188" y="56" width="5" height="12" rx="2.5" />
      <rect x="198" y="50" width="5" height="18" rx="2.5" />
    </g>
  </svg>
);

// Premises converging on a verified conclusion.
const LogicVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <rect className="ja-vis__row" x="14" y="22" width="76" height="9" rx="4.5" />
    <rect className="ja-vis__row" x="14" y="56" width="76" height="9" rx="4.5" />
    <rect className="ja-vis__row" x="14" y="90" width="76" height="9" rx="4.5" />
    <line className="ja-vis__edge" x1="90" y1="26" x2="150" y2="60" />
    <line className="ja-vis__edge" x1="90" y1="60" x2="150" y2="60" />
    <line className="ja-vis__edge" x1="90" y1="94" x2="150" y2="60" />
    <rect className="ja-vis__sink" x="150" y="48" width="24" height="24" rx="6" />
    <g className="ja-vis__worker"><rect x="184" y="51" width="22" height="18" rx="5" /><text x="195" y="64">✓</text></g>
  </svg>
);

// A product console: header, working rows, status chips. No source exposed.
const StartupVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <rect className="ja-vis__panel" x="14" y="16" width="192" height="88" rx="9" />
    <rect className="ja-vis__art-bar" x="26" y="28" width="58" height="8" rx="3" />
    <rect className="ja-vis__line ja-vis__line--soft" x="26" y="46" width="120" height="4" rx="2" />
    <rect className="ja-vis__row" x="26" y="60" width="168" height="9" rx="4.5" />
    <rect className="ja-vis__row ja-vis__row--play" x="26" y="76" width="126" height="9" rx="4.5" />
    <rect className="ja-vis__chip" x="160" y="28" width="22" height="12" rx="4" />
    <rect className="ja-vis__chip ja-vis__chip--b" x="184" y="28" width="12" height="12" rx="4" />
  </svg>
);

// Side-by-side comparison with a highlighted winner.
const CompareVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <rect className="ja-vis__panel" x="14" y="20" width="90" height="80" rx="8" />
    <rect className="ja-vis__art" x="116" y="20" width="90" height="80" rx="8" />
    <rect className="ja-vis__line" x="26" y="34" width="40" height="6" rx="3" />
    <rect className="ja-vis__art-bar" x="128" y="34" width="40" height="6" rx="3" />
    <rect className="ja-vis__row" x="26" y="52" width="66" height="8" rx="4" />
    <rect className="ja-vis__row" x="26" y="68" width="48" height="8" rx="4" />
    <rect className="ja-vis__row ja-vis__row--play" x="128" y="52" width="66" height="8" rx="4" />
    <rect className="ja-vis__row ja-vis__row--play" x="128" y="68" width="56" height="8" rx="4" />
    <rect className="ja-vis__chip ja-vis__chip--b" x="128" y="84" width="26" height="10" rx="4" />
  </svg>
);

// An itinerary route: stops wired in sequence toward a destination.
const TripVisual = (
  <svg className="ja-vis" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
    <line className="ja-vis__edge" x1="34" y1="88" x2="90" y2="52" />
    <line className="ja-vis__edge" x1="90" y1="52" x2="140" y2="76" />
    <line className="ja-vis__edge ja-vis__edge--out" x1="140" y1="76" x2="188" y2="36" />
    <circle className="ja-vis__hub" cx="34" cy="88" r="9" />
    <circle className="ja-vis__hub" cx="90" cy="52" r="9" />
    <circle className="ja-vis__hub" cx="140" cy="76" r="9" />
    <rect className="ja-vis__sink" x="178" y="26" width="20" height="20" rx="5" />
    <rect className="ja-vis__line ja-vis__line--soft" x="24" y="102" width="60" height="4" rx="2" />
    <rect className="ja-vis__line ja-vis__line--soft" x="92" y="102" width="40" height="4" rx="2" />
  </svg>
);

const PROOF_GROUPS: ProofGroup[] = [
  {
    label: 'Agents and AI tooling',
    items: [
      {
        tag: 'OPEN SOURCE · NPM · MCP SERVER',
        title: 'MDP',
        desc: 'Markdown to document compiler, published on npm. Ships with an MCP server and Claude Code and Codex plugins, so other tools and agents integrate it directly. TypeScript.',
        href: 'https://barmoshe.github.io/mdp/',
        open: 'Open MDP',
        visual: MdpVisual,
      },
      {
        tag: 'OPEN SOURCE · TEMPORAL.IO',
        title: 'temporal-plugin',
        desc: 'Temporal.io orchestration plugin for Claude Code: durable, restartable workflows for long-running agent tasks, with retries handled by the workflow engine.',
        href: 'https://github.com/Base67-AI/temporal-plugin',
        open: 'View the code',
        visual: PluginVisual,
      },
      {
        tag: 'LIVE · REAL-TIME AI',
        title: 'Biome Synth',
        desc: 'Browser instrument with an autonomous AI DJ that cycles five playing states. Tone.js, Three.js, Canvas2D. Deployed and playable in the browser.',
        href: 'https://biome-synth.lovable.app/',
        open: 'Play it live',
        visual: AppVisual,
      },
    ],
  },
  {
    label: 'Services and pipelines',
    items: [
      {
        tag: 'MICROSERVICES · TEMPORAL CODE EXCHANGE',
        title: 'Cross-language orchestration',
        desc: 'One Temporal workflow coordinating Go, Python, and TypeScript workers, each on its own task queue, processing data end to end. Featured on Temporal’s Code Exchange, with a Medium write-up.',
        href: 'https://temporal.io/code-exchange/cross-language-data-processing-service-with-temporal',
        open: 'See the writeup',
        visual: OrchestrateVisual,
      },
      {
        tag: 'REST API · OPENAI INTEGRATION',
        title: 'MIDI GPT REST API',
        desc: 'REST API that generates MIDI from prompts. A multi-step Temporal pipeline over Go, Python, and TypeScript calling OpenAI, with retries and validation on every step.',
        href: 'https://github.com/barmoshe/AI_MIDI_API',
        open: 'View the code',
        visual: ApiVisual,
      },
      {
        tag: 'OPEN SOURCE · VERIFICATION',
        title: 'entailer',
        desc: 'Logic-validity toolkit: checks whether a conclusion actually follows from its premises. Built for vetting AI-generated and human arguments alike.',
        href: 'https://github.com/barmoshe/entailer',
        open: 'View the code',
        visual: LogicVisual,
      },
    ],
  },
  {
    label: 'Product and full stack',
    items: [
      {
        tag: 'CURRENT ROLE · 2025 TO PRESENT',
        title: 'Joomsy',
        desc: 'Software developer and primary engineer at a five-person early-stage startup. Full-stack product development plus the DevOps that runs it: features owned from design through deploy and operation.',
        visual: StartupVisual,
      },
      {
        tag: 'LIVE · REACT + TYPESCRIPT',
        title: 'Apartment Hunter',
        desc: 'Real-estate decision tool: side-by-side apartment comparison, Israeli purchase-tax brackets, and a mortgage calculator. Deployed on Vercel.',
        href: 'https://apartment-hunter-one.vercel.app',
        open: 'Open the app',
        visual: CompareVisual,
      },
      {
        tag: 'LIVE · FULL PRODUCT CYCLE',
        title: 'Trip Planner',
        desc: 'Itinerary, budget, and logistics planner with live currency conversion and a trip countdown. Taken from brief to deployed product in days.',
        href: 'https://trip-planner-six-iota.vercel.app',
        open: 'Open the app',
        visual: TripVisual,
      },
    ],
  },
];

type Fit = { k: string; lead: string; body: string };

// Fit for the AI Solution Engineer role (Projects): prompt engineering,
// automations, Python/SQL, AI-output QA, and bilingual cross-functional range.
const FIT_SOLUTIONS: Fit[] = [
  {
    k: 'Prompt engineering and automations',
    lead: 'Design prompts, wire LLMs into automations.',
    body: 'A daily practice, shown in public: MDP on npm ships with an MCP server and editor plugins, a Temporal plugin runs durable agent workflows, and a REST API chains LLM calls with retries and validation. Building automations around models is the work, not a side interest.',
  },
  {
    k: 'Python, SQL, and data',
    lead: 'The coding that supports the products.',
    body: 'Python workers in a cross-language Temporal service and in a prompt-to-MIDI REST API. Comfortable reading and writing SQL over relational data and debugging the flow end to end, on top of a B.Sc. in Computer Science.',
  },
  {
    k: 'AI quality and evaluation',
    lead: 'QA on model output, meticulously.',
    body: 'Treats AI output as a testable property. entailer, an open-source toolkit, checks whether an answer’s conclusion actually follows from its premises; evals are part of daily work. The attention to detail the role asks for, aimed at the parts of AI that quietly break.',
  },
  {
    k: 'Range and communication',
    lead: 'Hebrew and English, across the team.',
    body: 'Native Hebrew and fluent English. Sole primary developer at a five-person startup means constant work across product, design, and engineering. Builds the front ends too, so interface design is part of the reasoning, not an afterthought.',
  },
];

// Fit for the Full Stack Engineer role (R&D): full-stack, GenAI integration,
// services/data, and DevOps.
const FIT_FS: Fit[] = [
  {
    k: 'Full-stack development',
    lead: 'React, Next.js, TypeScript, Node.js.',
    body: 'Primary developer at Joomsy (2025 to present), building React front ends over Node services end to end. Full-stack training at Coding Academy (React, Node.js, MongoDB) on top of a B.Sc. in Computer Science. NestJS runs on the same runtime and patterns; the modules and DI idiom is a fast switch, and I say that plainly rather than claim it as experience.',
  },
  {
    k: 'Generative AI integration',
    lead: 'LLM apps, MCP servers, agents, evals.',
    body: 'AI tooling shipped in public: MDP on npm with an MCP server and editor plugins, a Temporal orchestration plugin for agent workflows, and a REST API calling OpenAI through a validated multi-step pipeline. Day-to-day work includes agentic pipelines and prompt engineering.',
  },
  {
    k: 'Services and data',
    lead: 'REST APIs, microservices, durable pipelines.',
    body: 'Cross-language Temporal service (Go, Python, TypeScript workers on separate task queues) featured on Temporal’s Code Exchange. REST API design with auth, middleware, and logging across projects, over relational and document databases.',
  },
  {
    k: 'DevOps and delivery',
    lead: 'Docker, Kubernetes, Terraform, AWS, CI/CD.',
    body: 'Hands-on EKS, Kubernetes, Terraform, and scalable-deploy practice from the Wix DevOps workshop, applied in daily work at Joomsy. Earlier: Customer Support Engineer at Wochit, debugging a cloud video editor at scale with the engineering team. B.Sc. Computer Science, Afeka College of Engineering.',
  },
];

type RoleId = 'solutions' | 'fullstack';

type Role = {
  hash: string;
  tab: string;
  docTitle: string;
  titleA: string;
  titleB: React.ReactNode;
  lede: React.ReactNode;
  trust: React.ReactNode;
  fit: Fit[];
  ctaSub: string;
  footerTag: string;
  emailSubject: string;
};

const ROLES: Record<RoleId, Role> = {
  solutions: {
    hash: 'ai-solution-engineer',
    tab: 'AI Solution Engineer',
    docTitle: 'Bar Moshe × Jeen AI — AI Solution Engineer',
    titleA: 'Bar Moshe. From prompt',
    titleB: (
      <>
        to <span className="ja-hl">reliable AI output</span>
      </>
    ),
    lede: (
      <>
        Prompt engineering and LLM automation as a daily practice: MCP tooling and
        agent pipelines on npm, evals that treat model output as a testable property,
        and the Python and full-stack work to ship it. Currently the primary developer
        at Joomsy, an early-stage startup.
      </>
    ),
    trust: (
      <>
        <strong>B.Sc. Computer Science</strong>, Afeka College · Python · SQL · Prompt
        engineering · Hebrew &amp; English
      </>
    ),
    fit: FIT_SOLUTIONS,
    ctaSub:
      'If this background fits the AI Solution Engineer role, I would be glad to continue the conversation. Based in Tel Aviv.',
    footerTag:
      'An application page Bar Moshe built for the AI Solution Engineer role at Jeen.AI, Tel Aviv. Not affiliated with Jeen.AI.',
    emailSubject: 'AI Solution Engineer application from Bar Moshe',
  },
  fullstack: {
    hash: 'full-stack-engineer',
    tab: 'Full Stack Engineer',
    docTitle: 'Bar Moshe × Jeen AI — Full Stack Engineer',
    titleA: 'Bar Moshe. Full stack',
    titleB: (
      <>
        engineer for <span className="ja-hl">AI products</span>
      </>
    ),
    lede: (
      <>
        React, Next.js, TypeScript, and Node across the front end and services.
        Docker, Kubernetes, and CI/CD to production. Currently the primary developer
        at Joomsy, an early-stage startup. Open-source AI tooling on npm, and a service
        featured on Temporal&rsquo;s Code Exchange.
      </>
    ),
    trust: (
      <>
        <strong>B.Sc. Computer Science</strong>, Afeka College · TypeScript · Python ·
        Go · Tel Aviv
      </>
    ),
    fit: FIT_FS,
    ctaSub:
      'If this background fits the Full Stack Engineer role, I would be glad to continue the conversation. Based in Tel Aviv.',
    footerTag:
      'An application page Bar Moshe built for the Full Stack Engineer role at Jeen.AI, Tel Aviv. Not affiliated with Jeen.AI.',
    emailSubject: 'Full Stack Engineer application from Bar Moshe',
  },
};

const ROLE_ORDER: RoleId[] = ['solutions', 'fullstack'];

// Skill marquee — jeen.ai runs a scrolling customer-logo strip; Bar has no
// customer logos to show, so this is an honest strip of the languages and tools
// he actually works in. Uniform wordmarks read like a logo strip.
const MARQUEE = [
  'TypeScript', 'Python', 'Go', 'React', 'Next.js', 'Node.js', 'MCP',
  'Temporal', 'OpenAI', 'Docker', 'Kubernetes', 'npm', 'Evals',
  'Prompt engineering', 'CI/CD',
];

// "A governed foundation" — jeen's 4-up principles grid, mapped to how Bar
// builds. Role-independent (does not duplicate the role-swapping FIT band).
type Found = { accent: 'lilac' | 'coral' | 'amber' | 'plum'; k: string; d: string };
const FOUNDATION: Found[] = [
  {
    accent: 'lilac',
    k: 'Automations around models',
    d: 'Prompts and agent pipelines wired into working automations, with an MCP server and editor plugins shipped on npm.',
  },
  {
    accent: 'coral',
    k: 'Grounded and verified',
    d: 'Retrieval plus evals that treat model output as a testable property, including entailer for checking an answer actually follows.',
  },
  {
    accent: 'amber',
    k: 'Built to reach production',
    d: 'Docker, Kubernetes, and CI/CD carry the work from a prompt to a deployed, running product, not a demo.',
  },
  {
    accent: 'plum',
    k: 'One person, full range',
    d: 'Product, services, and DevOps owned end to end, in Hebrew and English, as the primary developer at a five-person startup.',
  },
];

export default function JeenApp() {
  const scope = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);

  // Which role the page addresses. Default is the AI Solution Engineer face;
  // `#full-stack-engineer` (or the toggle) swaps to the Full Stack framing.
  // Initial render is the default on both server and client to keep hydration
  // stable; the hash is read on mount.
  const [active, setActive] = useState<RoleId>('solutions');

  // Mobile nav sheet (jeen uses a hamburger; our IA is three anchors, so the
  // sheet mirrors the desktop links rather than inventing a mega-menu).
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace('#', '');
      const match = ROLE_ORDER.find((id) => ROLES[id].hash === h);
      if (match) setActive(match);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  useEffect(() => {
    document.title = ROLES[active].docTitle;
  }, [active]);

  const selectRole = (id: RoleId) => {
    setActive(id);
    if (window.location.hash.replace('#', '') !== ROLES[id].hash) {
      history.replaceState(null, '', `#${ROLES[id].hash}`);
    }
  };

  const role = ROLES[active];
  const EMAIL = mailto(role.emailSubject);

  useGSAP(
    () => {
      if (!matchMedia(FULL_MOTION_QUERY).matches) return;

      // Hero entrance: rise-reveal the copy block, staggered.
      gsap.from('.ja-hero__copy > [data-rise]', {
        yPercent: 18,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.08,
      });

      // Section reveals: fade-up each marked block as it enters.
      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      reveals.forEach((el) => {
        gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
      });
    },
    { scope },
  );

  // The hero "liquid": jeen.ai reveals a pastel wash through a soft
  // elliptical radial-gradient mask whose center is animated from JS. Same
  // mechanism here: ease toward the pointer while it moves over the hero,
  // drift on slow sines when idle. Reduced motion: CSS keeps the static
  // centered mask and this effect never attaches.
  useEffect(() => {
    if (!matchMedia(FULL_MOTION_QUERY).matches) return;
    const hero = heroRef.current;
    const blob = blobRef.current;
    if (!hero || !blob) return;

    const pos = { x: 0.5, y: 0.46 };
    const target = { x: 0.5, y: 0.46 };
    let lastPointer = 0;

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
      lastPointer = performance.now();
    };
    hero.addEventListener('pointermove', onMove, { passive: true });

    const tick = () => {
      const now = performance.now();
      if (now - lastPointer > 2600) {
        target.x = 0.5 + 0.28 * Math.sin(now / 4200);
        target.y = 0.44 + 0.15 * Math.cos(now / 5300);
      }
      pos.x += (target.x - pos.x) * 0.045;
      pos.y += (target.y - pos.y) * 0.045;
      const mask = `radial-gradient(17rem 24rem at ${(pos.x * 100).toFixed(2)}% ${(pos.y * 100).toFixed(2)}%, #000 0%, transparent 100%)`;
      blob.style.maskImage = mask;
      blob.style.webkitMaskImage = mask;
    };
    gsap.ticker.add(tick);

    return () => {
      hero.removeEventListener('pointermove', onMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="mp-root ja-root" ref={scope}>
      <a className="ja-skip" href="#main">Skip to content</a>

      {/* ── Top navigation ──────────────────────────────────── */}
      <header className="ja-nav">
        <div className="ja-nav__inner">
          <a className="ja-brand" href="#main" aria-label="Bar Moshe">
            <JeenMark className="ja-nav__mark" />
            <span className="ja-wordmark">Bar Moshe</span>
          </a>
          <span className="ja-nav__tag">for Jeen.AI</span>
          <nav className="ja-nav__links" aria-label="Sections">
            <a className="ja-nav__link" href="#demo">Demo</a>
            <a className="ja-nav__link" href="#work">Work</a>
            <a className="ja-nav__link" href="#fit">Why me</a>
          </nav>
          <div className="ja-nav__cta">
            <a className="ja-btn ja-btn--ghost ja-btn--sm" href={CV} target="_blank" rel="noopener noreferrer">Download CV</a>
            <a className="ja-btn ja-btn--ink ja-btn--sm" href={EMAIL}>
              <span className="ja-nav__full">Start a conversation</span>
              <span className="ja-nav__short">Let’s talk</span>
            </a>
          </div>
          <button
            type="button"
            className="ja-nav__burger"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="ja-nav-sheet"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span className={`ja-burger${navOpen ? ' is-open' : ''}`} aria-hidden="true">
              <span /><span /><span />
            </span>
          </button>
        </div>
        <div id="ja-nav-sheet" className={`ja-nav__sheet${navOpen ? ' is-open' : ''}`} hidden={!navOpen}>
          <a className="ja-nav__slink" href="#demo" onClick={() => setNavOpen(false)}>Demo</a>
          <a className="ja-nav__slink" href="#work" onClick={() => setNavOpen(false)}>Work</a>
          <a className="ja-nav__slink" href="#fit" onClick={() => setNavOpen(false)}>Why me</a>
          <div className="ja-nav__sheet-cta">
            <a className="ja-btn ja-btn--ghost ja-btn--sm" href={CV} target="_blank" rel="noopener noreferrer" onClick={() => setNavOpen(false)}>Download CV</a>
            <a className="ja-btn ja-btn--ink ja-btn--sm" href={EMAIL} onClick={() => setNavOpen(false)}>Start a conversation</a>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ── Hero (centered over the roaming pastel liquid) ── */}
        <section className="ja-hero" ref={heroRef}>
          <div className="ja-liquid" aria-hidden="true">
            <div className="ja-liquid__blob" ref={blobRef} />
          </div>
          <div className="ja-hero__inner">
            <div className="ja-hero__copy">
              <p className="ja-eyebrow" data-rise>
                <span className="ja-eyebrow__dot" />
                APPLICATION · JEEN.AI · TEL AVIV
              </p>
              <div className="ja-roletabs" role="group" aria-label="Choose the role this page addresses" data-rise>
                {ROLE_ORDER.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`ja-roletab${active === id ? ' is-active' : ''}`}
                    aria-pressed={active === id}
                    onClick={() => selectRole(id)}
                  >
                    {ROLES[id].tab}
                  </button>
                ))}
              </div>
              <h1 className="ja-title" data-rise>
                {role.titleA}
                <br />
                {role.titleB}
              </h1>
              <p className="ja-lede" data-rise>
                {role.lede}
              </p>
              <div className="ja-hero__cta" data-rise>
                <a className="ja-btn ja-btn--primary" href={EMAIL}>
                  Start a conversation
                  <span className="ja-btn__arrow" aria-hidden="true">→</span>
                </a>
                <a className="ja-btn ja-btn--ghost" href={CV} target="_blank" rel="noopener noreferrer">
                  Download CV
                </a>
              </div>
              <p className="ja-hero__trust" data-rise>
                {role.trust}
              </p>
            </div>
          </div>
        </section>

        {/* ── Skill marquee (jeen's logo strip, honest tech) ──── */}
        <div className="ja-trust">
          <div className="ja-marquee" aria-hidden="true">
            <div className="ja-marquee__track">
              {[...MARQUEE, ...MARQUEE].map((m, i) => (
                <span className="ja-marquee__item" key={i}>
                  {m}
                  <span className="ja-marquee__dot" />
                </span>
              ))}
            </div>
          </div>
          <p className="visually-hidden">
            Languages and tools: {MARQUEE.join(', ')}.
          </p>
        </div>

        {/* ── A governed foundation (jeen's 4-up principles grid) ── */}
        <section className="ja-section ja-section--foundation">
          <div className="ja-wrap">
            <header className="ja-section__head" data-reveal>
              <p className="ja-kicker">How I build</p>
              <h2 className="ja-h2">A foundation for AI that actually ships.</h2>
              <p className="ja-sub">
                Governed, grounded, and shipped to production: the parts of AI
                engineering that decide whether it survives contact with real users.
              </p>
            </header>
            <div className="ja-found__grid">
              {FOUNDATION.map((f) => (
                <article className="ja-found__card" data-reveal key={f.k}>
                  <span className={`ja-found__tile ja-found__tile--${f.accent}`} aria-hidden="true" />
                  <h3 className="ja-found__k">{f.k}</h3>
                  <p className="ja-found__d">{f.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Signature piece: from prompt to governed answer ── */}
        <section id="demo" className="ja-section ja-section--soft">
          <div className="ja-wrap">
            <header className="ja-section__head" data-reveal>
              <p className="ja-kicker">One foundation</p>
              <h2 className="ja-h2">The operating layer, visualized.</h2>
              <p className="ja-sub">
                A live diagram of an enterprise AI request descending through the
                stack: prompt, model routing, retrieval and grounding, a governance
                gate, and a cited answer, converging on a grounded foundation. Built
                from scratch in React for this page, reduced motion supported.
              </p>
            </header>
            <div data-reveal>
              <GovernedAnswer />
            </div>
          </div>
        </section>

        {/* ── Proof of work ─────────────────────────────────── */}
        <section id="work" className="ja-section">
          <div className="ja-wrap">
            <header className="ja-section__head" data-reveal>
              <p className="ja-kicker">Selected work</p>
              <h2 className="ja-h2">Selected work, by area.</h2>
              <p className="ja-sub">Live links and public repos where available; employer work is named, not shown.</p>
            </header>
            {PROOF_GROUPS.map((g) => (
              <div className="ja-proof__group" key={g.label}>
                <p className="ja-proof__glabel" data-reveal>{g.label}</p>
                <div className="ja-proof__grid">
                  {g.items.map((p) => {
                    const body = (
                      <>
                        <div className="ja-pcard__screen">{p.visual}</div>
                        <div className="ja-pcard__body">
                          <span className="ja-pcard__tag">{p.tag}</span>
                          <h3 className="ja-pcard__title">{p.title}</h3>
                          <p className="ja-pcard__desc">{p.desc}</p>
                          {p.href ? (
                            <span className="ja-pcard__link" aria-hidden="true">{p.open} →</span>
                          ) : (
                            <span className="ja-pcard__link ja-pcard__link--muted">Named, not linked. Employer IP.</span>
                          )}
                        </div>
                      </>
                    );
                    return p.href ? (
                      <a
                        key={p.title}
                        className="ja-pcard"
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-reveal
                      >
                        {body}
                      </a>
                    ) : (
                      <article key={p.title} className="ja-pcard ja-pcard--static" data-reveal>
                        {body}
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className="ja-proof__more">
              More in{' '}
              <a href="https://github.com/barmoshe" target="_blank" rel="noopener noreferrer">
                my portfolio
              </a>
              .
            </p>
          </div>
        </section>

        {/* ── Why Bar, for this role (deep-plum band) ───────── */}
        <section id="fit" className="ja-section ja-section--plum">
          <div className="ja-wrap">
            <header className="ja-section__head" data-reveal>
              <p className="ja-kicker">Experience and skills</p>
              <h2 className="ja-h2">Background, mapped to the role.</h2>
            </header>
            <div className="ja-fit__grid">
              {role.fit.map((f, i) => (
                <article className="ja-fcard" key={f.k} data-reveal>
                  <span className="ja-fcard__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="ja-fcard__k">{f.k}</h3>
                  <p className="ja-fcard__lead">{f.lead}</p>
                  <p className="ja-fcard__body">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Close band (cream, wash-washed, centered) ─────── */}
        <section className="ja-cta">
          <div className="ja-cta__inner" data-reveal>
            <JeenMark className="ja-cta__mark" float />
            <h2 className="ja-cta__title">Let’s talk.</h2>
            <p className="ja-cta__sub">{role.ctaSub}</p>
            <div className="ja-cta__links">
              <a className="ja-btn ja-btn--oninvert" href={EMAIL}>Email me</a>
              <a className="ja-btn ja-btn--oninvert-ghost" href="https://www.linkedin.com/in/barmoshe/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="ja-btn ja-btn--oninvert-ghost" href="https://github.com/barmoshe" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="ja-btn ja-btn--oninvert-ghost" href={CV} target="_blank" rel="noopener noreferrer">Download CV</a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer (dark) ───────────────────────────────────── */}
      <footer className="ja-footer">
        <div className="ja-footer__inner">
          <div className="ja-footer__brand">
            <span className="ja-footer__mark">
              <JeenMark className="ja-nav__mark" />
              <span className="ja-wordmark">Bar Moshe</span>
            </span>
            <p className="ja-footer__tag">{role.footerTag}</p>
          </div>
          <div className="ja-footer__col">
            <p className="ja-footer__h">The work</p>
            <ul>
              <li><a className="ja-footer__link" href="https://barmoshe.github.io/mdp/" target="_blank" rel="noopener noreferrer">MDP + MCP server</a></li>
              <li><a className="ja-footer__link" href="https://temporal.io/code-exchange/cross-language-data-processing-service-with-temporal" target="_blank" rel="noopener noreferrer">Temporal Code Exchange</a></li>
              <li><a className="ja-footer__link" href="https://github.com/barmoshe" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
          <div className="ja-footer__col">
            <p className="ja-footer__h">Get in touch</p>
            <ul>
              <li><a className="ja-footer__link" href={EMAIL}>1barmoshe1@gmail.com</a></li>
              <li><a className="ja-footer__link" href="https://www.linkedin.com/in/barmoshe/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a className="ja-footer__link" href={CV} target="_blank" rel="noopener noreferrer">Download CV</a></li>
            </ul>
          </div>
        </div>
        <div className="ja-footer__bottom">
          <div className="ja-footer__bottom-inner">
            <span>Built by Bar Moshe for this application.</span>
            <span>Tel Aviv · 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
