"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/animations/Reveal";
import ProductCard from "@/components/products/ProductCard/ProductCard";
import type { ProductItem } from "./ProductsList";

type ProductStatus = "available" | "soon";
type FilterId = "all" | ProductStatus;

const filters: { id: FilterId; label: "filterAll" | "filterAvailable" | "filterSoon" }[] = [
    { id: "all", label: "filterAll" },
    { id: "available", label: "filterAvailable" },
    { id: "soon", label: "filterSoon" },
];

const ProductsListClient = ({ items }: { items: readonly ProductItem[] }) => {
    const t = useTranslations("productsPage.list");
    const [filter, setFilter] = useState<FilterId>("all");

    const counts = useMemo(
        () => ({
            all: items.length,
            available: items.filter((item) => item.status === "available").length,
            soon: items.filter((item) => item.status === "soon").length,
        }),
        [items]
    );

    const visible = items.filter((item) => filter === "all" || item.status === filter);

    return (
        <section className="productsList" id="products-list">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-end justify-content-between productsList_head">
                        <div className="col-lg-7">
                            <Reveal animation="fade-up" trigger="load">
                                <span className="productsList_badge">{t("badge")}</span>
                                <h2 className="productsList_title fw-600">
                                    <span>{t("titleStrong")}</span>{" "}
                                    <span className="cr-blue">{t("titleMuted")}</span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <div
                                    className="productsList_filters ms-lg-auto"
                                    role="group"
                                    aria-label={t("badge")}
                                >
                                    {filters.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            className={`productsList_filter${filter === item.id ? " is-active" : ""}`}
                                            aria-pressed={filter === item.id}
                                            onClick={() => setFilter(item.id)}
                                        >
                                            <span>{t(item.label)}</span>
                                            <span className="productsList_filter_count">{counts[item.id]}</span>
                                        </button>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>

                    <div className="productsList_cards">
                        {visible.map((product) => {
                            const index = items.findIndex((item) => item.id === product.id);

                            return (
                                <Reveal animation="fade-up" trigger="load" className="productsList_card_wrap" key={product.id}>
                                    <ProductCard product={product} index={index} items={items} />
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductsListClient;
