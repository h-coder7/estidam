import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const raw = new URL(request.url).searchParams.get("url");
    if (!raw) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    let target: URL;
    try {
        target = new URL(raw);
    } catch {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const allowed =
        target.protocol === "https:" &&
        (target.hostname === "inspire-sa.com" || target.hostname.endsWith(".inspire-sa.com"));
    if (!allowed) {
        return NextResponse.json({ success: false }, { status: 403 });
    }

    const upstream = await fetch(target);
    if (!upstream.ok || !upstream.body) {
        return NextResponse.json({ success: false }, { status: 502 });
    }

    return new Response(upstream.body, {
        headers: {
            "Content-Type": upstream.headers.get("content-type") || "image/png",
            "Cache-Control": "public, max-age=86400",
        },
    });
}
