import { Fragment, ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getAboutDeliveryContent } from "@/lib/api/about";
import { headingFromCms } from "@/lib/api/home";
import { Link } from "@/i18n/routing";

import "./_AboutDelivery.scss";

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

const stepFallbacks = [
    { key: "step1", icon: "fa-regular fa-bullseye" },
    { key: "step2", icon: "fa-regular fa-magnifying-glass" },
    { key: "step3", icon: "fa-regular fa-lightbulb" },
    { key: "step4", icon: "fa-regular fa-code" },
    { key: "step5", icon: "fa-regular fa-rocket" },
    { key: "step6", icon: "fa-regular fa-chart-simple" },
    { key: "step7", icon: "fa-regular fa-arrows-rotate" },
] as const;

const AboutDelivery = async () => {
    const locale = await getLocale();
    const t = await getTranslations("howWeDeliver");
    const content = await getAboutDeliveryContent(locale);
    const heading = headingFromCms(content, t("titleStrong"), t("titleMuted"));
    const badge = content?.eyebrow || t("badge");
    const description = content?.description || t("description");
    const cta = content?.cta || "";
    const ctaUrl = content?.ctaUrl || "#";
    const estidamItems = content?.estidam.length
        ? content.estidam
        : [t("estidamItem1"), t("estidamItem2"), t("estidamItem3")];
    const inspireItems = content?.inspire.length
        ? content.inspire
        : [t("inspireItem1"), t("inspireItem2"), t("inspireItem3"), t("inspireItem4")];
    const togetherLabel = content?.togetherLabel || t("togetherLabel");
    const togetherText = content?.together || t("togetherText");
    const steps = content?.steps.length
        ? content.steps.map((label, index) => {
              const fallback = stepFallbacks[index];
              return {
                  label: label || (fallback ? t(fallback.key) : ""),
                  icon: fallback?.icon ?? stepFallbacks[stepFallbacks.length - 1].icon,
              };
          })
        : stepFallbacks.map((step) => ({ label: t(step.key), icon: step.icon }));

    return (
        <section className="about_delivery border-top pb-100" id="about-delivery">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="section-head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="section-head-badge">{badge}</span>
                        </Reveal>

                        <div className="row gx-0 justify-content-between">
                            <div className="col-lg-6">
                                <div className="section-head-left mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h2 className="section-head-title fsz-40 fw-600 lh-2">
                                            <span className="section-head-title-strong">{heading.titleStrong}</span>
                                            {heading.titleMuted ? (
                                                <>
                                                    <br />
                                                    <span className="section-head-title-muted cr-blue fw-500">
                                                        {heading.titleMuted}
                                                    </span>
                                                </>
                                            ) : null}
                                        </h2>
                                    </Reveal>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="section-head-right mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="section-head-description">{description}</p>
                                    </Reveal>

                                    {cta ? (
                                        <Reveal animation="fade-up" trigger="load">
                                            <CmsLink href={ctaUrl} className="butn butn-outline">
                                                <span>{cta}</span>
                                                <img
                                                    src="/images/icons/arrow-bl.svg"
                                                    alt=""
                                                    className="butn-icon"
                                                    aria-hidden="true"
                                                />
                                            </CmsLink>
                                        </Reveal>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="deliver_steps">
                            {steps.map((step, index) => (
                                <Fragment key={`${step.label}-${index}`}>
                                    {index > 0 ? <span className="deliver_step_arrow" aria-hidden="true"></span> : null}
                                    <div className="deliver_step">
                                        <div className="deliver_step_icon">
                                            <span className="deliver_step_num">{String(index + 1).padStart(2, "0")}</span>
                                            <i className={step.icon}></i>
                                        </div>
                                        <p className="deliver_step_label">{step.label}</p>
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="deliver_engine">
                            <div className="row align-items-center">
                                <div className="col-lg-4">
                                    <article className="deliver_side_card">
                                        <div className="logo-img">
                                            <img src="/images/logo-estidam.png" alt="Estidam" />
                                        </div>
                                        <ul className="deliver_side_list">
                                            {estidamItems.map((item) => (
                                                <li key={item}>
                                                    <i className="fa-solid fa-check"></i>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                </div>
                                <div className="col-lg-4">
                                    <div className="deliver_engine_visual">
                                        <img
                                            src="/images/deliver-img.png"
                                            alt={t("engineTitle")}
                                            className="deliver_engine_img"
                                        />
                                        <div className="deliver_engine_core">
                                            <img src="/images/icons/dlv1.png" alt="" className="th-30" />
                                            <span>{t("engineTitle")}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <article className="deliver_side_card inspire-card">
                                        <div className="logo-img">
                                            <img src="/images/logo-inspire.png" alt="Inspire" />
                                        </div>
                                        <ul className="deliver_side_list">
                                            {inspireItems.map((item) => (
                                                <li key={item}>
                                                    <i className="fa-solid fa-check"></i>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default AboutDelivery;
