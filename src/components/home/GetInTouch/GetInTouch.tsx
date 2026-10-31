import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getContactContent, headingFromCms } from "@/lib/api/home";
import { Link } from "@/i18n/routing";

import "./_GetInTouch.scss";

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
    { strong: "card1TitleStrong", muted: "card1TitleMuted", cta: "card1Cta" },
    { strong: "card2TitleStrong", muted: "card2TitleMuted", cta: "card2Cta" },
    { strong: "card3TitleStrong", muted: "card3TitleMuted", cta: "card3Cta" },
    { strong: "card4TitleStrong", muted: "card4TitleMuted", cta: "card4Cta" },
] as const;

const GetInTouch = async () => {
    const locale = await getLocale();
    const t = await getTranslations("getInTouch");
    const content = await getContactContent(locale);
    const heading = headingFromCms(content, t("titleStrong"), t("titleMuted"));
    const badge = content?.eyebrow || t("badge");
    const description = content?.description || t("description");
    const total = content ? Math.max(cardFallbacks.length, content.paths.length) : cardFallbacks.length;
    const cards = Array.from({ length: total }, (_, index) => {
        const path = content?.paths[index];
        const fallback = cardFallbacks[index];
        const cardHeading = headingFromCms(
            path?.title ? { titleStrong: path.title, titleMuted: "" } : null,
            fallback ? t(fallback.strong) : path?.title || "",
            fallback ? t(fallback.muted) : "",
        );

        return {
            titleStrong: cardHeading.titleStrong,
            titleMuted: cardHeading.titleMuted,
            text: path?.text || t("cardText"),
            cta: path?.cta || (fallback ? t(fallback.cta) : ""),
            ctaUrl: path?.ctaUrl || "#",
        };
    });

    return (
        <section className="get_in_touch" id="get-in-touch">
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

                <div className="get_in_touch_body">
                    <div className="content px-lg-4">
                        <div className="row gx-0">
                            {cards.map((card, index) => (
                                <div className="col-lg-3 col-md-6" key={`${card.titleStrong}-${index}`}>
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="touch_card">
                                            <h3 className="touch_card_title">
                                                <span className="touch_card_title_strong">{card.titleStrong}</span>
                                                {card.titleMuted ? (
                                                    <span className="touch_card_title_muted">{card.titleMuted}</span>
                                                ) : null}
                                            </h3>

                                            <p className="touch_card_text">{card.text}</p>

                                            <CmsLink href={card.ctaUrl} className="butn butn-ghost touch_card_cta">
                                                <span className="touch_card_cta_label">{card.cta}</span>
                                                <img
                                                    src="/images/icons/arrow-bl.svg"
                                                    alt=""
                                                    className="butn-icon"
                                                    aria-hidden="true"
                                                />
                                            </CmsLink>
                                        </article>
                                    </Reveal>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="sec-lines lines-light">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default GetInTouch;
