import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { Link } from "@/i18n/routing";

import "./_ProductRelated.scss";

const cards = [
    { id: "maydan", href: "/products/maydan", tone: "is-dark" },
    { id: "mayar", href: "/products/mayar", tone: "" },
] as const;

const glows = [
    { id: "1", src: "/images/product-det/related-glow-1.svg", width: 581, height: 471 },
    { id: "2", src: "/images/product-det/related-glow-2.svg", width: 581, height: 473 },
    { id: "3", src: "/images/product-det/related-glow-3.svg", width: 581, height: 471 },
] as const;

type RelatedItem = {
    title: string;
    text: string;
};

const ProductRelated = async () => {
    const t = await getTranslations("productsPage.detail.related");
    const items = t.raw("items") as RelatedItem[];

    return (
        <section className="products_related" id="product-related">
            <div className="container">
                <Reveal animation="fade-up">
                    <div className="section-title pt-100 pb-5 border-bottom px-lg-4">
                        <span className="products_related_badge">{t("badge")}</span>
                        <h2 className="products_related_title fw-500">
                            {t("titleStrong")}{" "}
                            <span className="products_related_title_muted cr-blue">{t("titleMuted")}</span>
                        </h2>
                    </div>
                </Reveal>
                <div className="cards pt-lg-4 px-lg-4">
                    <div className="row gy-4">
                        {cards.map((card, index) => (
                            <div className="col-lg-6" key={card.id}>
                                <Reveal animation="fade-up">
                                    <article className={`products_related_card mt-lg-5 ${card.tone}`}>
                                        {card.tone === "is-dark"
                                            ? glows.map((glow) => (
                                                <img
                                                    key={glow.id}
                                                    className={`products_related_glow is-${glow.id}`}
                                                    src={glow.src}
                                                    alt=""
                                                    width={glow.width}
                                                    height={glow.height}
                                                />
                                            ))
                                            : null}
                                        <span className={`products_related_logo is-${card.id}`} aria-hidden="true" />
                                        <div className="products_related_copy">
                                            <h3 className="products_related_name fw-500">{items[index].title}</h3>
                                            <p className="products_related_text">{items[index].text}</p>
                                            <Link href={card.href} className="products_related_link">
                                                {t("action")}
                                                <img
                                                    src="/images/product-det/related-arrow.svg"
                                                    alt=""
                                                    width={35}
                                                    height={35}
                                                />
                                            </Link>
                                        </div>
                                    </article>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="sec-lines"><span></span><span></span></div>
            </div>
        </section>
    );
};

export default ProductRelated;
