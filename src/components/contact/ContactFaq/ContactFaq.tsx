import { getLocale, getTranslations } from "next-intl/server";
import { getContactFaqContent } from "@/lib/api/contact";
import ContactFaqView, { type ContactFaqItemView } from "./ContactFaqView";

import "./_ContactFaq.scss";

const fallbackItems = [1, 2, 3, 4] as const;

const ContactFaq = async () => {
    const locale = await getLocale();
    const t = await getTranslations("contactPage.faq");
    const content = await getContactFaqContent(locale);

    const items: ContactFaqItemView[] =
        content && content.items.length
            ? content.items
            : fallbackItems.map((item) => ({
                  question: t(`q${item}`),
                  answer: t(`a${item}`),
              }));

    return (
        <ContactFaqView
            badge={content?.eyebrow || t("badge")}
            titleStrong={content ? content.titleStrong : t("titleStrong")}
            titleMuted={content ? content.titleMuted : t("titleMuted")}
            items={items}
        />
    );
};

export default ContactFaq;
