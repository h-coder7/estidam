"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT_HELP_ENDPOINT, readContactHelpPayload } from "@/components/contact/ContactHelp/ContactHelpForm";

export type ProductDemoOption = {
    id: string;
    label: string;
};

type ProductDemoFormProps = {
    badge: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    description: string;
    points: string[];
    products: ProductDemoOption[];
};

const ProductDemoForm = ({
    badge,
    titleBefore,
    titleAccent,
    titleAfter,
    description,
    points,
    products,
}: ProductDemoFormProps) => {
    const t = useTranslations("productsPage.demo");
    const locale = useLocale();
    const [product, setProduct] = useState(products[0]?.id || "");
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const punctuationOnly = /^[?؟.,،]+$/.test(titleAfter);
    const titleAfterText = punctuationOnly || !titleAfter ? "" : ` ${titleAfter}`;

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (sending) return;

        const form = event.currentTarget;
        const payload = readContactHelpPayload(form);
        const selected = products.find((item) => item.id === product);
        const productLine = locale === "ar" ? `المنتج: ${selected?.label || product}` : `Product: ${selected?.label || product}`;
        payload.message = [productLine, payload.message].filter(Boolean).join("\n\n");
        setSending(true);
        setStatus(null);

        try {
            const response = await fetch(CONTACT_HELP_ENDPOINT, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...payload, locale }),
            });
            const result = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
            const message = typeof result?.message === "string" ? result.message : "";

            if (!response.ok || result?.success === false) {
                setStatus({ type: "error", message: message || t("sendFailed") });
                return;
            }

            form.reset();
            setStatus({ type: "success", message });
        } catch {
            setStatus({ type: "error", message: t("sendFailed") });
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="products_demo border-top" id="product-demo">
            <div className="container">
                <div className="products_demo_wrap col-lg-10 mx-auto">
                    <div className="products_demo_card">
                        <div className="row g-0">
                            <div className="col-lg-5">
                                <div className="products_demo_side">
                                    {badge ? <span className="products_demo_badge">{badge}</span> : null}

                                    <h2 className="products_demo_title fw-600">
                                        {titleBefore ? <span className="d-inline">{titleBefore}</span> : null}
                                        {titleBefore && titleAccent ? " " : null}
                                        {titleAccent ? (
                                            <span className="d-inline products_demo_title_muted">
                                                {punctuationOnly ? `${titleAccent}${titleAfter}` : titleAccent}
                                            </span>
                                        ) : null}
                                        {titleAfterText ? <span className="d-inline">{titleAfterText}</span> : null}
                                    </h2>

                                    {description ? <p className="products_demo_text">{description}</p> : null}

                                    {points.length ? (
                                        <ul className="products_demo_points list-unstyled mb-0">
                                            {points.map((point) => (
                                                <li className="d-flex align-items-center" key={point}>
                                                    <span className="products_demo_check" aria-hidden="true">
                                                        <i className="fal fa-check"></i>
                                                    </span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <form className="products_demo_form" onSubmit={onSubmit}>
                                    <input type="hidden" name="requestType" value="product_demo" />
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
                                            {products.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    className={`products_demo_product${product === item.id ? " is-active" : ""}`}
                                                    aria-pressed={product === item.id}
                                                    onClick={() => setProduct(item.id)}
                                                >
                                                    {item.label}
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
                                        <input id="product-demo-consent" name="consent" type="checkbox" value="yes" required />
                                        <span>{t("consent")}</span>
                                    </label>

                                    <div className="products_demo_actions d-flex flex-wrap align-items-center justify-content-between">
                                        <button className="butn butn-blue" type="submit" disabled={sending}>
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

                                        {status ? (
                                            <p className={`products_demo_status is_${status.type}`} role="status">
                                                {status.message}
                                            </p>
                                        ) : null}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDemoForm;
