import { getLocale, getTranslations } from "next-intl/server";
import { getJourneyContent } from "@/lib/api/home";
import HajjJourneyView from "./HajjJourneyView";

const phaseFallbacks = [
    {
        id: "before",
        label: "phase1Label",
        title: "phase1Title",
        text: "phase1Text",
        points: "phase1Points",
        image: "/images/journey-1.png",
    },
    {
        id: "during",
        label: "phase2Label",
        title: "phase2Title",
        text: "phase2Text",
        points: "phase2Points",
        image: "/images/journey-1.png",
    },
    {
        id: "after",
        label: "phase3Label",
        title: "phase3Title",
        text: "phase3Text",
        points: "phase3Points",
        image: "/images/journey-1.png",
    },
] as const;

const HajjJourney = async () => {
    const locale = await getLocale();
    const t = await getTranslations("hajjJourney");
    const journey = await getJourneyContent(locale);

    const phases = journey?.phases.length
        ? journey.phases.map((phase, index) => {
              const fallback = phaseFallbacks[index];
              const points = phase.points.length
                  ? phase.points
                  : fallback
                    ? (t.raw(fallback.points) as string[])
                    : [];

              return {
                  id: phase.id,
                  number: phase.number,
                  label: phase.label || (fallback ? t(fallback.label) : ""),
                  title: phase.title || (fallback ? t(fallback.title) : ""),
                  text: phase.text || (fallback ? t(fallback.text) : ""),
                  points,
                  image: phase.image || fallback?.image || phaseFallbacks[0].image,
              };
          })
        : phaseFallbacks.map((phase, index) => ({
              id: phase.id,
              number: String(index + 1).padStart(2, "0"),
              label: t(phase.label),
              title: t(phase.title),
              text: t(phase.text),
              points: t.raw(phase.points) as string[],
              image: phase.image,
          }));

    return (
        <HajjJourneyView
            badge={journey?.eyebrow || t("badge")}
            titleStrong={journey?.titleStrong || t("titleStrong")}
            titleMuted={journey ? journey.titleMuted : t("titleMuted")}
            description={journey?.description || t("description")}
            cta={journey?.cta || t("cta")}
            ctaUrl={journey?.ctaUrl || "#"}
            phases={phases}
        />
    );
};

export default HajjJourney;
