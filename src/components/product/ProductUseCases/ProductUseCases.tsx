import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductUseCases } from "@/lib/api/productsPage";

import "./_ProductUseCases.scss";

const tabIcons: Record<string, string> = {
    users: "/images/product-det/use-case-icon-users.svg",
    calendar: "/images/product-det/use-case-icon-calendar.svg",
    file: "/images/product-det/use-case-icon-file.svg",
    filetext: "/images/product-det/use-case-icon-file.svg",
    filecheck: "/images/product-det/use-case-icon-file.svg",
};

const metricIcons: Record<string, string> = {
    clock: "/images/product-det/use-case-icon-time.svg",
    time: "/images/product-det/use-case-icon-time.svg",
    timer: "/images/product-det/use-case-icon-time.svg",
    percent: "/images/product-det/use-case-icon-percent.svg",
    percentage: "/images/product-det/use-case-icon-percent.svg",
};

const metricFallbacks = [
    "/images/product-det/use-case-icon-time.svg",
    "/images/product-det/use-case-icon-percent.svg",
] as const;

const steps = [
    { key: "challenge", tone: "challenge", dot: "/images/product-det/use-case-dot-challenge.svg" },
    { key: "solution", tone: "helps", dot: "/images/product-det/use-case-dot-helps.svg" },
    { key: "value", tone: "value", dot: "/images/product-det/use-case-dot-value.svg" },
] as const;

const iconFor = (map: Record<string, string>, name: string, fallback: string) =>
    map[name.toLowerCase().replace(/[\s_-]/g, "")] || fallback;

const ProductUseCases = async ({ productId }: { productId: "hrh" | "mayar" | "maydan" }) => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.detail.cases");
    const section = await getProductUseCases(locale, productId);
    if (!section || !section.scenarios.length) return null;

    const stepLabels = {
        challenge: t("steps.0.title"),
        solution: t("steps.1.title"),
        value: t("steps.2.title"),
    };
    const measureLabel = section.measureLabel || t("measureLabel");
    const eyebrow = section.eyebrow || t("badge");
    const titleStrong = section.titleStrong || t("titleStrong");
    const titleMuted = section.titleMuted || t("titleMuted");
    const description = section.description || t("description");

    return (
        <section className="products_cases" id="product-cases">
            <div className="products_cases_head">
                <div className="container">
                    <div className="row align-items-center justify-content-between gy-4 px-lg-4">
                        <div className="col-lg-6">
                            <Reveal animation="fade-up">
                                {eyebrow ? <span className="products_cases_badge">{eyebrow}</span> : null}
                                {titleStrong || titleMuted ? (
                                    <h2 className="products_cases_title fw-500">
                                        {titleStrong ? <span className="d-block">{titleStrong}</span> : null}
                                        {titleMuted ? (
                                            <span className="d-block products_cases_title_muted cr-blue">{titleMuted}</span>
                                        ) : null}
                                    </h2>
                                ) : null}
                            </Reveal>
                        </div>
                        {description ? (
                            <div className="col-lg-5">
                                <Reveal animation="fade-up">
                                    <p className="products_cases_description mb-0">{description}</p>
                                </Reveal>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="content">
                    <Reveal animation="fade-up">
                        <ul
                            className="nav nav-tabs products_cases_tabs"
                            id="productCasesTabs"
                            role="tablist"
                            style={{ gridTemplateColumns: `repeat(${Math.min(section.scenarios.length, 3)}, minmax(0, 1fr))` }}
                        >
                            {section.scenarios.map((item, index) => (
                                <li className="nav-item" role="presentation" key={`${item.title}-${index}`}>
                                    <button
                                        className={`nav-link${index === 0 ? " active" : ""}`}
                                        id={`product_cases_tab_${index}`}
                                        data-bs-toggle="tab"
                                        data-bs-target={`#product_cases_panel_${index}`}
                                        type="button"
                                        role="tab"
                                        aria-controls={`product_cases_panel_${index}`}
                                        aria-selected={index === 0}
                                    >
                                        <span className="products_cases_tab_icon">
                                            <img
                                                src={iconFor(tabIcons, item.icon, tabIcons.users)}
                                                alt=""
                                                width={18}
                                                height={18}
                                            />
                                        </span>
                                        <span>{item.title}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="tab-content" id="productCasesContent">
                            {section.scenarios.map((item, index) => {
                                const story = steps.flatMap((step) => {
                                    const text = item[step.key];
                                    return text ? [{ ...step, text, label: stepLabels[step.key] }] : [];
                                });

                                return (
                                    <div
                                        className={`tab-pane fade${index === 0 ? " show active" : ""}`}
                                        id={`product_cases_panel_${index}`}
                                        role="tabpanel"
                                        aria-labelledby={`product_cases_tab_${index}`}
                                        tabIndex={0}
                                        key={`${item.title}-${index}`}
                                    >
                                        <div className="row g-0 products_cases_body">
                                            {item.image ? (
                                                <div className="col-lg-5 products_cases_chart products_cases_visual">
                                                    <img src={item.image} alt={item.title} />
                                                </div>
                                            ) : null}
                                            <div className={item.image ? "col-lg-7 products_cases_detail" : "col-12 products_cases_detail"}>
                                                <div>
                                                    {item.title ? <h3 className="products_cases_detail_title fw-500">{item.title}</h3> : null}
                                                    {story.length ? (
                                                        <ol className="products_cases_steps">
                                                            {story.map((step) => (
                                                                <li className={`products_cases_step is-${step.tone}`} key={step.key}>
                                                                    <img className="products_cases_dot" src={step.dot} alt="" width={12} height={12} />
                                                                    <h4 className="products_cases_step_title fw-500">{step.label}</h4>
                                                                    <p className="products_cases_step_text mb-0">{step.text}</p>
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    ) : null}
                                                </div>
                                                {item.metrics.length ? (
                                                    <div className="products_cases_measure">
                                                        <span className="products_cases_measure_label fw-500">{measureLabel}</span>
                                                        {item.metrics.map((metric, metricIndex) => (
                                                            <span className="products_cases_chip" key={`${metric.label}-${metricIndex}`}>
                                                                <img
                                                                    src={iconFor(
                                                                        metricIcons,
                                                                        metric.icon,
                                                                        metricFallbacks[metricIndex % metricFallbacks.length],
                                                                    )}
                                                                    alt=""
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                {metric.label}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Reveal>
                    <div className="sec-lines"><span></span><span></span></div>
                </div>
            </div>
        </section>
    );
};

export default ProductUseCases;
