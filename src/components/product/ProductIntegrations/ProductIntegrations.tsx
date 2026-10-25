import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductIntegrations.scss";

const nodes = [
    { id: "data", icon: "/images/product-det/integrations-icon-data.svg", width: 14, height: 15 },
    { id: "erp", icon: "/images/product-det/integrations-icon-erp.svg", width: 13, height: 13 },
    { id: "crm", icon: "/images/product-det/integrations-icon-crm.svg", width: 14, height: 13 },
    { id: "api", icon: "/images/product-det/integrations-icon-api.svg", width: 14, height: 11 },
    { id: "internal", icon: "/images/product-det/integrations-icon-internal.svg", width: 13, height: 13 },
    { id: "notify", icon: "/images/product-det/integrations-icon-bell.svg", width: 12, height: 13 },
    { id: "web", icon: "/images/product-det/integrations-icon-web.svg", width: 13, height: 13 },
] as const;

const links = [
    { id: "web", src: "/images/product-det/integrations-line-web.svg", width: 117 },
    { id: "notify", src: "/images/product-det/integrations-line-notify.svg", width: 179 },
    { id: "erp", src: "/images/product-det/integrations-line-erp.svg", width: 127 },
    { id: "api", src: "/images/product-det/integrations-line-api.svg", width: 110 },
    { id: "data", src: "/images/product-det/integrations-line-data.svg", width: 145 },
    { id: "internal", src: "/images/product-det/integrations-line-internal.svg", width: 104 },
    { id: "crm", src: "/images/product-det/integrations-line-crm.svg", width: 78 },
] as const;

const chipIcons = [
    "/images/product-det/integrations-chip-data.svg",
    "/images/product-det/integrations-chip-lock.svg",
    "/images/product-det/integrations-chip-spark.svg",
] as const;

const chipTones = ["", "is-dark", "is-gold"] as const;

type IntegrationNode = {
    title: string;
    text: string;
};

const ProductIntegrations = async () => {
    const t = await getTranslations("productsPage.detail.integrations");
    const items = t.raw("nodes") as IntegrationNode[];
    const chips = t.raw("chips") as string[];

    return (
        <section className="products_integrations" id="product-integrations">
            <div className="container">
                <div className="row align-items-center gy-5 px-lg-4">
                    <div className="col-lg-5">
                        <Reveal animation="fade-up">
                            <span className="products_integrations_badge">{t("badge")}</span>
                            <h2 className="products_integrations_title fw-500">
                                {t("titleStrong")}{" "}
                                <span className="products_integrations_title_muted cr-blue">{t("titleMuted")}</span>
                            </h2>
                            <p className="products_integrations_description">{t("description")}</p>
                            <div className="products_integrations_note">
                                <img src="/images/product-det/integrations-info.svg" alt="" width={24} height={24} />
                                <p>
                                    <strong>{t("noteStrong")} </strong>
                                    {t("note")}
                                </p>
                            </div>
                            <div className="products_integrations_chips">
                                {chips.map((chip, index) => (
                                    <span className={`products_integrations_chip ${chipTones[index]}`} key={chip}>
                                        <img src={chipIcons[index]} alt="" width={14} height={14} />
                                        {chip}
                                    </span>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                    <div className="col-lg-7">
                        <Reveal animation="fade-up">
                            <div className="products_integrations_map">
                                <div className="products_integrations_scale">
                                    <div className="products_integrations_stage">
                                        {links.map((link) => (
                                            <span className={`products_integrations_link is-${link.id}`} key={link.id}>
                                                <img src={link.src} alt="" width={link.width} height={1} />
                                            </span>
                                        ))}
                                        <img
                                            className="products_integrations_dots"
                                            src="/images/product-det/integrations-links.svg"
                                            alt=""
                                            width={260}
                                            height={264}
                                        />
                                        <div className="products_integrations_hub">
                                            <div className="products_integrations_hub_face">
                                                <img
                                                    src="/images/product-det/integrations-hr.png"
                                                    alt=""
                                                    width={78}
                                                    height={43}
                                                />
                                                <span>{t("hub")}</span>
                                            </div>
                                        </div>
                                        {nodes.map((node, index) => (
                                            <article className={`products_integrations_node is-${node.id}`} key={node.id}>
                                                <span className="products_integrations_node_icon">
                                                    <img src={node.icon} alt="" width={node.width} height={node.height} />
                                                </span>
                                                <span>
                                                    <h3 className="products_integrations_node_title">{items[index].title}</h3>
                                                    <p className="products_integrations_node_text">{items[index].text}</p>
                                                </span>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductIntegrations;
