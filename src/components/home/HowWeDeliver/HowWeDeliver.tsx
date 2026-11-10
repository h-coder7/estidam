import { Fragment, ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getDeliveryContent, headingFromCms } from "@/lib/api/home";
import { Link } from "@/i18n/routing";

import "./_HowWeDeliver.scss";

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

const HowWeDeliver = async () => {
    const locale = await getLocale();
    const t = await getTranslations("howWeDeliver");
    const content = await getDeliveryContent(locale);
    const heading = headingFromCms(content, t("titleStrong"), t("titleMuted"));
    const badge = content?.eyebrow || t("badge");
    const description = content?.description || t("description");
    const cta = content?.cta || t("cta");
    const ctaUrl = content?.ctaUrl || "#";
    const steps = content?.steps.length
        ? content.steps.map((step, index) => {
              const fallback = stepFallbacks[index];
              return {
                  label: step.title || (fallback ? t(fallback.key) : ""),
                  icon: step.icon || fallback?.icon || stepFallbacks[stepFallbacks.length - 1].icon,
              };
          })
        : stepFallbacks.map((step) => ({ label: t(step.key), icon: step.icon }));

    return (
        <section className="how_we_deliver border-top pb-100" id="how-we-deliver">
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
                                        <p className="section-head-description">
                                            {description}
                                        </p>
                                    </Reveal>

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
                                            <img src="/images/logo-estidam.png" alt="Inspire" />
                                        </div>
                                        <ul className="deliver_side_list">
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("estidamItem1")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("estidamItem2")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("estidamItem3")}</span>
                                            </li>
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
                                            <img src="/images/icons/dlv1.png" alt="Engine-icon" className="th-30" />
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
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("inspireItem1")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("inspireItem2")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("inspireItem3")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("inspireItem4")}</span>
                                            </li>
                                        </ul>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="deliver-content mt-5">
                            <div className="deliver_together">
                                <span className="deliver_together_icon" aria-hidden="true">
                                    <i className="fal fa-handshake"></i>
                                </span>
                                <div className="deliver_together_copy">
                                    <span className="deliver_together_label mb-1">{t("togetherLabel")}</span>
                                    <p className="deliver_together_text">{t("togetherText")}</p>
                                </div>
                            </div>
                            <img src="/images/dlv-line.png" alt="" className="line-img" />
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

export default HowWeDeliver;
