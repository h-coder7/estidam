"use client";

import { useState } from "react";
import Reveal from "@/components/animations/Reveal";

export type ContactFaqItemView = {
    question: string;
    answer: string;
};

type ContactFaqViewProps = {
    badge: string;
    titleStrong: string;
    titleMuted: string;
    items: ContactFaqItemView[];
};

const ContactFaqView = ({ badge, titleStrong, titleMuted, items }: ContactFaqViewProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(items.length ? 0 : null);

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
                                {titleStrong ? (
                                    <span className="contact_faq_title_strong">{titleStrong}</span>
                                ) : null}
                                {titleStrong && titleMuted ? " " : null}
                                {titleMuted ? (
                                    <span className="contact_faq_title_muted cr-blue">{titleMuted}</span>
                                ) : null}
                            </h2>
                        </Reveal>

                        {badge ? (
                            <Reveal animation="fade-up">
                                <span className="contact_faq_badge">{badge}</span>
                            </Reveal>
                        ) : null}
                    </div>
                    <div className="row g-3 align-items-start">
                        {items.map((item, index) => {
                            const isOpen = openIndex === index;
                            const buttonId = `contact_faq_question_${index + 1}`;
                            const panelId = `contact_faq_answer_${index + 1}`;

                            return (
                                <div className="col-lg-6" key={`${item.question}-${index}`}>
                                    <Reveal animation="fade-up">
                                        <div className={`contact_faq_item ${isOpen ? "is_open" : ""}`}>
                                            <button
                                                type="button"
                                                id={buttonId}
                                                className="contact_faq_question fsz-14 fw-600"
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                onClick={() => handleToggle(index)}
                                            >
                                                <span className="contact_faq_question_text">{item.question}</span>
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
                                                        {item.answer}
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

export default ContactFaqView;
