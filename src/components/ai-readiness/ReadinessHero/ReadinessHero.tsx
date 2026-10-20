import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ReadinessHero.scss";

const ReadinessHero = async () => {
    const t = await getTranslations("aiReadinessPage.hero");

    const features = ["feature1", "feature2", "feature3"] as const;

    const metrics = [
        {
            key: "metric1",
            value: "67%",
            progress: 67,
            icon: "fa-regular fa-database",
            color: "purple",
        },
        {
            key: "metric2",
            value: "80%",
            progress: 80,
            icon: "fa-regular fa-users",
            color: "cyan",
        },
        {
            key: "metric3",
            value: "70%",
            progress: 70,
            icon: "fa-regular fa-shield",
            color: "lime",
        },
        {
            key: "metric4",
            value: "84%",
            progress: 84,
            icon: "fa-regular fa-lightbulb",
            color: "blue",
        },
        {
            key: "metric5",
            value: "90%",
            progress: 90,
            icon: "fa-regular fa-layer-group",
            color: "teal",
        },
    ] as const;

    return (
        <section className="hero_readiness">
            <div className="container">
                <div className="content">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <div className="txt_content">
                                <Reveal animation="fade-up" trigger="load">
                                    <span className="hero_readiness_badge">{t("badge")}</span>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="hero_readiness_title">
                                        <span className="hero_readiness_title_strong">
                                            {t("titleStrong")}
                                        </span>{" "}
                                        <span className="hero_readiness_title_muted">
                                            {t("titleMuted")}
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="hero_readiness_description col-lg-10">{t("description")}</p>
                                </Reveal>

                                <div className="hero_readiness_actions">
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
                                </div>

                                <Reveal animation="fade-up" trigger="load">
                                    <ul className="hero_readiness_features">
                                        {features.map((key) => (
                                            <li key={key} className="hero_readiness_feature">
                                                <i
                                                    className="fa-solid fa-check"
                                                    aria-hidden="true"
                                                ></i>
                                                <span>{t(key)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Reveal>
                            </div>
                        </div>
                    </div>

                    <div className="hero_readiness_metrics">
                        <div className="row g-3">
                            {metrics.map((metric) => (
                                <div key={metric.key} className="col-xl col-md-4 col-sm-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article
                                            className={`hero_readiness_metric is_${metric.color}`}
                                        >
                                            <div className="hero_readiness_metric_top">
                                                <span className="hero_readiness_metric_icon">
                                                    <i
                                                        className={metric.icon}
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                                <span className="hero_readiness_metric_value">
                                                    {metric.value}
                                                </span>
                                            </div>

                                            <h3 className="hero_readiness_metric_title">
                                                {t(metric.key)}
                                            </h3>

                                            <div
                                                className="hero_readiness_metric_bar"
                                                aria-hidden="true"
                                            >
                                                <span
                                                    style={{ width: `${metric.progress}%` }}
                                                ></span>
                                            </div>
                                        </article>
                                    </Reveal>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <img
                src="/images/readiness-hero.png"
                alt={t("imageAlt")}
                className="hero_readiness_visual"
            />
        </section>
    );
};

export default ReadinessHero;
