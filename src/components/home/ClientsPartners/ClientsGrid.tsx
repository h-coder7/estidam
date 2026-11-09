"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { BrandLogo } from "./clientsPartnersData";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = { logos: BrandLogo[]; label: string };

export default function ClientsGrid({ logos, label }: Props) {
    const rootRef = useRef<HTMLUListElement>(null);

    useIsoLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const mm = gsap.matchMedia(root);
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const q = gsap.utils.selector(root);
            const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 85%", once: true } });
            tl.from(q(".cp-cell"), { clipPath: "inset(100% 0 0 0)", duration: 1, stagger: { each: 0.02, grid: "auto" }, ease: "expo.inOut" }).from(
                q(".cp-cell img"),
                { y: 16, opacity: 0, duration: 0.8, stagger: 0.02, ease: "expo.out", clearProps: "transform,opacity" },
                0.25,
            );
        });
        return () => mm.revert();
    }, []);

    if (!logos.length) return null;

    return (
        <ul className="cp-grid" ref={rootRef} aria-label={label}>
            {logos.map((logo) => (
                <li key={logo.id} className="cp-cell" tabIndex={0}>
                    <span className="cp-box">
                        <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" draggable={false} />
                    </span>
                </li>
            ))}
        </ul>
    );
}
