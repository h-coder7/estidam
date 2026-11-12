"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
    type AssessmentOption,
    type AssessmentResult,
    type AssessmentSession,
    clearAssessmentSession,
    completeAssessment,
    loadAssessmentSession,
    saveAssessmentStage,
} from "@/lib/api/assessment";
import { assessmentCopy, assessmentQuestions } from "@/content/assessmentQuestions";
import { getLenis } from "@/components/LenisProvider";
import AssessmentResultView from "./AssessmentResult";

import "./_Assessment.scss";

const icons = [
    "/images/ai-assessment/step-org.svg",
    "/images/ai-assessment/step-ops.svg",
    "/images/ai-assessment/step-systems.svg",
    "/images/ai-assessment/step-data.svg",
    "/images/ai-assessment/step-ai.svg",
    "/images/ai-assessment/step-goals.svg",
] as const;

const Assessment = () => {
    const t = useTranslations("aiReadinessPage.assessment");
    const locale = useLocale();
    const router = useRouter();
    const [session, setSession] = useState<AssessmentSession | null>(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, AssessmentOption>>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<AssessmentResult | null>(null);

    useEffect(() => {
        let active = true;

        loadAssessmentSession(locale)
            .then((next) => {
                if (active) setSession(next);
            })
            .catch(() => {
                if (active) setError(t("error"));
            });

        return () => {
            active = false;
        };
    }, [locale, t]);

    useLayoutEffect(() => {
        const lenis = getLenis();
        if (lenis) {
            lenis.scrollTo(0, { immediate: true, force: true });
            return;
        }

        window.scrollTo(0, 0);
    }, [stepIndex, result]);

    const stage = assessmentQuestions[stepIndex];
    const stageReady = stage?.questions.every((question) => answers[question.no]);

    const goBack = () => {
        if (result) {
            router.push("/ai-readiness");
            return;
        }

        if (stepIndex === 0) {
            router.push("/ai-readiness");
            return;
        }

        setError("");
        setStepIndex((current) => current - 1);
    };

    const goNext = async () => {
        if (!session || !stage || !stageReady || saving) return;

        setSaving(true);
        setError("");

        try {
            await saveAssessmentStage(
                session,
                stage.stage,
                stage.questions.map((question) => ({
                    questionNo: question.no,
                    option: answers[question.no],
                })),
                locale,
            );

            if (stepIndex >= assessmentQuestions.length - 1) {
                const nextResult = await completeAssessment(session, locale);
                clearAssessmentSession();
                setResult(nextResult);
                return;
            }

            setStepIndex((current) => current + 1);
        } catch {
            setError(t("error"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className={`assess${result ? " is_result" : ""}`}>
            <div className={result ? "report_wrap" : "container"}>
                {result ? (
                    <AssessmentResultView result={result} />
                ) : (
                <>
                <div
                    className="assess_progress"
                    aria-hidden="true"
                    style={{ gridTemplateColumns: `repeat(${assessmentQuestions.length}, minmax(0, 1fr))` }}
                >
                    {assessmentQuestions.map((item, index) => (
                        <span key={item.stage} className={index <= stepIndex ? "is_done" : undefined} />
                    ))}
                </div>

                <ol className="assess_steps">
                    {assessmentQuestions.map((item, index) => (
                        <li key={item.stage} className={index === stepIndex ? "is_active" : undefined}>
                            {index > 0 ? <span className="assess_step_line" aria-hidden="true" /> : null}
                            <span className="assess_step_icon">
                                <img src={icons[index] ?? icons[0]} alt="" />
                            </span>
                            <span className="assess_step_label">{assessmentCopy(item.name, locale)}</span>
                        </li>
                    ))}
                </ol>

                        <div className="assess_head">
                            <span className="assess_badge">{stage ? t("stage", { number: stage.stage }) : ""}</span>
                            <h1 className="assess_title">{session && stage ? assessmentCopy(stage.name, locale) : t("loading")}</h1>
                            <p className="assess_hint">{t("hint")}</p>
                        </div>

                        {stage ? (
                            <div className="assess_questions">
                                {stage.questions.map((question) => (
                                    <fieldset key={question.no} className="assess_question">
                                        <legend className="assess_question_title">{assessmentCopy(question.text, locale)}</legend>
                                        <div className="assess_options" role="radiogroup" aria-label={assessmentCopy(question.text, locale)}>
                                            {question.options.map((option, index) => {
                                                const selected = answers[question.no] === option.key;
                                                return (
                                                    <button
                                                        key={option.key}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={selected}
                                                        className={`assess_option${selected ? " is_selected" : ""}`}
                                                        onClick={() =>
                                                            setAnswers((current) => ({
                                                                ...current,
                                                                [question.no]: option.key,
                                                            }))
                                                        }
                                                    >
                                                        <span className="assess_option_index">{String(index + 1).padStart(2, "0")}</span>
                                                        <span className={`assess_option_check${selected ? " is_selected" : ""}`}>
                                                            {selected ? <img src="/images/ai-assessment/option-check.svg" alt="" /> : null}
                                                        </span>
                                                        <span className="assess_option_copy">
                                                            <span className="assess_option_title">{assessmentCopy(option.label, locale)}</span>
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </fieldset>
                                ))}
                            </div>
                        ) : null}

                {error ? <p className="assess_error">{error}</p> : null}

                <div className="assess_actions">
                    <button type="button" className="assess_back" onClick={goBack}>
                        <img src="/images/ai-assessment/arrow-back.svg" alt="" />
                        <span>{t("back")}</span>
                    </button>
                    <button
                        type="button"
                        className="assess_next"
                        onClick={goNext}
                        disabled={!session || !stageReady || saving}
                    >
                        <span>{saving ? t("saving") : t("continue")}</span>
                        <img src="/images/ai-assessment/arrow-next.svg" alt="" />
                    </button>
                </div>
                </>
                )}
            </div>
        </section>
    );
};

export default Assessment;
