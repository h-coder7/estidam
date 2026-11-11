import { ReactNode } from "react";
import Reveal from "@/components/animations/Reveal";
import { Link } from "@/i18n/routing";
import type { SolutionHero } from "@/lib/api/solutionDetail";

import "./_SolutionsHero.scss";

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

const SolutionsHero = ({ hero }: { hero: SolutionHero }) => {
    const image = hero.image || "/images/solution-hero.png";

    return (
        <section className="solutions_hero mb-5 border-bottom">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6">
                            <div className="solutions_hero_content">
                                {hero.eyebrow ? (
                                    <Reveal animation="fade-up" trigger="load">
                                        <span className="solutions_hero_num">{hero.eyebrow}</span>
                                    </Reveal>
                                ) : null}

                                {hero.titleStrong || hero.titleMuted ? (
                                    <Reveal animation="fade-up" trigger="load">
                                        <h1 className="solutions_hero_title fsz-40 fw-600 lh-2">
                                            {hero.titleStrong ? (
                                                <span className="solutions_hero_title_strong">{hero.titleStrong}</span>
                                            ) : null}{" "}
                                            {hero.titleMuted ? (
                                                <span className="solutions_hero_title_muted cr-blue fw-500">{hero.titleMuted}</span>
                                            ) : null}
                                        </h1>
                                    </Reveal>
                                ) : null}

                                {hero.description ? (
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="solutions_hero_description">{hero.description}</p>
                                    </Reveal>
                                ) : null}

                                {hero.primaryLabel || hero.secondaryLabel ? (
                                    <div className="solutions_hero_actions">
                                        {hero.primaryLabel ? (
                                            <Reveal animation="fade-up" trigger="load">
                                                <CmsLink href={hero.primaryHref || "#"} className="butn butn-blue">
                                                    <span>{hero.primaryLabel}</span>
                                                    <img
                                                        src="/images/icons/arrow-wh.svg"
                                                        alt=""
                                                        className="butn-icon"
                                                        aria-hidden="true"
                                                    />
                                                </CmsLink>
                                            </Reveal>
                                        ) : null}

                                        {hero.secondaryLabel ? (
                                            <Reveal animation="fade-up" trigger="load">
                                                <CmsLink href={hero.secondaryHref || "#use-cases"} className="butn solutions_hero_link">
                                                    <span>{hero.secondaryLabel}</span>
                                                    <img
                                                        src="/images/icons/arrow-bl.svg"
                                                        alt=""
                                                        className="butn-icon"
                                                        aria-hidden="true"
                                                    />
                                                </CmsLink>
                                            </Reveal>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="solutions_hero_visual">
                                    <img src={image} alt={hero.titleStrong} className="solutions_hero_img" />
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <img src="/images/solution-hero-dots.png" alt="" className="solutions_hero_dots" aria-hidden="true" />
        </section>
    );
};

export default SolutionsHero;
