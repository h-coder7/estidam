import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_WhyEstidam.scss";

const cards = [
    {
        titleKey: "card1Title",
        titleRestKey: "card1TitleRest",
        textKey: "card1Text",
        icon: "/images/icons/kabaa.svg",
    },
    {
        titleKey: "card2Title",
        titleRestKey: "card2TitleRest",
        textKey: "card2Text",
        icon: "/images/icons/report.svg",
    },
    {
        titleKey: "card3Title",
        titleRestKey: "card3TitleRest",
        textKey: "card3Text",
        icon: "/images/icons/brand.svg",
    },
    {
        titleKey: "card4Title",
        titleRestKey: "card4TitleRest",
        textKey: "card4Text",
        icon: "/images/icons/chart.svg",
    },
] as const;

const WhyEstidam = async () => {
    const t = await getTranslations("whyEstidam");

    return (
        <section className="why_estidam border-bottom" id="why-estidam">
            <div className="container">

            <div className="content px-lg-4">
                <div className="section-head">
                    
                    <Reveal animation="fade-up" trigger="load">
                        <span className="section-head-badge">{t("badge")}</span>
                    </Reveal>

                    <div className="row gx-0 justify-content-between">
                        <div className="col-lg-6">
                            <div className="section-head-left mt-3">
                                <Reveal animation="fade-up" trigger="load">
                                    <h2 className="section-head-title">
                                        <span className="section-head-title-strong">{t("titleStrong")}</span>{" "}
                                        <span className="section-head-title-muted">{t("titleMuted")}</span>
                                    </h2>
                                </Reveal>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="section-head-right mt-3">
                                <Reveal animation="fade-up" trigger="load">
                                    <p className="section-head-description">{t("description")}</p>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <a href="#" className="butn butn-outline">
                                        <span>{t("cta")}</span>
                                        <img
                                            src="/images/icons/arrow-bl.svg"
                                            alt=""
                                            className="butn-icon"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </Reveal>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

                <div className="why_grid row gx-0">
                    {cards.map((card) => (
                        <div key={card.titleKey} className="col-lg-3 col-md-6">
                            <article className="why_card">
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
                                                <img src={card.icon} alt="" aria-hidden="true" />
                                            </div>
                                            <p className="why_card_text">{t(card.textKey)}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            </article>
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

export default WhyEstidam;
