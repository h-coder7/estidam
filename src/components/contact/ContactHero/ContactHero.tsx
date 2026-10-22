import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ContactHero.scss";

const ContactHero = async () => {
    const t = await getTranslations("contactPage.hero");

    return (
        <section className="contact_hero">
            <div className="container">
                <div className="contact_hero_content text-center mx-auto">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="contact_hero_badge">{t("badge")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h1 className="contact_hero_title fsz-55 fw-600 lh-2 mb-0">
                            <span className="contact_hero_title_strong d-block">
                                {t("titleStrong")}
                            </span>
                            <span className="contact_hero_title_muted d-block">
                                {t("titleMuted")}
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <p className="contact_hero_description fsz-15 fw-400 mb-0">
                            {t("description")}
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
