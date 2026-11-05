"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { mountContactHeroScene } from "./contactHeroScene";

type ContactHeroExperienceProps = {
    badge: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    reply: string;
};

const ContactHeroExperience = ({
    badge,
    titleStrong,
    titleMuted,
    description,
    reply,
}: ContactHeroExperienceProps) => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;
        return mountContactHeroScene(scene);
    }, []);

    useEffect(() => {
        const copy = copyRef.current;
        if (!copy) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const lines = copy.querySelectorAll("[data-contact-hero-line]");
        if (!lines.length) return;

        const context = gsap.context(() => {
            gsap.from(lines, {
                y: 32,
                autoAlpha: 0,
                duration: 1.05,
                stagger: 0.1,
                delay: 0.18,
                ease: "power3.out",
                onComplete: () => {
                    gsap.set(lines, { clearProps: "transform" });
                },
            });
        }, copy);

        return () => context.revert();
    }, []);

    return (
        <>
            <div className="contact_hero_scene" ref={sceneRef} />
            <div className="contact_hero_veil" aria-hidden="true" />
            <div className="container">
                <div className="contact_hero_content text-center mx-auto" ref={copyRef}>
                    {badge ? (
                        <span className="contact_hero_badge" data-contact-hero-line>
                            {badge}
                        </span>
                    ) : null}

                    {titleStrong || titleMuted ? (
                        <h1 className="contact_hero_title">
                            {titleStrong ? (
                                <span className="contact_hero_title_strong" data-contact-hero-line>
                                    {titleStrong}
                                </span>
                            ) : null}
                            {titleMuted ? (
                                <span className="contact_hero_title_muted" data-contact-hero-line>
                                    {titleMuted}
                                </span>
                            ) : null}
                        </h1>
                    ) : null}

                    {description ? (
                        <p className="contact_hero_description" data-contact-hero-line>
                            {description}
                        </p>
                    ) : null}

                    {reply ? (
                        <p className="contact_hero_reply" data-contact-hero-line>
                            <span className="contact_hero_dot" aria-hidden="true" />
                            {reply}
                        </p>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default ContactHeroExperience;
