"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/components/LenisProvider";
import {
    PRODUCTS_CASCADE_CONFIG as CONFIG,
    type ProductCascadeCard,
} from "./productsCascadeConfig";

const clamp = (x: number, min: number, max: number) =>
    Math.min(max, Math.max(min, x));

const ProductsCascade = () => {
    const t = useTranslations("products");
    const lenis = useLenis();
    const sectionRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLElement[]>([]);
    const ticksRef = useRef<HTMLButtonElement[]>([]);
    const liveRef = useRef<HTMLDivElement>(null);
    const progress = useRef(0);
    const activeIndex = useRef(0);
    const dragging = useRef(false);
    const rafRef = useRef(0);
    const sizeRef = useRef({ cw: 720, ch: 346, perspective: 1600 });

    const N = CONFIG.cards.length;
    const trackVh = Math.max(280, N * CONFIG.scroll.perCardVh);

    const getScrollMetrics = (section: HTMLElement) => {
        const earlyStart =
            window.innerHeight * ((CONFIG.scroll.earlyStartVh ?? 0) / 100);
        const travel = Math.max(
            1,
            section.offsetHeight - window.innerHeight + earlyStart
        );
        const scrolled = clamp(
            earlyStart - section.getBoundingClientRect().top,
            0,
            travel
        );
        return { travel, scrolled, earlyStart };
    };

    const measure = () => {
        const { card } = CONFIG;
        let cw = Math.round(
            Math.min(card.max, Math.max(card.min, window.innerWidth * card.vw))
        );
        let ch = Math.round(cw * card.aspect);
        const maxCH = window.innerHeight * 0.52;
        if (ch > maxCH) {
            ch = Math.round(maxCH);
            cw = Math.round(ch / card.aspect);
        }
        const perspective = Math.max(
            1200,
            Math.min(window.innerWidth, window.innerHeight) * 2.5
        );
        sizeRef.current = { cw, ch, perspective };

        const stage = stageRef.current;
        if (stage) {
            stage.style.setProperty("--pc-cw", `${cw}px`);
            stage.style.setProperty("--pc-ch", `${ch}px`);
            stage.style.perspective = `${perspective}px`;
        }
    };

    const applyCard = (el: HTMLElement, i: number, prog: number) => {
        const { ch } = sizeRef.current;
        const G = CONFIG.geometry;
        const H = ch || 346;
        const p = i - prog;
        let tilt: number;
        let ty: number;
        let tz: number;
        let scale: number;
        let sheen: number;
        let opacity: number;
        let z: number;

        if (p >= 0) {
            // Active / waiting: flat (no rotate), stacked cover
            const a = 1 - Math.exp(-p * G.backDecay);
            tilt = 0;
            ty = H * G.crestY;
            tz = H * (G.crestZ - G.backDepth * a);
            scale = 1 - G.backShrink * a;
            sheen = 0.45;
            opacity = clamp(1 - (p - G.backFade) * 0.5, 0, 1);
            z = 1000 - Math.round(p * 10);
        } else {
            // Scroll exit: fold + drop, fade out behind the next card
            const q = -p;
            const leave = clamp(q, 0, 1);
            tilt = G.frontFold * leave;
            ty = H * (G.crestY + G.frontDrop * q);
            const fwd = Math.sin(leave * Math.PI * 0.5);
            tz = H * (G.crestZ + G.frontFwd * fwd);
            scale = 1 + 0.03 * fwd;
            sheen = 0.45 - 0.25 * leave;
            opacity =
                1 -
                clamp((q - G.fadeStart) / (G.fadeEnd - G.fadeStart), 0, 1);
            z = 200 - Math.round(q * 20);
        }

        el.style.opacity = `${opacity}`;
        el.style.visibility = opacity < 0.03 ? "hidden" : "visible";
        el.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
        el.style.zIndex = `${z}`;
        el.style.setProperty("--sheen", sheen.toFixed(3));
        el.style.transform = `
            translateY(${ty.toFixed(5)}px)
            translateZ(${tz.toFixed(1)}px)
            rotateX(${tilt.toFixed(1)}deg)
            scale(${scale.toFixed(1)})
        `;
    };

    const setActive = (index: number) => {
        if (index === activeIndex.current) return;
        activeIndex.current = index;
        ticksRef.current.forEach((tick, i) => {
            if (!tick) return;
            tick.classList.toggle("is_active", i === index);
            tick.setAttribute("aria-current", i === index ? "true" : "false");
        });
        if (liveRef.current) {
            liveRef.current.textContent = t(CONFIG.cards[index].titleKey);
        }
    };

    const scrollToCard = (index: number, smooth = true) => {
        const section = sectionRef.current;
        if (!section) return;
        const { travel, earlyStart } = getScrollMetrics(section);
        const scrolled = (index / Math.max(1, N - 1)) * travel;
        const top =
            section.getBoundingClientRect().top +
            window.scrollY -
            earlyStart +
            scrolled;

        if (lenis) {
            lenis.scrollTo(top, { immediate: !smooth });
        } else {
            window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
        }
    };

    useEffect(() => {
        measure();

        const section = sectionRef.current;
        if (!section) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const tick = () => {
            if (!dragging.current) {
                const { travel, scrolled } = getScrollMetrics(section);
                const target = (scrolled / travel) * (N - 1);
                const easing = reduceMotion ? 1 : CONFIG.ease;
                progress.current += (target - progress.current) * easing;
                if (Math.abs(target - progress.current) < 0.0005) {
                    progress.current = target;
                }
            }

            cardsRef.current.forEach((el, i) => {
                if (el) applyCard(el, i, progress.current);
            });

            setActive(clamp(Math.round(progress.current), 0, N - 1));
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        const onResize = () => measure();
        window.addEventListener("resize", onResize);

        const onKey = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLElement &&
                (e.target.tagName === "INPUT" ||
                    e.target.tagName === "TEXTAREA" ||
                    e.target.isContentEditable)
            ) {
                return;
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                scrollToCard(clamp(activeIndex.current + 1, 0, N - 1));
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                scrollToCard(clamp(activeIndex.current - 1, 0, N - 1));
            }
        };
        window.addEventListener("keydown", onKey);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("keydown", onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lenis, N, t]);

    const onRailPointer = (clientY: number) => {
        const section = sectionRef.current;
        const rail = section?.querySelector(".products_rail_track") as HTMLElement | null;
        if (!section || !rail) return;
        const rect = rail.getBoundingClientRect();
        const ratio = clamp((clientY - rect.top) / rect.height, 0, 1);
        const { travel, earlyStart } = getScrollMetrics(section);
        const scrolled = ratio * travel;
        const top =
            section.getBoundingClientRect().top +
            window.scrollY -
            earlyStart +
            scrolled;
        if (lenis) {
            lenis.scrollTo(top, { immediate: true });
        } else {
            window.scrollTo({ top, behavior: "auto" });
        }
        progress.current = ratio * (N - 1);
    };

    const startDrag = (e: React.PointerEvent) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        onRailPointer(e.clientY);
    };

    const moveDrag = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        onRailPointer(e.clientY);
    };

    const endDrag = (e: React.PointerEvent) => {
        dragging.current = false;
        try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
            /* noop */
        }
    };

    return (
        <div
            className="products_cascade"
            ref={sectionRef}
            style={{ height: `${trackVh}vh` }}
            aria-roledescription="carousel"
            aria-label={t("badge")}
        >
            <div className="products_cascade_sticky">
                <div className="products_stage" ref={stageRef}>
                    <div className="products_deck">
                        {CONFIG.cards.map((card, index) => (
                            <article
                                key={card.id}
                                className="products_card"
                                ref={(el) => {
                                    if (el) cardsRef.current[index] = el;
                                }}
                                aria-hidden={index !== 0}
                            >
                                <ProductCardFace
                                    card={card}
                                    t={t as unknown as (key: string) => string}
                                />
                            </article>
                        ))}
                    </div>
                </div>

                <nav className="products_rail" aria-label={t("railLabel")}>
                    <div
                        className="products_rail_track"
                        onPointerDown={startDrag}
                        onPointerMove={moveDrag}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                    >
                        <span className="products_rail_line" aria-hidden="true"></span>
                        {CONFIG.cards.map((card, index) => (
                            <button
                                key={card.id}
                                type="button"
                                className={`products_rail_tick${index === 0 ? " is_active" : ""}`}
                                ref={(el) => {
                                    if (el) ticksRef.current[index] = el;
                                }}
                                aria-label={`${String(index + 1).padStart(2, "0")} — ${t(card.titleKey)}`}
                                aria-current={index === 0 ? "true" : "false"}
                                onClick={() => scrollToCard(index)}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="visually-hidden" aria-live="polite" ref={liveRef}>
                    {t(CONFIG.cards[0].titleKey)}
                </div>
            </div>
        </div>
    );
};

type FaceProps = {
    card: ProductCascadeCard;
    t: (key: string) => string;
};

const ProductCardFace = ({ card, t }: FaceProps) => {
    return (
        <div className="products_card_inner">
            <div className="products_card_media">
                <img src={card.img} alt="" className="products_card_img" />
            </div>

            <div className="products_card_body">
                <div className="products_card_head">
                    <div className="products_card_head_main">
                        <span
                            className={`products_card_status is_${card.statusTone}`}
                        >
                            <i></i>
                            {t(card.statusKey)}
                        </span>

                        <div className="products_card_title_row">
                            <div>
                                <h3 className="products_card_title">{t(card.titleKey)}</h3>
                                <p className="products_card_tagline">{t(card.taglineKey)}</p>
                            </div>

                            <div className="products_card_logo" aria-hidden="true">
                                <img src={card.logo} alt="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="products_card_meta">
                    <div className="products_card_meta_item">
                        <span className="products_card_meta_label">
                            {t(card.problemLabelKey)}
                        </span>
                        <p className="products_card_meta_text">{t(card.problemKey)}</p>
                    </div>
                    <div className="products_card_meta_item">
                        <span className="products_card_meta_label">
                            {t(card.usersLabelKey)}
                        </span>
                        <p className="products_card_meta_text">{t(card.usersKey)}</p>
                    </div>
                </div>
            </div>

            <span className="products_card_sheen" aria-hidden="true"></span>
        </div>
    );
};

export default ProductsCascade;
