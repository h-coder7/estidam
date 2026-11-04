"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/LenisProvider";
import type { SolutionCubeSlide } from "@/lib/api/home";

const fallbackImage = "/images/solution1.png";

/** Tunable Verticalix-matched values (from live preview DevTools). */
export const SOLUTIONS_STACK_CONFIG = {
    inactiveScale: 0.88,
    adjacentOpacity: 0.62,
    farOpacity: 0,
    inactiveBlur: 16,
    rotateDeg: 10,
    inactiveTx: -20,
    /** Vertical distance between card centers as a fraction of card height */
    pitchRatio: 0.92,
    hoverScale: 1.04,
    hoverDuration: 0.35,
    textDuration: 0.7,
    /** Vertical travel (px) for left copy while scrolling between slides */
    textTravel: 64,
    /** Longer settle = creamier card-to-card motion */
    snapDuration: 1.15,
    /** Lock wheel stepping until the card settle finishes */
    wheelLockMs: 1200,
    scrollPerSlideVh: 1.15,
    /** Scrub lag (seconds) softens pose updates behind scroll */
    scrubLag: 0.75,
};

type SolutionsCubeProps = {
    slides?: SolutionCubeSlide[];
};

type Pose = {
    scale: number;
    rotate: number;
    opacity: number;
    blur: number;
    tx: number;
    y: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smoothstep — eases pose changes so mid-transition isn't linear/harsh */
const smoothstep = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
};

/** Softer ease-out for blur / opacity (stays clear longer, softens near edges) */
const easeOutCubic = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return 1 - Math.pow(1 - x, 3);
};

/** Lenis scroll easing — slow settle into the active card */
const snapEase = (t: number) => 1 - Math.pow(1 - t, 3.2);

const poseAtDistance = (distance: number, pitch: number): Pose => {
    const sign = distance === 0 ? 1 : Math.sign(distance);
    const ad = Math.abs(distance);
    const { inactiveScale, adjacentOpacity, farOpacity, inactiveBlur, rotateDeg, inactiveTx } =
        SOLUTIONS_STACK_CONFIG;

    if (ad >= 2) {
        return {
            scale: inactiveScale,
            rotate: sign * rotateDeg,
            opacity: farOpacity,
            blur: inactiveBlur,
            tx: inactiveTx,
            y: sign * pitch * Math.min(ad, 2.35),
        };
    }

    if (ad <= 1) {
        const t = smoothstep(ad);
        const blurT = easeOutCubic(ad);
        return {
            scale: lerp(1, inactiveScale, t),
            rotate: lerp(0, sign * rotateDeg, t),
            opacity: lerp(1, adjacentOpacity, smoothstep(ad * 0.92)),
            blur: lerp(0, inactiveBlur, blurT),
            tx: lerp(0, inactiveTx, t),
            y: lerp(0, sign * pitch, smoothstep(ad)),
        };
    }

    const t = smoothstep(ad - 1);
    return {
        scale: inactiveScale,
        rotate: sign * rotateDeg,
        opacity: lerp(adjacentOpacity, farOpacity, t),
        blur: inactiveBlur,
        tx: inactiveTx,
        y: lerp(sign * pitch, sign * pitch * 2, t),
    };
};

const SolutionsCube = ({ slides }: SolutionsCubeProps) => {
    const t = useTranslations("solutions");
    const lenis = useLenis();
    const rootRef = useRef<HTMLDivElement>(null);
    const stackRef = useRef<HTMLDivElement>(null);
    const copyViewportRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLElement[]>([]);
    const mediaRef = useRef<HTMLElement[]>([]);
    const copyRef = useRef<HTMLElement[]>([]);
    const triggerRef = useRef<ScrollTrigger | null>(null);
    const progressRef = useRef(0);
    const activeIndexRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const fallbackSlides: SolutionCubeSlide[] = (() => {
        const items = t.raw("items") as
            | Array<{
                  titleStrong?: string;
                  titleMuted?: string;
                  text?: string;
                  highlight?: string;
              }>
            | undefined;

        if (!Array.isArray(items) || !items.length) {
            return [
                {
                    id: "fallback-1",
                    title: `${t("itemTitleStrong")} ${t("itemTitleMuted")}`.trim(),
                    titleStrong: t("itemTitleStrong"),
                    titleMuted: t("itemTitleMuted"),
                    text: t("itemText"),
                    highlight: t("itemHighlight"),
                    image: fallbackImage,
                },
            ];
        }

        return items.map((item, index) => ({
            id: `fallback-${index + 1}`,
            title: `${item.titleStrong || ""} ${item.titleMuted || ""}`.trim(),
            titleStrong: item.titleStrong || "",
            titleMuted: item.titleMuted || "",
            text: item.text || "",
            highlight: item.highlight || "",
            image: fallbackImage,
        }));
    })();

    const viewSlides = slides?.length ? slides : fallbackSlides;
    const count = viewSlides.length;

    useEffect(() => {
        const root = rootRef.current;
        const stack = stackRef.current;
        const copyViewport = copyViewportRef.current;
        if (!root || !stack || count < 1) return;

        gsap.registerPlugin(ScrollTrigger);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const rtl = document.documentElement.dir === "rtl";
        cardsRef.current = cardsRef.current.slice(0, count);
        mediaRef.current = mediaRef.current.slice(0, count);
        copyRef.current = copyRef.current.slice(0, count);
        const cards = cardsRef.current.filter(Boolean);
        const medias = mediaRef.current.filter(Boolean);
        const copies = copyRef.current.filter(Boolean);

        const measurePitch = () => {
            const card = cards[0];
            const height = card?.offsetHeight || stack.clientHeight * 0.55;
            return height * SOLUTIONS_STACK_CONFIG.pitchRatio;
        };

        const measureCopyViewport = () => {
            if (!copyViewport || !copies.length) return;
            let tallest = 0;
            copies.forEach((copy) => {
                tallest = Math.max(tallest, copy.scrollHeight || copy.offsetHeight);
            });
            if (tallest > 0) {
                copyViewport.style.minHeight = `${tallest}px`;
            }
        };

        let pitch = measurePitch();
        measureCopyViewport();

        const paint = (progress: number) => {
            progressRef.current = progress;
            const position = count < 2 ? 0 : progress * (count - 1);
            const textTravel = SOLUTIONS_STACK_CONFIG.textTravel;

            cards.forEach((card, index) => {
                const pose = poseAtDistance(index - position, pitch);
                const tx = pose.tx * (rtl ? -1 : 1);

                gsap.set(card, {
                    x: tx,
                    yPercent: -50,
                    y: pose.y,
                    scale: pose.scale,
                    rotation: reduced ? 0 : pose.rotate,
                    opacity: pose.opacity,
                    filter: reduced ? "none" : `blur(${pose.blur}px)`,
                    zIndex: Math.round(100 - Math.abs(index - position) * 10),
                    force3D: true,
                });

                card.setAttribute("aria-hidden", Math.abs(index - position) > 0.5 ? "true" : "false");
            });

            // Left copy rides the same scroll progress as the cards (Verticalix-style)
            copies.forEach((copy, index) => {
                const d = index - position;
                const ad = Math.abs(d);

                if (reduced) {
                    const on = ad < 0.5;
                    gsap.set(copy, {
                        y: 0,
                        opacity: on ? 1 : 0,
                        zIndex: on ? 2 : 0,
                        pointerEvents: on ? "auto" : "none",
                    });
                    copy.setAttribute("aria-hidden", on ? "false" : "true");
                    return;
                }

                const visibility = ad >= 1 ? 0 : 1 - smoothstep(ad);
                const y = d * textTravel;

                gsap.set(copy, {
                    y,
                    opacity: visibility,
                    zIndex: Math.round(20 - ad * 10),
                    pointerEvents: ad < 0.5 ? "auto" : "none",
                    force3D: true,
                });

                copy.setAttribute("aria-hidden", ad > 0.5 ? "true" : "false");
            });

            const nextIndex = Math.min(count - 1, Math.max(0, Math.round(position)));
            if (nextIndex !== activeIndexRef.current) {
                activeIndexRef.current = nextIndex;
                setActiveIndex(nextIndex);
            }
        };

        const refreshAfterImages = () => {
            pitch = measurePitch();
            measureCopyViewport();
            ScrollTrigger.refresh();
            paint(progressRef.current);
        };

        const imageLoads = medias
            .map((media) => media.querySelector("img"))
            .filter((img): img is HTMLImageElement => !!img)
            .map(
                (img) =>
                    new Promise<void>((resolve) => {
                        if (img.complete) {
                            resolve();
                            return;
                        }
                        img.addEventListener("load", () => resolve(), { once: true });
                        img.addEventListener("error", () => resolve(), { once: true });
                    }),
            );

        paint(0);

        if (count < 2) {
            return () => {
                gsap.set(cards, { clearProps: "all" });
            };
        }

        let wheelLocked = false;
        let wheelUnlockTimer = 0;
        let settleTimer = 0;
        let pinActive = false;

        const scrollToIndex = (index: number) => {
            const trigger = triggerRef.current;
            if (!trigger || count < 2) return;

            const next = Math.min(count - 1, Math.max(0, index));
            const target = trigger.start + ((trigger.end - trigger.start) * next) / (count - 1);
            const duration = reduced ? 0.01 : SOLUTIONS_STACK_CONFIG.snapDuration;

            wheelLocked = true;
            window.clearTimeout(wheelUnlockTimer);
            wheelUnlockTimer = window.setTimeout(() => {
                wheelLocked = false;
            }, reduced ? 50 : SOLUTIONS_STACK_CONFIG.wheelLockMs);

            if (lenis) {
                lenis.scrollTo(target, {
                    duration,
                    easing: snapEase,
                    force: true,
                    lock: true,
                    onComplete: () => {
                        wheelLocked = false;
                        window.clearTimeout(wheelUnlockTimer);
                    },
                });
                return;
            }

            window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
        };

        const snapToNearest = () => {
            const trigger = triggerRef.current;
            if (!trigger || !pinActive || count < 2 || wheelLocked) return;
            const position = trigger.progress * (count - 1);
            const nearest = Math.round(position);
            if (Math.abs(position - nearest) < 0.03) return;
            scrollToIndex(nearest);
        };

        const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top 96px",
            end: () =>
                `+=${(count - 1) * window.innerHeight * SOLUTIONS_STACK_CONFIG.scrollPerSlideVh}`,
            pin: true,
            pinSpacing: true,
            scrub: reduced ? true : SOLUTIONS_STACK_CONFIG.scrubLag,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => {
                pinActive = self.isActive;
                if (!self.isActive) {
                    wheelLocked = false;
                    window.clearTimeout(wheelUnlockTimer);
                    window.clearTimeout(settleTimer);
                }
            },
            onUpdate: (self) => {
                paint(self.progress);

                // Fallback settle-snap for trackpad inertia / touch that lands between cards
                if (reduced || wheelLocked) return;
                window.clearTimeout(settleTimer);
                settleTimer = window.setTimeout(snapToNearest, 180);
            },
            onRefresh: () => {
                pitch = measurePitch();
                paint(progressRef.current);
            },
        });

        triggerRef.current = trigger;
        pinActive = trigger.isActive;

        const stepFromWheel = (deltaY: number) => {
            if (!pinActive || reduced) return false;
            if (Math.abs(deltaY) < 8) return false;
            if (wheelLocked) return true;

            const dir = deltaY > 0 ? 1 : -1;
            const next = activeIndexRef.current + dir;
            if (next < 0 || next > count - 1) {
                // At ends: release page scroll so user can leave the section
                return false;
            }

            scrollToIndex(next);
            return true;
        };

        const onWheel = (event: WheelEvent) => {
            if (!pinActive || reduced) return;
            // Only hijack while pinned so one notch = one card
            const handled = stepFromWheel(event.deltaY);
            if (handled) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        const onEnter = (event: Event) => {
            const media = event.currentTarget as HTMLElement;
            const index = Number(media.dataset.index);
            if (index !== activeIndexRef.current || reduced) return;
            gsap.to(media, {
                scale: SOLUTIONS_STACK_CONFIG.hoverScale,
                duration: SOLUTIONS_STACK_CONFIG.hoverDuration,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        const onLeave = (event: Event) => {
            const media = event.currentTarget as HTMLElement;
            gsap.to(media, {
                scale: 1,
                duration: SOLUTIONS_STACK_CONFIG.hoverDuration,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                event.preventDefault();
                scrollToIndex(activeIndexRef.current + 1);
            } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                event.preventDefault();
                scrollToIndex(activeIndexRef.current - 1);
            } else if (event.key === "Home") {
                event.preventDefault();
                scrollToIndex(0);
            } else if (event.key === "End") {
                event.preventDefault();
                scrollToIndex(count - 1);
            }
        };

        medias.forEach((media) => {
            media.addEventListener("pointerenter", onEnter);
            media.addEventListener("pointerleave", onLeave);
        });
        stack?.addEventListener("keydown", onKeyDown);
        // Capture on window so Lenis doesn't smooth-scroll past mid-card states
        window.addEventListener("wheel", onWheel, { passive: false, capture: true });

        const frame = window.requestAnimationFrame(() => {
            refreshAfterImages();
            paint(trigger.progress);
        });

        void Promise.all(imageLoads).then(refreshAfterImages);

        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(wheelUnlockTimer);
            window.clearTimeout(settleTimer);
            window.removeEventListener("wheel", onWheel, true);
            medias.forEach((media) => {
                media.removeEventListener("pointerenter", onEnter);
                media.removeEventListener("pointerleave", onLeave);
            });
            stack?.removeEventListener("keydown", onKeyDown);
            trigger.kill();
            triggerRef.current = null;
            gsap.set(cards, { clearProps: "all" });
            gsap.set(medias, { clearProps: "transform" });
            gsap.set(copies, { clearProps: "all" });
        };
    }, [count, lenis]);

    return (
        <div className="solutions_body border-top px-4" ref={rootRef}>
            <div className="row gx-0 align-items-center solutions_body_row">
                <div className="col-md-5">
                    <div className="solutions_content" aria-live="polite" aria-atomic="true">
                        <p className="solutions_label">{t("itemLabel")}</p>

                        <div className="solutions_copy_viewport" ref={copyViewportRef}>
                            {viewSlides.map((slide, index) => (
                                <div
                                    className={`solutions_copy${index === activeIndex ? " is_active" : ""}`}
                                    key={`copy-${slide.id}-${index}`}
                                    ref={(node) => {
                                        if (node) copyRef.current[index] = node;
                                    }}
                                >
                                    <h3 className="solutions_title">
                                        <span className="solutions_title_strong">
                                            {slide.titleStrong}
                                        </span>
                                        {slide.titleMuted ? (
                                            <>
                                                {" "}
                                                <span className="solutions_title_muted cr-blue fw-500">
                                                    {slide.titleMuted}
                                                </span>
                                            </>
                                        ) : null}
                                    </h3>

                                    {slide.text ? (
                                        <p className="solutions_text">{slide.text}</p>
                                    ) : null}
                                    {slide.highlight ? (
                                        <p className="solutions_highlight">{slide.highlight}</p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="solutions_visual">
                        <div
                            className="solutions_stack"
                            ref={stackRef}
                            role="region"
                            tabIndex={0}
                            aria-roledescription="carousel"
                            aria-label={t("dotsLabel")}
                        >
                            {viewSlides.map((slide, index) => (
                                <article
                                    className={`solutions_stack_card${index === activeIndex ? " is_active" : ""}`}
                                    key={`${slide.id}-${index}`}
                                    ref={(node) => {
                                        if (node) cardsRef.current[index] = node;
                                    }}
                                >
                                    <div
                                        className="solutions_stack_card_media"
                                        data-index={index}
                                        ref={(node) => {
                                            if (node) mediaRef.current[index] = node;
                                        }}
                                    >
                                        <img
                                            src={slide.image || fallbackImage}
                                            alt={slide.title}
                                            draggable={false}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolutionsCube;
