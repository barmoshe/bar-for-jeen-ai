'use client';

import { useEffect, useState } from 'react';

/**
 * GovernedAnswer — a "one foundation" platform-layer diagram, recast from the
 * earlier console to match how jeen.ai visualizes its stack: an enterprise AI
 * request descending through stacked layers (prompt, routing, retrieval,
 * governance, answer) that light up in sequence and converge on a grounded
 * foundation. Same load-bearing state machine as before: pure React state + one
 * interval, no GSAP, no canvas; under prefers-reduced-motion it renders the
 * final resolved frame and never ticks.
 */

const SOURCES = [
  { name: 'HR-policy-2026.pdf', kind: 'docs' },
  { name: 'PostgreSQL · orders', kind: 'sql' },
  { name: 'Confluence · runbooks', kind: 'wiki' },
  { name: 'CRM · account notes', kind: 'crm' },
  { name: 'Call transcript · #4211', kind: 'voice' },
];

// The five stacked platform layers a request passes through.
const LAYERS = [
  { k: 'Prompt in', d: 'An employee asks, in plain language.' },
  { k: 'Model routing', d: 'On-prem or air-gapped, model-agnostic.' },
  { k: 'Retrieval & grounding', d: 'Context from your own governed sources.' },
  { k: 'Governance & PII', d: 'Permissions checked, PII masked, actions scoped.' },
  { k: 'Cited answer', d: 'Every claim traceable back to a source.' },
];

// Discrete timeline. One interval advances `step`; the whole diagram is derived
// from it, so it is a pure function of one integer (resettable, and a single
// static value for reduced motion).
const CYCLE = 13;
const FIXED_STEP = 11; // the resolved frame reduced-motion users see
const TARGET_CITED = 5;

function sourcesVisible(step: number): number {
  return Math.min(SOURCES.length, Math.max(0, step));
}
function sourcesCited(step: number): number {
  if (step < 7) return 0;
  return Math.min(SOURCES.length, (step - 6) * 2);
}
// Which layer is currently lighting up (0..4), or 5 when all are resolved.
function activeLayer(step: number): number {
  if (step >= 10) return 5;
  if (step >= 9) return 4;
  if (step >= 7) return 3;
  if (step >= 4) return 2;
  if (step >= 2) return 1;
  return 0;
}

export default function GovernedAnswer() {
  const [step, setStep] = useState(FIXED_STEP);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // hold the resolved frame, never tick

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnimate(true);
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => (s + 1) % CYCLE);
    }, 820);
    return () => clearInterval(id);
  }, []);

  const visible = sourcesVisible(step);
  const cited = sourcesCited(step);
  const active = activeLayer(step);
  const progress = Math.min(step, 10) / 10;
  const grounded = Math.round(progress * TARGET_CITED);
  const answered = active >= 5;

  return (
    <div
      className="ja-stack"
      data-answered={answered}
      role="img"
      aria-label="A platform-layer diagram of an enterprise AI request descending through five layers, prompt, model routing, retrieval and grounding, governance and PII, and a cited answer, converging on a grounded foundation."
    >
      <div className="ja-stack__head" aria-hidden="true">
        <span className="ja-stack__eyebrow">ONE FOUNDATION</span>
        <span className="ja-stack__title">The operating layer, end to end</span>
      </div>

      <ol className="ja-stack__layers" aria-hidden="true">
        {LAYERS.map((l, i) => {
          const state = i < active ? 'done' : i === active ? 'active' : 'idle';
          const isRetrieval = i === 2;
          return (
            <li key={l.k} className="ja-layer" data-state={state}>
              <span className="ja-layer__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="ja-layer__body">
                <span className="ja-layer__k">{l.k}</span>
                <span className="ja-layer__d">{l.d}</span>
                {isRetrieval && (
                  <span className="ja-layer__chips">
                    {SOURCES.map((s, si) => (
                      <span
                        key={s.name}
                        className="ja-chip"
                        data-on={si < visible}
                        data-cited={si < cited}
                      >
                        {s.kind}
                      </span>
                    ))}
                  </span>
                )}
              </span>
              <span className="ja-layer__tick" aria-hidden="true">
                {state === 'done' ? '✓' : ''}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="ja-stack__foundation" aria-hidden="true">
        <div className="ja-stack__gauge">
          <span className="ja-stack__glabel">Grounded &amp; governed</span>
          <span className="ja-stack__gscore">
            {grounded}
            <small>/{TARGET_CITED}</small>
          </span>
        </div>
        <div className="ja-stack__track">
          <span className="ja-stack__fill" style={{ inlineSize: `${progress * 100}%` }} />
        </div>
        <p className="ja-stack__meta">
          {cited}/{SOURCES.length} sources cited · PII masked · model stayed on-prem
          {animate ? '' : ' · static preview'}
        </p>
      </div>
    </div>
  );
}
