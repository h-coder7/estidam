import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_SystemsIntegrations.scss";

const SystemsIntegrations = async () => {
    const t = await getTranslations("solutionsPage.systemsIntegrations");

    const tags = [
        { key: "tag1", icon: "fa-regular fa-database" },
        { key: "tag2", icon: "fa-regular fa-user" },
        { key: "tag3", icon: "fa-regular fa-layer-group" },
        { key: "tag4", icon: "fa-regular fa-globe" },
        { key: "tag5", icon: "fa-regular fa-comment" },
        { key: "tag6", icon: "fa-regular fa-plug" },
        { key: "tag7", icon: "fa-regular fa-diagram-project" },
        { key: "tag8", icon: "fa-regular fa-cube" },
    ] as const;

    return (
        <section className="solutions_systems_integrations border-top border-wh-1" id="systems-integrations">
            <div className="container">
                <div className="systems_integrations_inner">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="systems_integrations_num">{t("number")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="systems_integrations_title fsz-40 fw-600 lh-2">
                            <span className="systems_integrations_title_strong">
                                {t("titleStrong")}
                            </span>{" "}
                            <span className="systems_integrations_title_muted cr-blue fw-500">
                                {t("titleMuted")}
                            </span>
                        </h2>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <p className="systems_integrations_description mb-0">
                            {t("description")}
                        </p>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <div className="systems_integrations_tags mt-5">
                            {tags.map((tag) => (
                                <span key={tag.key} className="systems_integrations_tag">
                                    <i className={tag.icon} aria-hidden="true"></i>
                                    <span>{t(tag.key)}</span>
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
