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

const fallbackLogos = [
    { id: "logo-1", src: "/images/logos/8.png", name: "Railway", url: "#" },
    { id: "logo-2", src: "/images/logos/6.png", name: "Wordsmyth", url: "#" },
    { id: "logo-3", src: "/images/logos/4.png", name: "granola", url: "#" },
    { id: "logo-4", src: "/images/logos/2.png", name: "parallel", url: "#" },
    { id: "logo-5", src: "/images/logos/7.png", name: "taskrabbit", url: "#" },
    { id: "logo-6", src: "/images/logos/5.png", name: "Modal", url: "#" },
    { id: "logo-7", src: "/images/logos/3.png", name: "turbopuffer", url: "#" },
    { id: "logo-8", src: "/images/logos/1.png", name: "Listen", url: "#" },
] as const;

const AboutLogos = async () => {
    const locale = await getLocale();
    const content = await getAboutLogosContent(locale);
    const ctaUrl = content?.ctaUrl || "#";
    const logos = content?.logos.length
        ? content.logos.map((logo, index) => ({
              id: logo.id,
              name: logo.name || fallbackLogos[index % fallbackLogos.length].name,
              url: logo.url || "#",
              src: logo.src || fallbackLogos[index % fallbackLogos.length].src,
          }))
        : fallbackLogos.map((logo) => ({ ...logo }));

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
                        <div key={logo.id} className="col-6 col-lg-3">
                            <Reveal className="h-100" animation="fade-up" trigger="load">
                                <a
                                    href={logo.url}
                                    className="about_logo d-flex align-items-center justify-content-center h-100"
                                    target={/^https?:\/\//i.test(logo.url) ? "_blank" : undefined}
                                    rel={/^https?:\/\//i.test(logo.url) ? "noreferrer" : undefined}
                                >
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
