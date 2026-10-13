import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_WhyEstidam.scss";

const cards = [
    {
        titleKey: "card1Title",
        titleRestKey: "card1TitleRest",
        textKey: "card1Text",
        icon: "fa-regular fa-building-columns",
        featured: true,
    },
    {
        titleKey: "card2Title",
        titleRestKey: "card2TitleRest",
        textKey: "card2Text",
        icon: "fa-regular fa-clipboard-list",
        featured: false,
    },
    {
        titleKey: "card3Title",
        titleRestKey: "card3TitleRest",
        textKey: "card3Text",
        icon: "fa-regular fa-microchip",
        featured: false,
    },
    {
        titleKey: "card4Title",
        titleRestKey: "card4TitleRest",
        textKey: "card4Text",
        icon: "fa-regular fa-chart-simple",
        featured: false,
    },
] as const;

const WhyEstidam = async () => {
    const t = await getTranslations("whyEstidam");

    return (
        <section className="why_estidam" id="why-estidam">
            <div className="container">

                <div className="why_head">
                    <div className="why_head_left">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="why_badge">{t("badge")}</span>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <h2 className="why_title">
                                <span className="why_title_strong">{t("titleStrong")}</span>{" "}
                                <span className="why_title_muted">{t("titleMuted")}</span>
                            </h2>
                        </Reveal>
                    </div>

                    <div className="why_head_right">
                        <Reveal animation="fade-up" trigger="load">
                            <p className="why_description">{t("description")}</p>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <a href="#" className="butn butn-outline">
                                <span>{t("cta")}</span>
                                <span className="butn-icon" aria-hidden="true"></span>
                            </a>
                        </Reveal>
                    </div>
                </div>

                <div className="why_grid">
                    {cards.map((card) => (
                        <article
                            key={card.titleKey}
                            className={`why_card${card.featured ? " is_featured" : ""}`}
                        >
                            <Reveal animation="fade-up" trigger="load">
                                <div className="why_card_inner">
                                    <h3 className="why_card_title">
                                        <span>{t(card.titleKey)}</span>
                                        <span className="why_card_title_muted">
                                            {t(card.titleRestKey)}
                                        </span>
                                    </h3>

                                    <div className="why_card_body">
                                        <div className="why_card_icon">
                                            <i className={card.icon}></i>
                                        </div>
                                        <p className="why_card_text">{t(card.textKey)}</p>
                                    </div>
                                </div>
                            </Reveal>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyEstidam;
