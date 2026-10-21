import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_Solutions.scss";

const Solutions = async () => {
    const t = await getTranslations("solutions");

    return (
        <section className="solutions border-top" id="solutions">
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
                                        <h2 className="section-head-title fsz-40 fw-600 lh-2">
                                            <span className="section-head-title-strong">
                                                {t("titleStrong")}
                                            </span>{" "}
                                            <br />
                                            <span className="section-head-title-muted cr-blue fw-500">
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

                <div className="solutions_body border-top px-4">
                    <div className="row gx-0 align-items-center">
                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="solutions_content">
                                    <p className="solutions_label">{t("itemLabel")}</p>

                                    <h3 className="solutions_title">
                                        <span className="solutions_title_strong">
                                            {t("itemTitleStrong")}
                                        </span>{" "}
                                        <span className="solutions_title_muted cr-blue fw-500">
                                            {t("itemTitleMuted")}
                                        </span>
                                    </h3>

                                    <p className="solutions_text">{t("itemText")}</p>

                                    <p className="solutions_highlight">{t("itemHighlight")}</p>
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-7">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="solutions_visual">
                                    <img
                                        src="/images/solution1.png"
                                        alt={t("itemTitleStrong")}
                                        className="solutions_img"
                                    />
                                </div>
                            </Reveal>
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

export default Solutions;
