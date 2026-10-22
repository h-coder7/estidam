import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ContactHero.scss";

const ContactHero = async () => {
    const t = await getTranslations("contactPage.hero");

    return (
        <section className="contact_faq">
            <div className="container">
                
            </div>
        </section>
    );
};

export default ContactHero;
