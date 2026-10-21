import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_AboutStats.scss";

const AboutStats = async () => {
    const t = await getTranslations("aboutPage.stats");

    const stats = [
        { value: "stat1Value", strong: "stat1Strong", muted: "stat1Muted" },
        { value: "stat2Value", strong: "stat2Strong", muted: "stat2Muted" },
        { value: "stat3Value", strong: "stat3Strong", muted: "stat3Muted" },
    ] as const;

    return (
        <section className="about_stats border-top border-bottom" id="about-stats">
            <div className="container">
                <div className="row gx-0">
                    {stats.map((stat) => (
                        <div key={stat.value} className="col-lg-3 col-md-6">
                            <Reveal animation="fade-up" trigger="load">
                                <article className="about_stat">
                                    <span className="about_stat_value fsz-45 fw-600 lh-1">
                                        {t(stat.value)}
                                    </span>
                                    <span className="about_stat_label">
                                        <strong className="cr-555">{t(stat.strong)}</strong>
                                        <span className="cr-999">{t(stat.muted)}</span>
                                    </span>
                                </article>
                            </Reveal>
                        </div>
                    ))}

                    <div className="col-lg-3 col-md-6">
                        <Reveal animation="fade-up" trigger="load">
                            <article className="about_stat is_dark">
                                <h2 className="about_stat_title fsz-22 lh-2 mb-0">
                                    {t("highlightTitle")}
                                </h2>
                                <span className="about_stat_note fsz-11 fw-500">
                                    {t("highlightNote")}
                                </span>
                            </article>
                        </Reveal>
                    </div>
                </div>
            </div>
            <div className="sec-lines"><span></span><span></span></div>
        </section>
    );
};

export default AboutStats;
