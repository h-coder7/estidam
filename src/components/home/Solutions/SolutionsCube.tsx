"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, useLenis } from "@/components/LenisProvider";
import type { SolutionCubeSlide } from "@/lib/api/home";

const fallbackImage = "/images/solution1.png";

/** Cinematic mask reveal — tunable values. */
export const SOLUTIONS_STACK_CONFIG = {
    /** Mask reveal duration (s) */
    revealDuration: 1,
    /** Incoming image starts this much larger and settles to 1 */
    revealScale: 1.03,
    /** Internal parallax travel (% of image height) during the reveal */
    parallax: 4,
    hoverScale: 1.02,
    hoverDuration: 0.4,
    /** Incoming copy rises this far (px) while it fades in */
    textTravel: 16,
    /** Card-to-card settle (Lenis tween) */
    snapDuration: 0.7,
    /** Ignore extra wheel notches while a card is settling */
    wheelLockMs: 760,
    scrollPerSlideVh: 0.75,
};

const SHOWN = "inset(0% 0% 0% 0% round 16px)";
const HIDE_TOP = "inset(0% 0% 100% 0% round 16px)";
const HIDE_BOTTOM = "inset(100% 0% 0% 0% round 16px)";

type SolutionsCubeProps = {
    slides?: SolutionCubeSlide[];
};

/** One decisive travel, then a short settle. Still lands on a whole card. */
const snapEase = (t: number) => 1 - (1 - t) ** 3;

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
        cardsRef.current = cardsRef.current.slice(0, count);
        mediaRef.current = mediaRef.current.slice(0, count);
        copyRef.current = copyRef.current.slice(0, count);
        const cards = cardsRef.current.filter(Boolean);
        const medias = mediaRef.current.filter(Boolean);
        const copies = copyRef.current.filter(Boolean);

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

        measureCopyViewport();

        if (copyViewport) {
            copyViewport.style.setProperty("--copy-shift", `${SOLUTIONS_STACK_CONFIG.textTravel}px`);
        }

        const imgOf = (index: number) => medias[index]?.querySelector("img") ?? null;
        const { revealDuration, revealScale, parallax } = SOLUTIONS_STACK_CONFIG;
        let reveal: gsap.core.Timeline | null = null;

        // Resting state: only the active image is visible — no neighbours, no ghost layers.
        const settle = (active: number) => {
            cards.forEach((card, index) => {
                const on = index === active;
                gsap.set(card, {
                    clipPath: on ? SHOWN : HIDE_BOTTOM,
                    autoAlpha: on ? 1 : 0,
                    zIndex: on ? 2 : 0,
                });
                card.setAttribute("aria-hidden", on ? "false" : "true");
                const img = imgOf(index);
                if (img) gsap.set(img, { yPercent: 0, scale: 1 });
            });
        };

        // Mask reveal between two images. Images are never filtered or deformed:
        // only clip-path, a few % of translate and a 1.03 → 1 scale.
        const transition = (from: number, to: number) => {
            reveal?.kill();
            const dir = to > from ? 1 : -1;
            const outgoing = cards[from];
            const incoming = cards[to];
            const inImg = imgOf(to);
            const outImg = imgOf(from);

            cards.forEach((card, index) => {
                if (index === from || index === to) return;
                gsap.set(card, { autoAlpha: 0, zIndex: 0, clipPath: HIDE_BOTTOM });
                card.setAttribute("aria-hidden", "true");
            });
            outgoing?.setAttribute("aria-hidden", "true");
            incoming?.setAttribute("aria-hidden", "false");

            if (reduced || !outgoing || !incoming) {
                settle(to);
                return;
            }

            gsap.set(outgoing, { zIndex: 1, autoAlpha: 1, clipPath: SHOWN });
            gsap.set(incoming, { zIndex: 2, autoAlpha: 1, clipPath: dir > 0 ? HIDE_BOTTOM : HIDE_TOP });
            if (inImg) gsap.set(inImg, { yPercent: dir * parallax, scale: revealScale });

            reveal = gsap
                .timeline({
                    defaults: { ease: "power3.inOut", duration: revealDuration },
                    onComplete: () => settle(to),
                })
                .to(incoming, { clipPath: SHOWN }, 0)
                .to(inImg, { yPercent: 0, scale: 1, ease: "power2.out", duration: revealDuration * 1.15 }, 0)
                .to(outImg, { yPercent: -dir * parallax * 0.6, ease: "power2.inOut" }, 0)
                .to(outgoing, { autoAlpha: 0.55, duration: revealDuration * 0.9 }, 0);
        };

        const paint = (progress: number) => {
            progressRef.current = progress;
            const position = count < 2 ? 0 : progress * (count - 1);

            // Copy motion is a CSS transition on .is_active — not a per-frame write.
            const nearestIndex = Math.min(count - 1, Math.max(0, Math.round(position)));
            copies.forEach((copy, index) => {
                const on = index === nearestIndex;
                copy.style.zIndex = on ? "2" : "0";
                copy.style.pointerEvents = on ? "auto" : "none";
                copy.setAttribute("aria-hidden", on ? "false" : "true");
            });

            if (nearestIndex !== activeIndexRef.current) {
                const previous = activeIndexRef.current;
                activeIndexRef.current = nearestIndex;
                cards.forEach((card, index) => {
                    card.classList.toggle("is_active", index === nearestIndex);
                });
                copies.forEach((copy, index) => {
                    copy.classList.toggle("is_active", index === nearestIndex);
                });
                transition(previous, nearestIndex);
            }
        };

        const refreshAfterImages = () => {
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

        activeIndexRef.current = 0;
        settle(0);
        paint(0);

        const resetStyles = () => {
            reveal?.kill();
            gsap.set(cards, { clearProps: "clipPath,opacity,visibility,zIndex" });
            medias.forEach((_, index) => {
                const img = imgOf(index);
                if (img) gsap.set(img, { clearProps: "transform" });
            });
        };

        if (count < 2) {
            return resetStyles;
        }

        let wheelLocked = false;
        let wheelUnlockTimer = 0;
        let settleTimer = 0;
        let watchdogTimer = 0;
        let programmaticScroll = false;
        let wheelAccum = 0;
        let wheelAccumTimer = 0;

        const lockWheel = (ms: number) => {
            wheelLocked = true;
            window.clearTimeout(wheelUnlockTimer);
            wheelUnlockTimer = window.setTimeout(() => {
                wheelLocked = false;
            }, ms);
        };

        // Inclusive bounds — ST's isActive flips false when resting exactly on start/end,
        // which let wheel notches leak to Lenis and bounce back to the same card.
        const isInPin = () => {
            const trigger = triggerRef.current;
            if (!trigger) return false;
            const sc = trigger.scroll();
            return sc >= trigger.start - 0.5 && sc <= trigger.end + 0.5;
        };

        const scrollToIndex = (index: number, force = false, retry = false) => {
            const trigger = triggerRef.current;
            if (!trigger || count < 2) return;

            const next = Math.min(count - 1, Math.max(0, index));
            const currentPos = trigger.progress * (count - 1);
            if (!force && Math.abs(currentPos - next) < 0.015) return;

            // Edge cards rest 1px inside the pin range so the pin never flaps at the boundary
            const span = trigger.end - trigger.start;
            const raw = trigger.start + (span * next) / (count - 1);
            const target = next === 0 ? raw + 1 : next === count - 1 ? raw - 1 : raw;
            const duration = reduced ? 0.01 : SOLUTIONS_STACK_CONFIG.snapDuration;

            programmaticScroll = true;
            wheelAccum = 0;
            lockWheel(reduced ? 40 : SOLUTIONS_STACK_CONFIG.wheelLockMs);

            const done = () => {
                window.clearTimeout(watchdogTimer);
                programmaticScroll = false;
                wheelLocked = false;
                window.clearTimeout(wheelUnlockTimer);
                // Land exactly on the card — never rest mid-stack
                paint(next / (count - 1));
            };

            // If anything interrupts the Lenis tween (a leaked wheel/touch event replaces
            // Lenis' animation and onComplete never fires) the flags would stay stuck and
            // the stack would rest between two cards. Watchdog: finish the intended step
            // once, then fall back to the nearest card.
            window.clearTimeout(watchdogTimer);
            watchdogTimer = window.setTimeout(() => {
                if (!programmaticScroll) return;
                programmaticScroll = false;
                wheelLocked = false;
                window.clearTimeout(wheelUnlockTimer);
                const pos = trigger.progress * (count - 1);
                if (Math.abs(pos - next) < 0.015) {
                    paint(next / (count - 1));
                    return;
                }
                if (!retry) {
                    scrollToIndex(next, true, true);
                    return;
                }
                snapToNearest();
            }, duration * 1000 + 400);

            // Always go through Lenis — native smooth scroll fights it (lag + mid-card stops)
            const scroller = lenis ?? getLenis();
            if (scroller) {
                scroller.scrollTo(target, {
                    duration,
                    easing: snapEase,
                    onComplete: done,
                });
                return;
            }

            window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
            window.setTimeout(done, duration * 1000);
        };

        const snapToNearest = () => {
            const trigger = triggerRef.current;
            if (!trigger || !isInPin() || count < 2 || wheelLocked || programmaticScroll) return;
            const position = trigger.progress * (count - 1);
            const nearest = Math.round(position);
            if (Math.abs(position - nearest) < 0.015) return;
            scrollToIndex(nearest);
        };

        const trigger = ScrollTrigger.create({
            trigger: root,
            start: () => `top ${Math.max(96, (window.innerHeight + 96 - root.offsetHeight) / 2)}px`,
            end: () =>
                `+=${(count - 1) * window.innerHeight * SOLUTIONS_STACK_CONFIG.scrollPerSlideVh}`,
            pin: true,
            pinSpacing: true,
            // Immediate scrub — lagged scrub + Lenis = sticky start
            scrub: true,
            anticipatePin: 0,
            invalidateOnRefresh: true,
            onToggle: (self) => {
                if (!self.isActive) {
                    // Leaving (or boundary flap mid-tween): don't drop an in-flight step
                    if (programmaticScroll) return;
                    wheelLocked = false;
                    window.clearTimeout(wheelUnlockTimer);
                    window.clearTimeout(settleTimer);
                    return;
                }
                if (reduced || programmaticScroll) return;
                // Entering with scroll momentum: always issue a programmatic Lenis scroll to
                // the edge card. This cancels the momentum immediately and absorbs the rest
                // of the gesture, so the first card is always seen fully settled.
                window.clearTimeout(settleTimer);
                const edge = self.direction >= 0 ? 0 : count - 1;
                scrollToIndex(edge, true);
            },
            onUpdate: (self) => {
                paint(self.progress);

                // Inertia / touch fallback — settle on nearest card
                if (reduced || wheelLocked || programmaticScroll) return;
                window.clearTimeout(settleTimer);
                settleTimer = window.setTimeout(snapToNearest, 110);
            },
            onRefresh: () => {
                paint(progressRef.current);
            },
        });

        triggerRef.current = trigger;

        // Firefox reports lines (deltaMode 1), some mice/trackpads report many tiny pixel
        // deltas. Normalize to pixels so no notch is ever dropped.
        const wheelDeltaPx = (event: WheelEvent) => {
            if (event.deltaMode === 1) return event.deltaY * 16;
            if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
            return event.deltaY;
        };

        const consume = (event: WheelEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        // One wheel gesture → exactly one card. Nothing inside the pin may reach Lenis:
        // a single leaked event replaces the settle tween and leaves the stack mid-card.
        const onWheel = (event: WheelEvent) => {
            if (reduced || !isInPin()) return;

            const dy = wheelDeltaPx(event);
            if (dy === 0) return;

            if (wheelLocked) {
                consume(event);
                return;
            }

            const dir = dy > 0 ? 1 : -1;
            const next = activeIndexRef.current + dir;
            if (next < 0 || next > count - 1) {
                // At ends: release page scroll so user can leave the section
                wheelAccum = 0;
                return;
            }

            consume(event);

            // Accumulate sub-notch deltas (trackpads / high-res wheels) into one step
            if (Math.sign(wheelAccum) !== dir) wheelAccum = 0;
            wheelAccum += dy;
            window.clearTimeout(wheelAccumTimer);
            wheelAccumTimer = window.setTimeout(() => {
                wheelAccum = 0;
            }, 160);
            if (Math.abs(wheelAccum) < 12) return;

            wheelAccum = 0;
            window.clearTimeout(settleTimer);
            scrollToIndex(next);
        };

        const onEnter = (event: Event) => {
            const media = event.currentTarget as HTMLElement;
            const index = Number(media.dataset.index);
            // Cards sliding under a resting cursor fire pointerenter — no hover tween mid-step
            if (index !== activeIndexRef.current || reduced || programmaticScroll) return;
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
        // Capture on window so our step runs before Lenis' wheel handler
        window.addEventListener("wheel", onWheel, { passive: false, capture: true });

        const frame = window.requestAnimationFrame(() => {
            refreshAfterImages();
            paint(trigger.progress);
        });

        void Promise.all(imageLoads).then(refreshAfterImages);

        return () => {
            resetStyles();
            window.cancelAnimationFrame(frame);
            window.clearTimeout(wheelUnlockTimer);
            window.clearTimeout(settleTimer);
            window.clearTimeout(watchdogTimer);
            window.clearTimeout(wheelAccumTimer);
            window.removeEventListener("wheel", onWheel, true);
            medias.forEach((media) => {
                media.removeEventListener("pointerenter", onEnter);
                media.removeEventListener("pointerleave", onLeave);
            });
            stack?.removeEventListener("keydown", onKeyDown);
            trigger.kill();
            triggerRef.current = null;
            copies.forEach((copy) => {
                copy.style.zIndex = "";
                copy.style.pointerEvents = "";
            });
            gsap.set(medias, { clearProps: "transform" });
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
                                    className={`solutions_copy${index === 0 ? " is_active" : ""}`}
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
                                    className={`solutions_stack_card${index === 0 ? " is_active" : ""}`}
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
