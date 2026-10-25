import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductUseCases.scss";

const tabs = [
    { id: "screening", icon: "/images/product-det/use-case-icon-users.svg" },
    { id: "shifts", icon: "/images/product-det/use-case-icon-calendar.svg" },
    { id: "documents", icon: "/images/product-det/use-case-icon-file.svg" },
] as const;

const bars = [
    { tone: "applied", width: 100, short: false },
    { tone: "screened", width: 100, short: false },
    { tone: "high", width: 45.65, short: false },
    { tone: "team", width: 18.48, short: true },
] as const;

const steps = [
    { tone: "challenge", dot: "/images/product-det/use-case-dot-challenge.svg" },
    { tone: "helps", dot: "/images/product-det/use-case-dot-helps.svg" },
    { tone: "value", dot: "/images/product-det/use-case-dot-value.svg" },
] as const;

const measures = [
    { icon: "/images/product-det/use-case-icon-time.svg" },
    { icon: "/images/product-det/use-case-icon-percent.svg" },
] as const;

type LabeledValue = { label: string; value: string };
type StepCopy = { title: string; text: string };
type TabCopy = { title: string };

const ProductUseCases = async () => {
    const t = await getTranslations("productsPage.detail.cases");
    const tabCopy = t.raw("tabs") as TabCopy[];
    const barCopy = t.raw("bars") as LabeledValue[];
    const stepCopy = t.raw("steps") as StepCopy[];
    const measureCopy = t.raw("measures") as string[];

    return (
        <section className="products_cases" id="product-cases">
            <div className="products_cases_head">
                <div className="container">
                    <div className="row align-items-center justify-content-between gy-4 px-lg-4">
                        <div className="col-lg-6">
                            <Reveal animation="fade-up">
                                <span className="products_cases_badge">{t("badge")}</span>
                                <h2 className="products_cases_title fw-500">
                                    <span className="d-block">{t("titleStrong")}</span>
                                    <span className="d-block products_cases_title_muted cr-blue">{t("titleMuted")}</span>
                                </h2>
                            </Reveal>
                        </div>
                        <div className="col-lg-5">
                            <Reveal animation="fade-up">
                                <p className="products_cases_description mb-0">{t("description")}</p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="content">
                    <Reveal animation="fade-up">
                        <ul className="nav nav-tabs products_cases_tabs" id="productCasesTabs" role="tablist">
                            {tabs.map((tab, index) => (
                                <li className="nav-item" role="presentation" key={tab.id}>
                                    <button
                                        className={`nav-link${index === 0 ? " active" : ""}`}
                                        id={`product_cases_tab_${tab.id}`}
                                        data-bs-toggle="tab"
                                        data-bs-target={`#product_cases_panel_${tab.id}`}
                                        type="button"
                                        role="tab"
                                        aria-controls={`product_cases_panel_${tab.id}`}
                                        aria-selected={index === 0}
                                    >
                                        <span className="products_cases_tab_icon">
                                            <img src={tab.icon} alt="" width={18} height={18} />
                                        </span>
                                        <span>{tabCopy[index].title}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="tab-content" id="productCasesContent">
                            <div
                                className="tab-pane fade show active"
                                id="product_cases_panel_screening"
                                role="tabpanel"
                                aria-labelledby="product_cases_tab_screening"
                                tabIndex={0}
                            >
                                <div className="row g-0 products_cases_body">
                                    <div className="col-lg-5 products_cases_chart">
                                        <div>
                                            <h3 className="products_cases_chart_title fw-500">
                                                {t("chartBefore")}
                                                <span>{t("chartCount")}</span>
                                                {t("chartAfter")}
                                            </h3>
                                            {bars.map((bar, index) => (
                                                <div className="products_cases_bar" key={bar.tone}>
                                                    <div className="products_cases_bar_meta">
                                                        <span>{barCopy[index].label}</span>
                                                        <span className="products_cases_bar_value">{barCopy[index].value}</span>
                                                    </div>
                                                    <div
                                                        className={`progress products_cases_progress is-${bar.tone}${bar.short ? " is-short" : ""}`}
                                                        role="progressbar"
                                                        aria-valuenow={bar.width}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        aria-label={barCopy[index].label}
                                                    >
                                                        <div className="progress-bar" style={{ width: bar.short ? "100%" : `${bar.width}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="products_cases_snapshot mb-0">{t("snapshot")}</p>
                                    </div>
                                    <div className="col-lg-7 products_cases_detail">
                                        <div>
                                            <h3 className="products_cases_detail_title fw-500">{tabCopy[0].title}</h3>
                                            <ol className="products_cases_steps">
                                                {steps.map((step, index) => (
                                                    <li className={`products_cases_step is-${step.tone}`} key={step.tone}>
                                                        <img className="products_cases_dot" src={step.dot} alt="" width={12} height={12} />
                                                        <h4 className="products_cases_step_title fw-500">{stepCopy[index].title}</h4>
                                                        <p className="products_cases_step_text mb-0">{stepCopy[index].text}</p>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                        <div className="products_cases_measure">
                                            <span className="products_cases_measure_label fw-500">{t("measureLabel")}</span>
                                            {measures.map((measure, index) => (
                                                <span className="products_cases_chip" key={measure.icon}>
                                                    <img src={measure.icon} alt="" width={16} height={16} />
                                                    {measureCopy[index]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {tabs.slice(1).map((tab, index) => (
                                <div
                                    className="tab-pane fade"
                                    id={`product_cases_panel_${tab.id}`}
                                    role="tabpanel"
                                    aria-labelledby={`product_cases_tab_${tab.id}`}
                                    tabIndex={0}
                                    key={tab.id}
                                >
                                    <div className="products_cases_detail">
                                        <h3 className="products_cases_detail_title fw-500">{tabCopy[index + 1].title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                    <div className="sec-lines"><span></span><span></span></div>
                </div>
            </div>
        </section>
    );
};

export default ProductUseCases;
