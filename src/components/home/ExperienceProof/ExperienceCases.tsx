"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import Swiper from "swiper";
import { Autoplay, EffectCreative, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-creative";
import "swiper/css/pagination";

const cases = [
    {
        id: "case-1",
        eyebrowKey: "case1Eyebrow",
        titleKey: "case1Title",
        proofKey: "case1Proof",
        challengeKey: "case1Challenge",
        solutionKey: "case1Solution",
        roleKey: "case1Role",
        logo: "/images/exp-logo1.png",
    },
    {
        id: "case-2",
        eyebrowKey: "case2Eyebrow",
        titleKey: "case2Title",
        proofKey: "case2Proof",
        challengeKey: "case2Challenge",
        solutionKey: "case2Solution",
        roleKey: "case2Role",
        logo: "/images/exp-logo2.png",
    },
    {
        id: "case-3",
        eyebrowKey: "case3Eyebrow",
        titleKey: "case3Title",
        proofKey: "case3Proof",
        challengeKey: "case3Challenge",
        solutionKey: "case3Solution",
        roleKey: "case3Role",
        logo: "/images/exp-logo3.png",
    },
] as const;

const ExperienceCases = () => {
    const t = useTranslations("experienceProof");
    const locale = useLocale();
    const isRtl = locale === "ar";
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const sliderEl = root.querySelector(".proof_stack") as HTMLElement | null;
        const dotsEl = root.querySelector(".proof_card_dots") as HTMLElement | null;
        if (!sliderEl || !dotsEl) return;

        // =========================================================
        // Swiper init
        // Edit options below freely
        // =========================================================
        const stackX = isRtl ? 28 : -28;

        const swiper = new Swiper(sliderEl, {
            modules: [Autoplay, EffectCreative, Pagination],
            direction: "horizontal",
            slidesPerView: 1,
            speed: 1000,
            grabCursor: true,
            watchSlidesProgress: true,
            loop: false,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            // effect
            effect: "creative",
            creativeEffect: {
                limitProgress: 2,
                prev: {
                    translate: [0, 48, -1],
                    scale: 0.98,
                    opacity: 0,
                },
                next: {
                    translate: [stackX, -28, -1],
                    scale: 0.97,
                    opacity: 0.92,
                },
            },
            // bullets
            pagination: {
                el: dotsEl,
                clickable: true,
                bulletClass: "proof_card_dot",
                bulletActiveClass: "is_active",
            },
        });

        return () => {
            swiper.destroy(true, true);
        };
    }, [isRtl]);

    return (
        <div className="proof_cases" ref={rootRef}>
            <div className="proof_stack_wrap">
                {/* bullets */}
                <div className="proof_card_dots" aria-label={t("casesLabel")}></div>

                {/* swiper */}
                <div className="swiper proof_stack" dir={isRtl ? "rtl" : "ltr"}>
                    <div className="swiper-wrapper">
                        {cases.map((item) => (
                            <div className="swiper-slide" key={item.id}>
                                <article className="proof_card">
                                    <div className="row align-items-start justify-content-between proof_card_top">
                                        <div className="col">
                                            <p className="proof_card_eyebrow mb-0">{t(item.eyebrowKey)}</p>
                                        </div>
                                        <div className="col-auto">
                                            <span className="proof_card_dots_spacer" aria-hidden="true"></span>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-9">
                                            <h3 className="proof_card_title">{t(item.titleKey)}</h3>
                                        </div>
                                    </div>

                                    <div className="row gx-4 gy-4 proof_card_body">
                                        <div className="col-lg-4">
                                            <div className="proof_stat h-100">
                                                <img
                                                    src={item.logo}
                                                    alt=""
                                                    className="proof_stat_logo"
                                                />
                                                <div className="btm-cont">
                                                    <p className="proof_stat_value">{t(item.proofKey)}</p>
                                                    <span className="proof_stat_label">{t("verifiedLabel")}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-8">
                                            <div className="proof_details">
                                                <div className="proof_detail">
                                                    <span className="proof_detail_label">{t("challengeLabel")}</span>
                                                    <p className="proof_detail_text">{t(item.challengeKey)}</p>
                                                </div>
                                                <div className="proof_detail">
                                                    <span className="proof_detail_label">{t("solutionLabel")}</span>
                                                    <p className="proof_detail_text">{t(item.solutionKey)}</p>
                                                </div>
                                                <div className="proof_detail">
                                                    <span className="proof_detail_label">{t("roleLabel")}</span>
                                                    <p className="proof_detail_text">{t(item.roleKey)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <img src="/images/exp-card-bg.png" alt="" className="card-bg" />
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceCases;
