'use client';

import { useEffect, useState } from 'react';

/**
 * GovernedAnswer — a bespoke console that dramatizes what Jeen sells: an
 * employee asks a question, the operating layer routes it to the right model,
 * retrieves grounded knowledge, passes a governance gate, and returns a cited,
 * policy-clean answer. It is the centerpiece of the application page, built
 * from scratch in the page's Jeen-inspired palette. Pure React state + one
 * interval, no GSAP, no canvas. Under prefers-reduced-motion it renders the
 * final, resolved frame and never ticks.
 */

const SOURCES = [
  { name: 'HR-policy-2026.pdf', kind: 'docs' },
  { name: 'PostgreSQL · orders', kind: 'sql' },
  { name: 'Confluence · runbooks', kind: 'wiki' },
  { name: 'CRM · account notes', kind: 'crm' },
  { name: 'Call transcript · #4211', kind: 'voice' },
];

const STAGES = ['Route model · on-prem', 'Retrieve knowledge', 'Governance gate · PII', 'Answer with citations'];

// Discrete timeline. The interval advances `step` and the whole UI is derived
// from it, so the animation is a pure function of one integer (easy to reason
// about, trivially resettable, and a single static value for reduced motion).
const CYCLE = 13;
const FIXED_STEP = 11; // the resolved frame reduced-motion users see
const TARGET_CITED = 5;

function sourcesVisible(step: number): number {
  // Steps 1..5 flood the connected sources in.
  return Math.min(SOURCES.length, Math.max(0, step));
}
function sourcesCited(step: number): number {
  // From step 7 each source resolves into a citation, two per beat.
  if (step < 7) return 0;
  return Math.min(SOURCES.length, (step - 6) * 2);
}
function stageActive(step: number): number {
  // Operating layer lights up across steps 6..9 (Route..Answer).
  if (step < 6) return -1;
  if (step >= 10) return STAGES.length; // all done
  return step - 6;
}
function phase(step: number): 'prompt' | 'retrieve' | 'govern' | 'answered' {
  if (step >= 10) return 'answered';
  if (step >= 7) return 'govern';
  if (step >= 2) return 'retrieve';
  return 'prompt';
}

function clock(step: number): string {
  const s = Math.min(step, 10) * 2; // a fast, machine-speed window
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

const PHASE_LABEL = {
  prompt: 'PROMPT',
  retrieve: 'RETRIEVE',
  govern: 'GOVERN',
  answered: 'ANSWERED',
} as const;

const PHASE_CAPTION = {
  prompt: 'An employee asks. The layer picks the model this data is allowed to reach.',
  retrieve: 'Pulling grounded context from the organization’s own sources.',
  govern: 'Policy gate: permissions checked, PII masked, actions scoped.',
  answered: 'A cited, policy-clean answer. Every claim traceable to a source.',
} as const;

export default function GovernedAnswer() {
  const [step, setStep] = useState(FIXED_STEP);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // hold the resolved frame, never tick

    // Kick the animation off on the client only: a stable SSR / first-paint
    // frame (the fixed step), then animate post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnimate(true);
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => (s + 1) % CYCLE);
    }, 760);
    return () => clearInterval(id);
  }, []);

  const visible = sourcesVisible(step);
  const cited = sourcesCited(step);
  const active = stageActive(step);
  const ph = phase(step);
  const progress = Math.min(step, 10) / 10;
  const grounded = Math.round(progress * TARGET_CITED);

  return (
    <div
      className="ja-console"
      data-phase={ph}
      role="img"
      aria-label="A simulated enterprise AI console moving from an employee prompt, through retrieval from governed organizational sources, to a cited, policy-clean answer."
    >
      <div className="ja-console__bar" aria-hidden="true">
        <span className="ja-console__dot" />
        <span className="ja-console__dot" />
        <span className="ja-console__dot" />
        <span className="ja-console__name">operating-layer // governed-answer</span>
        <span className="ja-console__clock">T+{clock(step)}</span>
      </div>

      <div className="ja-console__head" aria-hidden="true">
        <span className="ja-status" data-phase={ph}>
          <span className="ja-status__pip" />
          {PHASE_LABEL[ph]}
        </span>
        <span className="ja-console__caption">{PHASE_CAPTION[ph]}</span>
      </div>

      <div className="ja-console__body" aria-hidden="true">
        {/* Connected sources — the grounded knowledge */}
        <div className="ja-stream">
          <p className="ja-stream__label">CONNECTED SOURCES</p>
          <ul className="ja-stream__list">
            {SOURCES.map((s, i) => {
              const isVisible = i < visible;
              const isCited = i < cited;
              return (
                <li
                  key={s.name}
                  className="ja-source"
                  data-on={isVisible}
                  data-cited={isCited}
                >
                  <span className="ja-source__icon">{isCited ? '✓' : '•'}</span>
                  <span className="ja-source__name">{s.name}</span>
                  <span className="ja-source__kind">{s.kind}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Operating layer + grounding gauge — the governed answer */}
        <div className="ja-pipe">
          <p className="ja-stream__label">OPERATING LAYER</p>
          <ol className="ja-pipe__list">
            {STAGES.map((s, i) => (
              <li
                key={s}
                className="ja-pipe__step"
                data-state={i < active ? 'done' : i === active ? 'active' : 'idle'}
              >
                <span className="ja-pipe__node" />
                <span className="ja-pipe__name">{s}</span>
              </li>
            ))}
          </ol>

          <div className="ja-gauge">
            <div className="ja-gauge__head">
              <span className="ja-gauge__label">Citations grounded</span>
              <span className="ja-gauge__score">{grounded}<small>/{TARGET_CITED}</small></span>
            </div>
            <div className="ja-gauge__track">
              <span className="ja-gauge__fill" style={{ inlineSize: `${progress * 100}%` }} />
            </div>
            <p className="ja-gauge__meta">
              {cited}/{SOURCES.length} sources cited · PII masked · model stayed on-prem
              {animate ? '' : ' · static preview'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
