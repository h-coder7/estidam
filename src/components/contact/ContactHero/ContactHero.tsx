import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getContactHeroContent } from "@/lib/api/contact";

import "./_ContactHero.scss";

const ContactHero = async () => {
    const locale = await getLocale();
    const t = await getTranslations("contactPage.hero");
    const hero = await getContactHeroContent(locale);
    const badge = hero?.eyebrow || t("badge");
    const titleStrong = hero ? hero.titleStrong : t("titleStrong");
    const titleMuted = hero ? hero.titleMuted : t("titleMuted");
    const description = hero?.description || t("description");

    return (
        <section className="contact_hero">
            <div className="container">
                <div className="contact_hero_content text-center mx-auto">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="contact_hero_badge">{badge}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h1 className="contact_hero_title fsz-55 fw-600 lh-2 mb-0">
                            {titleStrong ? (
                                <span className="contact_hero_title_strong d-block">{titleStrong}</span>
                            ) : null}
                            {titleMuted ? (
                                <span className="contact_hero_title_muted d-block">{titleMuted}</span>
                            ) : null}
                        </h1>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <p className="contact_hero_description fsz-15 fw-400 mb-0">
                            {description}
                        </p>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <p className="contact_hero_reply">
                            <span className="contact_hero_dot" aria-hidden="true"></span>
                            {t("reply")}
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default ContactHero;
