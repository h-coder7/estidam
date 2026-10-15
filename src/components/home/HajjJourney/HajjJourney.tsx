"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/animations/Reveal";

import "./_HajjJourney.scss";

const phases = [
    {
        id: "before",
        number: "01",
        phaseKey: "phase1Label",
        titleKey: "phase1Title",
        textKey: "phase1Text",
        pointsKey: "phase1Points",
        image: "/images/journey-1.png",
    },
    {
        id: "during",
        number: "02",
        phaseKey: "phase2Label",
        titleKey: "phase2Title",
        textKey: "phase2Text",
        pointsKey: "phase2Points",
        image: "/images/journey-1.png",
    },
    {
        id: "after",
        number: "03",
        phaseKey: "phase3Label",
        titleKey: "phase3Title",
        textKey: "phase3Text",
        pointsKey: "phase3Points",
        image: "/images/journey-1.png",
    },
] as const;

const HajjJourney = () => {
    const t = useTranslations("hajjJourney");
    const [activeId, setActiveId] = useState<(typeof phases)[number]["id"]>("before");
    const activePhase = phases.find((phase) => phase.id === activeId) ?? phases[0];
    const points = t.raw(activePhase.pointsKey) as string[];

    return (
        <section className="hajj_journey" id="hajj-journey">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="section-head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="section-head-badge">{t("badge")}</span>
                        </Reveal>

                        <div className="row gx-0 justify-content-between">
                            <div className="col-lg-6">
                                <div className="section-head-left mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h2 className="section-head-title">
                                            <span className="section-head-title-strong">
                                                {t("titleStrong")}
                                            </span>{" "}
                                            <span className="section-head-title-muted">
                                                {t("titleMuted")}
                                            </span>
                                        </h2>
                                    </Reveal>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="section-head-right mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="section-head-description">
                                            {t("description")}
                                        </p>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <a href="#" className="butn butn-outline">
                                            <span>{t("cta")}</span>
                                            <span className="butn-icon" aria-hidden="true"></span>
                                        </a>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="journey_body border-top py-4">
                <div className="container">
                    <div className="row gx-0 align-items-center">
                        <div className="col-lg-3">
                            <Reveal animation="fade-up" trigger="load">
                                <nav className="journey_nav" aria-label={t("badge")}>
                                    {phases.map((phase) => {
                                        const isActive = phase.id === activeId;

                                        return (
                                            <button
                                                key={phase.id}
                                                type="button"
                                                className={`journey_nav_item${isActive ? " is_active" : ""}`}
                                                onClick={() => setActiveId(phase.id)}
                                                aria-pressed={isActive}
                                            >
                                                <span className="journey_nav_number">{phase.number}</span>
                                                <span className="journey_nav_copy">
                                                    <span className="journey_nav_phase">
                                                        {t(phase.phaseKey)}
                                                    </span>
                                                    <span className="journey_nav_title">
                                                        {t(phase.titleKey)}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </Reveal>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="journey_detail" key={activePhase.id}>
                                    <p className="journey_detail_phase">{t(activePhase.phaseKey)}</p>
                                    <h3 className="journey_detail_title">{t(activePhase.titleKey)}</h3>
                                    <p className="journey_detail_text">{t(activePhase.textKey)}</p>

                                    <ul className="journey_points row">
                                        {points.map((point) => (
                                            <li key={point} className="col-md-6">
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-4">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="journey_visual" key={activePhase.id}>
                                    <img
                                        src={activePhase.image}
                                        alt={t(activePhase.titleKey)}
                                        className="journey_visual_img"
                                    />
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default HajjJourney;
