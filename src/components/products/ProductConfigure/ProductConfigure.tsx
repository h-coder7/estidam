import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductsConfigureContent } from "@/lib/api/productsPage";

import "./_ProductConfigure.scss";

const fallbackCards = [1, 2, 3] as const;
const fallbackIcons = ["fa-regular fa-cog", "fa-regular fa-plug", "fa-regular fa-shield-check"];

const ProductConfigure = async () => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.configure");
    const content = await getProductsConfigureContent(locale);
    const badge = content?.eyebrow || t("badge");
    const titleStrong = content ? content.titleStrong : t("titleStrong");
    const titleMuted = content ? content.titleMuted : t("titleMuted");
    const cards =
        content && content.cards.length
            ? content.cards.map((card, index) => ({
                  title: card.title,
                  text: card.text,
                  icon: card.icon || fallbackIcons[index % fallbackIcons.length],
              }))
            : fallbackCards.map((card, index) => ({
                  title: t(`card${card}Title`),
                  text: t(`card${card}Text`),
                  icon: fallbackIcons[index],
              }));

    return (
        <section className="products_configure border-top" id="product-configure">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="products_configure_head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="products_configure_badge">{badge}</span>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <h2 className="products_configure_title fw-600">
                                {titleStrong ? (
                                    <span className="d-block products_configure_title_strong">{titleStrong}</span>
                                ) : null}
                                {titleMuted ? (
                                    <span className="d-block products_configure_title_muted fw-500">{titleMuted}</span>
                                ) : null}
                            </h2>
                        </Reveal>
                    </div>
                </div>

                <div className="products_configure_grid row g-0 border-top">
                    {cards.map((card) => (
                        <div className="col-lg-4 col-md-6" key={card.title}>
                            <Reveal animation="fade-up" trigger="load">
                                <article className="products_configure_card">
                                    <div className="products_configure_icon">
                                        <i className={card.icon} aria-hidden="true"></i>
                                    </div>
                                    <h3 className="products_configure_card_title fw-600">{card.title}</h3>
                                    <p className="products_configure_card_text mb-0">{card.text}</p>
                                </article>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default ProductConfigure;
