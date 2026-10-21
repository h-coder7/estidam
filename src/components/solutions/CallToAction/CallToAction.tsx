import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_CallToAction.scss";

const CallToAction = async () => {
    const t = await getTranslations("solutionsPage.callToAction");

    return (
        <section className="solutions_call_to_action" id="call-to-action">
            <img src="/images/call-action-pattern.png" alt="" className="lines" />
            <div className="container">
                <div className="call_to_action_inner">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="call_to_action_badge">{t("badge")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="call_to_action_title fsz-40 fw-600 lh-2">{t("title")}</h2>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <p className="call_to_action_description mb-0">{t("description")}</p>
                    </Reveal>

                    <div className="call_to_action_actions mt-5">
                        <Reveal animation="fade-up" trigger="load">
                            <a href="#" className="butn butn-blue">
                                <span>{t("primaryCta")}</span>
                                <img
                                    src="/images/icons/arrow-wh.svg"
                                    alt=""
                                    className="butn-icon"
                                    aria-hidden="true"
                                />
                            </a>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <a href="#" className="butn butn-ghost border-wh-2">
                                <span>{t("secondaryCta")}</span>
                                <img
                                    src="/images/icons/arrow-bl.svg"
                                    alt=""
                                    className="butn-icon"
                                    aria-hidden="true"
                                />
                            </a>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
