"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ClientLogo } from "./clientsData";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type Props = { logos: ClientLogo[]; label: string };

const ROWS = 3;
const COPIES = 3;
const SPEEDS = [34, 28, 38];

const isSquare = (logo: ClientLogo) => logo.width / logo.height < 1.4;

export default function ClientsMarquee({ logos, label }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [reduced, setReduced] = useState(false);

    const rows = Array.from({ length: ROWS }, (_, row) => logos.filter((_, index) => index % ROWS === row));

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(motion.matches);
        if (motion.matches) return;

        const rtl = document.documentElement.dir === "rtl";
        const state = Array.from(wrap.querySelectorAll<HTMLElement>(".cl-track")).map((el, index) => ({
            el,
            dir: (index === 1 ? 1 : -1) * (rtl ? -1 : 1),
            speed: SPEEDS[index] ?? 30,
            slow: { v: 1 },
            x: 0,
            w: 0,
        }));

        const measure = () =>
            state.forEach((row) => {
                const set = row.el.querySelector<HTMLElement>(".cl-set");
                const gap = parseFloat(getComputedStyle(row.el).columnGap || "22") || 22;
                row.w = (set?.offsetWidth ?? 0) + gap;
                if (row.dir > 0 && row.x === 0) row.x = -row.w;
            });
        measure();

        const ac = new AbortController();
        state.forEach((row) => {
            row.el.addEventListener(
                "pointerenter",
                () => gsap.to(row.slow, { v: 0.15, duration: 0.6, ease: "power2.out", overwrite: true }),
                { signal: ac.signal },
            );
            row.el.addEventListener(
                "pointerleave",
                () => gsap.to(row.slow, { v: 1, duration: 0.9, ease: "power2.inOut", overwrite: true }),
                { signal: ac.signal },
            );
        });

        let boost = 0;
        const trigger = ScrollTrigger.create({
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                boost = Math.min(4, Math.abs(self.getVelocity()) / 220);
            },
        });

        let visible = false;
        let frameId = 0;
        let last = performance.now();
        const frame = (time: number) => {
            const delta = Math.min(0.05, (time - last) / 1000);
            last = time;
            boost *= 0.92;
            state.forEach((row) => {
                if (!row.w) return;
                row.x += row.dir * row.speed * (1 + boost) * row.slow.v * delta;
                if (row.x <= -row.w) row.x += row.w;
                if (row.x > 0) row.x -= row.w;
                row.el.style.transform = `translate3d(${row.x.toFixed(2)}px,0,0)`;
            });
            if (visible) frameId = requestAnimationFrame(frame);
        };

        const observer = new IntersectionObserver(([entry]) => {
            const wasVisible = visible;
            visible = entry.isIntersecting;
            if (visible && !wasVisible) {
                last = performance.now();
                frameId = requestAnimationFrame(frame);
            }
            if (!visible) cancelAnimationFrame(frameId);
        });
        observer.observe(wrap);

        const resize = new ResizeObserver(measure);
        resize.observe(wrap);

        const rowEls = wrap.querySelectorAll(".cl-row");
        gsap.from(rowEls, {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: { trigger: wrap, start: "top bottom", once: true },
            clearProps: "opacity,transform",
        });

        return () => {
            ac.abort();
            cancelAnimationFrame(frameId);
            observer.disconnect();
            resize.disconnect();
            trigger.kill();
            gsap.killTweensOf([...state.map((row) => row.slow), ...rowEls]);
            state.forEach((row) => {
                row.el.style.transform = "";
            });
        };
    }, [logos]);

    return (
        <div className={`cl-marquee${reduced ? " is_static" : ""}`} ref={wrapRef}>
            <ul className="cl-sr" aria-label={label}>
                {logos.map((logo) => (
                    <li key={logo.src}>{logo.name}</li>
                ))}
            </ul>

            <div className="cl-rows" aria-hidden="true">
                {rows.map((row, rowIndex) => (
                    <div className="cl-row" key={rowIndex}>
                        <div className="cl-track">
                            {Array.from({ length: reduced ? 1 : COPIES }).map((_, copy) => (
                                <div className="cl-set" key={copy}>
                                    {row.map((logo) => (
                                        <span className={`cl-tile${isSquare(logo) ? " is_square" : ""}`} key={logo.src}>
                                            <img
                                                src={logo.src}
                                                alt=""
                                                width={logo.width}
                                                height={logo.height}
                                                loading="lazy"
                                                decoding="async"
                                                draggable={false}
                                            />
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
