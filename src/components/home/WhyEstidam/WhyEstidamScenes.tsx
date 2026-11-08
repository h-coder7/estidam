/**
 * Why Estidam — four conceptual "Operational Intelligence" scenes (approved Option B).
 *
 * Pure presentational SVG. No state, no effects: every animation lives in
 * `whyEstidamMotion.ts` and finds its targets through `data-we="…"` hooks.
 * The static markup is the fully-built end state, so SSR / no-JS /
 * reduced-motion users always see complete diagrams.
 *
 * All labels are conceptual illustrations — not claims about real Estidam
 * software or measured activity. They are exposed through `labels` props
 * (English defaults) so a future Arabic pass can translate them without
 * touching geometry.
 */

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

type CardProps = { x: number; y: number; w: number; h: number; title: string; hook?: string };

function Card({ x, y, w, h, title, hook }: CardProps) {
    return (
        <g data-we={hook}>
            <rect x={x} y={y} width={w} height={h} rx={7} className="we-card" />
            <text className="we-m7 we-f3" x={x + 10} y={y + 15}>
                {title}
            </text>
        </g>
    );
}

export function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
    const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

/* ------------------------------------------------------------------ */
/* 01 — Sector: season board (service lanes × Hajj phases)             */
/* ------------------------------------------------------------------ */

export const SEASON_LABELS = {
    phases: ["ARRIVAL", "MINA", "ARAFAT", "MUZDALIFAH", "RETURN"],
    lanes: ["TRANSPORT", "CAMPS", "CATERING", "PILGRIM CARE"],
    blocks: {
        0: { 0: "Transfers", 1: "Shuttles", 2: "Movement", 3: "Night moves", 4: "Departures" },
        1: { 0: "Allocation", 1: "Tent prep", 2: "Day camp" },
        2: { 1: "Meal plans", 2: "Meal service", 3: "Supplies" },
        3: { 0: "Reception", 1: "Guidance", 2: "Care desk", 4: "Farewell" },
    } as Record<number, Record<number, string>>,
};

/** Handoffs between lanes: [fromLane, toLane, phase] */
export const SEASON_HANDOFFS: [number, number, number][] = [
    [0, 1, 1],
    [1, 2, 2],
    [2, 3, 2],
    [0, 2, 3],
];
export const SEASON_X0 = 94;
export const SEASON_CW = 84;
const laneY = (i: number) => 34 + i * 48;

export function SeasonBoardScene({ labels = SEASON_LABELS }: { labels?: typeof SEASON_LABELS }) {
    const x0 = SEASON_X0;
    const cw = SEASON_CW;
    return (
        <svg viewBox="0 0 520 240" className="we-svg" role="img" aria-label="Conceptual season board: service lanes across Hajj phases">
            <rect data-we="col" x={x0} y={22} width={cw} height={206} rx={6} fill="#295CC7" opacity={0.06} transform={`translate(${2 * cw} 0)`} />
            {labels.phases.map((p, j) => (
                <text key={p} data-we="ph" className={`we-m7 we-f3${j === 2 ? " is-on" : ""}`} x={x0 + j * cw + cw / 2} y={15} textAnchor="middle">
                    {p}
                </text>
            ))}
            {labels.lanes.map((n, i) => (
                <g key={n}>
                    <text className="we-m7 we-f3" x={4} y={laneY(i) + 24}>
                        {n}
                    </text>
                    <line className="we-hl" x1={x0} y1={laneY(i) + 40} x2={514} y2={laneY(i) + 40} />
                </g>
            ))}
            {SEASON_HANDOFFS.map(([a, b, p], k) => {
                const x = x0 + p * cw + cw / 2;
                return <path key={k} data-we="ho" data-p={p} className="we-bl" d={`M${x} ${laneY(a) + 32}V${laneY(b) + 8}`} strokeDasharray="2 3" />;
            })}
            {Object.entries(labels.blocks).map(([i, row]) =>
                Object.entries(row).map(([j, t]) => {
                    const x = x0 + Number(j) * cw + 5;
                    const y = laneY(Number(i)) + 8;
                    return (
                        <g key={`${i}-${j}`} data-we="blk" data-p={j}>
                            <rect x={x} y={y} width={cw - 10} height={24} rx={5} fill="#fff" stroke="#e2e2e2" />
                            <circle cx={x + 9} cy={y + 12} r={2.5} fill={Number(j) === 2 ? "#295CC7" : "#bccdf3"} />
                            <text className="we-m7 we-fi" x={x + 16} y={y + 15}>
                                {t}
                            </text>
                        </g>
                    );
                }),
            )}
            {SEASON_HANDOFFS.map((_, k) => (
                <circle key={k} data-we="pk" r={2.6} fill="#295CC7" opacity={0} />
            ))}
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* 02 — Operations: challenge → agreed outcome → technology fit        */
/* ------------------------------------------------------------------ */

export const OPERATIONS_LABELS = {
    challenge: "OPERATIONAL CHALLENGE",
    defined: "DEFINED",
    outcome: "DESIRED OUTCOME",
    draft: "DRAFT",
    agreed: "AGREED",
    options: ["Process change", "Integration", "New platform"],
    optionsTitle: "TECHNOLOGY OPTIONS",
    selected: "SELECTED TO FIT THE OUTCOME",
};

export function OperationsFlowScene({ labels = OPERATIONS_LABELS }: { labels?: typeof OPERATIONS_LABELS }) {
    return (
        <svg viewBox="0 0 300 240" className="we-svg" role="img" aria-label="Conceptual flow: challenge, agreed outcome, then technology selection">
            <Card x={10} y={8} w={280} h={44} title={labels.challenge} hook="c1" />
            <rect x={20} y={31} width={150} height={4} rx={2} fill="#e2e2e2" />
            <rect x={20} y={40} width={100} height={4} rx={2} fill="#e2e2e2" />
            <rect x={222} y={16} width={58} height={16} rx={8} fill="#f3f4f6" />
            <text className="we-m7 we-f3" x={251} y={27} textAnchor="middle">
                {labels.defined}
            </text>

            <path className="we-hl2" d="M150 52V78" />
            <path data-we="k1" className="we-bl" d="M150 52V78" />

            <Card x={10} y={78} w={280} h={44} title={labels.outcome} hook="c2" />
            <rect x={20} y={101} width={170} height={4} rx={2} fill="#e2e2e2" />
            <rect x={20} y={110} width={120} height={4} rx={2} fill="#e2e2e2" />
            <rect data-we="p2r" x={222} y={86} width={58} height={16} rx={8} fill="#f3f6fd" />
            <text data-we="p2t" data-draft={labels.draft} data-agreed={labels.agreed} className="we-m7" x={251} y={97} textAnchor="middle" fill="#295CC7">
                {labels.agreed}
            </text>

            <path className="we-hl2" d="M150 122V140H52V158M150 140V158M150 140H248V158" />
            <path data-we="k2" className="we-bl" d="M150 122V140" />

            {labels.options.map((o, i) => {
                const x = 10 + i * 96;
                const on = i === 1;
                return (
                    <g key={o} data-we="opt" opacity={on ? 1 : 0.45}>
                        <rect data-we="or" x={x} y={158} width={88} height={34} rx={7} fill={on ? "#295CC7" : "#fff"} stroke={on ? "#295CC7" : "#e2e2e2"} />
                        <text data-we="ot" className="we-m7" x={x + 44} y={179} textAnchor="middle" fill={on ? "#fff" : "#8f8f8f"}>
                            {o}
                        </text>
                    </g>
                );
            })}
            <rect data-we="scan" x={10} y={156} width={88} height={38} rx={8} fill="none" stroke="#295CC7" strokeWidth={1.5} opacity={0} />

            <text className="we-m7 we-f3" x={10} y={214}>
                {labels.optionsTitle}
            </text>
            <text data-we="sel" className="we-m7 we-fb" x={290} y={214} textAnchor="end">
                {labels.selected}
            </text>
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* 03 — Practical AI: sources → staged analysis → reviewed decision    */
/* ------------------------------------------------------------------ */

export const ANALYSIS_LABELS = {
    sources: ["Processes", "Ops data", "Field input"],
    title: "ANALYSIS · STAGED",
    steps: ["Normalise inputs", "Detect patterns", "Compare to plan"],
    decision: "DECISION SUPPORT",
    recommendation: "Recommendation prepared",
    context: "with supporting context",
    awaiting: "AWAITING REVIEW",
    decided: "TEAM DECISION",
};

export function AnalysisFlowScene({ labels = ANALYSIS_LABELS }: { labels?: typeof ANALYSIS_LABELS }) {
    return (
        <svg viewBox="0 0 300 240" className="we-svg" role="img" aria-label="Conceptual flow: data sources, staged analysis, decision support with human review">
            {labels.sources.map((s, i) => {
                const y = 18 + i * 44;
                const d = `M98 ${y + 14}H106V${46 + i * 30}H118`;
                return (
                    <g key={s}>
                        <g data-we="src">
                            <rect x={6} y={y} width={92} height={28} rx={7} className="we-card" />
                            <rect x={14} y={y + 10} width={8} height={8} rx={2} fill="#bccdf3" />
                            <text className="we-m7 we-fi" x={28} y={y + 17}>
                                {s}
                            </text>
                        </g>
                        <path className="we-hl2" d={d} />
                        <path data-we="w" className="we-bl" d={d} />
                    </g>
                );
            })}

            <Card x={118} y={10} w={176} h={122} title={labels.title} hook="an" />
            {labels.steps.map((s, i) => {
                const y = 34 + i * 30;
                return (
                    <g key={s} data-we="st">
                        <line x1={128} y1={y} x2={284} y2={y} stroke="#f0f0f0" />
                        <text className="we-m8 we-fi" x={130} y={y + 17}>
                            {s}
                        </text>
                        <circle data-we="s0" cx={274} cy={y + 14} r={5.5} fill="#295CC7" stroke="#295CC7" />
                        <path data-we="spin" d={arcPath(274, y + 14, 5.5, -90, 60)} stroke="#295CC7" strokeWidth={1.6} fill="none" opacity={0} />
                        <path data-we="ok" d={`M271 ${y + 14}l2.2 2.2 4-4.4`} stroke="#fff" strokeWidth={1.5} fill="none" />
                    </g>
                );
            })}

            <path className="we-hl2" d="M206 132V156" />
            <path data-we="w2" className="we-bl" d="M206 132V156" />

            <g data-we="dec">
                <rect x={6} y={156} width={288} height={56} rx={7} className="we-card" />
                <text className="we-m7 we-f3" x={16} y={172}>
                    {labels.decision}
                </text>
                <text className="we-m9 we-fi" x={16} y={190}>
                    {labels.recommendation}
                </text>
                <text className="we-m7 we-f4" x={16} y={203}>
                    {labels.context}
                </text>
                <rect data-we="pr" x={190} y={172} width={94} height={22} rx={11} fill="#f3f6fd" stroke="#bccdf3" />
                <text data-we="pt" data-awaiting={labels.awaiting} data-decided={labels.decided} className="we-m7" x={237} y={186} textAnchor="middle" fill="#295CC7">
                    {labels.decided}
                </text>
            </g>
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* 04 — Improve: Measure → Review → Learn → Refine, wired back to ops  */
/* ------------------------------------------------------------------ */

export const IMPROVEMENT_LABELS = {
    stages: ["MEASURE", "REVIEW", "LEARN", "REFINE"],
    log: ["Observation recorded", "Findings reviewed", "Lesson captured", "Procedure refined"],
    feedsBack: "FEEDS BACK",
    operations: "OPERATIONS",
    current: "Current procedures",
    refined: "Refined procedures — v",
    logTitle: "IMPROVEMENT LOG · CONCEPT",
};

export function ImprovementLoopScene({ labels = IMPROVEMENT_LABELS }: { labels?: typeof IMPROVEMENT_LABELS }) {
    return (
        <svg viewBox="0 0 520 240" className="we-svg" role="img" aria-label="Conceptual improvement loop: measure, review, learn, refine, feeding back into operations">
            {labels.stages.map((s, i) => {
                const x = 6 + i * 128;
                return (
                    <g key={s}>
                        <g data-we="stg">
                            <rect data-we="sr" x={x} y={10} width={112} height={46} rx={7} fill="#fff" stroke="#e2e2e2" />
                            <text className="we-m7 we-f4" x={x + 10} y={26}>
                                {`0${i + 1}`}
                            </text>
                            <text className="we-m9 we-fi" x={x + 10} y={44}>
                                {s}
                            </text>
                            <circle data-we="sd" cx={x + 100} cy={22} r={3} fill="#295CC7" />
                        </g>
                        {i < 3 ? <path className="we-hl2" d={`M${x + 112} 33H${x + 128}`} /> : null}
                    </g>
                );
            })}

            <path className="we-hl2" d="M454 56V150H246" />
            <path data-we="ret" className="we-bl" d="M454 56V150H246" />
            <text className="we-m7 we-f3" x={350} y={144} textAnchor="middle">
                {labels.feedsBack}
            </text>
            <path className="we-hl2" d="M62 112V56" />
            <path data-we="up" className="we-bl" d="M62 112V56" />

            <g data-we="ops">
                <rect data-we="opsr" x={6} y={112} width={240} height={64} rx={7} className="we-card" />
                <text className="we-m7 we-f3" x={16} y={128}>
                    {labels.operations}
                </text>
                <text data-we="opt2" data-current={labels.current} data-refined={labels.refined} className="we-m9 we-fi" x={16} y={148}>
                    {labels.current}
                </text>
                <rect x={16} y={158} width={140} height={4} rx={2} fill="#e2e2e2" />
            </g>

            <g data-we="log">
                <rect x={270} y={166} width={244} height={66} rx={7} className="we-card" />
                <text className="we-m7 we-f3" x={280} y={182}>
                    {labels.logTitle}
                </text>
                {/* Rows are inserted by the motion layer (not React-managed). */}
                <g data-we="rows" data-log={JSON.stringify(labels.log)} />
            </g>

            <circle data-we="pk2" r={3} fill="#295CC7" opacity={0} />
        </svg>
    );
}

/** Scene order = approved capability positions 01–04. */
export const WHY_SCENES = [SeasonBoardScene, OperationsFlowScene, AnalysisFlowScene, ImprovementLoopScene] as const;
