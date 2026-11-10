import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getEcosystemContent, headingFromCms } from "@/lib/api/home";
import { Link } from "@/i18n/routing";

import "./_GrowthEcosystem.scss";

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

const cardFallbacks = [
    { title: "card1Title", text: "card1Text", cta: "card1Cta", icon: "fa-regular fa-sprout" },
    { title: "card2Title", text: "card2Text", cta: "card2Cta", icon: "fa-regular fa-diagram-project" },
    { title: "card3Title", text: "card3Text", cta: "card3Cta", icon: "fa-regular fa-handshake" },
] as const;

const GrowthEcosystem = async () => {
    const locale = await getLocale();
    const t = await getTranslations("growthEcosystem");
    const content = await getEcosystemContent(locale);
    const heading = headingFromCms(content, t("titleStrong"), t("titleMuted"));
    const badge = content?.eyebrow || t("badge");
    const description = content?.description || t("description");
    const cards = content?.cards.length
        ? content.cards.map((card, index) => {
              const fallback = cardFallbacks[index];
              return {
                  title: card.title || (fallback ? t(fallback.title) : ""),
                  text: card.text || (fallback ? t(fallback.text) : ""),
                  cta: card.cta || (fallback ? t(fallback.cta) : ""),
                  ctaUrl: "/contact",
                  icon: card.icon || fallback?.icon || cardFallbacks[0].icon,
              };
          })
        : cardFallbacks.map((card) => ({
              title: t(card.title),
              text: t(card.text),
              cta: t(card.cta),
              ctaUrl: "/contact",
              icon: card.icon,
          }));

    return (
        <section className="growth_ecosystem border-top" id="growth-ecosystem">
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
                                        <p className="section-head-description mb-0">
                                            {description}
                                        </p>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ecosystem_grid row gx-0 border-top">
                    {cards.map((card) => (
                        <div className="col-lg-4" key={card.title}>
                            <Reveal animation="fade-up" trigger="load">
                                <article className="ecosystem_card">
                                    <div className="ecosystem_card_icon">
                                        <i className={card.icon} aria-hidden="true" />
                                    </div>

                                    <h3 className="ecosystem_card_title">{card.title}</h3>

                                    <p className="ecosystem_card_text">{card.text}</p>

                                    <CmsLink href={card.ctaUrl} className="ecosystem_card_link">
                                        <span>{card.cta}</span>
                                        <img
                                            src="/images/icons/arrow-bl.svg"
                                            alt=""
                                            className="ecosystem_card_arrow"
                                            aria-hidden="true"
                                        />
                                    </CmsLink>
                                </article>
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

export default GrowthEcosystem;
