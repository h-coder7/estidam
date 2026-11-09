"use client";

import { Link } from "@/i18n/routing";
import "./_ProductCard.scss";

export type ProductCardView = {
    id: string;
    status: "available" | "soon";
    image: string;
    reversed: boolean;
    notify: boolean;
    name: string;
    kicker: string;
    headline: string;
    problem: string;
    users: string;
    capabilities: string[];
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
};

type ProductCardProps = {
    product: ProductCardView;
    index: number;
    items: readonly { id: string }[];
    labels: {
        problem: string;
        users: string;
        capabilities: string;
        statusAvailable: string;
        statusSoon: string;
    };
};

const BellIcon = () => (
    <svg className="butn-icon" viewBox="0 0 35 35" aria-hidden="true">
        <path
            d="M35 20.4289C35 21.755 34.4732 23.0268 33.5355 23.9645L23.9645 33.5355C23.0268 34.4732 21.755 35 20.4289 35H5C2.23858 35 0 32.7614 0 30V5C0 2.23858 2.23858 0 5 0H30C32.7614 0 35 2.23858 35 5V20.4289Z"
            fill="var(--blue)"
        />
        <path
            d="M17.5 10.1a.75.75 0 0 1 .75.75v.55a4.35 4.35 0 0 1 3.45 4.25v1.85l.85 1.45a.75.75 0 0 1-.64 1.15h-8.82a.75.75 0 0 1-.64-1.15l.85-1.45v-1.85a4.35 4.35 0 0 1 3.45-4.25v-.55a.75.75 0 0 1 .75-.75Zm-1.35 11.15a1.45 1.45 0 0 0 2.7 0h-2.7Z"
            fill="#fff"
        />
    </svg>
);

const ProductCard = ({ product, index, items, labels }: ProductCardProps) => {
    return (
        <article className={`productCard${product.reversed ? " is-reversed" : ""}`}>
            <div className="row g-0">
                <div className="col-12 col-lg-auto order-1">
                    <div className="productCard_rail d-flex" aria-hidden="true">
                        {items.map((item, railIndex) => (
                            <span key={item.id} className={railIndex === index ? "is-active" : undefined}>
                                {String(railIndex + 1).padStart(2, "0")}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={`col-12 col-lg order-2 ${product.reversed ? "order-lg-3" : "order-lg-2"}`}>
                    <div className="productCard_media">
                        <span className={`productCard_status productCard_status_${product.status}`}>
                            {product.status === "available" ? labels.statusAvailable : labels.statusSoon}
                        </span>
                        <img src={product.image} alt={product.name} className="productCard_img" />
                    </div>
                </div>

                <div className={`col-12 col-lg order-3 ${product.reversed ? "order-lg-2" : "order-lg-3"}`}>
                    <div className="productCard_body">
                        <h3 className="productCard_name fw-600">{product.name}</h3>
                        {product.kicker ? <p className="productCard_kicker mb-0">{product.kicker}</p> : null}
                        {product.headline ? <p className="productCard_headline fw-600">{product.headline}</p> : null}

                        <div className="row g-2 productCard_facts">
                            <div className="col-md-6">
                                <div className="productCard_fact">
                                    <p className="productCard_fact_label">{labels.problem}</p>
                                    <p className="productCard_fact_text mb-0">{product.problem}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="productCard_fact">
                                    <p className="productCard_fact_label">{labels.users}</p>
                                    <p className="productCard_fact_text mb-0">{product.users}</p>
                                </div>
                            </div>
                        </div>

                        {product.capabilities.length ? (
                            <>
                                <p className="productCard_caps_label mb-0">{labels.capabilities}</p>
                                <div className="productCard_caps d-flex flex-wrap">
                                    {product.capabilities.map((capability) => (
                                        <span className="productCard_cap" key={capability}>
                                            <i className="fal fa-check me-1 fsz-10 cr-blue"></i>
                                            {capability}
                                        </span>
                                    ))}
                                </div>
                            </>
                        ) : null}

                        <div className="productCard_actions d-flex flex-wrap align-items-center">
                            {product.primaryLabel ? (
                                <Link href={product.primaryHref} className="butn butn-blue">
                                    <span>{product.primaryLabel}</span>
                                    <img
                                        src="/images/icons/arrow-wh.svg"
                                        alt=""
                                        className="butn-icon"
                                        aria-hidden="true"
                                    />
                                </Link>
                            ) : null}
                            {product.secondaryLabel ? (
                                <a href={product.secondaryHref} className="butn productCard_btn productCard_btn_light">
                                    <span>{product.secondaryLabel}</span>
                                    {product.notify ? (
                                        <BellIcon />
                                    ) : (
                                        <img
                                            src="/images/icons/arrow-bl.svg"
                                            alt=""
                                            className="butn-icon"
                                            aria-hidden="true"
                                        />
                                    )}
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
