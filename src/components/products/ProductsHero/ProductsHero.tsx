import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductsHeroContent } from "@/lib/api/productsPage";
import { Link } from "@/i18n/routing";

import "./_ProductsHero.scss";

function HeroLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
    if (/^https?:\/\//i.test(href) || href.startsWith("#")) {
        return (
            <a href={href} className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}

const ProductsHero = async () => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.hero");
    const hero = await getProductsHeroContent(locale);
    const badge = hero?.eyebrow || t("badge");
    const titleStrong = hero ? hero.titleStrong : t("titleStrong");
    const titleMuted = hero ? hero.titleMuted : t("titleMuted");
    const description = hero?.description || t("description");
    const primaryLabel = hero ? hero.primaryLabel : t("primaryCta");
    const secondaryLabel = hero ? hero.secondaryLabel : t("secondaryCta");
    const primaryHref = hero?.primaryHref || "#products-list";
    const secondaryHref = hero?.secondaryHref || "#product-demo";
    const image = hero?.image || "/images/products-hero.png";

    return (
        <section className="productsHero border-bottom">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6">
                            <div className="productsHero_content">
                                <Reveal animation="fade-up" trigger="load">
                                    <span className="productsHero_num">{badge}</span>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="productsHero_title fsz-60 fw-600 lh-2">
                                        {titleStrong ? (
                                            <span className="productsHero_title_strong">{titleStrong}</span>
                                        ) : null}
                                        {titleStrong && titleMuted ? " " : null}
                                        {titleMuted ? (
                                            <span className="productsHero_title_muted cr-blue fw-500">
                                                {titleMuted}
                                            </span>
                                        ) : null}
                                    </h1>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="productsHero_description">{description}</p>
                                </Reveal>

                                <div className="productsHero_actions">
                                    {primaryLabel ? (
                                        <Reveal animation="fade-up" trigger="load">
                                            <HeroLink href={primaryHref} className="butn butn-blue">
                                                <span>{primaryLabel}</span>
                                                <img
                                                    src="/images/icons/arrow-wh.svg"
                                                    alt=""
                                                    className="butn-icon"
                                                    aria-hidden="true"
                                                />
                                            </HeroLink>
                                        </Reveal>
                                    ) : null}

                                    {secondaryLabel ? (
                                        <Reveal animation="fade-up" trigger="load">
                                            <HeroLink href={secondaryHref} className="butn border">
                                                <span>{secondaryLabel}</span>
                                                <img
                                                    src="/images/icons/arrow-bl.svg"
                                                    alt=""
                                                    className="butn-icon"
                                                    aria-hidden="true"
                                                />
                                            </HeroLink>
                                        </Reveal>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="productsHero_visual">
                                    <img
                                        src={image}
                                        alt={titleStrong || t("imageAlt")}
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

export default ProductsHero;
