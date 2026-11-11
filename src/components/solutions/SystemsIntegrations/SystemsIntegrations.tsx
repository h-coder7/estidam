import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import type { SolutionSystems } from "@/lib/api/solutionDetail";

import "./_SystemsIntegrations.scss";

const icons: Record<string, string> = {
    database: "fa-regular fa-database",
    erp: "fa-regular fa-database",
    user: "fa-regular fa-user",
    crm: "fa-regular fa-user",
    layers: "fa-regular fa-layer-group",
    layergroup: "fa-regular fa-layer-group",
    globe: "fa-regular fa-globe",
    comment: "fa-regular fa-comment",
    whatsapp: "fa-regular fa-comment",
    plug: "fa-regular fa-plug",
    api: "fa-regular fa-plug",
    diagram: "fa-regular fa-diagram-project",
    cube: "fa-regular fa-cube",
};

const fallbacks = [
    "fa-regular fa-database",
    "fa-regular fa-user",
    "fa-regular fa-layer-group",
    "fa-regular fa-globe",
    "fa-regular fa-comment",
    "fa-regular fa-plug",
    "fa-regular fa-diagram-project",
    "fa-regular fa-cube",
] as const;

const iconClass = (name: string, index: number) =>
    icons[name.toLowerCase().replace(/[\s_-]/g, "")] || fallbacks[index % fallbacks.length];

const SystemsIntegrations = async ({ systems }: { systems: SolutionSystems | null }) => {
    const t = await getTranslations("solutionsPage.systemsIntegrations");
    if (!systems?.tags.length) return null;

    const titleStrong = systems.titleStrong || t("titleStrong");
    const titleMuted = systems.titleMuted || t("titleMuted");
    const description = systems.description || t("description");

    return (
        <section className="solutions_systems_integrations border-top border-wh-1" id="systems-integrations">
            <div className="container">
                <div className="systems_integrations_inner">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="systems_integrations_num">{t("number")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="systems_integrations_title fsz-40 fw-600 lh-2">
                            <span className="systems_integrations_title_strong">{titleStrong}</span>{" "}
                            <span className="systems_integrations_title_muted cr-blue fw-500">{titleMuted}</span>
                        </h2>
                    </Reveal>

                    {description ? (
                        <Reveal animation="fade-up" trigger="load">
                            <p className="systems_integrations_description mb-0">{description}</p>
                        </Reveal>
                    ) : null}

                    <Reveal animation="fade-up" trigger="load">
                        <div className="systems_integrations_tags mt-5">
                            {systems.tags.map((tag, index) => (
                                <span key={`${tag.label}-${index}`} className="systems_integrations_tag">
                                    <i className={iconClass(tag.icon, index)} aria-hidden="true"></i>
                                    <span>{tag.label}</span>
                                </span>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="sec-lines lines-light">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default SystemsIntegrations;
