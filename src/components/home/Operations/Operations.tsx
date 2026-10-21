import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_Operations.scss";

const Operations = async () => {
    const t = await getTranslations("operations");

    return (
        <section className="operations" id="operations">
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
                                            </span>
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

                <div className="operations_body px-4">
                    <div className="d-lg-flex gap-4">
                        <Reveal animation="fade-up" trigger="load">
                            <div className="operations_card">
                                <img
                                    src="/images/operation2.png"
                                    alt={t("card1Alt")}
                                    className="operations_img"
                                />
                            </div>
                        </Reveal>
                        <Reveal animation="fade-up" trigger="load">
                            <div className="operations_card">
                                <img
                                    src="/images/operation1.png"
                                    alt={t("card2Alt")}
                                    className="operations_img"
                                />
                            </div>
                        </Reveal>
                    </div>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="operations_outcome">
                            <span className="operations_outcome_label">{t("outcomeLabel")}</span>

                            <div className="operations_outcome_flow">
                                <div className="operations_outcome_item_wrap">
                                    <span className="operations_outcome_item">{t("outcome1")}</span>
                                </div>

                                <div className="operations_outcome_item_wrap">
                                    <span className="operations_outcome_arrow" aria-hidden="true">
                                        ···›
                                    </span>
                                    <span className="operations_outcome_item">{t("outcome2")}</span>
                                </div>

                                <div className="operations_outcome_item_wrap">
                                    <span className="operations_outcome_arrow" aria-hidden="true">
                                        ···›
                                    </span>
                                    <span className="operations_outcome_item">{t("outcome3")}</span>
                                </div>

                                <div className="operations_outcome_item_wrap">
                                    <span className="operations_outcome_arrow" aria-hidden="true">
                                        ···›
                                    </span>
                                    <span className="operations_outcome_item">{t("outcome4")}</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="sec-lines lines-light">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default Operations;
