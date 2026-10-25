import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductChallenges.scss";

type ChallengeItem = {
    number: string;
    title: string;
    description: string;
};

const nodes = [
    { key: "files", className: "is-files" },
    { key: "contracts", className: "is-contracts" },
    { key: "shifts", className: "is-shifts" },
    { key: "chat", className: "is-chat" },
    { key: "attendance", className: "is-attendance" },
] as const;

const ProductChallenges = async () => {
    const t = await getTranslations("productsPage.detail.challenges");
    const items = t.raw("items") as ChallengeItem[];

    return (
        <section className="products_challenges" id="product-challenges">
            <div className="container">
                <div className="products_challenges_grid px-lg-4">
                    <Reveal className="products_challenges_reveal is-head" animation="fade-up">
                        <div className="products_challenges_head">
                            <span className="products_challenges_badge">{t("badge")}</span>
                            <h2 className="products_challenges_heading fw-500">
                                <span className="d-block">{t("titleStrong")}</span>
                                <span className="d-block products_challenges_heading_muted cr-blue">{t("titleMuted")}</span>
                            </h2>
                            <p className="products_challenges_lead mb-0">{t("description")}</p>
                        </div>
                    </Reveal>
                    {items.map((item, index) => (
                        <Reveal
                            className={`products_challenges_reveal${index === 0 ? " is-1" : ""}${index === 1 ? " is-2" : ""}`}
                            animation="fade-up"
                            key={item.number}
                        >
                            <article className="products_challenges_card">
                                <div className="products_challenges_top">
                                    <span className="products_challenges_icon">
                                        <img src="/images/product-det/challenge-icon.svg" alt="" />
                                    </span>
                                    <span className="products_challenges_num">{item.number}</span>
                                </div>
                                <h3 className="products_challenges_title fw-500">{item.title}</h3>
                                <span className="products_challenges_rule"></span>
                                <p className="products_challenges_text mb-0">{item.description}</p>
                            </article>
                        </Reveal>
                    ))}

                    <Reveal className="products_challenges_reveal is-map" animation="fade-up">
                        <article className="products_challenges_card products_challenges_map">
                            <div className="products_challenges_map_scale">
                                <div className="products_challenges_map_stage">
                                    <img
                                        className="products_challenges_lines"
                                        src="/images/product-det/pressure-lines.svg"
                                        alt=""
                                    />
                                    {nodes.map((node) => (
                                        <span
                                            className={`products_challenges_pill ${node.className}`}
                                            key={node.key}
                                        >
                                            {t(`nodes.${node.key}`)}
                                        </span>
                                    ))}
                                    <span className="products_challenges_dot is-d1"></span>
                                    <span className="products_challenges_dot is-d2"></span>
                                    <span className="products_challenges_dot is-d3"></span>
                                    <span className="products_challenges_dot is-d4"></span>
                                    <div className="products_challenges_hub">
                                        <img src="/images/product-det/pressure-alert.svg" alt="" />
                                        <span>
                                            {t("hubLine1")}
                                            <br />
                                            {t("hubLine2")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="products_challenges_caption mb-0">{t("caption")}</p>
                        </article>
                    </Reveal>
                </div>
            </div>
            <div className="sec-lines"><span></span><span></span></div>
        </section>
    );
};

export default ProductChallenges;
