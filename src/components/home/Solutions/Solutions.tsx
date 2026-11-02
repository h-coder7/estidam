import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getSolutionCubeSlides, getSolutionsContent, headingFromCms } from "@/lib/api/home";
import { Link } from "@/i18n/routing";
import SolutionsCube from "./SolutionsCube";

import "./_Solutions.scss";

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

const Solutions = async () => {
    const locale = await getLocale();
    const t = await getTranslations("solutions");
    const content = await getSolutionsContent(locale);
    const cubeSlides = await getSolutionCubeSlides(locale);
    const heading = headingFromCms(content, t("titleStrong"), t("titleMuted"));
    const badge = content?.eyebrow || t("badge");
    const description = content?.description || t("description");
    const cta = content?.cta || "";
    const ctaUrl = content?.ctaUrl || "#";

    return (
        <section className="solutions border-top" id="solutions">
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
                </div>

                <SolutionsCube slides={cubeSlides} />
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
            
        </section>
    );
};

export default Solutions;
