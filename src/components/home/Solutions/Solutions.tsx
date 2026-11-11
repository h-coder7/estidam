import { getLocale, getTranslations } from "next-intl/server";
import { getSolutionCubeSlides, getSolutionsContent, headingFromCms } from "@/lib/api/home";
import SolutionsJourney from "./SolutionsJourney";

import "./_Solutions.scss";

const Solutions = async () => {
    const locale = await getLocale();
    const t = await getTranslations("solutions");
    const content = await getSolutionsContent(locale);
    const slides = await getSolutionCubeSlides(locale);
    const heading = headingFromCms(content, t("titleStrong"), t("titleMuted"));
    const badge = content?.eyebrow || t("badge");

    return (
        <section className="solutions_journey" id="solutions" aria-labelledby="solutions-title">
            <SolutionsJourney
                slides={slides}
                badge={badge}
                titleStrong={heading.titleStrong}
                titleMuted={heading.titleMuted}
                itemLabel={t("itemLabel")}
                stepsLabel={t("dotsLabel")}
            />
        </section>
    );
};

export default Solutions;
