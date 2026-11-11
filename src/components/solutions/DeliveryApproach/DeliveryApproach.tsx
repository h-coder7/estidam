import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import type { SolutionDelivery } from "@/lib/api/solutionDetail";

import "./_DeliveryApproach.scss";

const DeliveryApproach = async ({ delivery }: { delivery: SolutionDelivery | null }) => {
    const t = await getTranslations("solutionsPage.deliveryApproach");
    if (!delivery?.stages.length) return null;

    const titleStrong = delivery.titleStrong || t("titleStrong");
    const titleMuted = delivery.titleMuted || t("titleMuted");
    const description = delivery.description || t("description");

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
                                    <h2 className="delivery_approach_title fsz-40 fw-600 lh-2">
                                        <span className="delivery_approach_title_strong">{titleStrong}</span>{" "}
                                        <span className="delivery_approach_title_muted cr-blue fw-500">{titleMuted}</span>
                                    </h2>
                                </Reveal>

                                {description ? (
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="delivery_approach_description mb-0">{description}</p>
                                    </Reveal>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="delivery_approach_body">
                        <div className="container">
                            <div className="delivery_stages row gx-0">
                                {delivery.stages.map((stage, index) => (
                                    <div className="col-lg-2 col-md-4 col-6" key={`${stage.label}-${index}`}>
                                        <Reveal animation="fade-up" trigger="load">
                                            <article className="delivery_stage">
                                                <span className="delivery_stage_label">{stage.label}</span>
                                                <p className="delivery_stage_text mb-0">{stage.text}</p>
                                            </article>
                                        </Reveal>
                                    </div>
                                ))}
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
