import axios from "axios";
import { NextResponse } from "next/server";
import apiClient from "@/lib/api";

type AssessmentAction = "start" | "save" | "complete";

type AssessmentRequest = {
    action?: AssessmentAction;
    locale?: string;
    id?: string;
    resumeToken?: string;
    stage?: number;
    answers?: { questionNo?: number; option?: string }[];
};

const OPTIONS = new Set(["A", "B", "C", "D"]);

function localeOf(value: unknown) {
    return value === "en" ? "en" : "ar";
}

export async function POST(request: Request) {
    let input: AssessmentRequest;

    try {
        input = (await request.json()) as AssessmentRequest;
    } catch {
        return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
    }

    const locale = localeOf(input.locale);
    const headers: Record<string, string> = {
        lang: locale,
        "Idempotency-Key": crypto.randomUUID(),
    };

    if (input.resumeToken) headers["X-Assessment-Token"] = input.resumeToken;

    try {
        if (input.action === "start") {
            const result = await apiClient.post("assessments", {}, { headers });
            return NextResponse.json(result.data);
        }

        if (!input.id || !input.resumeToken) {
            return NextResponse.json({ success: false, message: "Missing assessment session." }, { status: 400 });
        }

        if (input.action === "save") {
            const answers = (input.answers ?? []).filter(
                (answer): answer is { questionNo: number; option: string } =>
                    typeof answer.questionNo === "number" &&
                    answer.questionNo >= 1 &&
                    answer.questionNo <= 14 &&
                    typeof answer.option === "string" &&
                    OPTIONS.has(answer.option),
            );

            const result = await apiClient.put(
                `assessments/${input.id}/answers`,
                { stage: input.stage, answers },
                { headers },
            );
            return NextResponse.json(result.data);
        }

        if (input.action === "complete") {
            const result = await apiClient.post(`assessments/${input.id}/complete`, {}, { headers });
            return NextResponse.json(result.data);
        }

        return NextResponse.json({ success: false, message: "Unknown action." }, { status: 400 });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            const status = error.response?.status || 502;

            if (data && typeof data === "object") {
                return NextResponse.json(data, { status });
            }
        }

        return NextResponse.json(
            {
                success: false,
                message: locale === "en" ? "Could not save this stage. Try again." : "تعذر حفظ هذه المرحلة. حاول مرة أخرى.",
            },
            { status: 502 },
        );
    }
}
