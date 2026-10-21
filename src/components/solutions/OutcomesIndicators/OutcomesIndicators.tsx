import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_OutcomesIndicators.scss";

const OutcomesIndicators = async () => {
    const t = await getTranslations("solutionsPage.outcomesIndicators");

    const cards = [
        { key: "card1", icon: "fal fa-clock" },
        { key: "card2", icon: "fal fa-clone" },
        { key: "card3", icon: "fal fa-shield" },
        { key: "card4", icon: "fal fa-chart-line" },
        { key: "card5", icon: "fal fa-flag" },
    ] as const;

    return (
        <section className="solutions_outcomes_indicators border-bottom" id="outcomes-indicators">
            <div className="outcomes_indicators_head pt-100 pb-40 border-bottom bg-light-gray">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="outcomes_indicators_num">{t("number")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="outcomes_indicators_title fsz-40 fw-600 lh-2">
                            <span className="outcomes_indicators_title_strong">
                                {t("titleStrong")}
                            </span>
                            <span className="outcomes_indicators_title_muted cr-blue fw-500">
                                {t("titleMuted")}
                            </span>
                        </h2>
                    </Reveal>
                </div>
            </div>

            <div className="container">
                <div className="outcomes_indicators_body px-lg-5">
                    <div className="row">
                        {cards.map((card) => (
                            <div key={card.key} className="col-xl col-md-6 col-sm-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="outcome_card">
                                        <div className="outcome_card_icon">
                                            <i className={card.icon} aria-hidden="true"></i>
                                        </div>

                                        <h3 className="outcome_card_title">{t(card.key)}</h3>

                                        <div className="outcome_card_chart">
                                            <img
                                                src="/images/out-chart.png"
                                                alt=""
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <span className="outcome_card_trend">{t("trend")}</span>
                                    </article>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OutcomesIndicators;
