import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductConfigure.scss";

const cards = [
    { title: "card1Title", text: "card1Text", image: "/images/icons/figure1.svg" },
    { title: "card2Title", text: "card2Text", image: "/images/icons/figure2.svg" },
    { title: "card3Title", text: "card3Text", image: "/images/icons/figure3.svg" },
] as const;

const ProductConfigure = async () => {
    const t = await getTranslations("productsPage.configure");

    return (
        <section className="products_configure border-top" id="product-configure">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="products_configure_head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="products_configure_badge">{t("badge")}</span>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <h2 className="products_configure_title fw-600">
                                <span className="d-block products_configure_title_strong">{t("titleStrong")}</span>
                                <span className="d-block products_configure_title_muted fw-500">{t("titleMuted")}</span>
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
                                        <img src={card.image} alt="" aria-hidden="true" />
                                    </div>
                                    <h3 className="products_configure_card_title fw-600">{t(card.title)}</h3>
                                    <p className="products_configure_card_text mb-0">{t(card.text)}</p>
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
