import axios from "axios";
import { NextResponse } from "next/server";
import { api } from "@/lib/api";

type ContactRequest = {
    locale?: string;
    requestType?: string;
    fullName?: string;
    organization?: string;
    jobTitle?: string;
    email?: string;
    mobile?: string;
    message?: string;
    consent?: boolean;
};

function text(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
    let input: ContactRequest;

    try {
        input = (await request.json()) as ContactRequest;
    } catch {
        return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
    }

    const locale = input.locale === "en" ? "en" : "ar";
    const body = {
        name: text(input.fullName),
        email: text(input.email),
        phone: text(input.mobile),
        organization: text(input.organization),
        job_title: text(input.jobTitle),
        source: text(input.requestType),
        message: text(input.message),
        consent: input.consent === true,
    };

    if (!body.name || !body.email || !body.phone || !body.organization || !body.source || !body.consent) {
        return NextResponse.json(
            {
                success: false,
                message: locale === "en" ? "Please complete the required fields." : "أكمل الحقول المطلوبة.",
            },
            { status: 422 },
        );
    }

    try {
        const result = await api.submitContact(body, locale);
        return NextResponse.json(result);
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
                message: locale === "en" ? "Could not send your request." : "تعذر إرسال الطلب.",
            },
            { status: 502 },
        );
    }
}
