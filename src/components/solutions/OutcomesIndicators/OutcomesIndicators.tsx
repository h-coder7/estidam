import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import type { SolutionOutcome } from "@/lib/api/solutionDetail";

import "./_OutcomesIndicators.scss";

const icons: Record<string, string> = {
    gauge: "fal fa-clock",
    clock: "fal fa-clock",
    timer: "fal fa-clock",
    layers: "fal fa-clone",
    clone: "fal fa-clone",
    shield: "fal fa-shield",
    shieldcheck: "fal fa-shield",
    linechart: "fal fa-chart-line",
    chartline: "fal fa-chart-line",
    badgecheck: "fal fa-flag",
    flag: "fal fa-flag",
};

const fallbacks = ["fal fa-clock", "fal fa-clone", "fal fa-shield", "fal fa-chart-line", "fal fa-flag"] as const;

const iconClass = (name: string, index: number) =>
    icons[name.toLowerCase().replace(/[\s_-]/g, "")] || fallbacks[index % fallbacks.length];

const OutcomesIndicators = async ({ items }: { items: SolutionOutcome[] }) => {
    const t = await getTranslations("solutionsPage.outcomesIndicators");
    if (!items.length) return null;

    return (
        <section className="solutions_outcomes_indicators border-bottom" id="outcomes-indicators">
            <div className="outcomes_indicators_head pt-100 pb-40 border-bottom bg-light-gray">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="outcomes_indicators_num">{t("number")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="outcomes_indicators_title fsz-40 fw-600 lh-2">
                            <span className="outcomes_indicators_title_strong">{t("titleStrong")}</span>
                            <span className="outcomes_indicators_title_muted cr-blue fw-500">{t("titleMuted")}</span>
                        </h2>
                    </Reveal>
                </div>
            </div>

            <div className="container">
                <div className="outcomes_indicators_body px-lg-5">
                    <div className="row">
                        {items.map((item, index) => (
                            <div key={`${item.text}-${index}`} className="col-xl col-md-6 col-sm-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="outcome_card">
                                        <div className="outcome_card_icon">
                                            <i className={iconClass(item.icon, index)} aria-hidden="true"></i>
                                        </div>

                                        <h3 className="outcome_card_title">{item.text}</h3>

                                        <div className="outcome_card_chart">
                                            <img src="/images/out-chart.png" alt="" aria-hidden="true" />
                                        </div>

                                        <span className="outcome_card_trend">{t("trend")}</span>
                                    </article>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OutcomesIndicators;
