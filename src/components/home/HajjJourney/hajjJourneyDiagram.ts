/**
 * Hajj Operations Journey — conceptual "Editorial System" diagram engine (approved design).
 *
 * The engine owns the children of ONE empty <svg> rendered by React (React never
 * renders inside it, so there is no reconciliation conflict). It draws five point
 * cards + one hub and reconfigures them per phase:
 *   phase 0 · requirements converge into the Season Plan (readiness track fills)
 *   phase 1 · cards route around the Operations Desk (live lanes + travelling signals)
 *   phase 2 · cards settle on one loop; a signal travels card→card, the last step
 *             feeds the Next-Season Plan (v1 → v2)
 *
 * Usage (client only):
 *   const diagram = createJourneyDiagram(svg, { phases, labels, reducedMotion });
 *   diagram.go(index);   // on phase change
 *   diagram.destroy();   // on unmount
 *
 * All labels are conceptual illustration, not claims about real software or status.
 */
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(MotionPathPlugin);
}

const NS = "http://www.w3.org/2000/svg";
const BLUE = "#295CC7";

export type JourneyDiagramPhase = { points: string[] };

export type JourneyDiagramLabels = {
    chips: [string, string, string];
    hubs: [{ title: string; sub: string }, { title: string; sub: string }, { title: string; sub: string }];
    readinessTrack: string;
    aligning: string;
    readyForSeason: string;
    lanes: [string, string, string];
};

export const JOURNEY_DIAGRAM_LABELS: Record<"en" | "ar", JourneyDiagramLabels> = {
    en: {
        chips: ["Ready", "Live", "Captured"],
        hubs: [
            { title: "SEASON PLAN", sub: "Readiness baseline" },
            { title: "OPERATIONS DESK", sub: "Coordinated response" },
            { title: "NEXT-SEASON PLAN", sub: "Feeds stage 01" },
        ],
        readinessTrack: "READINESS TRACK",
        aligning: "ALIGNING",
        readyForSeason: "READY FOR SEASON",
        lanes: ["FIELD", "SERVICES", "ESCALATION"],
    },
    // Proposed Arabic diagram labels — pending client review (not in ar.json).
    ar: {
        chips: ["جاهز", "مباشر", "موثّق"],
        hubs: [
            { title: "خطة الموسم", sub: "خط أساس الجاهزية" },
            { title: "غرفة العمليات", sub: "استجابة منسّقة" },
            { title: "خطة الموسم القادم", sub: "تغذّي المرحلة 01" },
        ],
        readinessTrack: "مسار الجاهزية",
        aligning: "قيد المواءمة",
        readyForSeason: "جاهز للموسم",
        lanes: ["الميدان", "الخدمات", "التصعيد"],
    },
};

/** Purpose-drawn 20×20 line icons, one per point position, per phase ("|" separates paths). */
const ICONS: string[][] = [
    [
        "M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5z|M7 10l2 2 4-4",
        "M7 8a2.5 2.5 0 1 0 0-.01M14 9a2 2 0 1 0 0-.01|M2 17c0-3 2.5-5 5-5s5 2 5 5M12 17c0-2 1.5-4 3.5-4S19 15 19 17",
        "M4 5c0-1.7 2.7-3 6-3s6 1.3 6 3-2.7 3-6 3-6-1.3-6-3z|M4 5v10c0 1.7 2.7 3 6 3s6-1.3 6-3V5|M4 10c0 1.7 2.7 3 6 3s6-1.3 6-3",
        "M7 3v4M13 3v4|M5 7h10v3a5 5 0 0 1-10 0z|M10 15v3",
        "M4 4h4v4H4zM12 12h4v4h-4z|M8 6h3a2 2 0 0 1 2 2v4",
    ],
    [
        "M2 4h16v10H2z|M7 18h6M10 14v4|M5 10l3-3 2 2 4-4",
        "M10 3l8 14H2z|M10 8v4M10 14.5v.5",
        "M10 18s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z|M10 8a2 2 0 1 0 0-.01",
        "M10 2l2.4 5 5.6.6-4.2 3.8 1.2 5.6L10 14l-5 3 1.2-5.6L2 7.6 7.6 7z",
        "M10 2a8 8 0 1 0 0 16 8 8 0 1 0 0-16z|M13 7l-2 4-4 2 2-4z",
    ],
    [
        "M5 2h7l4 4v12H5z|M12 2v4h4|M8 10h5M8 13h5",
        "M10 2a8 8 0 1 0 0 16 8 8 0 1 0 0-16z|M10 6a4 4 0 1 0 0 8 4 4 0 1 0 0-8z|M10 9.5v1",
        "M16 7a7 7 0 0 0-12-1M4 3v3h3|M4 13a7 7 0 0 0 12 1M16 17v-3h-3",
        "M6 2h8v16l-4-3-4 3z",
        "M3 5h14v12H3z|M3 9h14M7 3v4M13 3v4",
    ],
];

type Box = { x: number; y: number; w: number; h: number; a?: number };
type Layout = { p: Box[]; hub: Box };

const CARD_W = 250;
const CARD_H = 56;
const LOOP_W = 222;
const LC = { x: 320, y: 236, rx: 250, ry: 172 };
const LOOP_ANGLES = [-90, -20, 50, 130, 200];
const onEllipse = (a: number): [number, number] => [LC.x + LC.rx * Math.cos((a * Math.PI) / 180), LC.y + LC.ry * Math.sin((a * Math.PI) / 180)];
const boxes = (pts: [number, number][]) => pts.map(([x, y]) => ({ x, y, w: CARD_W, h: CARD_H }));

const LAYOUTS: Layout[] = [
    {
        p: boxes([
            [0, 30],
            [0, 108],
            [0, 186],
            [0, 264],
            [0, 342],
        ]),
        hub: { x: 360, y: 140, w: 240, h: 170 },
    },
    {
        p: boxes([
            [175, 0],
            [-10, 120],
            [360, 120],
            [-10, 330],
            [360, 330],
        ]),
        hub: { x: 190, y: 186, w: 230, h: 110 },
    },
    {
        p: LOOP_ANGLES.map((a) => {
            const [cx, cy] = onEllipse(a);
            return { x: cx - LOOP_W / 2, y: cy - CARD_H / 2, w: LOOP_W, h: CARD_H, a };
        }),
        hub: { x: 245, y: 214, w: 150, h: 80 },
    },
];

export const JOURNEY_VIEWBOX = "-40 -20 720 490";
export const JOURNEY_MAX_POINTS = 5;

type Options = {
    phases: JourneyDiagramPhase[];
    labels: JourneyDiagramLabels;
    reducedMotion: boolean;
};

export function createJourneyDiagram(svg: SVGSVGElement, { phases, labels, reducedMotion }: Options) {
    const motion = !reducedMotion;
    const D = () => (motion ? 1 : 0.001);
    const q = <T extends Element = SVGElement>(sel: string, root: ParentNode = svg) => root.querySelector(sel) as T;
    const qa = <T extends Element = SVGElement>(sel: string, root: ParentNode = svg) => Array.from(root.querySelectorAll<T>(sel));
    const isRtl = () => getComputedStyle(svg).direction === "rtl" || svg.closest("[dir='rtl']") !== null;

    /* ---------------------------------------------------------- skeleton */
    const cross = [
        [-40, -20],
        [680, -20],
        [-40, 470],
        [680, 470],
    ]
        .map(([x, y]) => `<path d="M${x - 6} ${y}h12M${x} ${y - 6}v12"/>`)
        .join("");
    const card = (i: number) =>
        `<g class="jd-p" data-i="${i}"><rect class="jd-card" x="0" y="0" width="${CARD_W}" height="${CARD_H}" rx="9"/>` +
        `<rect class="jd-acc" x="0" y="0" width="3" height="0" rx="1.5" fill="${BLUE}" opacity="0"/>` +
        `<rect class="jd-ib" x="0" y="0" width="30" height="30" rx="7" fill="#f3f6fd"/>` +
        `<g class="jd-ic" fill="none" stroke="${BLUE}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></g>` +
        `<text class="jd-i" font-size="8.5" fill="#b5b5b5" letter-spacing=".1em"></text><text class="jd-t" font-size="10.5" fill="#171717"></text>` +
        `<g class="jd-chip" opacity="0"><rect x="0" y="0" width="0" height="16" rx="8" fill="#f3f6fd" stroke="#bccdf3"/><circle cx="0" cy="8" r="2.4" fill="${BLUE}"/><text x="0" y="11" font-size="8" fill="${BLUE}" letter-spacing=".06em"></text></g></g>`;
    svg.innerHTML =
        `<g class="jd-cross" stroke="#cfcfcf">${cross}</g><g class="jd-loop"></g><g class="jd-links"></g><g class="jd-ports"></g>` +
        [0, 1, 2, 3, 4].map(card).join("") +
        `<g class="jd-h"><rect class="jd-hub" x="360" y="140" width="240" height="170" rx="12"/><text class="jd-ht" x="378" y="166" font-size="10.5" fill="#fff" letter-spacing=".14em"></text>` +
        `<text class="jd-hs" x="378" y="182" font-size="9.5" fill="#9fb4dc"></text><g class="jd-hin"></g></g><g class="jd-pk"></g>`;

    const ps = qa<SVGGElement>(".jd-p");
    const hubG = q<SVGGElement>(".jd-h");
    const hin = q<SVGGElement>(".jd-hin");
    const links = q<SVGGElement>(".jd-links");
    const ports = q<SVGGElement>(".jd-ports");
    const pkG = q<SVGGElement>(".jd-pk");
    const loopG = q<SVGGElement>(".jd-loop");
    let stage = -1;
    let loops: gsap.core.Animation[] = [];
    let destroyed = false;
    const ease = "expo.inOut";

    const len = (e: SVGGeometryElement) => {
        try {
            return e.getTotalLength();
        } catch {
            return 300;
        }
    };
    const draw = (e: SVGGeometryElement, d = 0.8, delay = 0) => {
        const l = len(e);
        gsap.fromTo(e, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: d * D(), delay: delay * D(), ease: "power2.inOut" });
    };
    const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent: Element) => {
        const n = document.createElementNS(NS, tag);
        Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, String(v)));
        parent.appendChild(n);
        return n;
    };
    const mk = (d: string, cls = "jd-bl", parent: Element = links) => el("path", { d, class: cls }, parent);

    const place = (g: SVGGElement, b: Box, d: number, delay = 0) => {
        const o = { duration: d, delay, ease };
        gsap.to(q(".jd-card", g), { attr: { x: b.x, y: b.y, width: b.w, height: b.h }, ...o });
        gsap.to(q(".jd-ib", g), { attr: { x: b.x + 13, y: b.y + 13 }, ...o });
        gsap.to(q(".jd-acc", g), { attr: { x: b.x, y: b.y + 14, height: b.h - 28 }, ...o });
        gsap.to(q(".jd-ic", g), { x: b.x + 20.5, y: b.y + 20.5, ...o });
        gsap.to(q(".jd-i", g), { attr: { x: b.x + 56, y: b.y + 23 }, ...o });
        gsap.to(q(".jd-t", g), { attr: { x: b.x + 56, y: b.y + 39 }, ...o });
        gsap.to(q(".jd-chip", g), { x: b.x + b.w - 12, y: b.y + 12, ...o });
    };
    const setText = (node: Element, t: string) => {
        if (!motion) {
            node.textContent = t;
            return;
        }
        gsap.to(node, {
            opacity: 0,
            duration: 0.18,
            onComplete: () => {
                node.textContent = t;
                gsap.to(node, { opacity: 1, duration: 0.35 });
            },
        });
    };
    const setIcon = (g: SVGGElement, d: string) => {
        const ic = q<SVGGElement>(".jd-ic", g);
        const put = () => {
            ic.innerHTML = d
                .split("|")
                .map((p) => `<path d="${p}" transform="scale(.75)"/>`)
                .join("");
        };
        if (!motion || !ic.children.length) {
            put();
            return;
        }
        gsap.to(ic, {
            opacity: 0,
            duration: 0.18,
            onComplete: () => {
                put();
                gsap.fromTo(ic, { opacity: 0, scale: 0.6, transformOrigin: "6px 6px" }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" });
            },
        });
    };
    const setChip = (g: SVGGElement, t: string, delay: number) => {
        const c = q(".jd-chip", g);
        const tx = q("text", c);
        tx.textContent = t;
        const w = t.length * (isRtl() ? 6.2 : 5.2) + 22;
        gsap.set(q("rect", c), { attr: { x: -w, width: w } });
        gsap.set(q("circle", c), { attr: { cx: -w + 9 } });
        gsap.set(tx, { attr: { x: -w + 16 } });
        gsap.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.35 * D(), delay: delay * D() });
    };
    const placeHub = (b: Box, d: number) => {
        const o = { duration: d, ease };
        gsap.to(q(".jd-hub", hubG), { attr: { x: b.x, y: b.y, width: b.w, height: b.h }, ...o });
        gsap.to(q(".jd-ht", hubG), { attr: { x: b.x + 18, y: b.y + 26 }, ...o });
        gsap.to(q(".jd-hs", hubG), { attr: { x: b.x + 18, y: b.y + 42 }, ...o });
    };
    const port = (x: number, y: number, delay: number) => {
        const c = el("circle", { cx: x, cy: y, r: 3, fill: "#fff", stroke: BLUE, "stroke-width": 1.4 }, ports);
        gsap.fromTo(c, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.35 * D(), delay: delay * D(), ease: "back.out(3)" });
    };
    const pulseAlong = (pth: SVGPathElement, delay: number, rev = false) => {
        if (!motion) return;
        const c = el("circle", { r: 3, fill: BLUE, opacity: 0 }, pkG);
        const t = gsap.timeline({ repeat: -1, delay, repeatDelay: 1.4 });
        t.set(c, { opacity: 1 })
            .fromTo(
                c,
                { motionPath: { path: pth, start: rev ? 1 : 0, end: rev ? 1 : 0 } },
                { motionPath: { path: pth, start: rev ? 1 : 0, end: rev ? 0 : 1 }, duration: 1.1, ease: "power1.inOut" },
            )
            .set(c, { opacity: 0 });
        loops.push(t);
    };

    /* ------------------------------------------------------ hub interiors */
    const hubInner = (i: number, b: Box) => {
        hin.innerHTML = "";
        const x = b.x + 18;
        const w = b.w - 36;
        if (i === 0) {
            const yb = b.y + b.h - 58;
            hin.innerHTML =
                `<text x="${x}" y="${yb - 8}" font-size="8" fill="#6f84ad" letter-spacing=".1em">${labels.readinessTrack}</text>` +
                [0, 1, 2, 3, 4].map((k) => `<rect class="jd-hseg" x="${x + k * (w / 5)}" y="${yb}" width="${w / 5 - 5}" height="6" rx="3" fill="#1f3154"/>`).join("") +
                [0, 1, 2, 3, 4].map((k) => `<text x="${x + k * (w / 5)}" y="${yb + 22}" font-size="8" fill="#6f84ad">0${k + 1}</text>`).join("") +
                `<line x1="${x}" y1="${b.y + b.h - 18}" x2="${x + w}" y2="${b.y + b.h - 18}" stroke="#1f3154"/>` +
                `<text class="jd-hstat" x="${x}" y="${b.y + b.h - 6}" font-size="8" fill="#9fb4dc" letter-spacing=".08em">${labels.aligning}</text>`;
            qa(".jd-hseg", hin).forEach((s, k) => gsap.to(s, { fill: BLUE, duration: 0.3 * D(), delay: (0.9 + k * 0.12) * D() }));
            loops.push(
                gsap.delayedCall(1.6 * D(), () => {
                    const t = q(".jd-hstat", hin);
                    if (t) {
                        t.textContent = labels.readyForSeason;
                        t.setAttribute("fill", "#7fa4f0");
                    }
                }),
            );
        }
        if (i === 1) {
            const y0 = b.y + 58;
            hin.innerHTML = [0, 1, 2]
                .map(
                    (k) =>
                        `<line x1="${x}" y1="${y0 + k * 14}" x2="${x + w}" y2="${y0 + k * 14}" stroke="#1f3154"/>` +
                        `<text x="${x + w}" y="${y0 + k * 14 - 3}" font-size="7" fill="#6f84ad" text-anchor="end">${labels.lanes[k]}</text>`,
                )
                .join("");
            if (motion)
                [0, 1, 2].forEach((k) => {
                    const d = el("rect", { x, y: y0 + k * 14 - 1.5, width: 14, height: 3, rx: 1.5, fill: "#7fa4f0" }, hin);
                    loops.push(gsap.fromTo(d, { attr: { x } }, { attr: { x: x + w - 14 }, duration: 1.6 + k * 0.4, repeat: -1, ease: "none", delay: k * 0.3 }));
                });
        }
        if (i === 2) {
            const y0 = b.y + 60;
            hin.innerHTML =
                `<g><rect x="${x}" y="${y0}" width="30" height="16" rx="8" fill="#1f3154"/><text x="${x + 15}" y="${y0 + 11}" font-size="8" fill="#9fb4dc" text-anchor="middle">v1</text>` +
                `<path d="M${x + 36} ${y0 + 8}h18" stroke="#6f84ad" stroke-dasharray="2 2"/><path d="M${x + 50} ${y0 + 4}l4 4-4 4" stroke="#6f84ad" fill="none"/>` +
                `<rect class="jd-v2" x="${x + 60}" y="${y0}" width="30" height="16" rx="8" fill="${BLUE}"/><text x="${x + 75}" y="${y0 + 11}" font-size="8" fill="#fff" text-anchor="middle">v2</text></g>`;
            gsap.from(q(".jd-v2", hin), { scale: 0, transformOrigin: "50% 50%", duration: 0.5 * D(), delay: 3.1 * D(), ease: "back.out(2.5)" });
        }
        gsap.from(hin.children, { opacity: 0, duration: 0.4 * D(), delay: 0.7 * D(), stagger: 0.03 });
    };

    /* ------------------------------------------------------------ wiring */
    const wire = (i: number, l: Layout, visible: number) => {
        const p = l.p.slice(0, visible);
        const h = l.hub;
        const R = 10;
        if (i === 0) {
            const mx = h.x - 50;
            const hy = h.y + h.h / 2;
            p.forEach((b, k) => {
                const y = b.y + b.h / 2;
                const dir = hy > y ? 1 : -1;
                const dd =
                    Math.abs(hy - y) < 1
                        ? `M${b.x + b.w} ${y}H${h.x}`
                        : `M${b.x + b.w} ${y}H${mx - R}Q${mx} ${y} ${mx} ${y + dir * R}V${hy - dir * R}Q${mx} ${hy} ${mx + R} ${hy}H${h.x}`;
                draw(mk(dd), 0.8, 0.45 + k * 0.09);
                port(b.x + b.w, y, 0.45 + k * 0.09);
            });
            port(h.x, hy, 1.2);
        }
        if (i === 1) {
            const hy = h.y + h.h / 2;
            p.forEach((b, k) => {
                const cx = b.x + b.w / 2;
                let dd: string;
                let sy: number;
                if (k === 0) {
                    dd = `M${cx} ${b.y + b.h}V${h.y}`;
                    sy = b.y + b.h;
                } else {
                    const top = k < 3;
                    sy = top ? b.y + b.h : b.y;
                    const ex = k % 2 ? h.x : h.x + h.w;
                    const ey = hy + (top ? -18 : 18);
                    const dir = top ? 1 : -1;
                    dd = `M${cx} ${sy}V${ey - dir * R}Q${cx} ${ey} ${cx + (ex > cx ? R : -R)} ${ey}H${ex}`;
                }
                const pth = mk(dd);
                draw(pth, 0.6, 0.55 + k * 0.07);
                port(cx, sy, 0.55 + k * 0.07);
                pulseAlong(pth, 1.5 + k * 0.35, k % 2 === 0 && k > 0);
            });
        }
        if (i === 2) {
            const inside = (pt: [number, number], b: Box) => pt[0] > b.x - 8 && pt[0] < b.x + b.w + 8 && pt[1] > b.y - 8 && pt[1] < b.y + b.h + 8;
            const edge = (b: Box, dir: number) => {
                let a = b.a ?? 0;
                for (let s = 0; s < 90; s++) {
                    a += dir;
                    if (!inside(onEllipse(a), b)) return a;
                }
                return a;
            };
            const seg = (a0: number, a1: number) => {
                const [x0, y0] = onEllipse(a0);
                const [x1, y1] = onEllipse(a1);
                return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${LC.rx} ${LC.ry} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
            };
            const base = mk(`M${LC.x} ${LC.y - LC.ry}A${LC.rx} ${LC.ry} 0 1 1 ${LC.x - 0.1} ${LC.y - LC.ry}`, "jd-ln", loopG);
            base.setAttribute("stroke-dasharray", "1 5");
            gsap.fromTo(base, { opacity: 0 }, { opacity: 0.9, duration: 0.6 * D(), delay: 0.3 * D() });
            const t0 = 1.15;
            const step = 0.5;
            const head = el("circle", { r: 4, fill: "#fff", stroke: BLUE, "stroke-width": 2, opacity: 0 }, pkG);
            const lightCard = (k: number, at: number) => {
                gsap.to(q(".jd-acc", ps[k]), { opacity: 1, duration: 0.3 * D(), delay: at * D() });
                gsap.fromTo(q(".jd-card", ps[k]), { stroke: "#e3e3e3" }, { stroke: "#bccdf3", duration: 0.3 * D(), delay: at * D() });
                setChip(ps[k], labels.chips[2], at);
            };
            if (p.length) lightCard(0, t0 - 0.1);
            for (let k = 0; k < p.length - 1; k++) {
                const a1 = edge(p[k + 1], -1);
                const pth = mk(seg(edge(p[k], 1), a1), "jd-bl", loopG);
                const at = t0 + k * step;
                draw(pth, step * 0.9, at);
                const [ex, ey] = onEllipse(a1);
                const [px, py] = onEllipse(a1 - 2);
                const ah = mk("M-6 -4L0 0L-6 4", "jd-bl", loopG);
                ah.setAttribute("transform", `translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${((Math.atan2(ey - py, ex - px) * 180) / Math.PI).toFixed(1)})`);
                gsap.fromTo(ah, { opacity: 0 }, { opacity: 1, duration: 0.15 * D(), delay: (at + step * 0.85) * D() });
                if (motion)
                    gsap.timeline({ delay: at })
                        .set(head, { opacity: 1 })
                        .fromTo(head, { motionPath: { path: pth, start: 0, end: 0 } }, { motionPath: { path: pth, start: 0, end: 1 }, duration: step * 0.9, ease: "power2.inOut" });
                lightCard(k + 1, at + step * 0.85);
            }
            const tEnd = t0 + Math.max(0, p.length - 1) * step;
            gsap.set(head, { opacity: 0, delay: tEnd * D() });
            const last = p[p.length - 1];
            if (last) {
                const sx = last.x + last.w;
                const sy = last.y + last.h / 2 + 10;
                const fb = mk(`M${sx} ${sy}C${sx + 40} ${sy} ${h.x + h.w / 2} ${h.y - 40} ${h.x + h.w / 2} ${h.y}`);
                draw(fb, 0.6, tEnd);
                port(sx, sy, tEnd);
                port(h.x + h.w / 2, h.y, tEnd + 0.55);
                pulseAlong(fb, tEnd + 1.2);
            }
            gsap.fromTo(q(".jd-hub", hubG), { scale: 1 }, { scale: 1.04, transformOrigin: "50% 50%", duration: 0.25 * D(), yoyo: true, repeat: 1, delay: (tEnd + 0.6) * D() });
        }
    };

    /* -------------------------------------------------------- public API */
    const go = (index: number) => {
        if (destroyed) return;
        const i = Math.max(0, Math.min(LAYOUTS.length - 1, index));
        const first = stage === -1;
        if (i === stage) return;
        stage = i;
        loops.forEach((a) => a.kill());
        loops = [];
        pkG.innerHTML = "";
        ports.innerHTML = "";
        const points = (phases[index]?.points ?? []).slice(0, JOURNEY_MAX_POINTS);
        const d = 1.15 * D();
        const l = LAYOUTS[i];
        gsap.to([links, loopG], {
            opacity: 0,
            duration: 0.22 * D(),
            onComplete: () => {
                if (destroyed || stage !== i) return;
                links.innerHTML = "";
                loopG.innerHTML = "";
                gsap.set([links, loopG], { opacity: 1 });
                wire(i, l, points.length);
            },
        });
        ps.forEach((g, k) => {
            const has = k < points.length;
            gsap.to(g, { autoAlpha: has ? 1 : 0, duration: 0.3 * D() });
            place(g, l.p[k], d, k * 0.045 * D());
            setText(q(".jd-t", g), points[k] ?? "");
            setText(q(".jd-i", g), `${String(index + 1).padStart(2, "0")}.${k + 1}`);
            setIcon(g, ICONS[i][k]);
            gsap.set(q(".jd-acc", g), { opacity: 0 });
            gsap.set(q(".jd-card", g), { stroke: "#e3e3e3" });
            if (i !== 2 && has) setChip(g, labels.chips[i], 1.0 + k * 0.12);
            else gsap.set(q(".jd-chip", g), { opacity: 0 });
        });
        placeHub(l.hub, d);
        setText(q(".jd-ht", hubG), labels.hubs[i].title);
        setText(q(".jd-hs", hubG), labels.hubs[i].sub);
        loops.push(gsap.delayedCall(0.3 * D(), () => hubInner(i, l.hub)));
        if (first && motion) {
            gsap.from(ps, { opacity: 0, y: 14, duration: 0.7, stagger: 0.07, ease: "expo.out" });
            gsap.from(hubG, { opacity: 0, y: 10, duration: 0.8, ease: "expo.out", delay: 0.35 });
        }
    };

    // Initial geometry so the first frame is already composed.
    ps.forEach((g, k) => gsap.set(q(".jd-card", g), { attr: { x: LAYOUTS[0].p[k].x, y: LAYOUTS[0].p[k].y } }));

    const destroy = () => {
        destroyed = true;
        loops.forEach((a) => a.kill());
        loops = [];
        gsap.killTweensOf(svg.querySelectorAll("*"));
        svg.innerHTML = "";
    };

    return { go, destroy };
}
