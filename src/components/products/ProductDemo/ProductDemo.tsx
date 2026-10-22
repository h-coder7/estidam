"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/animations/Reveal";

import "./_ProductDemo.scss";

const products = ["hrh", "mayar", "maydan"] as const;
const points = ["point1", "point2", "point3"] as const;

type ProductId = (typeof products)[number];

const ProductDemo = () => {
    const t = useTranslations("productsPage.demo");
    const [product, setProduct] = useState<ProductId>("hrh");

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section className="products_demo border-top" id="product-demo">
            <div className="container">
                <Reveal animation="fade-up" trigger="load">
                    <div className="products_demo_wrap col-lg-10 mx-auto">
                        <div className="products_demo_card">
                            <div className="row g-0">
                                <div className="col-lg-5">
                                    <div className="products_demo_side">
                                        <span className="products_demo_badge">{t("badge")}</span>

                                        <h2 className="products_demo_title fw-600">
                                            <span className="d-inline">{t("title1")}</span>
                                            <span className="d-inline products_demo_title_muted">{t("title2")}</span>
                                            <span className="d-inline">{t("title3")}</span>
                                        </h2>

                                        <p className="products_demo_text">{t("text")}</p>

                                        <ul className="products_demo_points list-unstyled mb-0">
                                            {points.map((key) => (
                                                <li className="d-flex align-items-center" key={key}>
                                                    <span className="products_demo_check" aria-hidden="true">
                                                        <i className="fal fa-check"></i>
                                                    </span>
                                                    <span>{t(key)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-lg-7">
                                    <form className="products_demo_form" onSubmit={onSubmit}>
                                        <input type="hidden" name="product" value={product} />

                                        <div className="products_demo_field">
                                            <p className="products_demo_label mb-2" id="product-demo-product-label">
                                                {t("product")}
                                                <span aria-hidden="true"> *</span>
                                            </p>
                                            <div
                                                className="products_demo_products d-flex flex-wrap"
                                                role="group"
                                                aria-labelledby="product-demo-product-label"
                                            >
                                                {products.map((id) => (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        className={`products_demo_product${product === id ? " is-active" : ""}`}
                                                        aria-pressed={product === id}
                                                        onClick={() => setProduct(id)}
                                                    >
                                                        {t(`products.${id}`)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="visually-hidden" htmlFor="product-demo-name">
                                                    {t("fullName")}
                                                </label>
                                                <input
                                                    id="product-demo-name"
                                                    className="products_demo_input"
                                                    name="fullName"
                                                    type="text"
                                                    autoComplete="name"
                                                    placeholder={`${t("fullName")} *`}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="visually-hidden" htmlFor="product-demo-organization">
                                                    {t("organization")}
                                                </label>
                                                <input
                                                    id="product-demo-organization"
                                                    className="products_demo_input"
                                                    name="organization"
                                                    type="text"
                                                    autoComplete="organization"
                                                    placeholder={`${t("organization")} *`}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="visually-hidden" htmlFor="product-demo-job">
                                                    {t("jobTitle")}
                                                </label>
                                                <input
                                                    id="product-demo-job"
                                                    className="products_demo_input"
                                                    name="jobTitle"
                                                    type="text"
                                                    autoComplete="organization-title"
                                                    placeholder={t("jobTitle")}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="visually-hidden" htmlFor="product-demo-email">
                                                    {t("email")}
                                                </label>
                                                <input
                                                    id="product-demo-email"
                                                    className="products_demo_input"
                                                    name="email"
                                                    type="email"
                                                    dir="ltr"
                                                    autoComplete="email"
                                                    placeholder={`${t("email")} *`}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="visually-hidden" htmlFor="product-demo-mobile">
                                                    {t("mobile")}
                                                </label>
                                                <input
                                                    id="product-demo-mobile"
                                                    className="products_demo_input"
                                                    name="mobile"
                                                    type="tel"
                                                    dir="ltr"
                                                    autoComplete="tel"
                                                    placeholder={`${t("mobile")} *`}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="visually-hidden" htmlFor="product-demo-message">
                                                    {t("message")}
                                                </label>
                                                <textarea
                                                    id="product-demo-message"
                                                    className="products_demo_input"
                                                    name="message"
                                                    rows={3}
                                                    placeholder={t("message")}
                                                />
                                            </div>
                                        </div>

                                        <label className="products_demo_consent" htmlFor="product-demo-consent">
                                            <input
                                                id="product-demo-consent"
                                                name="consent"
                                                type="checkbox"
                                                value="yes"
                                                required
                                            />
                                            <span>{t("consent")}</span>
                                        </label>

                                        <div className="products_demo_actions d-flex flex-wrap align-items-center justify-content-between">
                                            <button className="butn butn-blue" type="submit">
                                                <span>{t("submit")}</span>
                                                <img
                                                    src="/images/icons/arrow-wh.svg"
                                                    alt=""
                                                    className="butn-icon"
                                                    aria-hidden="true"
                                                />
                                            </button>

                                            <p className="products_demo_note mb-0">
                                                <i className="fal fa-lock" aria-hidden="true"></i>
                                                <span>{t("privacy")}</span>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default ProductDemo;
