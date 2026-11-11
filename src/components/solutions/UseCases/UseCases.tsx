import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import type { SolutionUseCase } from "@/lib/api/solutionDetail";

import "./_UseCases.scss";

const UseCases = async ({ items }: { items: SolutionUseCase[] }) => {
    const t = await getTranslations("solutionsPage.useCases");
    if (!items.length) return null;

    return (
        <section className="solutions_use_cases" id="use-cases">
            <div className="container">
                <div className="use_cases_head px-lg-5 border-bottom">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="use_cases_num">{t("number")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="use_cases_title fsz-40 fw-600 lh-2">{t("title")}</h2>
                    </Reveal>
                </div>
            </div>

            <div className="use_cases_body">
                <div className="container">
                    <div className="row gx-0">
                        {items.map((item, index) => (
                            <div className="col-lg-4" key={`${item.title}-${index}`}>
                                <Reveal animation="fade-up" trigger="load">
                                    <article className={`use_case_col${index === 1 ? " is_featured" : ""}`}>
                                        {item.title ? <h3 className="use_case_title">{item.title}</h3> : null}

                                        <div className="use_case_steps">
                                            {item.challenge ? (
                                                <div className="use_case_step">
                                                    <span className="use_case_step_icon is_challenge">
                                                        <i className="fa-regular fa-triangle-exclamation"></i>
                                                    </span>
                                                    <div className="use_case_step_content">
                                                        <span className="use_case_step_label">{t("challengeLabel")}</span>
                                                        <p className="use_case_step_text mb-0">{item.challenge}</p>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {item.solution ? (
                                                <div className="use_case_step">
                                                    <span className="use_case_step_icon is_solution">
                                                        <i className="fa-regular fa-lightbulb"></i>
                                                    </span>
                                                    <div className="use_case_step_content">
                                                        <span className="use_case_step_label">{t("solutionLabel")}</span>
                                                        <p className="use_case_step_text mb-0">{item.solution}</p>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {item.outcome ? (
                                                <div className="use_case_step">
                                                    <span className="use_case_step_icon is_outcome">
                                                        <i className="fa-regular fa-circle-check"></i>
                                                    </span>
                                                    <div className="use_case_step_content">
                                                        <span className="use_case_step_label">{t("outcomeLabel")}</span>
                                                        <p className="use_case_step_text mb-0">{item.outcome}</p>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </article>
                                </Reveal>
                            </div>
                        ))}
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
