import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_HowWeDeliver.scss";

const HowWeDeliver = async () => {
    const t = await getTranslations("howWeDeliver");

    return (
        <section className="how_we_deliver border-top pb-100" id="how-we-deliver">
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
                                        <p className="section-head-description">
                                            {t("description")}
                                        </p>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <a href="#" className="butn butn-outline">
                                            <span>{t("cta")}</span>
                                            <span className="butn-icon" aria-hidden="true"></span>
                                        </a>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="deliver_steps">
                            <div className="deliver_step">
                                <div className="deliver_step_icon">
                                    <span className="deliver_step_num">01</span>
                                    <i className="fa-regular fa-bullseye"></i>
                                </div>
                                <p className="deliver_step_label">{t("step1")}</p>
                            </div>

                            <span className="deliver_step_arrow" aria-hidden="true"></span>

                            <div className="deliver_step">
                                <div className="deliver_step_icon">
                                    <span className="deliver_step_num">02</span>
                                    <i className="fa-regular fa-magnifying-glass"></i>
                                </div>
                                <p className="deliver_step_label">{t("step2")}</p>
                            </div>

                            <span className="deliver_step_arrow" aria-hidden="true"></span>

                            <div className="deliver_step">
                                <div className="deliver_step_icon">
                                    <span className="deliver_step_num">03</span>
                                    <i className="fa-regular fa-lightbulb"></i>
                                </div>
                                <p className="deliver_step_label">{t("step3")}</p>
                            </div>

                            <span className="deliver_step_arrow" aria-hidden="true"></span>

                            <div className="deliver_step">
                                <div className="deliver_step_icon">
                                    <span className="deliver_step_num">04</span>
                                    <i className="fa-regular fa-code"></i>
                                </div>
                                <p className="deliver_step_label">{t("step4")}</p>
                            </div>

                            <span className="deliver_step_arrow" aria-hidden="true"></span>

                            <div className="deliver_step">
                                <div className="deliver_step_icon">
                                    <span className="deliver_step_num">05</span>
                                    <i className="fa-regular fa-rocket"></i>
                                </div>
                                <p className="deliver_step_label">{t("step5")}</p>
                            </div>

                            <span className="deliver_step_arrow" aria-hidden="true"></span>

                            <div className="deliver_step">
                                <div className="deliver_step_icon">
                                    <span className="deliver_step_num">06</span>
                                    <i className="fa-regular fa-chart-simple"></i>
                                </div>
                                <p className="deliver_step_label">{t("step6")}</p>
                            </div>

                            <span className="deliver_step_arrow" aria-hidden="true"></span>

                            <div className="deliver_step">
                                <div className="deliver_step_icon">
                                    <span className="deliver_step_num">07</span>
                                    <i className="fa-regular fa-arrows-rotate"></i>
                                </div>
                                <p className="deliver_step_label">{t("step7")}</p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="deliver_engine">

                            <div className="row align-items-center">
                                <div className="col-lg-4">
                                    <article className="deliver_side_card">
                                        <div className="logo-img">
                                            <img src="/images/logo-estidam.png" alt="Inspire" />
                                        </div>
                                        <ul className="deliver_side_list">
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("estidamItem1")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("estidamItem2")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("estidamItem3")}</span>
                                            </li>
                                        </ul>
                                    </article>
                                </div>
                                <div className="col-lg-4">
                                    <div className="deliver_engine_visual">
                                        <img
                                            src="/images/deliver-img.png"
                                            alt={t("engineTitle")}
                                            className="deliver_engine_img"
                                        />
                                        <div className="deliver_engine_core">
                                            <img src="/images/icons/dlv1.png" alt="Engine-icon" className="th-30" />
                                            <span>{t("engineTitle")}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <article className="deliver_side_card inspire-card">
                                        <div className="logo-img">
                                            <img src="/images/logo-inspire.png" alt="Inspire" />
                                        </div>
                                        <ul className="deliver_side_list">
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("inspireItem1")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("inspireItem2")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("inspireItem3")}</span>
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-check"></i>
                                                <span>{t("inspireItem4")}</span>
                                            </li>
                                        </ul>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="deliver-content mt-5">
                            <div className="deliver_together">
                                <span className="deliver_together_icon" aria-hidden="true">
                                    <i className="fal fa-handshake"></i>
                                </span>
                                <div className="deliver_together_copy">
                                    <span className="deliver_together_label mb-1">{t("togetherLabel")}</span>
                                    <p className="deliver_together_text">{t("togetherText")}</p>
                                </div>
                            </div>
                            <img src="/images/dlv-line.png" alt="" className="line-img" />
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default HowWeDeliver;
