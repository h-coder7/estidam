"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/animations/Reveal";
import ProductCard, { type ProductCardView } from "@/components/products/ProductCard/ProductCard";

type FilterId = "all" | "available" | "soon";

export type ProductsListView = {
    badge: string;
    titleStrong: string;
    titleMuted: string;
    showFilter: boolean;
    filters: { id: FilterId; label: string }[];
    labels: {
        problem: string;
        users: string;
        capabilities: string;
        statusAvailable: string;
        statusSoon: string;
    };
    cards: ProductCardView[];
};

const ProductsListClient = ({ badge, titleStrong, titleMuted, showFilter, filters, labels, cards }: ProductsListView) => {
    const [filter, setFilter] = useState<FilterId>("all");

    const counts = useMemo(
        () => ({
            all: cards.length,
            available: cards.filter((item) => item.status === "available").length,
            soon: cards.filter((item) => item.status === "soon").length,
        }),
        [cards],
    );

    const visible = cards.filter((item) => filter === "all" || item.status === filter);

    return (
        <section className="productsList" id="products-list">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-end justify-content-between productsList_head">
                        <div className="col-lg-7">
                            <Reveal animation="fade-up" trigger="load">
                                <span className="productsList_badge">{badge}</span>
                                <h2 className="productsList_title fw-600">
                                    {titleStrong ? <span>{titleStrong}</span> : null}
                                    {titleStrong && titleMuted ? " " : null}
                                    {titleMuted ? <span className="cr-blue">{titleMuted}</span> : null}
                                </h2>
                            </Reveal>
                        </div>

                        {showFilter ? (
                            <div className="col-lg-5">
                                <Reveal animation="fade-up" trigger="load">
                                    <div className="productsList_filters ms-lg-auto" role="group" aria-label={badge}>
                                        {filters.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                className={`productsList_filter${filter === item.id ? " is-active" : ""}`}
                                                aria-pressed={filter === item.id}
                                                onClick={() => setFilter(item.id)}
                                            >
                                                <span>{item.label}</span>
                                                <span className="productsList_filter_count">{counts[item.id]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>
                        ) : null}
                    </div>

                    <div className="productsList_cards">
                        {visible.map((product) => {
                            const index = cards.findIndex((item) => item.id === product.id);

                            return (
                                <Reveal animation="fade-up" trigger="load" className="productsList_card_wrap" key={product.id}>
                                    <ProductCard product={product} index={index} items={cards} labels={labels} />
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
