import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_UseCases.scss";

const UseCases = async () => {
    const t = await getTranslations("solutionsPage.useCases");

    return (
        <section className="solutions_use_cases" id="use-cases">
                <div className="container">
                    <div className="use_cases_head px-lg-5 border-bottom">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="use_cases_num">{t("number")}</span>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <h2 className="use_cases_title">{t("title")}</h2>
                        </Reveal>
                    </div>
                </div>

            <div className="use_cases_body">
                <div className="container">
                    <div className="row gx-0">
                        <div className="col-lg-4">
                            <Reveal animation="fade-up" trigger="load">
                                <article className="use_case_col">
                                    <h3 className="use_case_title">{t("case1Title")}</h3>

                                    <div className="use_case_steps">
                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_challenge">
                                                <i className="fa-regular fa-triangle-exclamation"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("challengeLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case1Challenge")}</p>
                                            </div>
                                        </div>

                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_solution">
                                                <i className="fa-regular fa-lightbulb"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("solutionLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case1Solution")}</p>
                                            </div>
                                        </div>

                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_outcome">
                                                <i className="fa-regular fa-circle-check"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("outcomeLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case1Outcome")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Reveal>
                        </div>

                        <div className="col-lg-4">
                            <Reveal animation="fade-up" trigger="load">
                                <article className="use_case_col is_featured">
                                    <h3 className="use_case_title">{t("case2Title")}</h3>

                                    <div className="use_case_steps">
                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_challenge">
                                                <i className="fa-regular fa-triangle-exclamation"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("challengeLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case2Challenge")}</p>
                                            </div>
                                        </div>

                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_solution">
                                                <i className="fa-regular fa-lightbulb"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("solutionLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case2Solution")}</p>
                                            </div>
                                        </div>

                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_outcome">
                                                <i className="fa-regular fa-circle-check"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("outcomeLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case2Outcome")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Reveal>
                        </div>

                        <div className="col-lg-4">
                            <Reveal animation="fade-up" trigger="load">
                                <article className="use_case_col">
                                    <h3 className="use_case_title">{t("case3Title")}</h3>

                                    <div className="use_case_steps">
                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_challenge">
                                                <i className="fa-regular fa-triangle-exclamation"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("challengeLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case3Challenge")}</p>
                                            </div>
                                        </div>

                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_solution">
                                                <i className="fa-regular fa-lightbulb"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("solutionLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case3Solution")}</p>
                                            </div>
                                        </div>

                                        <div className="use_case_step">
                                            <span className="use_case_step_icon is_outcome">
                                                <i className="fa-regular fa-circle-check"></i>
                                            </span>
                                            <div className="use_case_step_content">
                                                <span className="use_case_step_label">{t("outcomeLabel")}</span>
                                                <p className="use_case_step_text mb-0">{t("case3Outcome")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Reveal>
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

export default UseCases;
