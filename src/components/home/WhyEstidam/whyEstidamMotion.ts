/**
 * Why Estidam — GSAP motion layer (approved Option B · Operational Intelligence).
 *
 * Usage (client only):
 *   const cleanup = initWhyEstidamMotion(rootElement);
 *   // … on unmount
 *   cleanup();
 *
 * Guarantees
 * - Every query is scoped to `root` (no global selectors, no other sections touched).
 * - Hidden "from" states are applied by GSAP only, inside a
 *   `prefers-reduced-motion: no-preference` matchMedia branch. SSR, no-JS and
 *   reduced-motion users see the complete static section.
 * - One ScrollTrigger (once) plays the entrance; it relies on the existing
 *   Lenis ↔ ScrollTrigger bridge in LenisProvider (no Lenis instance here).
 * - Cleanup aborts all listeners, kills every tween created by interactions
 *   and reverts the matchMedia context → React Strict Mode safe.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import { SEASON_CW, SEASON_HANDOFFS, SEASON_X0 } from "./WhyEstidamScenes";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const BLUE = "#295CC7";
const LINE = "#e2e2e2";
const SVG_NS = "http://www.w3.org/2000/svg";

type SceneController = {
    tl: gsap.core.Timeline;
    move?: (e: PointerEvent) => void;
    leave?: () => void;
    click?: () => void;
};
type SceneFactory = (svg: SVGSVGElement) => SceneController;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const all = <T extends Element = SVGElement>(root: ParentNode, hook: string) => Array.from(root.querySelectorAll<T>(`[data-we="${hook}"]`));
const one = <T extends Element = SVGElement>(root: ParentNode, hook: string) => root.querySelector<T>(`[data-we="${hook}"]`) as T;

const pathLength = (el: SVGGeometryElement) => {
    try {
        return el.getTotalLength();
    } catch {
        return 300;
    }
};

/** Prepare paths for a draw-on (dash offset = full length). */
const prepDraw = (els: SVGGeometryElement[]) =>
    els.forEach((el) => {
        const l = pathLength(el);
        gsap.set(el, { strokeDasharray: l, strokeDashoffset: l });
    });

/** Pointer X → SVG user-space X (viewBox width W). */
const svgX = (svg: SVGSVGElement, clientX: number, W: number) => {
    const r = svg.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * W;
};

/** Text swap for SVG <text> (opacity cross-fade). */
const swapText = (el: Element, txt: string, dur = 0.45) => {
    const tl = gsap.timeline();
    tl.to(el, { opacity: 0, duration: dur * 0.4 })
        .add(() => {
            el.textContent = txt;
        })
        .to(el, { opacity: 1, duration: dur * 0.6 });
    return tl;
};

/* ------------------------------------------------------------------ */
/* Scene 01 — Season board                                             */
/* ------------------------------------------------------------------ */

const seasonScene: SceneFactory = (svg) => {
    const x0 = SEASON_X0;
    const cw = SEASON_CW;
    const col = one(svg, "col");
    const blk = all(svg, "blk");
    const ho = all<SVGPathElement>(svg, "ho");
    const pk = all(svg, "pk");
    const ph = all(svg, "ph");
    const phaseCount = ph.length;

    const lightPhase = (j: number) => ph.forEach((t, k) => t.classList.toggle("is-on", k === j));
    gsap.set(col, { attr: { transform: "translate(0 0)" } });

    const focus = (j: number) => {
        gsap.to(col, { x: j * cw, duration: 0.5, ease: "expo.out", overwrite: "auto" });
        lightPhase(j);
        blk.forEach((b) => gsap.to(b, { opacity: Number(b.dataset.p) === j ? 1 : 0.45, duration: 0.35, overwrite: "auto" }));
        ho.forEach((l) => gsap.to(l, { opacity: Number(l.dataset.p) === j ? 1 : 0.25, duration: 0.35, overwrite: "auto" }));
    };

    const tl = gsap.timeline({ paused: true });
    tl.set(blk, { opacity: 0 })
        .set(ho, { opacity: 0 })
        .set(col, { x: 0 })
        .from(ph, { opacity: 0, y: 4, stagger: 0.05, duration: 0.4 }, 0);

    for (let j = 0; j < phaseCount; j++) {
        const at = 0.3 + j * 0.55;
        tl.to(col, { x: j * cw, duration: 0.5, ease: "expo.inOut" }, at)
            .add(() => lightPhase(j), at + 0.2)
            .fromTo(
                blk.filter((b) => Number(b.dataset.p) === j),
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "expo.out" },
                at + 0.15,
            );
        SEASON_HANDOFFS.forEach(([, , p], k) => {
            if (p !== j || !ho[k]) return;
            tl.to(ho[k], { opacity: 1, duration: 0.2 }, at + 0.45)
                .set(pk[k], { opacity: 1 }, at + 0.45)
                .fromTo(
                    pk[k],
                    { motionPath: { path: ho[k], start: 0, end: 0 } },
                    { motionPath: { path: ho[k], start: 0, end: 1 }, duration: 0.5, ease: "power2.inOut" },
                    at + 0.45,
                )
                .set(pk[k], { opacity: 0 }, at + 0.95);
        });
    }
    tl.to(col, { x: 2 * cw, duration: 0.6, ease: "expo.inOut" }, 3.2).add(() => lightPhase(2), 3.4);

    return {
        tl,
        move: (e) => {
            if (tl.isActive()) return;
            const x = svgX(svg, e.clientX, 520);
            focus(Math.max(0, Math.min(phaseCount - 1, Math.floor((x - x0) / cw))));
        },
        leave: () => {
            if (tl.isActive()) return;
            gsap.to(blk, { opacity: 1, duration: 0.4 });
            gsap.to(ho, { opacity: 1, duration: 0.4 });
        },
    };
};

/* ------------------------------------------------------------------ */
/* Scene 02 — Challenge → outcome → technology                         */
/* ------------------------------------------------------------------ */

const operationsScene: SceneFactory = (svg) => {
    const opts = all<SVGGElement>(svg, "opt");
    const scan = one(svg, "scan");
    const t2 = one<SVGTextElement>(svg, "p2t");
    const p2r = one(svg, "p2r");
    const k1 = one<SVGPathElement>(svg, "k1");
    const k2 = one<SVGPathElement>(svg, "k2");
    const sel = one(svg, "sel");
    const draft = t2.dataset.draft ?? "";
    const agreed = t2.dataset.agreed ?? "";
    const rect = (g: Element) => one(g, "or");
    const label = (g: Element) => one(g, "ot");
    let pick = 1;

    const build = () => {
        const tl = gsap.timeline();
        tl.set(opts, { opacity: 1 })
            .set(opts.map(rect), { fill: "#fff", stroke: LINE })
            .set(opts.map(label), { fill: "#8f8f8f" })
            .set(sel, { opacity: 0 })
            .set(scan, { opacity: 0, x: 0 })
            .add(() => {
                t2.textContent = draft;
            }, 0)
            .set(p2r, { fill: "#f3f4f6" })
            .set(t2, { fill: "#8f8f8f" })
            .fromTo(one(svg, "c1"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0)
            .fromTo(k1, { strokeDasharray: pathLength(k1), strokeDashoffset: pathLength(k1) }, { strokeDashoffset: 0, duration: 0.4 }, 0.4)
            .fromTo(one(svg, "c2"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.6)
            .add(swapText(t2, agreed), 1.2)
            .to(p2r, { fill: "#f3f6fd", duration: 0.3 }, 1.3)
            .to(t2, { fill: BLUE, duration: 0.3 }, 1.3)
            .fromTo(k2, { strokeDasharray: pathLength(k2), strokeDashoffset: pathLength(k2) }, { strokeDashoffset: 0, duration: 0.3 }, 1.6)
            .fromTo(opts, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "expo.out" }, 1.7)
            .set(scan, { opacity: 1 }, 2.1);
        [0, 1, 2, pick].forEach((k, s) => tl.to(scan, { x: k * 96, duration: 0.35, ease: "power2.inOut" }, 2.15 + s * 0.32));
        tl.to(rect(opts[pick]), { fill: BLUE, stroke: BLUE, duration: 0.3 }, 3.5)
            .to(label(opts[pick]), { fill: "#fff", duration: 0.3 }, 3.5)
            .to(
                opts.filter((_, i) => i !== pick),
                { opacity: 0.45, duration: 0.4 },
                3.5,
            )
            .to(scan, { opacity: 0, duration: 0.3 }, 3.6)
            .to(sel, { opacity: 1, duration: 0.4 }, 3.7);
        return tl;
    };

    const tl = build().pause();
    return {
        tl,
        click: () => {
            pick = (pick + 1) % opts.length;
            build();
        },
    };
};

/* ------------------------------------------------------------------ */
/* Scene 03 — Sources → staged analysis → reviewed decision            */
/* ------------------------------------------------------------------ */

const analysisScene: SceneFactory = (svg) => {
    const wires = all<SVGPathElement>(svg, "w");
    const w2 = one<SVGPathElement>(svg, "w2");
    const steps = all(svg, "st");
    const pt = one<SVGTextElement>(svg, "pt");
    const pr = one(svg, "pr");
    const awaiting = pt.dataset.awaiting ?? "";
    const decided = pt.dataset.decided ?? "";
    prepDraw([...wires, w2]);

    const tl = gsap.timeline({ paused: true });
    tl.add(() => {
        pt.textContent = awaiting;
    }, 0)
        .set(pr, { fill: "#fff7e6", stroke: "#f3d9a4" })
        .set(pt, { fill: "#a86a00" })
        .set(all(svg, "s0"), { fill: "#fff", stroke: "#d4d4d4" })
        .set(all(svg, "ok"), { opacity: 0 })
        .from(all(svg, "src"), { opacity: 0, x: -8, duration: 0.5, stagger: 0.08, ease: "expo.out" }, 0)
        .to(wires, { strokeDashoffset: 0, duration: 0.5, stagger: 0.1, ease: "power2.inOut" }, 0.35)
        .from(one(svg, "an"), { opacity: 0, y: 8, duration: 0.5, ease: "expo.out" }, 0.5)
        .from(steps, { opacity: 0, duration: 0.3, stagger: 0.06 }, 0.7);

    steps.forEach((s, i) => {
        const at = 1.1 + i * 0.55;
        const spin = one(s, "spin");
        tl.set(spin, { opacity: 1 }, at)
            .fromTo(spin, { rotation: 0, svgOrigin: `274 ${48 + i * 30}` }, { rotation: 360, duration: 0.5, ease: "none" }, at)
            .set(spin, { opacity: 0 }, at + 0.5)
            .to(one(s, "s0"), { fill: BLUE, stroke: BLUE, duration: 0.2 }, at + 0.5)
            .to(one(s, "ok"), { opacity: 1, duration: 0.2 }, at + 0.55);
    });

    tl.to(w2, { strokeDashoffset: 0, duration: 0.35 }, 2.8)
        .from(one(svg, "dec"), { opacity: 0, y: 8, duration: 0.5, ease: "expo.out" }, 2.9)
        .add(swapText(pt, decided), 3.9)
        .to(pr, { fill: "#f3f6fd", stroke: "#bccdf3", duration: 0.3 }, 4.0)
        .to(pt, { fill: BLUE, duration: 0.3 }, 4.0);

    return { tl };
};

/* ------------------------------------------------------------------ */
/* Scene 04 — Improvement loop                                         */
/* ------------------------------------------------------------------ */

const improvementScene: SceneFactory = (svg) => {
    const stg = all(svg, "stg");
    const rows = one<SVGGElement>(svg, "rows");
    const opt = one<SVGTextElement>(svg, "opt2");
    const ret = one<SVGPathElement>(svg, "ret");
    const up = one<SVGPathElement>(svg, "up");
    const pk = one(svg, "pk2");
    const opsCard = one(svg, "opsr");
    const log: string[] = JSON.parse(rows.dataset.log || "[]");
    const current = opt.dataset.current ?? "";
    const refined = opt.dataset.refined ?? "";
    prepDraw([ret, up]);

    const pushRow = (t: string) => {
        const g = document.createElementNS(SVG_NS, "g");
        const dot = document.createElementNS(SVG_NS, "circle");
        dot.setAttribute("cx", "284");
        dot.setAttribute("cy", "0");
        dot.setAttribute("r", "2.5");
        dot.setAttribute("fill", BLUE);
        const text = document.createElementNS(SVG_NS, "text");
        text.setAttribute("class", "we-m8 we-fi");
        text.setAttribute("x", "294");
        text.setAttribute("y", "3");
        text.textContent = t;
        g.append(dot, text);
        rows.prepend(g);
        Array.from(rows.children).forEach((c, i) => {
            if (i > 1) {
                c.remove();
                return;
            }
            gsap.fromTo(c, { y: i ? 196 : 184, opacity: i ? 1 : 0 }, { y: i ? 212 : 196, opacity: i ? 0.45 : 1, duration: 0.5, ease: "expo.out" });
        });
    };

    const activate = (i: number) =>
        stg.forEach((s, k) => {
            gsap.to(one(s, "sr"), { stroke: k === i ? BLUE : LINE, fill: k === i ? "#f3f6fd" : "#fff", duration: 0.3 });
            gsap.to(one(s, "sd"), { fill: k <= i ? BLUE : "#d4d4d4", duration: 0.3 });
        });

    let n = 0;
    const cycle = (tl: gsap.core.Timeline, at: number) => {
        stg.forEach((_, i) =>
            tl.add(() => {
                activate(i);
                if (log[i]) pushRow(log[i]);
            }, at + i * 0.6),
        );
        tl.set(pk, { opacity: 1 }, at + 2.4)
            .fromTo(pk, { motionPath: { path: ret, start: 0, end: 0 } }, { motionPath: { path: ret, start: 0, end: 1 }, duration: 0.7, ease: "power2.inOut" }, at + 2.4)
            .set(pk, { opacity: 0 }, at + 3.1)
            .add(() => {
                n++;
                swapText(opt, refined + (n + 1));
            }, at + 3.1)
            .to(opsCard, { stroke: BLUE, duration: 0.2, yoyo: true, repeat: 1 }, at + 3.1)
            .add(() => activate(-1), at + 3.6);
    };

    const tl = gsap.timeline({ paused: true });
    tl.add(() => {
        n = 0;
        opt.textContent = current;
        rows.replaceChildren();
        activate(-1);
    }, 0)
        .from(stg, { opacity: 0, y: 8, duration: 0.5, stagger: 0.08, ease: "expo.out" }, 0)
        .from(one(svg, "ops"), { opacity: 0, y: 8, duration: 0.5, ease: "expo.out" }, 0.3)
        .to(up, { strokeDashoffset: 0, duration: 0.4 }, 0.6)
        .to(ret, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.8)
        .from(one(svg, "log"), { opacity: 0, y: 8, duration: 0.5, ease: "expo.out" }, 0.9);
    cycle(tl, 1.5);

    return {
        tl,
        click: () => {
            if (tl.isActive()) return;
            cycle(gsap.timeline(), 0);
        },
    };
};

const SCENES: SceneFactory[] = [seasonScene, operationsScene, analysisScene, improvementScene];

/* ------------------------------------------------------------------ */
/* Section orchestration                                               */
/* ------------------------------------------------------------------ */

export function initWhyEstidamMotion(root: HTMLElement): () => void {
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
        const abort = new AbortController();
        const cells = Array.from(root.querySelectorAll<HTMLElement>("[data-we-cell]"));
        const scenes: (SceneController | null)[] = cells.map((cell) => {
            const svg = cell.querySelector<SVGSVGElement>("[data-we-scene] svg");
            const index = Number(cell.dataset.weCell);
            const factory = SCENES[index];
            return svg && factory ? factory(svg) : null;
        });

        const q = gsap.utils.selector(root);
        const master = gsap.timeline({ paused: true });
        master
            .fromTo(q("[data-we-head='eyebrow']"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" })
            .fromTo(
                q("[data-we-head='word']"),
                { yPercent: 50, opacity: 0, filter: "blur(6px)" },
                { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.05, ease: "expo.out" },
                "-=0.35",
            )
            .fromTo(q("[data-we-head='fade']"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "expo.out" }, "-=0.6")
            .fromTo(cells, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: 0.09, ease: "expo.inOut" }, "-=0.4")
            .fromTo(q("[data-we-fade]"), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.025, ease: "expo.out" }, "<0.4");
        scenes.forEach((s, i) => {
            if (s) master.add(() => s.tl.restart(), `<${0.1 + i * 0.15}`);
        });
        master.set(cells, { clearProps: "clipPath" });

        ScrollTrigger.create({ trigger: root, start: "top 72%", once: true, onEnter: () => master.play() });

        const opts = { signal: abort.signal };
        cells.forEach((cell, i) => {
            const scene = () => scenes[i];
            cell.addEventListener(
                "pointermove",
                (e) => {
                    const r = cell.getBoundingClientRect();
                    cell.style.setProperty("--we-mx", `${e.clientX - r.left}px`);
                    cell.style.setProperty("--we-my", `${e.clientY - r.top}px`);
                    scene()?.move?.(e);
                },
                opts,
            );
            cell.addEventListener("pointerenter", () => cell.style.setProperty("--we-spot", "1"), opts);
            cell.addEventListener(
                "pointerleave",
                () => {
                    cell.style.setProperty("--we-spot", "0");
                    scene()?.leave?.();
                },
                opts,
            );
            const replay = () => {
                const s = scene();
                if (!s) return;
                if (s.click) s.click();
                else s.tl.restart();
            };
            cell.addEventListener("click", replay, opts);
            cell.addEventListener(
                "keydown",
                (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        replay();
                    }
                },
                opts,
            );
        });

        return () => {
            abort.abort();
            scenes.forEach((s) => s?.tl.kill());
        };
    });

    return () => {
        gsap.killTweensOf(root.querySelectorAll("*"));
        mm.revert();
    };
}
