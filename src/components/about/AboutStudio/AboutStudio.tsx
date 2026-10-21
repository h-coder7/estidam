import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_AboutStudio.scss";

const steps = [
    { number: "01", title: "step1Title", text: "step1Text" },
    { number: "02", title: "step2Title", text: "step2Text" },
    { number: "03", title: "step3Title", text: "step3Text" },
    { number: "04", title: "step4Title", text: "step4Text" },
] as const;

const disciplines = [
    { key: "discipline1", tech: false },
    { key: "discipline2", tech: false },
    { key: "discipline3", tech: false },
    { key: "discipline4", tech: true },
] as const;

const topics = [
    "topic1",
    "topic2",
    "topic3",
    "topic4",
    "topic5",
    "topic6",
    "topic7",
] as const;

const AboutStudio = async () => {
    const t = await getTranslations("aboutPage.studio");

    return (
        <section className="about_studio" id="solutions-studio">
            <div className="container">
                <div className="bg-white">
                    <div className="content pb-100 px-lg-4">
                        <div className="section-head">
                            <Reveal animation="fade-up" trigger="load">
                                <span className="section-head-badge">{t("badge")}</span>
                            </Reveal>

                            <div className="row gx-0 justify-content-between align-items-center">
                                <div className="col-lg-7">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h2 className="section-head-title fsz-40 fw-600 lh-2 mb-0">
                                            <span className="section-head-title-strong">
                                                {t("titleStrong")}
                                            </span>
                                            <br />
                                            <span className="about_studio_title_muted">
                                                {t("titleMuted")}
                                            </span>
                                        </h2>
                                    </Reveal>
                                </div>

                                <div className="col-lg-4">
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="about_studio_description fsz-13 fw-400 mb-0 ps-lg-4">
                                            {t("description")}
                                        </p>
                                    </Reveal>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 align-items-stretch">
                            <div className="col-lg-4">
                                <Reveal className="h-100" animation="fade-up" trigger="load">
                                    <article className="about_studio_steps_card h-100">
                                        <span className="about_studio_kicker fsz-11 fw-600">
                                            {t("stepsLabel")}
                                        </span>

                                        <ol className="about_studio_steps">
                                            {steps.map((step) => (
                                                <li key={step.number}>
                                                    <span className="about_studio_step_num fsz-11 fw-600">
                                                        {step.number}
                                                    </span>
                                                    <div>
                                                        <h3 className="about_studio_step_title fsz-16 fw-600 mb-1">
                                                            {t(step.title)}
                                                        </h3>
                                                        <p className="about_studio_step_text fsz-13 fw-400 mb-0">
                                                            {t(step.text)}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-8">
                                <div className="d-flex flex-column gap-3 h-100">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="about_studio_team">
                                            <div className="row align-items-center justify-content-between g-3">
                                                <div className="col-lg-6">
                                                    <h3 className="about_studio_team_title fsz-18 fw-600 mb-2">
                                                        {t("teamTitle")}
                                                    </h3>
                                                    <p className="about_studio_team_text fsz-13 fw-400 mb-0">
                                                        {t("teamText")}
                                                    </p>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="about_studio_venn" aria-hidden="true">
                                                        {disciplines.map((item) => (
                                                            <span
                                                                key={item.key}
                                                                className={`fsz-12 fw-500${item.tech ? " is_tech" : ""}`}
                                                            >
                                                                {t(item.key)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Reveal>

                                    <div className="row g-3 flex-grow-1">
                                        <div className="col-lg-7">
                                            <Reveal className="h-100" animation="fade-up" trigger="load">
                                                <article className="about_studio_work h-100">
                                                    <span className="about_studio_kicker is_muted fsz-11 fw-600">
                                                        {t("workLabel")}
                                                    </span>
                                                    <div className="about_studio_topics">
                                                        {topics.map((topic) => (
                                                            <span key={topic} className="fsz-13 fw-500">
                                                                {t(topic)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </article>
                                            </Reveal>
                                        </div>

                                        <div className="col-lg-5">
                                            <Reveal className="h-100" animation="fade-up" trigger="load">
                                                <article className="about_studio_cta h-100">
                                                    <h3 className="about_studio_cta_title fsz-22 fw-600">
                                                        {t("ctaTitle")}
                                                    </h3>
                                                    <a href="#get-in-touch" className="butn butn-blue">
                                                        <span>{t("cta")}</span>
                                                        <img
                                                            src="/images/icons/arrow-wh.svg"
                                                            alt=""
                                                            className="butn-icon"
                                                            aria-hidden="true"
                                                        />
                                                    </a>
                                                </article>
                                            </Reveal>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

export default AboutStudio;
