type Envelope<T> = { success?: boolean; data: T; message?: string };

const postAssessment = async <T>(body: unknown) => {
    const response = await fetch("/api/assessment/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
    });
    const payload = (await response.json()) as Envelope<T>;

    if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Assessment request failed");
    }

    return payload.data;
};

export type AssessmentOption = "A" | "B" | "C" | "D";

export type AssessmentSession = {
    id: string;
    resumeToken: string;
    code: string;
    currentStage: number;
};

export type AssessmentStrength = string | { text?: string; title?: string; description?: string };

export type AssessmentResult = {
    code: string;
    totalScore: number;
    maxScore: number;
    percentage: number;
    tier: {
        key?: string;
        name: string;
        summary: string;
        diagnosis: string;
        direction: string;
    };
    categoryScores?: Record<string, number>;
    categoryCoverage?: { passed: number; total: number };
    strengths?: AssessmentStrength[];
    strengthsMessage?: string | null;
    gaps: { questionNo: number; category: string; text: string }[];
    gapsMessage?: string | null;
    recommendations: {
        key: string;
        productName: string;
        title: string;
        description: string;
        expectedROI?: string;
    }[];
    roadmap: { order: number; duration: string; title: string; action: string }[];
};

const STORAGE_KEY = "estidam.assessment";

let starting: Promise<AssessmentSession> | null = null;

const readStoredSession = (): AssessmentSession | null => {
    if (typeof window === "undefined") return null;

    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as AssessmentSession;
        if (!parsed?.id || !parsed?.resumeToken) return null;
        return parsed;
    } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

export const loadAssessmentSession = (locale: string) => {
    const stored = readStoredSession();
    if (stored) return Promise.resolve(stored);

    if (!starting) {
        starting = postAssessment<AssessmentSession>({ action: "start", locale })
            .then((session) => {
                window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
                return session;
            })
            .catch((error) => {
                starting = null;
                throw error;
            });
    }

    return starting;
};

export const clearAssessmentSession = () => {
    starting = null;
    if (typeof window !== "undefined") window.sessionStorage.removeItem(STORAGE_KEY);
};

export const saveAssessmentStage = (
    session: AssessmentSession,
    stage: number,
    answers: { questionNo: number; option: AssessmentOption }[],
    locale: string,
) =>
    postAssessment({
        action: "save",
        locale,
        id: session.id,
        resumeToken: session.resumeToken,
        stage,
        answers,
    });

export const completeAssessment = (session: AssessmentSession, locale: string) =>
    postAssessment<AssessmentResult>({
        action: "complete",
        locale,
        id: session.id,
        resumeToken: session.resumeToken,
    });
