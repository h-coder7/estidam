import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getHeroContent } from "@/lib/api/home";
import { Link } from "@/i18n/routing";

import WaveGalaxy from "./WaveGalaxy";

import "./_Hero.scss";

function HeroLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
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

const Hero = async () => {
    const locale = await getLocale();
    const t = await getTranslations("hero");
    const hero = await getHeroContent(locale);

    const eyebrow = hero?.eyebrow || t("eyebrow");
    const title = hero?.title || t("title");
    const titleAccent = hero ? hero.titleAccent : t("titleAccent");
    const description = hero?.description || t("description");
    const primaryCta = hero?.primaryCta || t("primaryCta");
    const secondaryCta = hero?.secondaryCta || t("secondaryCta");
    const primaryUrl = hero?.primaryUrl || "#";
    const secondaryUrl = hero?.secondaryUrl || "#why-estidam";

    return (
        <section className="hero_section">
            <WaveGalaxy />
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="txt_content">
                                <Reveal animation="fade-up" trigger="load">
                                    <p className="hero_eyebrow">{eyebrow}</p>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="hero_title">
                                        {title}
                                        {titleAccent ? (
                                            <>
                                                {" "}
                                                <span className="hero_title_accent">{titleAccent}</span>
                                            </>
                                        ) : null}
                                    </h1>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="hero_description">{description}</p>
                                </Reveal>

                                <div className="hero_actions">
                                    <Reveal animation="fade-up" trigger="load">
                                        <HeroLink href={primaryUrl} className="butn butn-blue">
                                            <span>{primaryCta}</span>
                                            <img
                                                src="/images/icons/arrow-wh.svg"
                                                alt=""
                                                className="butn-icon"
                                                aria-hidden="true"
                                            />
                                        </HeroLink>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <HeroLink href={secondaryUrl} className="butn butn-outline">
                                            <span>{secondaryCta}</span>
                                            <img
                                                src="/images/icons/arrow-bl.svg"
                                                alt=""
                                                className="butn-icon"
                                                aria-hidden="true"
                                            />
                                        </HeroLink>
                                    </Reveal>
                                </div>
                            </div>
                        </div>

                        {hero?.image ? (
                            <div className="col-lg-6">
                                <img src={hero.image} alt="" className="hero_media" />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            {/* <img src="/images/hero-dots.png" alt="Hero Pattern" className="hero-dots" /> */}
            {/* <div className="sec-lines">
                <span></span>
                <span></span>
            </div> */}
        </section>
    );
};

export default Hero;
