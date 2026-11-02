import { getLocale, getTranslations } from "next-intl/server";
import { getContactDirectContent } from "@/lib/api/contact";
import ContactDirectView, {
    type ContactDirectChannelView,
    type ContactDirectSocialView,
} from "./ContactDirectView";

import "./_ContactDirect.scss";

const channelIds = ["email", "phone", "whatsapp", "address"] as const;
const socialIds = ["linkedin", "x", "instagram"] as const;

const labelKey = {
    email: "emailLabel",
    phone: "phoneLabel",
    whatsapp: "whatsappLabel",
    address: "addressLabel",
} as const;

const ContactDirect = async () => {
    const locale = await getLocale();
    const t = await getTranslations("contactPage.direct");
    const content = await getContactDirectContent(locale);

    const channels: ContactDirectChannelView[] =
        content && content.channels.length
            ? content.channels.map((channel) => ({
                  id: channel.id,
                  label: t(labelKey[channel.id]),
                  value: channel.value,
                  ltr: channel.ltr,
              }))
            : channelIds.map((id) => ({
                  id,
                  label: t(labelKey[id]),
                  value: t(id),
                  ltr: id !== "address",
              }));

    const socials: ContactDirectSocialView[] = content
        ? content.socials.map((social) => ({
              id: social.id,
              label: t(social.id),
              href: social.href,
          }))
        : socialIds.map((id) => ({
              id,
              label: t(id),
              href: "#",
          }));

    return (
        <ContactDirectView
            title={content?.title || t("title")}
            channels={channels}
            socials={socials}
            follow={t("follow")}
            copy={t("copy")}
            copied={t("copied")}
        />
    );
};

export default ContactDirect;
