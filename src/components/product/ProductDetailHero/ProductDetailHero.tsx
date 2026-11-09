import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductHeroContent } from "@/lib/api/productsPage";

import "./_ProductDetailHero.scss";

type ProductDetailHeroProps = {
    productId: "hrh" | "mayar" | "maydan";
};

const ProductDetailHero = async ({ productId }: ProductDetailHeroProps) => {
    const locale = await getLocale();
    const t = await getTranslations(`productsPage.detail.${productId}`);
    const hero = await getProductHeroContent(locale, productId);
    const points = t.raw("points") as string[];
    const badge = hero?.badge || t("badge");
    const titleStrong = hero?.title || t("titleStrong");
    const titleAccent = hero?.title ? "" : t("titleAccent");
    const description = hero ? hero.description : t("description");
    const secondaryLabel = hero?.secondaryLabel || t("secondaryCta");
    const fallbackImages = {
        hrh: "/images/products/product-01-hrh-seasonal-hiring.jpg",
        mayar: "/images/products/product-02-mayar-quality.jpg",
        maydan: "/images/products/product-03-maidan-field-ops.jpg",
    } as const;
    const image = hero?.image || fallbackImages[productId];

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
                                        {badge}
                                    </p>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="productDetailHero_title fw-600">
                                        {titleStrong ? (
                                            <span className="d-block productDetailHero_title_strong">{titleStrong}</span>
                                        ) : null}
                                        {titleAccent ? (
                                            <span className="d-block productDetailHero_title_accent">{titleAccent}</span>
                                        ) : null}
                                    </h1>
                                </Reveal>

                                {description ? (
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="productDetailHero_description">{description}</p>
                                    </Reveal>
                                ) : null}

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

                                    {secondaryLabel ? (
                                        <Reveal animation="fade-up" trigger="load">
                                            <a href="#" className="butn border">
                                                <span>{secondaryLabel}</span>
                                                <img
                                                    src="/images/icons/arrow-bl.svg"
                                                    alt=""
                                                    className="butn-icon"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </Reveal>
                                    ) : null}
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
                                    <img src={image} alt={badge || titleStrong} className="productDetailHero_img" />
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
