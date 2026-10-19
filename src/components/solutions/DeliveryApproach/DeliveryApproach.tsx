import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_DeliveryApproach.scss";

const DeliveryApproach = async () => {
    const t = await getTranslations("solutionsPage.deliveryApproach");

    return (
        <section className="solutions_delivery_approach" id="delivery-approach">

            <div className="container">
                <div className="delivery_content">
                    <div className="delivery_approach_arc" aria-hidden="true"></div>
                    <div className="delivery_approach_head">
                        <div className="container">
                            <div className="delivery_approach_head_inner">
                                <Reveal animation="fade-up" trigger="load">
                                    <span className="delivery_approach_num">{t("number")}</span>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h2 className="delivery_approach_title">
                                        <span className="delivery_approach_title_strong">
                                            {t("titleStrong")}
                                        </span>{" "}
                                        <span className="delivery_approach_title_muted">
                                            {t("titleMuted")}
                                        </span>
                                    </h2>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="delivery_approach_description mb-0">
                                        {t("description")}
                                    </p>
                                </Reveal>
                            </div>
                        </div>
                    </div>

                    <div className="delivery_approach_body">
                        <div className="container">
                            <div className="delivery_stages row gx-0">
                                <div className="col-lg-2 col-md-4 col-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="delivery_stage">
                                            <span className="delivery_stage_label">{t("stage1Label")}</span>
                                            <p className="delivery_stage_text mb-0">{t("stage1Text")}</p>
                                        </article>
                                    </Reveal>
                                </div>

                                <div className="col-lg-2 col-md-4 col-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="delivery_stage">
                                            <span className="delivery_stage_label">{t("stage2Label")}</span>
                                            <p className="delivery_stage_text mb-0">{t("stage2Text")}</p>
                                        </article>
                                    </Reveal>
                                </div>

                                <div className="col-lg-2 col-md-4 col-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="delivery_stage">
                                            <span className="delivery_stage_label">{t("stage3Label")}</span>
                                            <p className="delivery_stage_text mb-0">{t("stage3Text")}</p>
                                        </article>
                                    </Reveal>
                                </div>

                                <div className="col-lg-2 col-md-4 col-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="delivery_stage">
                                            <span className="delivery_stage_label">{t("stage4Label")}</span>
                                            <p className="delivery_stage_text mb-0">{t("stage4Text")}</p>
                                        </article>
                                    </Reveal>
                                </div>

                                <div className="col-lg-2 col-md-4 col-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="delivery_stage">
                                            <span className="delivery_stage_label">{t("stage5Label")}</span>
                                            <p className="delivery_stage_text mb-0">{t("stage5Text")}</p>
                                        </article>
                                    </Reveal>
                                </div>

                                <div className="col-lg-2 col-md-4 col-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="delivery_stage">
                                            <span className="delivery_stage_label">{t("stage6Label")}</span>
                                            <p className="delivery_stage_text mb-0">{t("stage6Text")}</p>
                                        </article>
                                    </Reveal>
                                </div>
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

export default DeliveryApproach;
