import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getAboutStatsContent } from "@/lib/api/about";

import "./_AboutStats.scss";

const fallbackKeys = [
    { value: "stat1Value", strong: "stat1Strong", muted: "stat1Muted" },
    { value: "stat2Value", strong: "stat2Strong", muted: "stat2Muted" },
    { value: "stat3Value", strong: "stat3Strong", muted: "stat3Muted" },
] as const;

const AboutStats = async () => {
    const locale = await getLocale();
    const t = await getTranslations("aboutPage.stats");
    const cms = await getAboutStatsContent(locale);
    const highlightTitle = cms?.highlightTitle || t("highlightTitle");
    const highlightNote = cms?.highlightNote || t("highlightNote");

    const stats = fallbackKeys.map((keys, index) => {
        const item = cms?.stats[index];
        const fallback = {
            value: t(keys.value),
            strong: t(keys.strong),
            muted: t(keys.muted),
        };
        if (!item) return fallback;

        const hasLabel = Boolean(item.strong || item.muted);

        return {
            value: item.value || fallback.value,
            strong: hasLabel ? item.strong : fallback.strong,
            muted: hasLabel ? item.muted : fallback.muted,
        };
    });

    return (
        <section className="about_stats border-top border-bottom" id="about-stats">
            <div className="container">
                <div className="row gx-0">
                    {stats.map((stat, index) => (
                        <div key={fallbackKeys[index].value} className="col-lg-3 col-md-6">
                            <Reveal animation="fade-up" trigger="load">
                                <article className="about_stat">
                                    <span className="about_stat_value fsz-45 fw-600 lh-1">
                                        {stat.value}
                                    </span>
                                    <span className="about_stat_label">
                                        {stat.strong ? <strong className="cr-555">{stat.strong}</strong> : null}
                                        {stat.muted ? <span className="cr-999">{stat.muted}</span> : null}
                                    </span>
                                </article>
                            </Reveal>
                        </div>
                    ))}

                    <div className="col-lg-3 col-md-6">
                        <Reveal animation="fade-up" trigger="load">
                            <article className="about_stat is_dark">
                                <h2 className="about_stat_title fsz-22 lh-2 mb-0">
                                    {highlightTitle}
                                </h2>
                                <span className="about_stat_note fsz-11 fw-500">
                                    {highlightNote}
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
