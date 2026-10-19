import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_HowHelps.scss";

const HowHelps = async () => {
    const t = await getTranslations("solutionsPage.howHelps");

    return (
        <section className="solutions_how_helps border-top" id="how-helps">
            <div className="how_helps_head bg-light-gray border-bottom px-lg-5">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="how_helps_num">{t("number")}</span>
                    </Reveal>

                    <div className="row gx-0 justify-content-between align-items-end">
                        <div className="col-lg-6">
                            <Reveal animation="fade-up" trigger="load">
                                <h2 className="how_helps_title">
                                    <span className="how_helps_title_strong">
                                        {t("titleStrong")}
                                    </span>{" "}
                                    <span className="how_helps_title_muted">
                                        {t("titleMuted")}
                                    </span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <p className="how_helps_description mb-0 text-lg-end">
                                    {t("description")}
                                </p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="container">
                    <div className="how_helps_body px-lg-5">
                        <div className="row gx-4 gy-4">
                            <div className="col-lg-6">
                                <div className="how_helps_col">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="help_card">
                                            <div className="help_card_icon">
                                                <img
                                                    src="/images/icons/sh1.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="help_card_content">
                                                <h3 className="help_card_title">{t("card1Title")}</h3>
                                                <p className="help_card_text mb-0">{t("card1Text")}</p>
                                            </div>

                                            <span className="help_card_badge">{t("card1Badge")}</span>
                                        </article>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="help_card">
                                            <div className="help_card_icon">
                                                <img
                                                    src="/images/icons/sh2.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="help_card_content">
                                                <h3 className="help_card_title">{t("card2Title")}</h3>
                                                <p className="help_card_text mb-0">{t("card2Text")}</p>
                                            </div>

                                            <span className="help_card_badge">{t("card2Badge")}</span>
                                        </article>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="help_card">
                                            <div className="help_card_icon">
                                                <img
                                                    src="/images/icons/sh3.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="help_card_content">
                                                <h3 className="help_card_title">{t("card3Title")}</h3>
                                                <p className="help_card_text mb-0">{t("card3Text")}</p>
                                            </div>

                                            <span className="help_card_badge">{t("card3Badge")}</span>
                                        </article>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="help_card">
                                            <div className="help_card_icon">
                                                <img
                                                    src="/images/icons/sh4.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="help_card_content">
                                                <h3 className="help_card_title">{t("card4Title")}</h3>
                                                <p className="help_card_text mb-0">{t("card4Text")}</p>
                                            </div>

                                            <span className="help_card_badge">{t("card4Badge")}</span>
                                        </article>
                                    </Reveal>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="how_helps_col">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="help_card">
                                            <div className="help_card_icon">
                                                <img
                                                    src="/images/icons/sh5.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="help_card_content">
                                                <h3 className="help_card_title">{t("card5Title")}</h3>
                                                <p className="help_card_text mb-0">{t("card5Text")}</p>
                                            </div>

                                            <span className="help_card_badge">{t("card5Badge")}</span>
                                        </article>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="help_card">
                                            <div className="help_card_icon">
                                                <img
                                                    src="/images/icons/sh6.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="help_card_content">
                                                <h3 className="help_card_title">{t("card6Title")}</h3>
                                                <p className="help_card_text mb-0">{t("card6Text")}</p>
                                            </div>

                                            <span className="help_card_badge">{t("card6Badge")}</span>
                                        </article>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="help_card">
                                            <div className="help_card_icon">
                                                <img
                                                    src="/images/icons/sh7.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="help_card_content">
                                                <h3 className="help_card_title">{t("card7Title")}</h3>
                                                <p className="help_card_text mb-0">{t("card7Text")}</p>
                                            </div>

                                            <span className="help_card_badge">{t("card7Badge")}</span>
                                        </article>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowHelps;
