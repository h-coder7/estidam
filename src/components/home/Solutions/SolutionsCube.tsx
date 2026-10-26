"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { EffectCube } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cube";

const slides = [
    "/images/solution1.png",
    "/images/solution1.png",
    "/images/solution1.png",
];

const SolutionsCube = () => {
    const t = useTranslations("solutions");
    const rootRef = useRef<HTMLDivElement>(null);
    const count = slides.length;

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
                ? false
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
                    <div className="solutions_content">
                        <p className="solutions_label">{t("itemLabel")}</p>

                        <h3 className="solutions_title">
                            <span className="solutions_title_strong">{t("itemTitleStrong")}</span>{" "}
                            <span className="solutions_title_muted cr-blue fw-500">
                                {t("itemTitleMuted")}
                            </span>
                        </h3>

                        <p className="solutions_text">{t("itemText")}</p>
                        <p className="solutions_highlight">{t("itemHighlight")}</p>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="solutions_visual">
                        <div className="solutions_cube_stage">
                            <div className="solutions_cube_frame">
                                <div className="swiper solutions_cube" dir="ltr">
                                <div className="swiper-wrapper">
                                    {slides.slice(0, count).map((src, index) => (
                                        <div className="swiper-slide" key={src + index}>
                                            <div className="solutions_cube_card">
                                                <img src={src} alt="" draggable={false} />
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
