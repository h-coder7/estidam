import { getLocale, getTranslations } from "next-intl/server";
import AiOperationsSection from "./AiOperationsSection";
import type { AiOperationsContent } from "./aiOperationsData";

export default async function AiOperations() {
    const locale = await getLocale();
    const t = await getTranslations("operations");

    const content: AiOperationsContent = {
        eyebrow: t("badge"),
        titleLine1: t("titleStrong"),
        titleLine2: t("titleMuted"),
        description: t("description"),
        inputs: [t("input1"), t("input2"), t("input3"), t("input4")],
        aiLabel: t("aiLabel"),
        aiSubLabel: t("aiSubLabel"),
        outputs: [t("output1"), t("output2"), t("output3")],
        readinessTitle: t("readinessTitle"),
        readinessDescription: t("readinessDescription"),
        readinessLeft: [t("readinessLeft1"), t("readinessLeft2"), t("readinessLeft3")],
        readinessRight: [t("readinessRight1"), t("readinessRight2"), t("readinessRight3")],
        readinessCaption: t("readinessCaption"),
        outcomeLabel: t("outcomeLabel"),
        outcomes: [t("outcome1"), t("outcome2"), t("outcome3"), t("outcome4")],
    };

    return <AiOperationsSection id="operations" dir={locale === "ar" ? "rtl" : "ltr"} content={content} />;
}
