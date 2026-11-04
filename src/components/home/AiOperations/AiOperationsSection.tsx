'use client';

import { useRef } from 'react';
import {
  AiOperationsContent,
  defaultAiOperationsContent,
  DEFAULT_READINESS_VALUE,
  INTEL_VB,
  INTEL_CORE,
  INTEL_INPUT_X,
  INTEL_INPUT_Y,
  INTEL_OUTPUT_X,
  INTEL_OUTPUT_Y,
  intelInputPaths,
  intelOutputPaths,
  READY_VB,
  READY_RING,
  READY_ROW_Y,
  READY_LEFT_X,
  READY_RIGHT_X,
  readyLeftPaths,
  readyRightPaths,
  pct,
} from './aiOperationsData';
import { useAiOperationsAnimation } from './useAiOperationsAnimation';
import './_ai-operations.scss';

export interface AiOperationsSectionProps {
  /** Localized copy. Pass translated strings from the project's i18n layer. */
  content?: Partial<AiOperationsContent>;
  /** Displayed readiness percentage (presentation value). Default 82. */
  readinessValue?: number;
  /** 'rtl' for Arabic. Diagram flow stays left→right (see README). */
  dir?: 'ltr' | 'rtl';
  className?: string;
  id?: string;
}

const BrainIcon = () => (
  <svg viewBox="0 0 48 48" width="56" height="56" fill="none" aria-hidden="true">
    <path
      d="M18 8a6 6 0 0 0-6 6v.5A6 6 0 0 0 8 20a6 6 0 0 0 2 4.5A6 6 0 0 0 9 32a6 6 0 0 0 6 6 5 5 0 0 0 9 1V12a5 5 0 0 0-6-4Z
         M30 8a6 6 0 0 1 6 6v.5A6 6 0 0 1 40 20a6 6 0 0 1-2 4.5 6 6 0 0 1 1 7.5 6 6 0 0 1-6 6 5 5 0 0 1-9 1V12a5 5 0 0 1 6-4Z
         M24 18h-4m4 10h-5m5-5h6m-6 10h4"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AiOperationsSection({
  content,
  readinessValue = DEFAULT_READINESS_VALUE,
  dir = 'ltr',
  className = '',
  id = 'ai-operations',
}: AiOperationsSectionProps) {
  const c: AiOperationsContent = { ...defaultAiOperationsContent, ...content };
  const value = Math.max(0, Math.min(100, Math.round(readinessValue)));
  const rootRef = useRef<HTMLElement>(null);

  useAiOperationsAnimation(rootRef, value);

  const circumference = 2 * Math.PI * READY_RING.r;

  return (
    <section
      ref={rootRef}
      id={id}
      dir={dir}
      className={`estidam-ai-operations ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="estidam-ai-operations__glow" data-ai="glow" aria-hidden="true" />

      <div className="container">
        {/* ---------- Header ---------- */}
        <header className="estidam-ai-operations__header">
          <div className="estidam-ai-operations__heading">
            <span className="estidam-ai-operations__eyebrow" data-ai="reveal">
              {c.eyebrow}
            </span>
            <h2 id={`${id}-title`} className="estidam-ai-operations__title" data-ai="reveal">
              <span>{c.titleLine1}</span>
              <span className="estidam-ai-operations__title-muted">{c.titleLine2}</span>
            </h2>
          </div>
          <p className="estidam-ai-operations__desc" data-ai="reveal">
            {c.description}
          </p>
        </header>

        {/* ---------- Cards ---------- */}
        <div className="estidam-ai-operations__grid">
          {/* Intelligence layer */}
          <div className="estidam-ai-operations__card estidam-ai-operations__card--intel" data-ai="card">
            <div className="estidam-ai-operations__dots" aria-hidden="true" />

            <div className="estidam-ai-operations__intel" dir="ltr">
              <svg
                className="estidam-ai-operations__lines"
                viewBox={`0 0 ${INTEL_VB.w} ${INTEL_VB.h}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {intelInputPaths.map((d, i) => (
                  <g key={`in-${i}`}>
                    <path d={d} className="estidam-ai-operations__line" data-ai="in-line" />
                    <circle cx={INTEL_INPUT_X} cy={INTEL_INPUT_Y[i]} r="2.5" className="estidam-ai-operations__dot" data-ai="in-dot" />
                  </g>
                ))}
                {intelOutputPaths.map((d, i) => (
                  <g key={`out-${i}`}>
                    <path d={d} className="estidam-ai-operations__line" data-ai="out-line" />
                    <circle cx={INTEL_OUTPUT_X} cy={INTEL_OUTPUT_Y[i]} r="2.5" className="estidam-ai-operations__dot" data-ai="out-dot" />
                  </g>
                ))}
              </svg>

              {c.inputs.map((label, i) => (
                <span
                  key={label + i}
                  className="estidam-ai-operations__chip estidam-ai-operations__chip--in"
                  style={{ right: pct(INTEL_VB.w - INTEL_INPUT_X, INTEL_VB.w), top: pct(INTEL_INPUT_Y[i], INTEL_VB.h) }}
                  data-ai="in-chip"
                >
                  {label}
                </span>
              ))}

              <div
                className="estidam-ai-operations__core"
                style={{
                  left: pct(INTEL_CORE.x, INTEL_VB.w),
                  top: pct(INTEL_CORE.y, INTEL_VB.h),
                  width: pct(INTEL_CORE.w, INTEL_VB.w),
                  height: pct(INTEL_CORE.h, INTEL_VB.h),
                }}
                data-ai="core"
              >
                <span className="estidam-ai-operations__core-halo" data-ai="core-halo" aria-hidden="true" />
                <span className="estidam-ai-operations__core-sheen" data-ai="core-sheen" aria-hidden="true" />
                <span className="estidam-ai-operations__core-inner" data-ai="core-inner">
                  <BrainIcon />
                  <strong>{c.aiLabel}</strong>
                  <small>{c.aiSubLabel}</small>
                </span>
              </div>

              {c.outputs.map((label, i) => (
                <span
                  key={label + i}
                  className="estidam-ai-operations__chip estidam-ai-operations__chip--out"
                  style={{ left: pct(INTEL_OUTPUT_X, INTEL_VB.w), top: pct(INTEL_OUTPUT_Y[i], INTEL_VB.h) }}
                  data-ai="out-chip"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Readiness assessment */}
          <div className="estidam-ai-operations__card estidam-ai-operations__card--ready" data-ai="card">
            <div className="estidam-ai-operations__dots" aria-hidden="true" />
            <h3 className="estidam-ai-operations__card-title" data-ai="ready-text">{c.readinessTitle}</h3>
            <p className="estidam-ai-operations__card-desc" data-ai="ready-text">{c.readinessDescription}</p>

            <div className="estidam-ai-operations__ready" dir="ltr">
              <svg
                className="estidam-ai-operations__lines"
                viewBox={`0 0 ${READY_VB.w} ${READY_VB.h}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {[...readyLeftPaths, ...readyRightPaths].map((d, i) => (
                  <path key={i} d={d} className="estidam-ai-operations__line" data-ai="ready-line" />
                ))}
                {READY_ROW_Y.map((y, i) => (
                  <g key={`rd-${i}`}>
                    <circle cx={READY_LEFT_X} cy={y} r="2.5" className="estidam-ai-operations__dot" data-ai="ready-dot" />
                    <circle cx={READY_RIGHT_X} cy={y} r="2.5" className="estidam-ai-operations__dot" data-ai="ready-dot" />
                  </g>
                ))}
              </svg>

              {/* Ring uses its own square SVG so it never distorts */}
              <div
                className="estidam-ai-operations__ring"
                style={{
                  left: pct(READY_RING.cx, READY_VB.w),
                  top: pct(READY_RING.cy, READY_VB.h),
                }}
                role="img"
                aria-label={`${c.readinessCaption}: ${value}%`}
              >
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r={READY_RING.r} className="estidam-ai-operations__ring-track" />
                  <circle
                    cx="50"
                    cy="50"
                    r={READY_RING.r}
                    className="estidam-ai-operations__ring-bar"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - value / 100)}
                    transform="rotate(-90 50 50)"
                    data-ai="ring-bar"
                    data-circ={circumference}
                  />
                </svg>
                <span className="estidam-ai-operations__ring-value" aria-hidden="true">
                  <span data-ai="ring-num">{value}</span>%
                </span>
                <span className="estidam-ai-operations__ring-caption" aria-hidden="true">
                  {c.readinessCaption}
                </span>
              </div>

              {c.readinessLeft.map((label, i) => (
                <span
                  key={'l' + i}
                  className="estidam-ai-operations__chip estidam-ai-operations__chip--in"
                  style={{ right: pct(READY_VB.w - READY_LEFT_X, READY_VB.w), top: pct(READY_ROW_Y[i], READY_VB.h) }}
                  data-ai="ready-chip"
                >
                  {label}
                </span>
              ))}
              {c.readinessRight.map((label, i) => (
                <span
                  key={'r' + i}
                  className="estidam-ai-operations__chip estidam-ai-operations__chip--out"
                  style={{ left: pct(READY_RIGHT_X, READY_VB.w), top: pct(READY_ROW_Y[i], READY_VB.h) }}
                  data-ai="ready-chip"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Outcome flow ---------- */}
        <div className="estidam-ai-operations__outcome">
          <span className="estidam-ai-operations__outcome-label" data-ai="outcome-label">
            {c.outcomeLabel}
          </span>
          <ol className="estidam-ai-operations__outcome-list">
            {c.outcomes.map((label, i) => (
              <li key={label + i} className="estidam-ai-operations__outcome-item">
                {i > 0 && (
                  <span className="estidam-ai-operations__arrow" data-ai="outcome-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 12" width="22" height="11">
                      <path d="M1 6h17" strokeDasharray="2 3" />
                      <path d="M16 2l5 4-5 4" />
                    </svg>
                  </span>
                )}
                <span className="estidam-ai-operations__chip estidam-ai-operations__chip--flow" data-ai="outcome-chip">
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
