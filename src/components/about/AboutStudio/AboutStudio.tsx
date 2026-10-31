import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getAboutStudioContent } from "@/lib/api/about";
import { headingFromCms } from "@/lib/api/home";
import { Link } from "@/i18n/routing";

import "./_AboutStudio.scss";

function CmsLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
    if (/^https?:\/\//i.test(href) || href.startsWith("#")) {
        return (
            <a href={href} className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}

const disciplines = [
    { key: "discipline1", tone: "is_ops" },
    { key: "discipline2", tone: "is_data" },
    { key: "discipline3", tone: "is_ux" },
    { key: "discipline4", tone: "is_tech" },
] as const;

const topicRows = [
    ["topic1"],
    ["topic2"],
    ["topic3", "topic4"],
    ["topic5"],
    ["topic6"],
    ["topic7"],
] as const;

const AboutStudio = async () => {
    const locale = await getLocale();
    const t = await getTranslations("aboutPage.studio");
    const studio = await getAboutStudioContent(locale);
    const heading = headingFromCms(studio, t("titleStrong"), t("titleMuted"));
    const badge = studio?.eyebrow || t("badge");
    const description = studio?.description || t("description");
    const cta = studio?.cta || t("cta");
    const ctaUrl = studio?.ctaUrl || "#get-in-touch";

    const steps = [
        { number: "01", title: "step1Title", text: "step1Text" },
        { number: "02", title: "step2Title", text: "step2Text" },
        { number: "03", title: "step3Title", text: "step3Text" },
        { number: "04", title: "step4Title", text: "step4Text" },
    ].map((step, index) => {
        const point = studio?.points[index];
        const fallback = { title: t(step.title), text: t(step.text) };
        if (!point) return { number: step.number, ...fallback };

        return {
            number: step.number,
            title: point.title || fallback.title,
            text: point.title ? point.text : point.text || fallback.text,
        };
    });

    return (
        <section className="about_studio" id="solutions-studio">
            <div className="container">
                <div className="bg-white">
                    <div className="content pb-100 px-lg-4">
                        <div className="section-head">
                            <Reveal animation="fade-up" trigger="load">
                                <span className="section-head-badge">{badge}</span>
                            </Reveal>

                            <div className="row gx-0 justify-content-between align-items-center">
                                <div className="col-lg-7">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h2 className="section-head-title fsz-40 fw-600 lh-2 mb-0">
                                            {heading.titleStrong ? (
                                                <span className="section-head-title-strong">{heading.titleStrong}</span>
                                            ) : null}
                                            {heading.titleMuted ? (
                                                <>
                                                    {heading.titleStrong ? <br /> : null}
                                                    <span className="about_studio_title_muted">{heading.titleMuted}</span>
                                                </>
                                            ) : null}
                                        </h2>
                                    </Reveal>
                                </div>

                                <div className="col-lg-4">
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="about_studio_description fsz-13 fw-400 mb-0 ps-lg-4">
                                            {description}
                                        </p>
                                    </Reveal>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 align-items-stretch">
                            <div className="col-lg-4">
                                <Reveal className="h-100" animation="fade-up" trigger="load">
                                    <article className="about_studio_steps_card h-100">
                                        <span className="about_studio_kicker fsz-13 fw-500">
                                            {t("stepsLabel")}
                                        </span>

                                        <ol className="about_studio_steps">
                                            {steps.map((step) => (
                                                <li key={step.number}>
                                                    <span className="about_studio_step_num fsz-12 fw-500">
                                                        {step.number}
                                                    </span>
                                                    <div className="about_studio_step_copy">
                                                        <h3 className="about_studio_step_title fsz-18 mb-0">
                                                            {step.title}
                                                        </h3>
                                                        {step.text ? (
                                                            <p className="about_studio_step_text fsz-14 fw-400 mb-0">
                                                                {step.text}
                                                            </p>
                                                        ) : null}
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
                                                    <div className="about_studio_venn">
                                                        <div className="about_studio_venn_fills" aria-hidden="true">
                                                            {disciplines.map((item) => (
                                                                <span key={item.key} className={item.tone} />
                                                            ))}
                                                        </div>
                                                        <div className="about_studio_venn_strokes" aria-hidden="true">
                                                            {disciplines.map((item) => (
                                                                <span key={item.key} className={item.tone} />
                                                            ))}
                                                        </div>
                                                        <div className="about_studio_venn_labels">
                                                            {disciplines.map((item) => (
                                                                <span key={item.key} className="fsz-12 fw-500">
                                                                    {t(item.key)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Reveal>

                                    <div className="row g-3 flex-grow-1">
                                        <div className="col-lg-7">
                                            <Reveal className="h-100" animation="fade-up" trigger="load">
                                                <article className="about_studio_work h-100">
                                                    <span className="about_studio_kicker is_muted fsz-13 fw-600">
                                                        {t("workLabel")}
                                                    </span>
                                                    <div className="about_studio_topics">
                                                        {topicRows.map((row) => (
                                                            <div key={row[0]} className="about_studio_topics_row">
                                                                {row.map((topic) => (
                                                                    <span key={topic} className="">
                                                                        {t(topic)}
                                                                    </span>
                                                                ))}
                                                            </div>
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
                                                    <CmsLink href={ctaUrl} className="butn butn-blue">
                                                        <span>{cta}</span>
                                                        <img
                                                            src="/images/icons/arrow-wh.svg"
                                                            alt=""
                                                            className="butn-icon"
                                                            aria-hidden="true"
                                                        />
                                                    </CmsLink>
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
