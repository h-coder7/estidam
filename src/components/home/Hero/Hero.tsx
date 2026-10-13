import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_Hero.scss";

const Hero = async () => {
    const t = await getTranslations("hero");

    return (
        <section className="hero_section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="txt_content">
                            <Reveal animation="fade-up" trigger="load">
                                <p className="hero_eyebrow">{t("eyebrow")}</p>
                            </Reveal>

                            <Reveal animation="fade-up" trigger="load">
                                <h1 className="hero_title">
                                    {t("title")}{" "}
                                    <span className="hero_title_accent">{t("titleAccent")}</span>
                                </h1>
                            </Reveal>

                            <Reveal animation="fade-up" trigger="load">
                                <p className="hero_description">{t("description")}</p>
                            </Reveal>

                            <div className="hero_actions">
                                <Reveal animation="fade-up" trigger="load">
                                    <a href="#" className="butn butn-blue">
                                        <span>{t("primaryCta")}</span>
                                        <span className="butn-icon" aria-hidden="true"></span>
                                    </a>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <a href="#why-estidam" className="butn butn-ghost">
                                        <span>{t("secondaryCta")}</span>
                                        <span className="butn-icon" aria-hidden="true"></span>
                                    </a>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <img src="/images/hero-dots.png" alt="Hero Pattern" className="hero-dots" />
            <div className="sec-lines lines-light">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default Hero;
