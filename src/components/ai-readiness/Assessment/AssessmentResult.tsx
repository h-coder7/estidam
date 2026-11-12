"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { AssessmentResult, AssessmentStrength } from "@/lib/api/assessment";

import "./_AssessmentResult.scss";

const DIMENSIONS = [
    { id: "operations", keys: ["operations"] },
    { id: "data", keys: ["data"] },
    { id: "systems", keys: ["infrastructure", "systems"] },
    { id: "adoption", keys: ["adoption", "ai", "workforce"] },
    { id: "governance", keys: ["governance"] },
    { id: "value", keys: ["value", "goals"] },
] as const;

const OPPORTUNITY_ICONS = [
    "/images/ai-assessment/result-settings.svg",
    "/images/ai-assessment/result-connect.svg",
    "/images/ai-assessment/result-brain.svg",
] as const;

const radarPoint = (index: number, ratio: number, radius: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / DIMENSIONS.length;
    return [160 + Math.cos(angle) * radius * ratio, 160 + Math.sin(angle) * radius * ratio];
};

const ringPoints = (ratio: number) =>
    DIMENSIONS.map((_, index) => radarPoint(index, ratio, 108).map((value) => value.toFixed(1)).join(",")).join(" ");

const strengthText = (item: AssessmentStrength) => {
    if (typeof item === "string") return item;
    return item.text || item.title || item.description || "";
};

const AssessmentResultView = ({ result }: { result: AssessmentResult }) => {
    const t = useTranslations("aiReadinessPage.assessment");
    const locale = useLocale();
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const scores = result.categoryScores ?? {};
    const labels = {
        operations: t("dimOperations"),
        data: t("dimData"),
        systems: t("dimSystems"),
        adoption: t("dimAdoption"),
        governance: t("dimGovernance"),
        value: t("dimValue"),
    };
    const radarLabels = {
        operations: t("radarOperations"),
        data: t("radarData"),
        systems: t("radarSystems"),
        adoption: t("radarAdoption"),
        governance: t("radarGovernance"),
        value: t("radarValue"),
    };
    const dimensions = DIMENSIONS.map((dimension) => {
        const match = dimension.keys.find((key) => typeof scores[key] === "number");
        const value = match ? Math.max(0, Math.min(100, scores[match])) : null;
        return { ...dimension, label: labels[dimension.id], radar: radarLabels[dimension.id], value };
    });

    const strengths = (result.strengths ?? []).map(strengthText).filter(Boolean);
    const coverage = result.categoryCoverage;
    const measured = dimensions.filter((dimension) => dimension.value !== null).length;
    const polygon = dimensions
        .map((dimension, index) => radarPoint(index, (dimension.value ?? 0) / 100, 108).map((value) => value.toFixed(1)).join(","))
        .join(" ");

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (sending) return;

        const form = event.currentTarget;
        const data = new FormData(form);
        const fullName = String(data.get("fullName") || "").trim();
        const jobTitle = String(data.get("jobTitle") || "").trim();
        const email = String(data.get("email") || "").trim();
        const mobile = String(data.get("mobile") || "").trim();
        const consent = data.get("consent") === "yes";

        if (!fullName || !jobTitle || !email || !mobile || !consent) {
            setStatus({ type: "error", message: t("formInvalid") });
            return;
        }

        setSending(true);
        setStatus(null);

        try {
            const response = await fetch("/api/contact/", {
                method: "POST",
                headers: { Accept: "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    locale,
                    requestType: "AI Readiness Report",
                    fullName,
                    organization: result.code,
                    jobTitle,
                    email,
                    mobile,
                    consent: true,
                    message: `${result.tier.name} — ${result.percentage}% (${result.code})`,
                }),
            });
            const payload = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;

            if (!response.ok || payload?.success === false) {
                setStatus({ type: "error", message: payload?.message || t("formError") });
                return;
            }

            form.reset();
            setStatus({ type: "success", message: payload?.message || t("sent") });
        } catch {
            setStatus({ type: "error", message: t("formError") });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="report">
            <span className="report_glow report_glow_a" aria-hidden="true" />
            <span className="report_glow report_glow_b" aria-hidden="true" />

            <div className="report_top">
                <article className="report_score">
                    <p className="report_badge">
                        <img src="/images/ai-assessment/result-dot.svg" alt="" />
                        <span>{t("completeBadge")}</span>
                        <span className="is_mark">•</span>
                        <span>{t("complete")}</span>
                    </p>
                    <p className="report_percent">{Math.round(result.percentage)}%</p>
                    <div className="report_tier">
                        <span>{result.tier.name}</span>
                        <i />
                    </div>
                    <p className="report_summary">{result.tier.summary || result.tier.diagnosis}</p>
                    <div className="report_stats">
                        <p>
                            <strong>{coverage ? `${coverage.passed}/${coverage.total}` : `${measured}/${DIMENSIONS.length}`}</strong>
                            <span>{t("dimensions")}</span>
                        </p>
                        <p>
                            <strong>{strengths.length}×</strong>
                            <span>{t("strengthsStat")}</span>
                        </p>
                        <p>
                            <strong>{t("planValue")}</strong>
                            <span>{t("planStat")}</span>
                        </p>
                    </div>
                </article>

                <div className="report_side">
                    <article className="report_chart">
                        <div className="report_radar" aria-hidden="true">
                            <svg viewBox="0 0 320 320">
                                <polygon points={ringPoints(1)} />
                                <polygon points={ringPoints(0.66)} />
                                <polygon points={ringPoints(0.33)} />
                                <polygon className="is_score" points={polygon} />
                                {dimensions.map((dimension, index) => {
                                    if (dimension.value === null) return null;
                                    const [cx, cy] = radarPoint(index, dimension.value / 100, 108);
                                    return <circle key={dimension.id} cx={cx} cy={cy} r="5" />;
                                })}
                            </svg>
                            {dimensions.map((dimension) => (
                                <span key={dimension.id} className={`is_${dimension.id}`}>
                                    {dimension.radar}
                                </span>
                            ))}
                        </div>
                        <ul className="report_bars">
                            {dimensions.map((dimension) => (
                                <li key={dimension.id}>
                                    <span>{dimension.label}</span>
                                    <span className="report_bar">
                                        <i style={{ width: `${dimension.value ?? 0}%` }} />
                                    </span>
                                    <strong>
                                        {dimension.value === null ? "—" : Math.round(dimension.value)}
                                        {dimension.value === null ? null : <em>%</em>}
                                    </strong>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <div className="report_split">
                        <article className="report_list">
                            <h2>{t("strengths")}</h2>
                            {strengths.length > 0 ? (
                                <ul>
                                    {strengths.map((item) => (
                                        <li key={item}>
                                            <span className="report_check">
                                                <img src="/images/ai-assessment/result-check.svg" alt="" />
                                            </span>
                                            <p>{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="report_note">{result.strengthsMessage}</p>
                            )}
                        </article>
                        <article className="report_list">
                            <h2>{t("gapsTitle")}</h2>
                            {result.gaps.length > 0 ? (
                                <ul>
                                    {result.gaps.map((gap) => (
                                        <li key={gap.questionNo}>
                                            <img src="/images/ai-assessment/result-gap.svg" alt="" />
                                            <p>{gap.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="report_note">{result.gapsMessage}</p>
                            )}
                        </article>
                    </div>

                    {result.recommendations.length > 0 ? (
                        <article className="report_opportunities">
                            <h2>{t("opportunities")}</h2>
                            <ul>
                                {result.recommendations.map((item, index) => (
                                    <li key={item.key}>
                                        <span>
                                            <img src={OPPORTUNITY_ICONS[index % OPPORTUNITY_ICONS.length]} alt="" />
                                        </span>
                                        <p>
                                            <strong>{item.title || item.productName}</strong>
                                            <em>{item.description}</em>
                                        </p>
                                        <img className="report_go" src="/images/ai-assessment/result-arrow.svg" alt="" />
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ) : null}
                </div>
            </div>

            {result.roadmap.length > 0 ? (
                <article className="report_plan">
                    <h2>
                        {t("planTitle")} <span>{t("planTitleMuted")}</span>
                    </h2>
                    <ol>
                        {result.roadmap.map((step, index) => (
                            <li key={step.order} className={index < 2 ? "is_done" : undefined}>
                                <span>{String(step.order).padStart(2, "0")}</span>
                                <strong>{step.title}</strong>
                                <p>{step.action}</p>
                            </li>
                        ))}
                    </ol>
                </article>
            ) : null}

            <article className="report_cta">
                <div>
                    <p className="report_badge">
                        <img src="/images/ai-assessment/result-dot.svg" alt="" />
                        <span>{t("nextStep")}</span>
                        <span className="is_mark">•</span>
                        <span>{t("nextStepAction")}</span>
                    </p>
                    <h2>
                        <span className="report_line">{t("ctaLine1")}</span>
                        <span className="report_line">{t("ctaLine2")}</span>
                        <span className="report_line">
                            {t("ctaLead")} <span>{t("ctaAccent")}</span>
                        </span>
                    </h2>
                    <p>{t("ctaText")}</p>
                </div>
                <form onSubmit={onSubmit} noValidate>
                    <label>
                        <span>
                            {t("fullName")} <em>*</em>
                        </span>
                        <input name="fullName" type="text" autoComplete="name" />
                    </label>
                    <label>
                        <span>
                            {t("jobTitle")} <em>*</em>
                        </span>
                        <input name="jobTitle" type="text" autoComplete="organization-title" />
                    </label>
                    <label>
                        <span>
                            {t("workEmail")} <em>*</em>
                        </span>
                        <input name="email" type="email" autoComplete="email" placeholder={t("emailPlaceholder")} />
                    </label>
                    <label>
                        <span>
                            {t("mobile")} <em>*</em>
                        </span>
                        <input name="mobile" type="tel" autoComplete="tel" placeholder={t("mobilePlaceholder")} />
                    </label>
                    <label className="report_consent">
                        <input name="consent" type="checkbox" value="yes" />
                        <span>{t("consent")}</span>
                    </label>
                    <button type="submit" disabled={sending}>
                        <span>{sending ? t("sendingReport") : t("send")}</span>
                        <img src="/images/ai-assessment/result-send.svg" alt="" />
                    </button>
                    {status ? <p className={`report_status is_${status.type}`}>{status.message}</p> : null}
                </form>
            </article>
        </div>
    );
};

export default AssessmentResultView;
