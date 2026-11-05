import { getLocale, getTranslations } from "next-intl/server";
import { getContactHeroContent } from "@/lib/api/contact";
import ContactHeroExperience from "./ContactHeroExperience";

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
            <ContactHeroExperience
                badge={badge}
                titleStrong={titleStrong}
                titleMuted={titleMuted}
                description={description}
                reply={t("reply")}
            />
        </section>
    );
};

export default ContactHero;
