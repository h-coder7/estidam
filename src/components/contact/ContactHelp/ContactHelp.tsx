import { getLocale, getTranslations } from "next-intl/server";
import { getContactHelpContent } from "@/lib/api/contact";
import ContactHelpForm, { type ContactHelpPathView } from "./ContactHelpForm";

const messageKeys = {
    challenge_operational: "operational",
    challenge_ai: "ai",
    product_demo: "demo",
    partner: "partner",
} as const;

const fallbackSources = [
    "challenge_operational",
    "challenge_ai",
    "product_demo",
    "partner",
] as const;

const ContactHelp = async () => {
    const locale = await getLocale();
    const t = await getTranslations("contactPage.help");
    const paths = await getContactHelpContent(locale);

    const view: ContactHelpPathView[] = paths
        ? paths.map((path, index) => {
              const messageKey = messageKeys[path.source as keyof typeof messageKeys];

              return {
                  id: path.source || `path-${index + 1}`,
                  label: path.title,
                  title: path.title,
                  text: path.description,
                  message: messageKey ? t(`types.${messageKey}.message`) : path.title,
              };
          })
        : fallbackSources.map((source) => {
              const messageKey = messageKeys[source];

              return {
                  id: source,
                  label: t(`types.${messageKey}.label`),
                  title: t(`types.${messageKey}.title`),
                  text: t(`types.${messageKey}.text`),
                  message: t(`types.${messageKey}.message`),
              };
          });

    return <ContactHelpForm paths={view} />;
};

export default ContactHelp;
