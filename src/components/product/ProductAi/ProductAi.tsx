import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductAi } from "@/lib/api/productsPage";

import "./_ProductAi.scss";

const cards = [
    { shape: "/images/product-det/ai-card-1.svg", icon: "/images/product-det/ai-icon-users.svg" },
    { shape: "/images/product-det/ai-card-2.svg", icon: "/images/product-det/ai-icon-match.svg" },
    { shape: "/images/product-det/ai-card-3.svg", icon: "/images/product-det/ai-icon-shift.svg" },
    { shape: "/images/product-det/ai-card-4.svg", icon: "/images/product-det/ai-icon-chat.svg" },
] as const;

type AiCard = {
    title: string;
    text: string;
};

const ProductAi = async ({ productId }: { productId: "hrh" | "mayar" | "maydan" }) => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.detail.ai");
    const capabilities = await getProductAi(locale, productId);
    const fallback = t.raw("cards") as AiCard[];
    const fromApi = capabilities.map((item) => ({ title: item.title, text: item.text }));
    const items = fromApi.length ? [...fromApi, ...fallback.slice(fromApi.length)] : fallback;

    return (
        <section className="products_ai" id="product-ai">
            <div className="container">
                <div className="products_ai_head row align-items-center justify-content-between gy-4 px-lg-4">
                    <div className="col-lg-6">
                        <Reveal animation="fade-up">
                            <span className="products_ai_badge">{t("badge")}</span>
                            <h2 className="products_ai_title fw-500">
                                <span className="d-block">{t("titleStrong")}</span>
                                <span className="d-block products_ai_title_muted cr-blue">{t("titleMuted")}</span>
                            </h2>
                        </Reveal>
                    </div>
                    <div className="col-lg-5">
                        <Reveal animation="fade-up">
                            <p className="products_ai_description mb-0">{t("description")}</p>
                        </Reveal>
                    </div>
                </div>

                <div className="row align-items-center gy-4 px-lg-4">
                    <div className="col-lg-6">
                        <Reveal animation="fade-up">
                            <div className="products_ai_board">
                                <div className="products_ai_grid">
                                    {items.map((item, index) => {
                                        const card = cards[index % cards.length];

                                        return (
                                        <article className="products_ai_card" key={`${item.title}-${index}`}>
                                            <img
                                                className="products_ai_card_shape"
                                                src={card.shape}
                                                alt=""
                                                width={310}
                                                height={226}
                                            />
                                            <div className="products_ai_card_body">
                                                <span className="products_ai_icon">
                                                    <img src={card.icon} alt="" width={24} height={24} />
                                                </span>
                                                <h3 className="products_ai_card_title fw-500">{item.title}</h3>
                                                <p className="products_ai_card_text mb-0">{item.text}</p>
                                            </div>
                                        </article>
                                        );
                                    })}
                                    <div className="products_ai_pill">
                                        <img src="/images/product-det/ai-icon-layers.svg" alt="" width={24} height={24} />
                                        <span>
                                            <span className="products_ai_pill_title fw-500">{t("pillTitle")}</span>
                                            <span className="products_ai_pill_text">{t("pillText")}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="products_ai_governance">
                                    <img src="/images/product-det/ai-icon-shield.svg" alt="" width={30} height={30} />
                                    <div>
                                        <h3 className="products_ai_governance_title fw-500">{t("governanceTitle")}</h3>
                                        <p className="products_ai_governance_text mb-0">{t("governanceText")}</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                    <div className="col-lg-6">
                        <Reveal animation="fade-up">
                            <img
                                className="products_ai_visual"
                                src="/images/product-det/ai-img.png"
                                alt={t("imageAlt")}
                            />
                        </Reveal>
                    </div>
                </div>
            </div>
            <img src="/images/product-det/ai-bg-light.png" alt="" className="bg-pattern" />
        </section>
    );
};

export default ProductAi;
