import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_SolutionsHero.scss";

const SolutionsHero = async () => {
    const t = await getTranslations("solutionsPage.hero");

    return (
        <section className="solutions_hero mb-5 border-bottom">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6">
                            <div className="solutions_hero_content">
                                <Reveal animation="fade-up" trigger="load">
                                    <span className="solutions_hero_num">{t("number")}</span>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="solutions_hero_title fsz-40 fw-600 lh-2">
                                        <span className="solutions_hero_title_strong">
                                            {t("titleStrong")}
                                        </span>{" "}
                                        <span className="solutions_hero_title_muted cr-blue fw-500">
                                            {t("titleMuted")}
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="solutions_hero_description">
                                        {t("description")}
                                    </p>
                                </Reveal>

                                <div className="solutions_hero_actions">
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
                                        <a href="#use-cases" className="butn solutions_hero_link">
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

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="solutions_hero_visual">
                                    <img
                                        src="/images/solution-hero.png"
                                        alt={t("imageAlt")}
                                        className="solutions_hero_img"
                                    />
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <img
                src="/images/solution-hero-dots.png"
                alt=""
                className="solutions_hero_dots"
                aria-hidden="true"
            />
        </section>
    );
};

export default SolutionsHero;
