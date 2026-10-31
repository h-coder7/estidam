import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getOperationsContent, headingFromCms } from "@/lib/api/home";
import { Link } from "@/i18n/routing";

import "./_Operations.scss";

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

const outcomeKeys = ["outcome1", "outcome2", "outcome3", "outcome4"] as const;

const Operations = async () => {
    const locale = await getLocale();
    const t = await getTranslations("operations");
    const content = await getOperationsContent(locale);
    const heading = headingFromCms(content, t("titleStrong"), t("titleMuted"));
    const badge = content?.eyebrow || t("badge");
    const description = content?.description || t("description");
    const outcomes = outcomeKeys.map((key, index) => content?.outcomes[index] || t(key));
    const cta = content?.cta || "";
    const ctaUrl = content?.ctaUrl || "#";

    return (
        <section className="operations" id="operations">
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
                                        <p className={`section-head-description${cta ? "" : " mb-0"}`}>
                                            {description}
                                        </p>
                                    </Reveal>

                                    {cta ? (
                                        <Reveal animation="fade-up" trigger="load">
                                            <CmsLink href={ctaUrl} className="butn border border-wh-2 text-white">
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
                </div>

                <div className="operations_body px-lg-4">
                    <div className="d-lg-flex gap-4">
                        <Reveal animation="fade-up" trigger="load">
                            <div className="operations_card">
                                <img
                                    src="/images/operation2.png"
                                    alt={t("card1Alt")}
                                    className="operations_img"
                                />
                            </div>
                        </Reveal>
                        <Reveal animation="fade-up" trigger="load">
                            <div className="operations_card">
                                <img
                                    src="/images/operation1.png"
                                    alt={t("card2Alt")}
                                    className="operations_img"
                                />
                            </div>
                        </Reveal>
                    </div>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="operations_outcome">
                            <span className="operations_outcome_label">{t("outcomeLabel")}</span>

                            <div className="operations_outcome_flow">
                                {outcomes.map((outcome, index) => (
                                    <div className="operations_outcome_item_wrap" key={`${outcome}-${index}`}>
                                        {index > 0 ? (
                                            <span className="operations_outcome_arrow" aria-hidden="true">
                                                ···›
                                            </span>
                                        ) : null}
                                        <span className="operations_outcome_item">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="sec-lines lines-light">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default Operations;
