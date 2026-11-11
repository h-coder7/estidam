import { getLocale } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductAi } from "@/lib/api/productsPage";

import "./_ProductAi.scss";

const shapes = [
    "/images/product-det/ai-card-1.svg",
    "/images/product-det/ai-card-2.svg",
    "/images/product-det/ai-card-3.svg",
    "/images/product-det/ai-card-4.svg",
] as const;

const icons: Record<string, string> = {
    users: "/images/product-det/ai-icon-users.svg",
    usercheck: "/images/product-det/ai-icon-match.svg",
    repeat: "/images/product-det/ai-icon-shift.svg",
    messagecircle: "/images/product-det/ai-icon-chat.svg",
    messagesquare: "/images/product-det/ai-icon-chat.svg",
    shield: "/images/product-det/ai-icon-shield.svg",
    layers: "/images/product-det/ai-icon-layers.svg",
};

const cardIcon = (name: string) => icons[name.toLowerCase().replace(/[\s_-]/g, "")] || icons.users;

const ProductAi = async ({ productId }: { productId: "hrh" | "mayar" | "maydan" }) => {
    const locale = await getLocale();
    const section = await getProductAi(locale, productId);
    if (!section) return null;

    const hasHead = section.eyebrow || section.titleStrong || section.titleMuted || section.description;
    const hasBoard = section.cards.length || section.badgeTitle || section.badgeText || section.governanceTitle || section.governanceText;

    return (
        <section className="products_ai" id="product-ai">
            <div className="container">
                {hasHead ? (
                    <div className="products_ai_head row align-items-center justify-content-between gy-4 px-lg-4">
                        <div className="col-lg-6">
                            <Reveal animation="fade-up">
                                {section.eyebrow ? <span className="products_ai_badge">{section.eyebrow}</span> : null}
                                {section.titleStrong || section.titleMuted ? (
                                    <h2 className="products_ai_title fw-500">
                                        {section.titleStrong ? <span className="d-block">{section.titleStrong}</span> : null}
                                        {section.titleMuted ? (
                                            <span className="d-block products_ai_title_muted cr-blue">{section.titleMuted}</span>
                                        ) : null}
                                    </h2>
                                ) : null}
                            </Reveal>
                        </div>
                        {section.description ? (
                            <div className="col-lg-5">
                                <Reveal animation="fade-up">
                                    <p className="products_ai_description mb-0">{section.description}</p>
                                </Reveal>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div className="row align-items-center gy-4 px-lg-4">
                    {hasBoard ? (
                        <div className={section.image ? "col-lg-6" : "col-12"}>
                            <Reveal animation="fade-up">
                                <div className="products_ai_board">
                                    {section.cards.length || section.badgeTitle || section.badgeText ? (
                                        <div className="products_ai_grid">
                                            {section.cards.map((item, index) => (
                                                <article className="products_ai_card" key={`${item.title}-${index}`}>
                                                    <img
                                                        className="products_ai_card_shape"
                                                        src={shapes[index % shapes.length]}
                                                        alt=""
                                                        width={310}
                                                        height={226}
                                                    />
                                                    <div className="products_ai_card_body">
                                                        <span className="products_ai_icon">
                                                            <img src={cardIcon(item.icon)} alt="" width={24} height={24} />
                                                        </span>
                                                        {item.title ? <h3 className="products_ai_card_title fw-500">{item.title}</h3> : null}
                                                        {item.text ? <p className="products_ai_card_text mb-0">{item.text}</p> : null}
                                                    </div>
                                                </article>
                                            ))}
                                            {section.badgeTitle || section.badgeText ? (
                                                <div className="products_ai_pill">
                                                    <img src="/images/product-det/ai-icon-layers.svg" alt="" width={24} height={24} />
                                                    <span>
                                                        {section.badgeTitle ? (
                                                            <span className="products_ai_pill_title fw-500">{section.badgeTitle}</span>
                                                        ) : null}
                                                        {section.badgeText ? (
                                                            <span className="products_ai_pill_text">{section.badgeText}</span>
                                                        ) : null}
                                                    </span>
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null}
                                    {section.governanceTitle || section.governanceText ? (
                                        <div className="products_ai_governance">
                                            <img src="/images/product-det/ai-icon-shield.svg" alt="" width={30} height={30} />
                                            <div>
                                                {section.governanceTitle ? (
                                                    <h3 className="products_ai_governance_title fw-500">{section.governanceTitle}</h3>
                                                ) : null}
                                                {section.governanceText ? (
                                                    <p className="products_ai_governance_text mb-0">{section.governanceText}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </Reveal>
                        </div>
                    ) : null}
                    {section.image ? (
                        <div className="col-lg-6">
                            <Reveal animation="fade-up">
                                <img className="products_ai_visual" src={section.image} alt={section.titleStrong || section.eyebrow} />
                            </Reveal>
                        </div>
                    ) : null}
                </div>
            </div>
            <img src="/images/product-det/ai-bg-light.png" alt="" className="bg-pattern" />
        </section>
    );
};

export default ProductAi;
