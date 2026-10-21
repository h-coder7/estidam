import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_AboutHero.scss";

const AboutHero = async () => {
    const t = await getTranslations("aboutPage.hero");

    return (
        <section className="about_hero mb-5 border-bottom">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6">
                            <div className="about_hero_content">
                                <Reveal animation="fade-up" trigger="load">
                                    <span className="about_hero_badge">{t("badge")}</span>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="about_hero_title fsz-45 fw-600 lh-2">
                                        <span className="about_hero_title_strong">
                                            {t("titleBefore")}{" "}
                                        </span>
                                        <span className="cr-blue">{t("titleAccent")}</span>{" "}
                                        <span className="about_hero_title_strong">
                                            {t("titleAfter")}
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="about_hero_description fsz-14 fw-400 lh-4 mb-0">
                                        {t("description")}
                                    </p>
                                </Reveal>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <img
                                    src="/images/about-pg-hero.png"
                                    alt={t("imageAlt")}
                                    className="about_hero_img"
                                />
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <img
                src="/images/solution-hero-dots.png"
                alt=""
                className="about_hero_dots"
                aria-hidden="true"
            />
        </section>
    );
};

export default AboutHero;
