import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_Challenges.scss";

const Challenges = async () => {
    const t = await getTranslations("solutionsPage.challenges");

    return (
        <section className="solutions_challenges border-top mb-5 border-bottom" id="challenges">
            <div className="challenges_head border-bottom">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="challenges_num">{t("number")}</span>
                    </Reveal>

                    <div className="row gx-0 justify-content-between align-items-end">
                        <div className="col-lg-6">
                            <Reveal animation="fade-up" trigger="load">
                                <h2 className="challenges_title">
                                    <span className="challenges_title_strong">
                                        {t("titleStrong")}
                                    </span>{" "}
                                    <span className="challenges_title_muted">
                                        {t("titleMuted")}
                                    </span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <p className="challenges_description mb-0 text-lg-end">
                                    {t("description")}
                                </p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content border-bottom">
                <div className="container">
                    <div className="challenges_grid">
                        <div className="row gx-0">

                            <div className="col-lg-4 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="challenge_card">
                                        <div className="challenge_card_top">
                                            <div className="challenge_card_icon">
                                                <img
                                                    src="/images/icons/ch1.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <a
                                                href="#"
                                                className="challenge_card_arrow"
                                                aria-label={t("card1Title")}
                                            >
                                                <i
                                                    className="fa-regular fa-arrow-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </div>

                                        <h3 className="challenge_card_title">{t("card1Title")}</h3>

                                        <div className="challenge_card_footer">
                                            <span>{t("impact")}</span>
                                        </div>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="challenge_card">
                                        <div className="challenge_card_top">
                                            <div className="challenge_card_icon">
                                                <img
                                                    src="/images/icons/ch2.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <a
                                                href="#"
                                                className="challenge_card_arrow"
                                                aria-label={t("card2Title")}
                                            >
                                                <i
                                                    className="fa-regular fa-arrow-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </div>

                                        <h3 className="challenge_card_title">{t("card2Title")}</h3>

                                        <div className="challenge_card_footer">
                                            <span>{t("impact")}</span>
                                        </div>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="challenge_card">
                                        <div className="challenge_card_top">
                                            <div className="challenge_card_icon">
                                                <img
                                                    src="/images/icons/ch3.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <a
                                                href="#"
                                                className="challenge_card_arrow"
                                                aria-label={t("card3Title")}
                                            >
                                                <i
                                                    className="fa-regular fa-arrow-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </div>

                                        <h3 className="challenge_card_title">{t("card3Title")}</h3>

                                        <div className="challenge_card_footer">
                                            <span>{t("impact")}</span>
                                        </div>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="challenge_card">
                                        <div className="challenge_card_top">
                                            <div className="challenge_card_icon">
                                                <img
                                                    src="/images/icons/ch4.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <a
                                                href="#"
                                                className="challenge_card_arrow"
                                                aria-label={t("card4Title")}
                                            >
                                                <i
                                                    className="fa-regular fa-arrow-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </div>

                                        <h3 className="challenge_card_title">{t("card4Title")}</h3>

                                        <div className="challenge_card_footer">
                                            <span>{t("impact")}</span>
                                        </div>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="challenge_card">
                                        <div className="challenge_card_top">
                                            <div className="challenge_card_icon">
                                                <img
                                                    src="/images/icons/ch5.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <a
                                                href="#"
                                                className="challenge_card_arrow"
                                                aria-label={t("card5Title")}
                                            >
                                                <i
                                                    className="fa-regular fa-arrow-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </div>

                                        <h3 className="challenge_card_title">{t("card5Title")}</h3>

                                        <div className="challenge_card_footer">
                                            <span>{t("impact")}</span>
                                        </div>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="challenge_card">
                                        <div className="challenge_card_top">
                                            <div className="challenge_card_icon">
                                                <img
                                                    src="/images/icons/ch6.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <a
                                                href="#"
                                                className="challenge_card_arrow"
                                                aria-label={t("card6Title")}
                                            >
                                                <i
                                                    className="fa-regular fa-arrow-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </div>

                                        <h3 className="challenge_card_title">{t("card6Title")}</h3>

                                        <div className="challenge_card_footer">
                                            <span>{t("impact")}</span>
                                        </div>
                                    </article>
                                </Reveal>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </section>
    );
};

export default Challenges;
