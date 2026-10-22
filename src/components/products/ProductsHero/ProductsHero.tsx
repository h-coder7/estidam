import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductsHero.scss";

const productsHero = async () => {
    const t = await getTranslations("productsPage.hero");

    return (
        <section className="productsHero border-bottom">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6">
                            <div className="productsHero_content">
                                <Reveal animation="fade-up" trigger="load">
                                    <span className="productsHero_num">{t("badge")}</span>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="productsHero_title fsz-60 fw-600 lh-2">
                                        <span className="productsHero_title_strong">
                                            {t("titleStrong")}
                                        </span>{" "}
                                        <span className="productsHero_title_muted cr-blue fw-500">
                                            {t("titleMuted")}
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="productsHero_description">
                                        {t("description")}
                                    </p>
                                </Reveal>

                                <div className="productsHero_actions">
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
                                        <a href="#use-cases" className="butn border">
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
                                <div className="productsHero_visual">
                                    <img
                                        src="/images/products-hero.png"
                                        alt={t("imageAlt")}
                                        className="productsHero_img"
                                    />
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default productsHero;
