"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { BrandLogo } from "./clientsPartnersData";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type Props = { logos: BrandLogo[]; label: string; pauseLabel: string; playLabel: string };

const COPIES = 3; // enough copies for a seamless loop on wide screens

/**
 * Two horizontal rows moving in opposite directions (approved).
 * - One rAF loop for both rows; transform only.
 * - Scroll velocity gives a short speed boost; hovering a row slows it nearly to a stop.
 * - Pause / Play button (WCAG 2.2.2). Reduced motion → static rows, button hidden.
 * - Loop runs only while the section is on screen (IntersectionObserver).
 * - Duplicate sets are aria-hidden; screen readers get one list of all partners.
 */
export default function PartnersMarquee({ logos, label, pauseLabel, playLabel }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const [reduced, setReduced] = useState(false);
    const pausedRef = useRef(false);

    const half = Math.ceil(logos.length / 2);
    const rows = [logos.slice(0, half), logos.slice(half)];

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        if (mq.matches) return;

        const rtl = document.documentElement.dir === "rtl";
        const state = Array.from(wrap.querySelectorAll<HTMLElement>(".cp-row")).map((el, i) => ({
            el,
            dir: (i === 0 ? -1 : 1) * (rtl ? -1 : 1),
            speed: i === 0 ? 28 : 34,
            slow: { v: 1 },
            x: 0,
            w: 0,
        }));
        const measure = () =>
            state.forEach((s) => {
                const set = s.el.querySelector<HTMLElement>(".cp-set");
                const gap = parseFloat(getComputedStyle(s.el).columnGap || "16") || 16;
                s.w = (set?.offsetWidth ?? 0) + gap;
                if (s.dir > 0 && s.x === 0) s.x = -s.w;
            });
        measure();

        const ac = new AbortController();
        state.forEach((s) => {
            s.el.addEventListener("pointerenter", () => gsap.to(s.slow, { v: 0.06, duration: 0.6, ease: "power2.out", overwrite: true }), { signal: ac.signal });
            s.el.addEventListener("pointerleave", () => gsap.to(s.slow, { v: 1, duration: 0.9, ease: "power2.inOut", overwrite: true }), { signal: ac.signal });
        });

        let boost = 0;
        const st = ScrollTrigger.create({
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                boost = Math.min(5, Math.abs(self.getVelocity()) / 200);
            },
        });

        let visible = false;
        let raf = 0;
        let last = performance.now();
        const frame = (t: number) => {
            const dt = Math.min(0.05, (t - last) / 1000);
            last = t;
            boost *= 0.92;
            if (!pausedRef.current) {
                state.forEach((s) => {
                    if (!s.w) return;
                    s.x += s.dir * s.speed * (1 + boost) * s.slow.v * dt;
                    if (s.x <= -s.w) s.x += s.w;
                    if (s.x > 0) s.x -= s.w;
                    s.el.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
                });
            }
            if (visible) raf = requestAnimationFrame(frame);
        };
        const io = new IntersectionObserver(([entry]) => {
            const was = visible;
            visible = entry.isIntersecting;
            if (visible && !was) {
                last = performance.now();
                raf = requestAnimationFrame(frame);
            }
            if (!visible) cancelAnimationFrame(raf);
        });
        io.observe(wrap);

        const ro = new ResizeObserver(measure);
        ro.observe(wrap);

        gsap.from(wrap.querySelectorAll(".cp-row"), { opacity: 0, y: 30, duration: 1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: wrap, start: "top bottom", once: true }, clearProps: "opacity,transform" });

        return () => {
            ac.abort();
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            st.kill();
            gsap.killTweensOf([...state.map((s) => s.slow), ...wrap.querySelectorAll(".cp-row")]);
            state.forEach((s) => (s.el.style.transform = ""));
        };
    }, [logos]);

    return (
        <div className="cp-marquee" ref={wrapRef}>
            {/* Accessible list (visually hidden) — every partner exactly once. */}
            <ul className="cp-sr">
                {logos.map((logo) => (
                    <li key={logo.id}>
                        {logo.url ? (
                            <a href={logo.url} target={/^https?:\/\//i.test(logo.url) ? "_blank" : undefined} rel={/^https?:\/\//i.test(logo.url) ? "noreferrer" : undefined}>
                                {logo.name}
                            </a>
                        ) : (
                            logo.name
                        )}
                    </li>
                ))}
            </ul>

            <div className="cp-rows" aria-hidden="true" role="presentation" title={label}>
                {rows.map((row, r) => (
                    <div className="cp-row" key={r}>
                        {Array.from({ length: COPIES }).map((_, c) => (
                            <div className="cp-set" key={c}>
                                {row.map((logo) => {
                                    const external = !!logo.url && /^https?:\/\//i.test(logo.url);
                                    const image = (
                                        <span className="cp-box">
                                            <img src={logo.src} alt="" width={logo.width} height={logo.height} loading="lazy" decoding="async" draggable={false} />
                                        </span>
                                    );

                                    return logo.url ? (
                                        <a
                                            className="cp-plate"
                                            key={`${c}-${logo.id}`}
                                            href={logo.url}
                                            tabIndex={-1}
                                            target={external ? "_blank" : undefined}
                                            rel={external ? "noreferrer" : undefined}
                                        >
                                            {image}
                                        </a>
                                    ) : (
                                        <span className="cp-plate" key={`${c}-${logo.id}`}>
                                            {image}
                                        </span>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* {!reduced ? (
                <div className="cp-ctrl">
                    <button type="button" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                        {paused ? playLabel : pauseLabel}
                    </button>
                </div>
            ) : null} */}
        </div>
    );
}
