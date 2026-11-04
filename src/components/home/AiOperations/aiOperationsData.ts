/**
 * Static geometry + default (English) copy for the AI Operations section.
 * Geometry is expressed in SVG viewBox units; HTML nodes are positioned
 * with percentages derived from the same numbers, so lines and labels
 * always stay aligned at any width.
 */

export interface AiOperationsContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  inputs: [string, string, string, string];
  aiLabel: string;
  aiSubLabel: string;
  outputs: [string, string, string];
  readinessTitle: string;
  readinessDescription: string;
  readinessLeft: [string, string, string];
  readinessRight: [string, string, string];
  readinessCaption: string;
  outcomeLabel: string;
  outcomes: [string, string, string, string];
}

export const defaultAiOperationsContent: AiOperationsContent = {
  eyebrow: 'AI Embedded in Operations',
  titleLine1: 'AI Embedded in Operations',
  titleLine2: 'Not Added Around Them',
  description:
    'We embed AI into the operational core — connecting systems, data, operations and people to decisions, alerts and actions.',
  inputs: ['Systems', 'Data', 'Operations', 'People'],
  aiLabel: 'AI',
  aiSubLabel: 'Intelligence Layer',
  outputs: ['Decisions', 'Alerts', 'Actions'],
  readinessTitle: 'Readiness Assessment',
  readinessDescription:
    'Turn insights into a clear view of your operational and AI readiness.',
  readinessLeft: ['Processes', 'Data', 'Systems'],
  readinessRight: ['Use cases', 'Governance', 'People'],
  readinessCaption: 'Overall readiness',
  outcomeLabel: 'Outcome:',
  outcomes: ['Readiness', 'High-impact opportunities', 'Priorities', 'Actionable roadmap'],
};

/** Presentation value from the approved design — not calculated data. */
export const DEFAULT_READINESS_VALUE = 82;

/* ---------- Intelligence diagram geometry (viewBox 820 x 380) ---------- */
export const INTEL_VB = { w: 820, h: 380 };
export const INTEL_CORE = { x: 310, y: 80, w: 200, h: 220 };

export const INTEL_INPUT_Y = [48, 142, 236, 330];
export const INTEL_INPUT_X = 120; // right edge of input chips
export const INTEL_CORE_IN_Y = [140, 182, 200, 242];

export const INTEL_OUTPUT_Y = [78, 190, 302];
export const INTEL_OUTPUT_X = 700; // left edge of output chips
export const INTEL_CORE_OUT_Y = [168, 192, 214];

export const intelInputPaths = INTEL_INPUT_Y.map((y, i) => {
  const ty = INTEL_CORE_IN_Y[i];
  const x1 = INTEL_INPUT_X;
  const x2 = INTEL_CORE.x;
  return `M${x1} ${y} C ${x1 + 110} ${y}, ${x2 - 90} ${ty}, ${x2} ${ty}`;
});

export const intelOutputPaths = INTEL_OUTPUT_Y.map((y, i) => {
  const sy = INTEL_CORE_OUT_Y[i];
  const x1 = INTEL_CORE.x + INTEL_CORE.w;
  const x2 = INTEL_OUTPUT_X;
  return `M${x1} ${sy} C ${x1 + 90} ${sy}, ${x2 - 110} ${y}, ${x2} ${y}`;
});

/* ---------- Readiness diagram geometry (viewBox 500 x 200) ---------- */
export const READY_VB = { w: 500, h: 200 };
export const READY_RING = { cx: 250, cy: 100, r: 36 };
export const READY_ROW_Y = [45, 100, 155];
export const READY_LEFT_X = 118; // right edge of left chips
export const READY_RIGHT_X = 382; // left edge of right chips

export const readyLeftPaths = READY_ROW_Y.map((y, i) => {
  const ty = READY_RING.cy + (i - 1) * 14;
  const x2 = READY_RING.cx - READY_RING.r - 12;
  return `M${READY_LEFT_X} ${y} C ${READY_LEFT_X + 50} ${y}, ${x2 - 40} ${ty}, ${x2} ${ty}`;
});

export const readyRightPaths = READY_ROW_Y.map((y, i) => {
  const sy = READY_RING.cy + (i - 1) * 14;
  const x1 = READY_RING.cx + READY_RING.r + 12;
  return `M${x1} ${sy} C ${x1 + 40} ${sy}, ${READY_RIGHT_X - 50} ${y}, ${READY_RIGHT_X} ${y}`;
});

export const pct = (v: number, total: number) => `${(v / total) * 100}%`;
