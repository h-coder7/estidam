"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/animations/Reveal";

import "./_ContactDirect.scss";

const channels = [
    { id: "email", label: "emailLabel", value: "email", dir: "ltr" },
    { id: "phone", label: "phoneLabel", value: "phone", dir: "ltr" },
    { id: "whatsapp", label: "whatsappLabel", value: "whatsapp", dir: "ltr" },
    { id: "address", label: "addressLabel", value: "address" },
] as const;

const socials = [
    { id: "linkedin", href: "#" },
    { id: "x", href: "#" },
    { id: "instagram", href: "#" },
] as const;

const ContactDirect = () => {
    const t = useTranslations("contactPage.direct");
    const [copied, setCopied] = useState<string | null>(null);

    const onCopy = async (id: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(id);
            window.setTimeout(() => {
                setCopied((current) => (current === id ? null : current));
            }, 1600);
        } catch {
            setCopied(null);
        }
    };

    return (
        <section className="contact_direct" id="contact-direct">
            <div className="container">
                <Reveal animation="fade-up" trigger="load">
                    <h2 className="contact_direct_title fw-600">{t("title")}</h2>
                </Reveal>

                <Reveal animation="fade-up" trigger="load">
                    <div className="row g-0 contact_direct_grid">
                        {channels.map((channel) => {
                            const value = t(channel.value);

                            return (
                                <div className="col-6 col-lg-3" key={channel.id}>
                                    <div className="contact_direct_item">
                                        <p className="contact_direct_label fsz-11 fw-600">
                                            {t(channel.label)}
                                        </p>
                                        <p
                                            className="contact_direct_value fw-600 mb-0"
                                            dir={"dir" in channel ? channel.dir : undefined}
                                        >
                                            {value}
                                        </p>
                                        <button
                                            className="contact_direct_copy"
                                            type="button"
                                            onClick={() => onCopy(channel.id, value)}
                                        >
                                            {copied === channel.id ? t("copied") : t("copy")}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>

                <Reveal animation="fade-up" trigger="load">
                    <div className="contact_direct_social d-flex align-items-center flex-wrap">
                        <span className="contact_direct_follow">{t("follow")}</span>
                        {socials.map((social) => (
                            <a
                                key={social.id}
                                className="contact_direct_pill"
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t(social.id)}
                            </a>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default ContactDirect;
