import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_RelatedSolutions.scss";

const RelatedSolutions = async () => {
    const t = await getTranslations("solutionsPage.relatedSolutions");

    const cards = [
        { key: "card1", image: "/images/icons/rs1.png" },
        { key: "card2", image: "/images/icons/rs2.png" },
        { key: "card3", image: "/images/icons/rs3.png" },
    ] as const;

    return (
        <section className="solutions_related_solutions" id="related-solutions">
            <div className="related_solutions_head pt-100 pb-40 border-bottom bg-light-gray">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="related_solutions_num">{t("number")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="related_solutions_title">
                            <span className="related_solutions_title_strong">
                                {t("titleStrong")}
                            </span>{" "}
                            <span className="related_solutions_title_muted">
                                {t("titleMuted")}
                            </span>
                        </h2>
                    </Reveal>
                </div>
            </div>

            <div className="container">
                <div className="related_solutions_body px-lg-5">
                    <div className="row g-4">
                        {cards.map((card) => (
                            <div key={card.key} className="col-lg-4 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="related_card">
                                        <div className="related_card_visual">
                                            <img
                                                src={card.image}
                                                alt=""
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <h3 className="related_card_title">
                                            {t(`${card.key}Title`)}
                                        </h3>

                                        <p className="related_card_text mb-0">
                                            {t(`${card.key}Text`)}
                                        </p>

                                        <a href="#" className="related_card_link">
                                            <span>{t("cta")}</span>
                                            <img
                                                src="/images/icons/arrow-bl.svg"
                                                alt=""
                                                className="related_card_arrow"
                                                aria-hidden="true"
                                            />
                                        </a>
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

export default RelatedSolutions;
