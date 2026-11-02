import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductCapabilities } from "@/lib/api/productsPage";

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

type CapabilityView = {
    id: string;
    title: string;
    does: string;
    value: string;
    note: string;
    image: string;
    imageAlt: string;
};

const ProductCapabilities = async ({ productId }: { productId: "hrh" | "mayar" | "maydan" }) => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.detail.capabilities");
    const capabilities = await getProductCapabilities(locale, productId);
    const items: CapabilityView[] = capabilities.length
        ? capabilities.map((item, index) => ({
              id: `cap-${index + 1}`,
              title: item.title,
              does: item.text,
              value: t("items.contracts.value"),
              note: t("items.contracts.interface"),
              image: panelImage,
              imageAlt: t("items.contracts.imageAlt"),
          }))
        : itemIds.map((id) => ({
              id,
              title: t(`items.${id}.title`),
              does: id === "contracts" ? t("items.contracts.does") : "",
              value: id === "contracts" ? t("items.contracts.value") : "",
              note: id === "contracts" ? t("items.contracts.interface") : "",
              image: id === "contracts" ? panelImage : "",
              imageAlt: id === "contracts" ? t("items.contracts.imageAlt") : "",
          }));

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
                <div className="accordion products_capabilities_list" id={`productCapabilitiesAccordion-${productId}`}>
                    {items.map((item, index) => {
                        const isDefault = index === 0;
                        const buttonId = `product_capability_${productId}_${item.id}`;
                        const panelId = `product_capability_panel_${productId}_${item.id}`;

                        return (
                            <div className="accordion-item products_capabilities_item" key={item.id}>
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
                                        <span className="products_capabilities_name fw-500">{item.title}</span>
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
                                    data-bs-parent={`#productCapabilitiesAccordion-${productId}`}
                                >
                                    <div className="accordion-body products_capabilities_panel_grid">
                                        <div className="products_capabilities_copy">
                                            {item.does ? (
                                                <>
                                                    <p className="products_capabilities_label fw-600">{t("doesLabel")}</p>
                                                    <p className="products_capabilities_text">{item.does}</p>
                                                </>
                                            ) : null}
                                            {item.value ? (
                                                <>
                                                    <p className="products_capabilities_label fw-600">{t("valueLabel")}</p>
                                                    <p className="products_capabilities_text">{item.value}</p>
                                                </>
                                            ) : null}
                                            {item.note ? <p className="products_capabilities_note">{item.note}</p> : null}
                                        </div>
                                        {item.image ? (
                                            <div className="products_capabilities_shot">
                                                <img src={item.image} alt={item.imageAlt} />
                                            </div>
                                        ) : null}
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
