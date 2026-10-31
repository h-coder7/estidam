import { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getAboutLogosContent } from "@/lib/api/about";
import { Link } from "@/i18n/routing";

import "./_AboutLogos.scss";

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

const logos = [
    { src: "/images/logos/8.png", name: "Railway" },
    { src: "/images/logos/6.png", name: "Wordsmyth" },
    { src: "/images/logos/4.png", name: "granola" },
    { src: "/images/logos/2.png", name: "parallel" },
    { src: "/images/logos/7.png", name: "taskrabbit" },
    { src: "/images/logos/5.png", name: "Modal" },
    { src: "/images/logos/3.png", name: "turbopuffer" },
    { src: "/images/logos/1.png", name: "Listen" },
] as const;

const AboutLogos = async () => {
    const locale = await getLocale();
    const content = await getAboutLogosContent(locale);
    const ctaUrl = content?.ctaUrl || "#";

    return (
        <section className="about_logos" id="about-logos">
            <div className="container">
                {/* {content ? (
                    <div className="section-head">
                        <Reveal animation="fade-up" trigger="load">
                            {content.eyebrow ? (
                                <span className="section-head-badge">{content.eyebrow}</span>
                            ) : null}
                        </Reveal>

                        <div className="row gx-0 justify-content-between align-items-center">
                            <div className="col-lg-7">
                                <Reveal animation="fade-up" trigger="load">
                                    <h2 className="section-head-title fsz-40 fw-600 lh-2 mb-0">
                                        {content.titleStrong ? (
                                            <span className="section-head-title-strong">{content.titleStrong}</span>
                                        ) : null}
                                        {content.titleMuted ? (
                                            <>
                                                {content.titleStrong ? <br /> : null}
                                                <span className="about_logos_title_muted">{content.titleMuted}</span>
                                            </>
                                        ) : null}
                                    </h2>
                                </Reveal>
                            </div>

                            <div className="col-lg-4">
                                <Reveal animation="fade-up" trigger="load">
                                    {content.description ? (
                                        <p className="section-head-description mb-0">{content.description}</p>
                                    ) : null}
                                </Reveal>

                                {content.cta ? (
                                    <Reveal animation="fade-up" trigger="load">
                                        <CmsLink href={ctaUrl} className="butn butn-outline mt-4">
                                            <span>{content.cta}</span>
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
                ) : null} */}

                <div className="about_logos_grid row g-0">
                    {logos.map((logo) => (
                        <div key={logo.src} className="col-6 col-lg-3">
                            <Reveal className="h-100" animation="fade-up" trigger="load">
                                <a href="#0" className="about_logo d-flex align-items-center justify-content-center h-100">
                                    <img src={logo.src} alt={logo.name} />
                                    <span className="about_logo_arrow" aria-hidden="true">
                                        <i className="fal fa-arrow-right-long"></i>
                                    </span>
                                </a>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default AboutLogos;
