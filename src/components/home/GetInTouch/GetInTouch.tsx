import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_GetInTouch.scss";

const GetInTouch = async () => {
    const t = await getTranslations("getInTouch");

    return (
        <section className="get_in_touch" id="get-in-touch">
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

                <div className="get_in_touch_body">
                    <div className="content px-lg-4">
                        <div className="row gx-0">
                            <div className="col-lg-3 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="touch_card">
                                        <h3 className="touch_card_title">
                                            <span className="touch_card_title_strong">
                                                {t("card1TitleStrong")}
                                            </span>
                                            <span className="touch_card_title_muted">
                                                {t("card1TitleMuted")}
                                            </span>
                                        </h3>

                                        <p className="touch_card_text">{t("cardText")}</p>

                                        <a href="#" className="butn butn-ghost touch_card_cta">
                                            <span className="touch_card_cta_label">{t("card1Cta")}</span>
                                            <span className="butn-icon" aria-hidden="true"></span>
                                        </a>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="touch_card">
                                        <h3 className="touch_card_title">
                                            <span className="touch_card_title_strong">
                                                {t("card2TitleStrong")}
                                            </span>
                                            <span className="touch_card_title_muted">
                                                {t("card2TitleMuted")}
                                            </span>
                                        </h3>

                                        <p className="touch_card_text">{t("cardText")}</p>

                                        <a href="#" className="butn butn-ghost touch_card_cta">
                                            <span className="touch_card_cta_label">{t("card2Cta")}</span>
                                            <span className="butn-icon" aria-hidden="true"></span>
                                        </a>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="touch_card">
                                        <h3 className="touch_card_title">
                                            <span className="touch_card_title_strong">
                                                {t("card3TitleStrong")}
                                            </span>
                                            <span className="touch_card_title_muted">
                                                {t("card3TitleMuted")}
                                            </span>
                                        </h3>

                                        <p className="touch_card_text">{t("cardText")}</p>

                                        <a href="#" className="butn butn-ghost touch_card_cta">
                                            <span className="touch_card_cta_label">{t("card3Cta")}</span>
                                            <span className="butn-icon" aria-hidden="true"></span>
                                        </a>
                                    </article>
                                </Reveal>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="touch_card">
                                        <h3 className="touch_card_title">
                                            <span className="touch_card_title_strong">
                                                {t("card4TitleStrong")}
                                            </span>
                                            <span className="touch_card_title_muted">
                                                {t("card4TitleMuted")}
                                            </span>
                                        </h3>

                                        <p className="touch_card_text">{t("cardText")}</p>

                                        <a href="#" className="butn butn-ghost touch_card_cta">
                                            <span className="touch_card_cta_label">{t("card4Cta")}</span>
                                            <span className="butn-icon" aria-hidden="true"></span>
                                        </a>
                                    </article>
                                </Reveal>
                            </div>
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
