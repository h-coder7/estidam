import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductCapabilities.scss";

const itemIds = [
    "recruitment",
    "contracts",
    "lifecycle",
    "attendance",
    "alerts",
    "dashboards",
] as const;

const panelImage = "/images/product-det/capability-contracts.png";

const ProductCapabilities = async () => {
    const t = await getTranslations("productsPage.detail.capabilities");

    return (
        <section className="products_capabilities" id="product-capabilities">
            <div className="products_capabilities_head">
                <div className="container">
                    <div className="row align-items-center justify-content-between gy-4 px-lg-4">
                        <div className="col-lg-6">
                            <Reveal animation="fade-up">
                                <span className="products_capabilities_badge">{t("badge")}</span>
                                <h2 className="products_capabilities_title fw-500">
                                    <span className="d-block">{t("titleStrong")}</span>
                                    <span className="d-block products_capabilities_title_muted cr-blue">{t("titleMuted")}</span>
                                </h2>
                            </Reveal>
                        </div>
                        <div className="col-lg-5">
                            <Reveal animation="fade-up">
                                <p className="products_capabilities_description mb-0">{t("description")}</p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="accordion products_capabilities_list" id="productCapabilitiesAccordion">
                    {itemIds.map((id) => {
                        const isDefault = id === "contracts";
                        const buttonId = `product_capability_${id}`;
                        const panelId = `product_capability_panel_${id}`;

                        return (
                            <div className="accordion-item products_capabilities_item" key={id}>
                                <h3 className="accordion-header" id={buttonId}>
                                    <button
                                        className={`accordion-button products_capabilities_trigger${isDefault ? "" : " collapsed"}`}
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#${panelId}`}
                                        aria-expanded={isDefault}
                                        aria-controls={panelId}
                                    >
                                        <span className="products_capabilities_icon">
                                            <img
                                                className="products_capabilities_icon_idle"
                                                src="/images/product-det/capability-icon.svg"
                                                alt=""
                                                width={24}
                                                height={24}
                                            />
                                            <img
                                                className="products_capabilities_icon_active"
                                                src="/images/product-det/capability-icon-active.svg"
                                                alt=""
                                                width={24}
                                                height={24}
                                            />
                                        </span>
                                        <span className="products_capabilities_name fw-500">
                                            {t(`items.${id}.title`)}
                                        </span>
                                        <span className="products_capabilities_arrows">
                                            <img
                                                className="products_capabilities_arrow is_next"
                                                src="/images/product-det/capability-arrow.svg"
                                                alt=""
                                                width={34}
                                                height={34}
                                            />
                                            <img
                                                className="products_capabilities_arrow is_down"
                                                src="/images/product-det/capability-arrow-down.svg"
                                                alt=""
                                                width={34}
                                                height={34}
                                            />
                                        </span>
                                    </button>
                                </h3>
                                <div
                                    id={panelId}
                                    className={`accordion-collapse collapse${isDefault ? " show" : ""}`}
                                    aria-labelledby={buttonId}
                                    data-bs-parent="#productCapabilitiesAccordion"
                                >
                                    <div className="accordion-body products_capabilities_panel_grid">
                                        <div className="products_capabilities_copy">
                                            <p className="products_capabilities_label fw-600">{t("doesLabel")}</p>
                                            <p className="products_capabilities_text">{t("items.contracts.does")}</p>
                                            <p className="products_capabilities_label fw-600">{t("valueLabel")}</p>
                                            <p className="products_capabilities_text">{t("items.contracts.value")}</p>
                                            <p className="products_capabilities_note">{t("items.contracts.interface")}</p>
                                        </div>
                                        <div className="products_capabilities_shot">
                                            <img src={panelImage} alt={t("items.contracts.imageAlt")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="sec-lines"><span></span><span></span></div>
            </div>
        </section>
    );
};

export default ProductCapabilities;
