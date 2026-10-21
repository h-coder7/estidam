import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_HowItWorks.scss";

const HowItWorks = async () => {
    const t = await getTranslations("aiReadinessPage.howItWorks");

    const cards = [
        { key: "card1", number: "01" },
        { key: "card2", number: "02" },
        { key: "card3", number: "03" },
        { key: "card4", number: "04" },
        { key: "card5", number: "05" },
    ] as const;

    return (
        <section className="readiness_how_it_works mt-5 border-top" id="how-it-works">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="how_it_works_head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="how_it_works_badge">{t("badge")}</span>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <h2 className="how_it_works_title fsz-40 fw-600 lh-2 mb-0">
                                <span className="how_it_works_title_strong">
                                    {t("titleStrong")}
                                </span>
                                <span className="how_it_works_title_muted cr-blue fw-500">
                                    {t("titleMuted")}
                                </span>
                            </h2>
                        </Reveal>
                    </div>

                    <div className="how_it_works_body">
                        <div className="how_steps">
                            {cards.map((card, index) => (
                                <Reveal
                                    key={card.key}
                                    animation="fade-up"
                                    trigger="load"
                                    className={`how_step${index === 0 ? " is_active" : ""}`}
                                >
                                        <article className="how_step_card">
                                            <span className="how_step_num fsz-13 fw-600">
                                                {card.number}
                                            </span>

                                            <div className="how_step_content">
                                                <h3 className="how_step_title fsz-16 fw-600 mb-0">
                                                    {t(`${card.key}Title`)}
                                                </h3>
                                                <p className="how_step_text fsz-14 fw-400 lh-4 mb-0">
                                                    {t("cardText")}
                                                </p>
                                            </div>

                                            <img
                                                src="/images/how-work-card.png"
                                                alt=""
                                                className="how_step_visual"
                                                aria-hidden="true"
                                            />
                                        </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default HowItWorks;
