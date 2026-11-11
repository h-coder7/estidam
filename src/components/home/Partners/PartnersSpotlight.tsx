"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import type { PartnerLogo } from "./partnersData";

type Props = {
    logos: PartnerLogo[];
    title: ReactNode;
    chooseLabel: string;
    pauseLabel: string;
    playLabel: string;
};

/** Time each partner stays on stage (ms). */
const DURATION = 3200;

/**
 * One partner on a large stage, advancing on a single rAF loop.
 * Auto-advance stops while the pointer or focus is on the stage, the section
 * is off screen, the tab is hidden, the user pressed Pause, or motion is reduced.
 */
export default function PartnersSpotlight({ logos, title, chooseLabel, pauseLabel, playLabel }: Props) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reduced, setReduced] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLSpanElement>(null);
    const elapsed = useRef(0);
    const hold = useRef(false);
    const pausedRef = useRef(false);
    const count = logos.length;

    const go = useCallback(
        (next: number) => {
            elapsed.current = 0;
            setIndex(((next % count) + count) % count);
        },
        [count],
    );

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || count < 2) return;

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        if (mq.matches) return;

        let visible = false;
        let raf = 0;
        let last = performance.now();

        const frame = (now: number) => {
            const dt = now - last;
            last = now;
            if (!pausedRef.current && !hold.current && !document.hidden) {
                elapsed.current += dt;
                if (elapsed.current >= DURATION) {
                    elapsed.current = 0;
                    setIndex((i) => (i + 1) % count);
                }
            }
            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${Math.min(1, elapsed.current / DURATION)})`;
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
        io.observe(root);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
        };
    }, [count]);

    const active = logos[index];

    return (
        <div className="ps-grid" ref={rootRef}>
            <div className="ps-head">
                {title}
                <div className="ps-thumbs" role="group" aria-label={chooseLabel}>
                    {logos.map((logo, i) => (
                        <button
                            key={logo.src}
                            type="button"
                            className="ps-thumb"
                            aria-label={logo.name}
                            aria-pressed={i === index}
                            onClick={() => go(i)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logo.src} alt="" width={logo.width} height={logo.height} loading="lazy" decoding="async" />
                        </button>
                    ))}
                </div>
            </div>

            <div
                className="ps-stage"
                onPointerEnter={() => {
                    hold.current = true;
                }}
                onPointerLeave={() => {
                    hold.current = false;
                }}
                onFocus={() => {
                    hold.current = true;
                }}
                onBlur={() => {
                    hold.current = false;
                }}
            >
                {!reduced ? <span className="ps-progress" ref={barRef} aria-hidden="true" /> : null}

                {logos.map((logo, i) => (
                    <div className={`ps-plate${i === index ? " is_active" : ""}`} key={logo.src} aria-hidden={i !== index}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logo.src}
                            alt={i === index ? logo.name : ""}
                            width={logo.width}
                            height={logo.height}
                            loading={i < 2 ? "eager" : "lazy"}
                            decoding="async"
                        />
                    </div>
                ))}

                <div className="ps-foot">
                    <span className="ps-name">{active?.name}</span>
                    {!reduced ? (
                        <button type="button" className="ps-ctrl" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                            <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span> {paused ? playLabel : pauseLabel}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
