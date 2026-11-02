"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { EffectCube } from "swiper/modules";
import type { SolutionCubeSlide } from "@/lib/api/home";

import "swiper/css";
import "swiper/css/effect-cube";

const fallbackImage = "/images/solution1.png";

type SolutionsCubeProps = {
    slides?: SolutionCubeSlide[];
};

const SolutionsCube = ({ slides }: SolutionsCubeProps) => {
    const t = useTranslations("solutions");
    const rootRef = useRef<HTMLDivElement>(null);
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
    const active = viewSlides[Math.min(activeIndex, count - 1)] ?? viewSlides[0];

    useEffect(() => {
        const root = rootRef.current;
        if (!root || count < 2) return;

        const sliderEl = root.querySelector(".solutions_cube") as HTMLElement | null;
        if (!sliderEl) return;

        gsap.registerPlugin(ScrollTrigger);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const swiper = new Swiper(sliderEl, {
            modules: [EffectCube],
            direction: "vertical",
            effect: "cube",
            speed: 0,
            allowTouchMove: false,
            resistanceRatio: 0,
            cubeEffect: {
                shadow: false,
                slideShadows: false,
            },
        });

        const paint = (progress: number) => {
            swiper.setProgress(progress, 0);
            swiper.slides.forEach((slide, index) => {
                const card = slide.querySelector<HTMLElement>(".solutions_cube_card");
                if (!card) return;
                const distance = Math.abs(progress * (count - 1) - index);
                card.style.opacity = String(Math.max(0, 1 - distance ** 1.35));
            });

            const nextIndex = Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));
            setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
        };

        const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top 96px",
            end: () => `+=${(count - 1) * window.innerHeight * 0.9}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: reduced
                ? undefined
                : {
                      snapTo: 1 / (count - 1),
                      duration: 0.45,
                      ease: "power2.inOut",
                      delay: 0.06,
                  },
            onUpdate: (self) => {
                paint(self.progress);
            },
        });

        paint(0);

        const frame = window.requestAnimationFrame(() => {
            swiper.update();
            ScrollTrigger.refresh();
        });

        return () => {
            window.cancelAnimationFrame(frame);
            trigger.kill();
            swiper.destroy(true, true);
        };
    }, [count]);

    return (
        <div className="solutions_body border-top px-4" ref={rootRef}>
            <div className="row gx-0 align-items-center">
                <div className="col-lg-5">
                    <div className="solutions_content" key={active?.id || activeIndex}>
                        <p className="solutions_label">{t("itemLabel")}</p>

                        <h3 className="solutions_title">
                            <span className="solutions_title_strong">{active?.titleStrong}</span>
                            {active?.titleMuted ? (
                                <>
                                    {" "}
                                    <span className="solutions_title_muted cr-blue fw-500">
                                        {active.titleMuted}
                                    </span>
                                </>
                            ) : null}
                        </h3>

                        {active?.text ? <p className="solutions_text">{active.text}</p> : null}
                        {active?.highlight ? (
                            <p className="solutions_highlight">{active.highlight}</p>
                        ) : null}
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="solutions_visual">
                        <div className="solutions_cube_stage">
                            <div className="solutions_cube_frame">
                                <div className="swiper solutions_cube" dir="ltr">
                                    <div className="swiper-wrapper">
                                        {viewSlides.map((slide, index) => (
                                            <div className="swiper-slide" key={`${slide.id}-${index}`}>
                                                <div className="solutions_cube_card">
                                                    <img
                                                        src={slide.image || fallbackImage}
                                                        alt={slide.title}
                                                        draggable={false}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolutionsCube;
