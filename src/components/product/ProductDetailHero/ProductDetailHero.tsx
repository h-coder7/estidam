import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductDetailHero.scss";

type ProductDetailHeroProps = {
    productId: "hrh" | "mayar" | "maydan";
};

const ProductDetailHero = async ({ productId }: ProductDetailHeroProps) => {
    const t = await getTranslations(`productsPage.detail.${productId}`);
    const points = t.raw("points") as string[];

    return (
        <section className="productDetailHero">
            <div className="container">
                <div className="content">
                    <div className="row align-items-center justify-content-between g-4 g-lg-5">
                        <div className="col-lg-6">
                            <div className="productDetailHero_content">
                                {productId === "hrh" && (
                                    <Reveal animation="fade-up" trigger="load">
                                        <div className="productDetailHero_logo">
                                            <span className="productDetailHero_logo_mark" aria-hidden="true">HR</span>
                                            <span className="productDetailHero_logo_ar">حج</span>
                                        </div>
                                    </Reveal>
                                )}

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="productDetailHero_badge mb-0">
                                        <span className="productDetailHero_dot" aria-hidden="true"></span>
                                        {t("badge")}
                                    </p>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="productDetailHero_title fw-600">
                                        <span className="d-block productDetailHero_title_strong">{t("titleStrong")}</span>
                                        <span className="d-block productDetailHero_title_accent">{t("titleAccent")}</span>
                                    </h1>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="productDetailHero_description">{t("description")}</p>
                                </Reveal>

                                <div className="productDetailHero_actions d-flex flex-wrap align-items-center">
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
                                        <a href="#" className="butn border">
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

                                <ul className="productDetailHero_points list-unstyled mb-0">
                                    {points.map((point) => (
                                        <li className="d-flex align-items-center" key={point}>
                                            <i className="fal fa-check" aria-hidden="true"></i>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="productDetailHero_visual">
                                    <img
                                        src="/images/product-det/hero1.png"
                                        alt={t("imageAlt")}
                                        className="productDetailHero_img"
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

export default ProductDetailHero;
