"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/animations/Reveal";
import { Link } from "@/i18n/routing";

import "./_ProductNext.scss";

const channels = [
    { id: "email", icon: "fal fa-envelope" },
    { id: "phone", icon: "fal fa-phone" },
    { id: "whatsapp", icon: "fab fa-whatsapp" },
] as const;

type ChannelId = (typeof channels)[number]["id"];

const ProductNext = () => {
    const t = useTranslations("productsPage.detail.next");
    const challenges = t.raw("challenges") as string[];
    const [channel, setChannel] = useState<ChannelId>("email");

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section className="products_next pt-80 pb-100" id="product-next">
            <div className="products_next_stripes" aria-hidden="true" />
            <div className="container">
                <div className="row align-items-start gy-5 px-lg-4">
                    <div className="col-lg-6">
                        <Reveal animation="fade-up">
                            <span className="products_next_badge">{t("badge")}</span>
                            <h2 className="products_next_title fw-500">
                                {t("titleStrong")}{" "}
                                <span className="products_next_title_muted">{t("titleMuted")}</span>
                            </h2>
                            <p className="products_next_description">{t("description")}</p>
                            <div className="products_next_actions d-flex flex-wrap align-items-center">
                                <a className="products_next_cta is-primary" href="#product-next-form">
                                    {t("demo")}
                                    <img src="/images/product-det/next-arrow-light.svg" alt="" width={35} height={35} />
                                </a>
                                <Link className="products_next_cta" href="/contact">
                                    {t("contact")}
                                    <img src="/images/product-det/related-arrow.svg" alt="" width={35} height={35} />
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                    <div className="col-lg-6">
                        <Reveal animation="fade-up">
                            <form className="products_next_card" id="product-next-form" onSubmit={onSubmit}>
                                <h3 className="products_next_form_title fw-500">
                                    {t("formTitleStrong")}{" "}
                                    <span className="products_next_title_muted">{t("formTitleMuted")}</span>
                                </h3>
                                <p className="products_next_form_note">{t("formNote")}</p>
                                <input type="hidden" name="product" value="hrh" />
                                <input type="hidden" name="channel" value={channel} />

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="products_next_label" htmlFor="product-next-name">
                                            {t("fullName")}
                                            <span aria-hidden="true"> *</span>
                                        </label>
                                        <input id="product-next-name" className="products_next_input" name="fullName" type="text" autoComplete="name" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="products_next_label" htmlFor="product-next-organization">
                                            {t("organization")}
                                            <span aria-hidden="true"> *</span>
                                        </label>
                                        <input id="product-next-organization" className="products_next_input" name="organization" type="text" autoComplete="organization" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="products_next_label" htmlFor="product-next-job">
                                            {t("jobTitle")}
                                            <span aria-hidden="true"> *</span>
                                        </label>
                                        <input id="product-next-job" className="products_next_input" name="jobTitle" type="text" autoComplete="organization-title" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="products_next_label" htmlFor="product-next-email">
                                            {t("email")}
                                            <span aria-hidden="true"> *</span>
                                        </label>
                                        <input
                                            id="product-next-email"
                                            className="products_next_input"
                                            name="email"
                                            type="email"
                                            dir="ltr"
                                            autoComplete="email"
                                            placeholder={t("emailPlaceholder")}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="products_next_label" htmlFor="product-next-mobile">
                                            {t("mobile")}
                                            <span aria-hidden="true"> *</span>
                                        </label>
                                        <input
                                            id="product-next-mobile"
                                            className="products_next_input"
                                            name="mobile"
                                            type="tel"
                                            dir="ltr"
                                            autoComplete="tel"
                                            placeholder={t("mobilePlaceholder")}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <p className="products_next_label" id="product-next-product-label">
                                            {t("product")}
                                        </p>
                                        <div className="products_next_product" aria-labelledby="product-next-product-label">
                                            <img src="/images/product-det/next-check.svg" alt="" width={14} height={14} />
                                            <span>{t("productValue")}</span>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="products_next_label" htmlFor="product-next-challenge">
                                            {t("challenge")}
                                            <span aria-hidden="true"> *</span>
                                        </label>
                                        <div className="products_next_select">
                                            <select id="product-next-challenge" name="challenge" defaultValue="" required>
                                                <option value="" disabled>
                                                    {t("challengePlaceholder")}
                                                </option>
                                                {challenges.map((item) => (
                                                    <option key={item} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                            <img src="/images/product-det/next-chevron.svg" alt="" width={18} height={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="products_next_channels" role="group" aria-label={t("channelLabel")}>
                                    {channels.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            className={`products_next_channel${channel === item.id ? " is-active" : ""}`}
                                            aria-pressed={channel === item.id}
                                            onClick={() => setChannel(item.id)}
                                        >
                                            <i className={item.icon} aria-hidden="true"></i>
                                            {t(`channels.${item.id}`)}
                                        </button>
                                    ))}
                                </div>

                                <label className="products_next_consent" htmlFor="product-next-consent">
                                    <input id="product-next-consent" name="consent" type="checkbox" value="yes" required />
                                    <span>{t("consent")}</span>
                                </label>

                                <button className="products_next_submit" type="submit">
                                    {t("submit")}
                                    <img src="/images/product-det/next-arrow-send.svg" alt="" width={20} height={20} />
                                </button>
                            </form>
                        </Reveal>
                    </div>
                </div>
            </div>
            <div className="sec-lines"><span></span><span></span></div>
        </section>
    );
};

export default ProductNext;
