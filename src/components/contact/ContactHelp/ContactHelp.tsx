"use client";

import { FormEvent, useEffect } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/animations/Reveal";

import "./_ContactHelp.scss";

const requestTypes = ["operational", "ai", "demo", "partner"] as const;

type RequestType = (typeof requestTypes)[number];

export const CONTACT_HELP_ENDPOINT = "/api/contact";

export type ContactHelpPayload = {
    requestType: RequestType;
    fullName: string;
    organization: string;
    jobTitle: string;
    email: string;
    mobile: string;
    message: string;
    consent: boolean;
};

const isRequestType = (value: string): value is RequestType =>
    (requestTypes as readonly string[]).includes(value);

export const readContactHelpPayload = (form: HTMLFormElement): ContactHelpPayload => {
    const data = new FormData(form);
    const requestType = String(data.get("requestType") || "operational");

    return {
        requestType: isRequestType(requestType) ? requestType : "operational",
        fullName: String(data.get("fullName") || ""),
        organization: String(data.get("organization") || ""),
        jobTitle: String(data.get("jobTitle") || ""),
        email: String(data.get("email") || ""),
        mobile: String(data.get("mobile") || ""),
        message: String(data.get("message") || ""),
        consent: data.get("consent") === "yes",
    };
};

const ContactHelp = () => {
    const t = useTranslations("contactPage.help");

    useEffect(() => {
        const tabList = document.getElementById("contactHelpTab");
        const requestTypeInput = document.getElementById("contact-request-type");
        const messageLabel = document.getElementById("contact-message-label");

        if (!tabList || !(requestTypeInput instanceof HTMLInputElement) || !messageLabel) {
            return;
        }

        const onShown = (event: Event) => {
            const trigger = event.target;

            if (!(trigger instanceof HTMLElement)) return;

            const requestType = trigger.getAttribute("data-request-type");
            const message = trigger.getAttribute("data-message-label");

            if (requestType) requestTypeInput.value = requestType;
            if (message) messageLabel.textContent = message;
        };

        tabList.addEventListener("shown.bs.tab", onShown);

        return () => tabList.removeEventListener("shown.bs.tab", onShown);
    }, []);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = readContactHelpPayload(event.currentTarget);

        // POST payload to CONTACT_HELP_ENDPOINT when the contact API is ready.
        void payload;
    };

    return (
        <section className="contact_help pt-100" id="contact-help">
            <div className="container">
                <Reveal animation="fade-up" trigger="load">
                    <h2 className="contact_help_title fw-600">{t("title")}</h2>
                </Reveal>

                <Reveal animation="fade-up" trigger="load">
                    <div className="contact_help_card">
                        <form
                            id="contact-help-form"
                            method="post"
                            action={CONTACT_HELP_ENDPOINT}
                            onSubmit={onSubmit}
                        >
                            <div className="row g-0">
                                <div className="col-lg-4">
                                    <div className="contact_help_side">
                                        <p className="contact_help_kicker fsz-11 fw-600">
                                            {t("requestType")}
                                        </p>

                                        <ul
                                            className="nav nav-pills flex-column contact_help_types"
                                            id="contactHelpTab"
                                            role="tablist"
                                        >
                                            {requestTypes.map((key, index) => (
                                                <li className="nav-item" role="presentation" key={key}>
                                                    <button
                                                        className={`nav-link contact_help_type${index === 0 ? " active" : ""}`}
                                                        id={`contact-tab-${key}`}
                                                        data-bs-toggle="tab"
                                                        data-bs-target={`#contact-pane-${key}`}
                                                        type="button"
                                                        role="tab"
                                                        aria-controls={`contact-pane-${key}`}
                                                        aria-selected={index === 0}
                                                        data-request-type={key}
                                                        data-message-label={t(`types.${key}.message`)}
                                                    >
                                                        <span className="contact_help_type_num">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                        <span className="contact_help_type_copy">
                                                            <span className="contact_help_type_label d-block">
                                                                {t(`types.${key}.label`)}
                                                            </span>
                                                            <span className="contact_help_type_hint">
                                                                {t(`types.${key}.hint`)}
                                                            </span>
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-lg-8">
                                    <div className="contact_help_panel">
                                        <input
                                            type="hidden"
                                            name="requestType"
                                            id="contact-request-type"
                                            defaultValue="operational"
                                        />

                                        <div className="tab-content" id="contactHelpContent">
                                            {requestTypes.map((key, index) => (
                                                <div
                                                    key={key}
                                                    className={`tab-pane fade${index === 0 ? " show active" : ""}`}
                                                    id={`contact-pane-${key}`}
                                                    role="tabpanel"
                                                    aria-labelledby={`contact-tab-${key}`}
                                                    tabIndex={0}
                                                >
                                                    <h3 className="contact_help_heading fw-600">
                                                        {t(`types.${key}.title`)}
                                                    </h3>
                                                    <p className="contact_help_text fsz-14 fw-400">
                                                        {t(`types.${key}.text`)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="row g-0 contact_help_grid">
                                            <div className="col-md-6">
                                                <div className="contact_help_field">
                                                    <label className="contact_help_label fsz-13 fw-600" htmlFor="contact-name">
                                                        {t("fullName")}
                                                        <span className="contact_help_req" aria-hidden="true">*</span>
                                                    </label>
                                                    <input
                                                        id="contact-name"
                                                        className="contact_help_input"
                                                        name="fullName"
                                                        type="text"
                                                        autoComplete="name"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="contact_help_field">
                                                    <label className="contact_help_label fsz-13 fw-600" htmlFor="contact-organization">
                                                        {t("organization")}
                                                        <span className="contact_help_req" aria-hidden="true">*</span>
                                                    </label>
                                                    <input
                                                        id="contact-organization"
                                                        className="contact_help_input"
                                                        name="organization"
                                                        type="text"
                                                        autoComplete="organization"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="contact_help_field">
                                                    <label className="contact_help_label fsz-13 fw-600" htmlFor="contact-job">
                                                        {t("jobTitle")}
                                                    </label>
                                                    <input
                                                        id="contact-job"
                                                        className="contact_help_input"
                                                        name="jobTitle"
                                                        type="text"
                                                        autoComplete="organization-title"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="contact_help_field">
                                                    <label className="contact_help_label fsz-13 fw-600" htmlFor="contact-email">
                                                        {t("email")}
                                                        <span className="contact_help_req" aria-hidden="true">*</span>
                                                    </label>
                                                    <input
                                                        id="contact-email"
                                                        className="contact_help_input"
                                                        name="email"
                                                        type="email"
                                                        dir="ltr"
                                                        autoComplete="email"
                                                        placeholder={t("emailPlaceholder")}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="contact_help_field">
                                                    <label className="contact_help_label fsz-13 fw-600" htmlFor="contact-mobile">
                                                        {t("mobile")}
                                                        <span className="contact_help_req" aria-hidden="true">*</span>
                                                    </label>
                                                    <input
                                                        id="contact-mobile"
                                                        className="contact_help_input"
                                                        name="mobile"
                                                        type="tel"
                                                        dir="ltr"
                                                        autoComplete="tel"
                                                        placeholder={t("mobilePlaceholder")}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="contact_help_field">
                                                    <label
                                                        className="contact_help_label fsz-13 fw-600"
                                                        id="contact-message-label"
                                                        htmlFor="contact-message"
                                                    >
                                                        {t("types.operational.message")}
                                                    </label>
                                                    <textarea
                                                        id="contact-message"
                                                        className="contact_help_input"
                                                        name="message"
                                                        rows={1}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <label className="contact_help_consent fsz-13 fw-400" htmlFor="contact-consent">
                                            <input
                                                id="contact-consent"
                                                name="consent"
                                                type="checkbox"
                                                value="yes"
                                                required
                                            />
                                            <span>{t("consent")}</span>
                                        </label>

                                        <div className="contact_help_actions d-flex flex-wrap">
                                            <button className="butn butn-blue" type="submit">
                                                <span>{t("submit")}</span>
                                                <img
                                                    src="/images/icons/arrow-wh.svg"
                                                    alt=""
                                                    className="butn-icon"
                                                    aria-hidden="true"
                                                />
                                            </button>

                                            <p className="contact_help_note mb-0">{t("privacy")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </Reveal>
            </div>
            <div className="btm-lines-border mt-100">
                <div className="container"><div className="bg-lines"></div></div>
            </div>
        </section>
    );
};

export default ContactHelp;
