import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_AboutJourney.scss";

const phases = [
    {
        id: "before",
        number: "01",
        col: "col-lg-5",
        label: "phase1Label",
        title: "phase1Title",
        text: "phase1Text",
        points: "phase1Points",
    },
    {
        id: "during",
        number: "02",
        col: "col-lg-3",
        label: "phase2Label",
        title: "phase2Title",
        text: "phase2Text",
        points: "phase2Points",
    },
    {
        id: "after",
        number: "03",
        col: "col-lg-4",
        label: "phase3Label",
        title: "phase3Title",
        text: "phase3Text",
        points: "phase3Points",
    },
] as const;

const AboutJourney = async () => {
    const t = await getTranslations("aboutPage.journey");

    return (
        <section className="about_journey" id="hajj-operations-journey">
                <div className="section-head border-bottom border-wh-1">
                    <div className="container">
                        <Reveal animation="fade-up" trigger="load">
                            <div className="about_journey_eyebrow d-inline-flex align-items-center gap-2">
                                <span className="about_journey_index fsz-12 fw-600">{t("index")}</span>
                                <span className="fsz-13 fw-500">{t("badge")}</span>
                            </div>
                        </Reveal>
                        <div className="row gx-0 justify-content-between">
                            <div className="col-lg-8">
                                <Reveal animation="fade-up" trigger="load">
                                    <h2 className="section-head-title fsz-40 fw-600 lh-2 mb-0">
                                        <span className="section-head-title-strong">
                                            {t("titleBefore")}
                                        </span>{" "}
                                        <span className="about_journey_title_muted">
                                            {t("titleMutedStart")}
                                        </span>
                                        <br />
                                        <span className="about_journey_title_muted">
                                            {t("titleMutedRest")}
                                        </span>{" "}
                                        <span className="section-head-title-strong">
                                            {t("titleAfter")}
                                        </span>
                                    </h2>
                                </Reveal>
                            </div>

                            <div className="col-lg-3">
                                <Reveal animation="fade-up" trigger="load">
                                    <p className="about_journey_hint fsz-13 fw-400 mb-0">
                                        {t("hint")}
                                    </p>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="content px-lg-4">
                        <div className="about_journey_body">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="row g-3" id="aboutJourneyTab" role="tablist">
                                    {phases.map((phase, index) => (
                                        <div key={phase.id} className={phase.col}>
                                            <button
                                                className={`nav-link about_journey_stage w-100${index === 0 ? " active" : ""}`}
                                                id={`journey-tab-${phase.id}`}
                                                data-bs-toggle="tab"
                                                data-bs-target={`#journey-pane-${phase.id}`}
                                                type="button"
                                                role="tab"
                                                aria-controls={`journey-pane-${phase.id}`}
                                                aria-selected={index === 0}
                                            >
                                                <span className="about_journey_stage_meta fsz-12 fw-500">
                                                    {phase.number}
                                                    <span aria-hidden="true"> · </span>
                                                    {t(phase.label)}
                                                </span>
                                                <span className="about_journey_stage_title fsz-18 fw-600">
                                                    {t(phase.title)}
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>

                            <div className="about_journey_timeline" aria-hidden="true">
                                <span className="fsz-11 fw-500">{t("timelineStart")}</span>
                                <span className="about_journey_timeline_line" />
                                <span className="fsz-11 fw-500">{t("timelineMid")}</span>
                                <span className="about_journey_timeline_line" />
                                <span className="fsz-11 fw-500">{t("timelineEnd")}</span>
                            </div>

                            <Reveal animation="fade-up" trigger="load">
                                <div className="tab-content" id="aboutJourneyContent">
                                    {phases.map((phase, index) => {
                                        const points = t.raw(phase.points) as string[];

                                        return (
                                            <div
                                                key={phase.id}
                                                className={`tab-pane fade${index === 0 ? " show active" : ""}`}
                                                id={`journey-pane-${phase.id}`}
                                                role="tabpanel"
                                                aria-labelledby={`journey-tab-${phase.id}`}
                                                tabIndex={0}
                                            >
                                                <article className="about_journey_panel">
                                                    <div className="row g-4">
                                                        <div className="col-lg-5">
                                                            <h3 className="about_journey_panel_title fsz-28 fw-600 mb-3">
                                                                {t(phase.title)}
                                                            </h3>
                                                            <p className="about_journey_panel_text fsz-14 fw-400 mb-0">
                                                                {t(phase.text)}
                                                            </p>
                                                        </div>

                                                        <div className="col-lg-7">
                                                            <div className="row g-3">
                                                                {points.map((point) => (
                                                                    <div key={point} className="col-md-6">
                                                                        <div className="about_journey_point fsz-14 fw-500">
                                                                            <span className="about_journey_check">
                                                                                <i
                                                                                    className="fal fa-check"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </span>
                                                                            {point}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>

        </section>
    );
};

export default AboutJourney;
