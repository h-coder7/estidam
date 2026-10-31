"use client";

import { ReactNode, useState } from "react";
import Reveal from "@/components/animations/Reveal";
import ParticleHalo from "@/components/effects/ParticleHalo/ParticleHalo";
import { Link } from "@/i18n/routing";

import "./_HajjJourney.scss";

export type JourneyViewPhase = {
    id: string;
    number: string;
    label: string;
    title: string;
    text: string;
    points: string[];
    image: string;
};

type JourneyViewProps = {
    badge: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    cta: string;
    ctaUrl: string;
    phases: JourneyViewPhase[];
};

function CmsLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
    if (/^https?:\/\//i.test(href) || href.startsWith("#")) {
        return (
            <a href={href} className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}

const HajjJourneyView = ({
    badge,
    titleStrong,
    titleMuted,
    description,
    cta,
    ctaUrl,
    phases,
}: JourneyViewProps) => {
    const [activeId, setActiveId] = useState(phases[0]?.id ?? "");
    const activePhase = phases.find((phase) => phase.id === activeId) ?? phases[0];

    if (!activePhase) return null;

    return (
        <section className="hajj_journey" id="hajj-journey">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="section-head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="section-head-badge">{badge}</span>
                        </Reveal>

                        <div className="row gx-0 justify-content-between">
                            <div className="col-lg-6">
                                <div className="section-head-left mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h2 className="section-head-title fsz-40 fw-600 lh-2">
                                            <span className="section-head-title-strong">{titleStrong}</span>
                                            {titleMuted ? (
                                                <>
                                                    {" "}
                                                    <span className="section-head-title-muted cr-blue fw-500">
                                                        {titleMuted}
                                                    </span>
                                                </>
                                            ) : null}
                                        </h2>
                                    </Reveal>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="section-head-right mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="section-head-description">{description}</p>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <CmsLink href={ctaUrl} className="butn butn-outline">
                                            <span>{cta}</span>
                                            <img
                                                src="/images/icons/arrow-bl.svg"
                                                alt=""
                                                className="butn-icon"
                                                aria-hidden="true"
                                            />
                                        </CmsLink>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="journey_body border-top">
                <div className="container">
                    <div className="row gx-0 align-items-center">
                        <div className="col-lg-3">
                            <Reveal animation="fade-up" trigger="load">
                                <nav className="journey_nav" aria-label={badge}>
                                    {phases.map((phase) => {
                                        const isActive = phase.id === activeId;

                                        return (
                                            <button
                                                key={phase.id}
                                                type="button"
                                                className={`journey_nav_item${isActive ? " is_active" : ""}`}
                                                onClick={() => setActiveId(phase.id)}
                                                aria-pressed={isActive}
                                            >
                                                <span className="journey_nav_number">{phase.number}</span>
                                                <span className="journey_nav_copy">
                                                    <span className="journey_nav_phase">{phase.label}</span>
                                                    <span className="journey_nav_title">{phase.title}</span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </Reveal>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="journey_detail" key={activePhase.id}>
                                    <p className="journey_detail_phase">{activePhase.label}</p>
                                    <h3 className="journey_detail_title">{activePhase.title}</h3>
                                    <p className="journey_detail_text">{activePhase.text}</p>

                                    <ul className="journey_points row">
                                        {activePhase.points.map((point) => (
                                            <li key={point} className="col-md-6">
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-4 journey_visual_col">
                            <div className="journey_visual">
                                <ParticleHalo />
                                <Reveal animation="fade-up" trigger="load" className="journey_visual_reveal">
                                    <div className="img p-5">
                                        <img
                                            key={activePhase.id}
                                            src={activePhase.image}
                                            alt={activePhase.title}
                                            className="journey_visual_img"
                                        />
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default HajjJourneyView;
