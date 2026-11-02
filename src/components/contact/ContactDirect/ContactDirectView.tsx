"use client";

import { useState } from "react";
import Reveal from "@/components/animations/Reveal";

export type ContactDirectChannelView = {
    id: string;
    label: string;
    value: string;
    ltr?: boolean;
};

export type ContactDirectSocialView = {
    id: string;
    label: string;
    href: string;
};

type ContactDirectViewProps = {
    title: string;
    channels: ContactDirectChannelView[];
    socials: ContactDirectSocialView[];
    follow: string;
    copy: string;
    copied: string;
};

const ContactDirectView = ({
    title,
    channels,
    socials,
    follow,
    copy,
    copied,
}: ContactDirectViewProps) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const cellClass =
        channels.length >= 4 ? "col-6 col-lg-3" : channels.length === 2 ? "col-12 col-lg-6" : "col-12 col-lg-4";

    const onCopy = async (id: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedId(id);
            window.setTimeout(() => {
                setCopiedId((current) => (current === id ? null : current));
            }, 1600);
        } catch {
            setCopiedId(null);
        }
    };

    return (
        <section className="contact_direct" id="contact-direct">
            <div className="container">
                <Reveal animation="fade-up" trigger="load">
                    <h2 className="contact_direct_title fw-600">{title}</h2>
                </Reveal>

                <Reveal animation="fade-up" trigger="load">
                    <div className="row g-0 contact_direct_grid">
                        {channels.map((channel) => (
                            <div className={cellClass} key={channel.id}>
                                <div className="contact_direct_item">
                                    <p className="contact_direct_label fsz-11 fw-600">{channel.label}</p>
                                    <p
                                        className="contact_direct_value fw-600 mb-0"
                                        dir={channel.ltr ? "ltr" : undefined}
                                    >
                                        {channel.value}
                                    </p>
                                    <button
                                        className="contact_direct_copy"
                                        type="button"
                                        onClick={() => onCopy(channel.id, channel.value)}
                                    >
                                        {copiedId === channel.id ? copied : copy}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Reveal>

                {socials.length ? (
                    <Reveal animation="fade-up" trigger="load">
                        <div className="contact_direct_social d-flex align-items-center flex-wrap">
                            <span className="contact_direct_follow">{follow}</span>
                            {socials.map((social) => (
                                <a
                                    key={social.id}
                                    className="contact_direct_pill"
                                    href={social.href}
                                    target={social.href.startsWith("http") ? "_blank" : undefined}
                                    rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                                >
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    </Reveal>
                ) : null}
            </div>
        </section>
    );
};

export default ContactDirectView;
