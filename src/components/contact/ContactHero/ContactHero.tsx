import { getLocale, getTranslations } from "next-intl/server";
import { getContactHeroContent } from "@/lib/api/contact";

import RingGalaxy from "./RingGalaxy";

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
            <RingGalaxy />
            <div className="container">
                <div className="contact_hero_content text-center mx-auto">
                    {badge ? <span className="contact_hero_badge">{badge}</span> : null}

                    {titleStrong || titleMuted ? (
                        <h1 className="contact_hero_title">
                            {titleStrong ? <span className="contact_hero_title_strong">{titleStrong}</span> : null}
                            {titleMuted ? <span className="contact_hero_title_muted">{titleMuted}</span> : null}
                        </h1>
                    ) : null}

                    {description ? <p className="contact_hero_description">{description}</p> : null}

                    {t("reply") ? (
                        <p className="contact_hero_reply">
                            <span className="contact_hero_dot" aria-hidden="true" />
                            {t("reply")}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

export default ContactHero;
