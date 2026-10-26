"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/LenisProvider";

const cases = [
    {
        id: "case-1",
        eyebrowKey: "case1Eyebrow",
        titleKey: "case1Title",
        proofKey: "case1Proof",
        challengeKey: "case1Challenge",
        solutionKey: "case1Solution",
        roleKey: "case1Role",
        logo: "/images/exp-logo1.png",
    },
    {
        id: "case-2",
        eyebrowKey: "case2Eyebrow",
        titleKey: "case2Title",
        proofKey: "case2Proof",
        challengeKey: "case2Challenge",
        solutionKey: "case2Solution",
        roleKey: "case2Role",
        logo: "/images/exp-logo2.png",
    },
    {
        id: "case-3",
        eyebrowKey: "case3Eyebrow",
        titleKey: "case3Title",
        proofKey: "case3Proof",
        challengeKey: "case3Challenge",
        solutionKey: "case3Solution",
        roleKey: "case3Role",
        logo: "/images/exp-logo3.png",
    },
] as const;

const ExperienceCases = () => {
    const t = useTranslations("experienceProof");
    const lenis = useLenis();
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<ScrollTrigger | null>(null);
    const scrollToIndexRef = useRef<(index: number) => void>(() => {});
    const count = cases.length;

    useEffect(() => {
        const root = rootRef.current;
        if (!root || count < 2) return;

        gsap.registerPlugin(ScrollTrigger);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const cards = Array.from(root.querySelectorAll<HTMLElement>(".proof_card_motion"));
        const dots = Array.from(root.querySelectorAll<HTMLButtonElement>(".proof_card_dot"));
        let currentIndex = 0;

        const paint = (progress: number) => {
            cards.forEach((card, index) => {
                if (index === 0) {
                    gsap.set(card, { y: 0, opacity: 1 });
                    return;
                }

                const start = (index - 1) / (count - 1);
                const end = index / (count - 1);
                const local = gsap.utils.clamp(0, 1, (progress - start) / (end - start));
                gsap.set(card, {
                    y: (1 - local) * (card.offsetHeight + 48),
                    opacity: local,
                });
            });
        };

        const scrollToIndex = (index: number) => {
            const trigger = triggerRef.current;
            if (!trigger) return;

            const next = Math.min(count - 1, Math.max(0, index));
            const target = trigger.start + ((trigger.end - trigger.start) * next) / (count - 1);

            if (lenis) {
                lenis.scrollTo(target, { duration: reduced ? 0.01 : 0.85 });
                return;
            }

            window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
        };

        scrollToIndexRef.current = scrollToIndex;

        const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top 120px",
            end: () => `+=${(count - 1) * window.innerHeight * 0.85}`,
            pin: true,
            pinSpacing: true,
            pinType: "transform",
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: reduced
                ? false
                : {
                      snapTo: 1 / (count - 1),
                      duration: 0.45,
                      ease: "power2.inOut",
                      delay: 0.06,
                  },
            onUpdate: (self) => {
                paint(self.progress);
                const index = Math.min(count - 1, Math.round(self.progress * (count - 1)));
                if (index === currentIndex) return;
                currentIndex = index;
                dots.forEach((dot, dotIndex) => {
                    dot.classList.toggle("is_active", dotIndex === index);
                });
            },
        });

        triggerRef.current = trigger;
        paint(0);

        const frame = window.requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            paint(trigger.progress);
        });

        return () => {
            window.cancelAnimationFrame(frame);
            triggerRef.current = null;
            trigger.kill();
        };
    }, [count, lenis]);

    return (
        <div className="proof_cases" ref={rootRef}>
            <div className="proof_stack_wrap">
                <div className="proof_card_dots" aria-label={t("casesLabel")}>
                    {cases.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`proof_card_dot${index === 0 ? " is_active" : ""}`}
                            aria-label={t(item.eyebrowKey)}
                            onClick={() => scrollToIndexRef.current(index)}
                        />
                    ))}
                </div>

                <div className="proof_stack">
                    {cases.map((item, index) => (
                        <article
                            className="proof_card"
                            key={item.id}
                            style={
                                {
                                    "--stack": index,
                                    zIndex: index + 1,
                                } as React.CSSProperties
                            }
                        >
                            <div className="proof_card_motion">
                                <div className="row align-items-start justify-content-between proof_card_top">
                                    <div className="col">
                                        <p className="proof_card_eyebrow mb-0">{t(item.eyebrowKey)}</p>
                                    </div>
                                    <div className="col-auto">
                                        <span className="proof_card_dots_spacer" aria-hidden="true"></span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-9">
                                        <h3 className="proof_card_title">{t(item.titleKey)}</h3>
                                    </div>
                                </div>

                                <div className="row gx-4 gy-4 proof_card_body">
                                    <div className="col-lg-4">
                                        <div className="proof_stat h-100">
                                            <img src={item.logo} alt="" className="proof_stat_logo" />
                                            <div className="btm-cont">
                                                <p className="proof_stat_value">{t(item.proofKey)}</p>
                                                <span className="proof_stat_label">{t("verifiedLabel")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-8">
                                        <div className="proof_details">
                                            <div className="proof_detail">
                                                <span className="proof_detail_label">{t("challengeLabel")}</span>
                                                <p className="proof_detail_text">{t(item.challengeKey)}</p>
                                            </div>
                                            <div className="proof_detail">
                                                <span className="proof_detail_label">{t("solutionLabel")}</span>
                                                <p className="proof_detail_text">{t(item.solutionKey)}</p>
                                            </div>
                                            <div className="proof_detail">
                                                <span className="proof_detail_label">{t("roleLabel")}</span>
                                                <p className="proof_detail_text">{t(item.roleKey)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <img src="/images/exp-card-bg.png" alt="" className="card-bg" />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExperienceCases;
