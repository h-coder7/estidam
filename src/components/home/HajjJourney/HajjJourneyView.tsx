"use client";

import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import Reveal from "@/components/animations/Reveal";
import { Link } from "@/i18n/routing";

import { JOURNEY_DIAGRAM_LABELS, JOURNEY_VIEWBOX, createJourneyDiagram } from "./hajjJourneyDiagram";

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

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HajjJourneyView = ({ badge, titleStrong, titleMuted, description, cta, ctaUrl, phases }: JourneyViewProps) => {
    const locale = useLocale();
    const [active, setActive] = useState(0);
    const [started, setStarted] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const diagramRef = useRef<ReturnType<typeof createJourneyDiagram> | null>(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const labels = JOURNEY_DIAGRAM_LABELS[locale === "ar" ? "ar" : "en"];
        const diagram = createJourneyDiagram(svg, {
            phases: phases.map((phase) => ({ points: phase.points })),
            labels,
            reducedMotion: prefersReducedMotion(),
        });
        diagramRef.current = diagram;
        return () => {
            diagram.destroy();
            diagramRef.current = null;
        };
    }, [locale, phases]);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;
        if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
            setStarted(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setStarted(true);
                    io.disconnect();
                }
            },
            { threshold: 0.25 },
        );
        io.observe(node);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (started) diagramRef.current?.go(active);
    }, [active, started, locale, phases]);

    const activePhase = phases[active] ?? phases[0];
    if (!activePhase) return null;

    const select = (index: number, focus = false) => {
        const next = (index + phases.length) % phases.length;
        setActive(next);
        if (focus) tabRefs.current[next]?.focus();
    };

    const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
        const forward = event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
        const back = event.key === "ArrowUp" || event.key === (rtl ? "ArrowRight" : "ArrowLeft");
        if (forward || back) {
            event.preventDefault();
            select(active + (forward ? 1 : -1), true);
        } else if (event.key === "Home") {
            event.preventDefault();
            select(0, true);
        } else if (event.key === "End") {
            event.preventDefault();
            select(phases.length - 1, true);
        }
    };

    return (
        <section className={`hajj_journey${started ? " is-in" : ""}`} id="hajj-journey" ref={sectionRef}>
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
                                                    <span className="section-head-title-muted cr-blue fw-500">{titleMuted}</span>
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
                                            <img src="/images/icons/arrow-bl.svg" alt="" className="butn-icon" aria-hidden="true" />
                                        </CmsLink>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hj-tabs" role="tablist" aria-label={badge} onKeyDown={onTabKey}>
                    {phases.map((phase, index) => (
                        <button
                            key={phase.id}
                            ref={(node) => {
                                tabRefs.current[index] = node;
                            }}
                            type="button"
                            role="tab"
                            id={`hj-tab-${phase.id}`}
                            aria-selected={index === active}
                            aria-controls="hj-panel"
                            tabIndex={index === active ? 0 : -1}
                            className="hj-tab"
                            onClick={() => select(index)}
                        >
                            <span className="hj-tab-bar" aria-hidden="true" />
                            <small>
                                {phase.number || String(index + 1).padStart(2, "0")} · {phase.label}
                            </small>
                            <b>{phase.title}</b>
                        </button>
                    ))}
                </div>

                <div className="hj-body">
                    <div
                        className="hj-info"
                        id="hj-panel"
                        role="tabpanel"
                        aria-labelledby={`hj-tab-${activePhase.id}`}
                        aria-live="polite"
                        key={activePhase.id}
                    >
                        <div className="hj-label">{activePhase.label}</div>
                        <h3 className="hj-stage-title">{activePhase.title}</h3>
                        <p className="hj-stage-text">{activePhase.text}</p>
                        {activePhase.points.length ? (
                            <ul className="hj-points">
                                {activePhase.points.map((point, index) => (
                                    <li key={`${activePhase.id}-${index}`} style={{ animationDelay: `${0.12 + index * 0.04}s` }}>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>

                    <div className="hj-diagram">
                        <svg ref={svgRef} viewBox={JOURNEY_VIEWBOX} role="img" aria-label={`${activePhase.label} — ${activePhase.title}`} />
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
