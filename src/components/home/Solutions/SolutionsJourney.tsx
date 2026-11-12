"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/components/LenisProvider";
import type { SolutionCubeSlide } from "@/lib/api/home";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type Props = {
    slides: SolutionCubeSlide[];
    badge: string;
    titleStrong: string;
    titleMuted: string;
    itemLabel: string;
    stepsLabel: string;
};

/** Pin + horizontal travel only on wide screens with motion allowed. */
const DESKTOP_QUERY = "(min-width: 992px) and (prefers-reduced-motion: no-preference)";

/** The CMS has no short-title field, so the step uses the first word of the title. */
const shortLabel = (slide: SolutionCubeSlide) => (slide.title || slide.titleStrong).split(/\s+/)[0] || slide.title;

/**
 * Desktop: the section pins while vertical scroll moves the cards horizontally.
 * Smaller screens and reduced motion: a native horizontal scroll-snap strip.
 */
export default function SolutionsJourney({ slides, badge, titleStrong, titleMuted, itemLabel, stepsLabel }: Props) {
    const t = useTranslations("solutions");
    const pinRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLOListElement>(null);
    const jumpRef = useRef<(index: number) => void>(() => {});
    const [active, setActive] = useState(0);

    const fallback: SolutionCubeSlide[] = (() => {
        const items = t.raw("items") as Array<{ titleStrong?: string; titleMuted?: string; text?: string; highlight?: string }> | undefined;
        if (!Array.isArray(items)) return [];
        return items.map((item, index) => ({
            id: `fallback-${index + 1}`,
            slug: "",
            title: `${item.titleStrong || ""} ${item.titleMuted || ""}`.trim(),
            titleStrong: item.titleStrong || "",
            titleMuted: item.titleMuted || "",
            text: item.text || "",
            highlight: item.highlight || "",
            image: "",
            showOnHome: true,
            showOnPage: true,
        }));
    })();
    const view = slides?.length ? slides : fallback;
    const count = view.length;

    useEffect(() => {
        const pin = pinRef.current;
        const track = trackRef.current;
        const steps = stepsRef.current;
        if (!pin || !track || !steps || count < 1) return;

        const bars = Array.from(steps.querySelectorAll<HTMLElement>(".sj-step-bar"));
        const cards = Array.from(track.querySelectorAll<HTMLElement>(".sj-card"));
        let current = -1;

        const mark = (p: number) => {
            bars.forEach((bar, k) => {
                bar.style.transform = `scaleX(${Math.max(0, Math.min(1, p - k + 0.5))})`;
            });
            const i = Math.max(0, Math.min(count - 1, Math.round(p)));
            if (i !== current) {
                current = i;
                setActive(i);
            }
        };

        const lead = () => {
            const head = pin.querySelector<HTMLElement>(".sj-head");
            if (!head) return 0;
            const pad = parseFloat(getComputedStyle(head).paddingInlineStart) || 0;
            const rect = head.getBoundingClientRect();
            const rtl = document.documentElement.dir === "rtl";
            const inset = rtl ? window.innerWidth - rect.right + pad : rect.left + pad;
            const value = Math.max(0, inset);
            pin.style.setProperty("--sj-lead", `${value}px`);
            pin.style.setProperty("--sj-track-top", `${head.offsetHeight + 56}px`);
            return value;
        };

        const mm = gsap.matchMedia();
        lead();

        mm.add(DESKTOP_QUERY, () => {
            pin.classList.remove("is_static");
            const dir = document.documentElement.dir === "rtl" ? 1 : -1;
            const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + lead());

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: pin,
                    start: "bottom bottom",
                    end: () => `+=${distance()}`,
                    pin: true,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => mark(self.progress * Math.max(1, count - 1)),
                },
            });
            tl.to(track, { x: () => dir * distance(), ease: "none" }, 0);
            track.querySelectorAll<HTMLElement>(".sj-media img").forEach((img) => {
                tl.fromTo(img, { xPercent: dir * 8 }, { xPercent: 0, ease: "none" }, 0);
            });

            jumpRef.current = (index: number) => {
                const st = tl.scrollTrigger;
                if (!st) return;
                const y = st.start + (st.end - st.start) * (count > 1 ? index / (count - 1) : 0);
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(y, { duration: 1.1 });
                else window.scrollTo({ top: y, behavior: "smooth" });
            };

            mark(0);
            return () => {
                gsap.set(track, { clearProps: "transform" });
                track.querySelectorAll(".sj-media img").forEach((img) => gsap.set(img, { clearProps: "transform" }));
            };
        });

        mm.add(`not all and ${DESKTOP_QUERY}`, () => {
            pin.classList.add("is_static");
            lead();
            const stepSize = () => (cards[0]?.offsetWidth ?? 1) + parseFloat(getComputedStyle(track).columnGap || "16");
            const rtl = document.documentElement.dir === "rtl";
            const onScroll = () => mark(Math.abs(track.scrollLeft) / stepSize());
            track.addEventListener("scroll", onScroll, { passive: true });
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            jumpRef.current = (index: number) =>
                track.scrollTo({ left: (rtl ? -1 : 1) * index * stepSize(), behavior: reduce ? "auto" : "smooth" });
            mark(0);
            return () => track.removeEventListener("scroll", onScroll);
        });

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);

        return () => {
            window.removeEventListener("load", refresh);
            mm.revert();
            jumpRef.current = () => {};
        };
    }, [count]);

    return (
        <div className="sj-pin" ref={pinRef}>
            <div className="sj-head container">
                <div>
                    <span className="sj-badge">{badge}</span>
                    <h2 id="solutions-title" className="sj-title">
                        {titleStrong} {titleMuted ? <span>{titleMuted}</span> : null}
                    </h2>
                </div>

                <ol className="sj-steps" ref={stepsRef} aria-label={stepsLabel}>
                    {view.map((slide, i) => (
                        <li key={slide.id}>
                            <button type="button" aria-current={i === active ? "step" : undefined} onClick={() => jumpRef.current(i)}>
                                {shortLabel(slide)}
                                <span className="sj-step-bar" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="sj-track" ref={trackRef}>
                {view.map((slide, i) => (
                    <article className="sj-card" key={slide.id} aria-label={`${i + 1} / ${count}: ${slide.title}`}>
                        <div className="sj-copy">
                            <span className="sj-label">{itemLabel}</span>
                            <h3>{slide.title || `${slide.titleStrong} ${slide.titleMuted}`.trim()}</h3>
                            {slide.text ? <p>{slide.text}</p> : null}
                            {slide.highlight ? <p className="sj-outcome">{slide.highlight}</p> : null}
                        </div>
                        <div className="sj-media">
                            {slide.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={slide.image}
                                    alt=""
                                    width={1600}
                                    height={1200}
                                    loading={i < 2 ? "eager" : "lazy"}
                                    decoding="async"
                                    draggable={false}
                                />
                            ) : null}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
