import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import ExperienceCases from "./ExperienceCases";

import "./_ExperienceProof.scss";

const ExperienceProof = async () => {
    const t = await getTranslations("experienceProof");

    return (
        <section className="experience_proof" id="experience-proof">
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

                    <Reveal animation="fade-up" trigger="load">
                        <ExperienceCases />
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

export default ExperienceProof;
