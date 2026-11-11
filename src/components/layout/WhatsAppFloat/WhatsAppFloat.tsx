import { getTranslations } from "next-intl/server";

import "./_WhatsAppFloat.scss";

const WHATSAPP_URL = "https://wa.me/966505977954";

const WhatsAppFloat = async () => {
    const t = await getTranslations("footer");

    return (
        <a className="wa_float" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label={t("whatsappChat")}>
            <span className="wa_float_pulse" aria-hidden="true" />
            <i className="fab fa-whatsapp" aria-hidden="true" />
        </a>
    );
};

export default WhatsAppFloat;
