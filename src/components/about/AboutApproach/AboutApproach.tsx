import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getAboutApproachContent } from "@/lib/api/about";

import "./_AboutApproach.scss";

const fallbackKeys = [
    {
        id: "understand",
        icon: "fal fa-landmark",
        title: "item1Title",
        text: "item1Text",
        points: "item1Points",
    },
    {
        id: "operations",
        icon: "fal fa-gears",
        title: "item2Title",
        text: "item2Text",
        points: "item2Points",
    },
    {
        id: "ai",
        icon: "fal fa-sparkles",
        title: "item3Title",
        text: "item3Text",
        points: "item3Points",
    },
    {
        id: "measure",
        icon: "fal fa-chart-line",
        title: "item4Title",
        text: "item4Text",
        points: "item4Points",
    },
] as const;

const AboutApproach = async () => {
    const locale = await getLocale();
    const t = await getTranslations("aboutPage.approach");
    const approach = await getAboutApproachContent(locale);

    const badge = approach?.eyebrow || t("badge");
    const titleStrong = approach ? approach.titleStrong : t("titleStrong");
    const titleMuted = approach ? approach.titleMuted : t("titleMuted");
    const description = approach?.description || t("description");

    const fallbackItems = fallbackKeys.map((item, index) => ({
        id: item.id,
        number: String(index + 1).padStart(2, "0"),
        icon: item.icon,
        title: t(item.title),
        text: t(item.text),
        points: t.raw(item.points) as string[],
    }));

    const items = fallbackItems.map((fallback, index) => {
        const card = approach?.cards[index];
        if (!card) return fallback;

        return {
            id: fallback.id,
            number: fallback.number,
            icon: card.icon || fallback.icon,
            title: card.title || fallback.title,
            text: card.text || fallback.text,
            points: card.points.length ? card.points : fallback.points,
        };
    });

    return (
        <section className="about_approach" id="our-approach">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="section-head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="section-head-badge">{badge}</span>
                        </Reveal>

                        <div className="row gx-0 justify-content-between align-items-center">
                            <div className="col-lg-7">
                                <Reveal animation="fade-up" trigger="load">
                                    <h2 className="section-head-title fsz-40 fw-600 lh-2 mb-0">
                                        {titleStrong ? (
                                            <span className="section-head-title-strong">{titleStrong}</span>
                                        ) : null}
                                        {titleStrong && titleMuted ? " " : null}
                                        {titleMuted ? (
                                            <span className="about_approach_title_muted cr-blue">{titleMuted}</span>
                                        ) : null}
                                    </h2>
                                </Reveal>
                            </div>

                            <div className="col-lg-4">
                                <Reveal animation="fade-up" trigger="load">
                                    <p className="about_approach_description fsz-13 fw-400 mb-0 ps-lg-4">
                                        {description}
                                    </p>
                                </Reveal>
                            </div>
                        </div>
                    </div>

                    <div className="row gx-4 gy-4 align-items-start">
                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <div
                                    className="about_approach_nav nav nav-pills flex-column"
                                    id="aboutApproachTab"
                                    role="tablist"
                                    aria-orientation="vertical"
                                >
                                    {items.map((item, index) => (
                                        <button
                                            key={item.id}
                                            className={`nav-link${index === 0 ? " active" : ""}`}
                                            id={`approach-tab-${item.id}`}
                                            data-bs-toggle="tab"
                                            data-bs-target={`#approach-pane-${item.id}`}
                                            type="button"
                                            role="tab"
                                            aria-controls={`approach-pane-${item.id}`}
                                            aria-selected={index === 0}
                                        >
                                            <span className="about_approach_num fsz-13 fw-500">
                                                {item.number}
                                            </span>
                                            <span className="about_approach_label fsz-15 fw-500">
                                                {item.title}
                                            </span>
                                            <i
                                                className="fal fa-arrow-right about_approach_arrow"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-7">
                            <Reveal animation="fade-up" trigger="load">
                                <div className="tab-content" id="aboutApproachContent">
                                    {items.map((item, index) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className={`tab-pane fade${index === 0 ? " show active" : ""}`}
                                                id={`approach-pane-${item.id}`}
                                                role="tabpanel"
                                                aria-labelledby={`approach-tab-${item.id}`}
                                                tabIndex={0}
                                            >
                                                <article className="about_approach_card">
                                                    <span className="about_approach_watermark fw-600">
                                                        {item.number}
                                                    </span>

                                                    <span className="about_approach_icon">
                                                        {item.icon.includes("fa-") ? (
                                                            <i className={item.icon} aria-hidden="true" />
                                                        ) : (
                                                            <img src={item.icon} alt="" aria-hidden="true" />
                                                        )}
                                                    </span>

                                                    <h3 className="about_approach_card_title fsz-22 fw-600 mb-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="about_approach_card_text fsz-14 fw-400">
                                                        {item.text}
                                                    </p>

                                                    <ul className="about_approach_points col-lg-7">
                                                        {item.points.map((point) => (
                                                            <li key={point} className="fsz-14 fw-500">
                                                                <span className="about_approach_diamond" />
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </article>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default AboutApproach;
