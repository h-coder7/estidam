"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/animations/Reveal";

import "./_ContactFaq.scss";

const FAQ_ITEMS = [1, 2, 3, 4];

const ContactFaq = () => {
    const t = useTranslations("contactPage.faq");
    const [openIndex, setOpenIndex] = useState<number | null>(1);

    const handleToggle = (index: number) => {
        setOpenIndex((current) => (current === index ? null : index));
    };

    return (
        <section className="contact_faq border-top">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="contact_faq_header d-flex align-items-center justify-content-between">
                        <Reveal animation="fade-up">
                            <h2 className="contact_faq_title fsz-32 fw-600 mb-0">
                                <span className="contact_faq_title_strong">{t("titleStrong")}</span>{" "}
                                <span className="contact_faq_title_muted cr-blue">{t("titleMuted")}</span>
                            </h2>
                        </Reveal>

                        <Reveal animation="fade-up">
                            <span className="contact_faq_badge">{t("badge")}</span>
                        </Reveal>
                    </div>
                    <div className="row g-3 align-items-start">
                        {FAQ_ITEMS.map((item) => {
                            const isOpen = openIndex === item;
                            const buttonId = `contact_faq_question_${item}`;
                            const panelId = `contact_faq_answer_${item}`;

                            return (
                                <div className="col-lg-6" key={item}>
                                    <Reveal animation="fade-up">
                                        <div className={`contact_faq_item ${isOpen ? "is_open" : ""}`}>
                                            <button
                                                type="button"
                                                id={buttonId}
                                                className="contact_faq_question fsz-14 fw-600"
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                onClick={() => handleToggle(item)}
                                            >
                                                <span className="contact_faq_question_text">
                                                    {t(`q${item}`)}
                                                </span>
                                                <span className="contact_faq_icon" aria-hidden="true"></span>
                                            </button>

                                            <div
                                                id={panelId}
                                                role="region"
                                                aria-labelledby={buttonId}
                                                className="contact_faq_answer"
                                            >
                                                <div className="contact_faq_answer_inner">
                                                    <p className="contact_faq_answer_text fsz-13 fw-400 mb-0">
                                                        {t(`a${item}`)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Reveal>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactFaq;