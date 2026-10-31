import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getAboutHeroContent } from "@/lib/api/about";

import "./_AboutHero.scss";

const AboutHero = async () => {
    const locale = await getLocale();
    const t = await getTranslations("aboutPage.hero");
    const hero = await getAboutHeroContent(locale);

    const badge = hero?.eyebrow || t("badge");
    const titleBefore = hero ? hero.titleBefore : t("titleBefore");
    const titleAccent = hero ? hero.titleAccent : t("titleAccent");
    const titleAfter = hero ? hero.titleAfter : t("titleAfter");
    const description = hero?.description || t("description");
    const image = hero?.image || "/images/about-pg-hero.png";
    const imageAlt = titleBefore || t("imageAlt");

    return (
        <section className="about_hero mb-5 border-bottom">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6">
                            <div className="about_hero_content">
                                <Reveal animation="fade-up" trigger="load">
                                    <span className="about_hero_badge">{badge}</span>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <h1 className="about_hero_title fsz-45 fw-600 lh-2">
                                        {titleBefore ? (
                                            <span className="about_hero_title_strong">{titleBefore} </span>
                                        ) : null}
                                        {titleAccent ? <span className="cr-blue">{titleAccent}</span> : null}
                                        {titleAfter ? (
                                            <span className="about_hero_title_strong"> {titleAfter}</span>
                                        ) : null}
                                    </h1>
                                </Reveal>

                                <Reveal animation="fade-up" trigger="load">
                                    <p className="about_hero_description fsz-14 fw-400 lh-4 mb-0">
                                        {description}
                                    </p>
                                </Reveal>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <img
                                    src={image}
                                    alt={imageAlt}
                                    className="about_hero_img"
                                />
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <img
                src="/images/solution-hero-dots.png"
                alt=""
                className="about_hero_dots"
                aria-hidden="true"
            />
        </section>
    );
};

export default AboutHero;
