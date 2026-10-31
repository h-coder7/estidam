import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProofContent, headingFromCms } from "@/lib/api/home";
import ExperienceCases from "./ExperienceCases";

import "./_ExperienceProof.scss";

const ExperienceProof = async () => {
    const locale = await getLocale();
    const t = await getTranslations("experienceProof");
    const content = await getProofContent(locale);
    const heading = headingFromCms(content, t("titleStrong"), t("titleMuted"));
    const badge = content?.eyebrow || t("badge");
    const description = content?.description || t("description");

    return (
        <section className="experience_proof" id="experience-proof">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="section-head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="section-head-badge">{badge}</span>
                        </Reveal>

                        <div className="row gx-0 justify-content-between">
                            <div className="col-lg-6">
                                <div className="section-head-left mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h2 className="section-head-title fsz-40 fw-600 lh-2">
                                            <span className="section-head-title-strong">{heading.titleStrong}</span>
                                            {heading.titleMuted ? (
                                                <>
                                                    <br />
                                                    <span className="section-head-title-muted cr-blue fw-500">
                                                        {heading.titleMuted}
                                                    </span>
                                                </>
                                            ) : null}
                                        </h2>
                                    </Reveal>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="section-head-right mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="section-head-description mb-0">
                                            {description}
                                        </p>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ExperienceCases />
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
