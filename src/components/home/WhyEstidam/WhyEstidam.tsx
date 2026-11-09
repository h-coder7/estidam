import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getWhyContent } from "@/lib/api/home";
import { Link } from "@/i18n/routing";

import WhyEstidamBento from "./WhyEstidamBento";

import "./_WhyEstidam.scss";

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

const cards = [
    {
        labelKey: "card1Label",
        titleKey: "card1Title",
        titleRestKey: "card1TitleRest",
        textKey: "card1Text",
    },
    {
        labelKey: "card2Label",
        titleKey: "card2Title",
        titleRestKey: "card2TitleRest",
        textKey: "card2Text",
    },
    {
        labelKey: "card3Label",
        titleKey: "card3Title",
        titleRestKey: "card3TitleRest",
        textKey: "card3Text",
    },
    {
        labelKey: "card4Label",
        titleKey: "card4Title",
        titleRestKey: "card4TitleRest",
        textKey: "card4Text",
    },
] as const;

const WhyEstidam = async () => {
    const locale = await getLocale();
    const t = await getTranslations("whyEstidam");
    const why = await getWhyContent(locale);

    const badge = why?.eyebrow || t("badge");
    const titleStrong = why?.titleStrong || t("titleStrong");
    const titleMuted = why ? why.titleMuted : t("titleMuted");
    const description = why?.description || t("description");
    const cta = why?.cta || t("cta");
    const ctaUrl = why?.ctaUrl || "#";
    const viewCards = why?.cards.length
        ? why.cards.map((card, index) => {
              const fallback = cards[index];

              return {
                  key: `why-card-${index}`,
                  label: fallback ? t(fallback.labelKey) : "",
                  title: card.title || (fallback ? t(fallback.titleKey) : ""),
                  titleRest: card.title ? card.titleRest : fallback ? t(fallback.titleRestKey) : card.titleRest,
                  text: card.text || (fallback ? t(fallback.textKey) : ""),
              };
          })
        : cards.map((card) => ({
              key: card.titleKey,
              label: t(card.labelKey),
              title: t(card.titleKey),
              titleRest: t(card.titleRestKey),
              text: t(card.textKey),
          }));

    return (
        <section className="why_estidam border-bottom" id="why-estidam">
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
                                        <span className="section-head-title-strong">{titleStrong}</span>
                                        {titleMuted ? (
                                            <>
                                                {" "}
                                                <span className="section-head-title-muted cr-blue fw-500">{titleMuted}</span>
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
            </div>

                <WhyEstidamBento cards={viewCards} conceptLabel={t("conceptLabel")} locale={locale} />

            </div>
            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default WhyEstidam;
