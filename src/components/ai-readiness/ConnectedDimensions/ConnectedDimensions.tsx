import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ConnectedDimensions.scss";

const ConnectedDimensions = async () => {
    const t = await getTranslations("aiReadinessPage.connectedDimensions");

    const cards = [
        { key: "card1", icon: "fal fa-diagram-project" },
        { key: "card2", icon: "fal fa-database" },
        { key: "card3", icon: "fal fa-plug" },
        { key: "card4", icon: "fal fa-sparkles" },
        { key: "card5", icon: "fal fa-shield" },
        { key: "card6", icon: "fal fa-bullseye" },
    ] as const;

    return (
        <section className="readiness_dimensions border-top border-bottom" id="connected-dimensions">
            <div className="dimensions_head border-bottom">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="dimensions_badge">{t("badge")}</span>
                    </Reveal>

                    <div className="row gx-0 justify-content-between align-items-center">
                        <div className="col-lg-7">
                            <Reveal animation="fade-up" trigger="load">
                                <h2 className="dimensions_title fsz-40 fw-600 lh-2 mb-0">
                                    <span className="dimensions_title_strong">
                                        {t("titleStrong")}
                                    </span>
                                    <span className="dimensions_title_muted cr-blue fw-500">
                                        {t("titleMuted")}
                                    </span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="col-lg-3">
                            <Reveal animation="fade-up" trigger="load">
                                <p className="dimensions_description fsz-14 fw-400 lh-4 mb-0">
                                    {t("description")}
                                </p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="container">
                    <div className="dimensions_grid">
                        <div className="row gx-0">
                            {cards.map((card) => (
                                <div key={card.key} className="col-lg-4 col-md-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="dimension_card">
                                            <div className="dimension_card_top">
                                                <div className="dimension_card_icon">
                                                    <i className={card.icon} aria-hidden="true"></i>
                                                </div>
                                                <a
                                                    href="#"
                                                    className="dimension_card_arrow"
                                                    aria-label={t(`${card.key}Title`)}
                                                >
                                                    <i
                                                        className="fal fa-arrow-right"
                                                        aria-hidden="true"
                                                    ></i>
                                                </a>
                                            </div>

                                            <h3 className="dimension_card_title fsz-20 fw-500">
                                                {t(`${card.key}Title`)}
                                            </h3>

                                            <div className="dimension_card_footer">
                                                <p className="fsz-14 fw-400 lh-4 mb-0">
                                                    {t(`${card.key}Text`)}
                                                </p>
                                            </div>
                                        </article>
                                    </Reveal>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConnectedDimensions;
