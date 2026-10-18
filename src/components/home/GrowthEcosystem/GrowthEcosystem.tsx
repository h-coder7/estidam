import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_GrowthEcosystem.scss";

const GrowthEcosystem = async () => {
    const t = await getTranslations("growthEcosystem");

    return (
        <section className="growth_ecosystem border-top" id="growth-ecosystem">
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
                                            <span className="section-head-title-strong">
                                                {t("titleStrong")}
                                            </span>
                                            <br />
                                            <span className="section-head-title-muted">
                                                {t("titleMuted")}
                                            </span>
                                        </h2>
                                    </Reveal>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="section-head-right mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="section-head-description mb-0">
                                            {t("description")}
                                        </p>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ecosystem_grid row gx-0 border-top">
                    <div className="col-lg-4">
                        <Reveal animation="fade-up" trigger="load">
                            <article className="ecosystem_card">
                                <div className="ecosystem_card_icon">
                                    <img
                                        src="/images/icons/gr1.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="ecosystem_card_title">{t("card1Title")}</h3>

                                <p className="ecosystem_card_text">{t("card1Text")}</p>

                                <a href="#" className="ecosystem_card_link">
                                    <span>{t("card1Cta")}</span>
                                    <img
                                        src="/images/icons/arrow-bl.svg"
                                        alt=""
                                        className="ecosystem_card_arrow"
                                        aria-hidden="true"
                                    />
                                </a>
                            </article>
                        </Reveal>
                    </div>

                    <div className="col-lg-4">
                        <Reveal animation="fade-up" trigger="load">
                            <article className="ecosystem_card">
                                <div className="ecosystem_card_icon">
                                    <img
                                        src="/images/icons/gr2.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="ecosystem_card_title">{t("card2Title")}</h3>

                                <p className="ecosystem_card_text">{t("card2Text")}</p>

                                <a href="#" className="ecosystem_card_link">
                                    <span>{t("card2Cta")}</span>
                                    <img
                                        src="/images/icons/arrow-bl.svg"
                                        alt=""
                                        className="ecosystem_card_arrow"
                                        aria-hidden="true"
                                    />
                                </a>
                            </article>
                        </Reveal>
                    </div>

                    <div className="col-lg-4">
                        <Reveal animation="fade-up" trigger="load">
                            <article className="ecosystem_card">
                                <div className="ecosystem_card_icon">
                                    <img
                                        src="/images/icons/gr3.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </div>

                                <h3 className="ecosystem_card_title">{t("card3Title")}</h3>

                                <p className="ecosystem_card_text">{t("card3Text")}</p>

                                <a href="#" className="ecosystem_card_link">
                                    <span>{t("card3Cta")}</span>
                                    <img
                                        src="/images/icons/arrow-bl.svg"
                                        alt=""
                                        className="ecosystem_card_arrow"
                                        aria-hidden="true"
                                    />
                                </a>
                            </article>
                        </Reveal>
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

export default GrowthEcosystem;
