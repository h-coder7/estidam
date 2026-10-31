import { cache } from "react";
import { api } from "@/lib/api";

export type ContactHeroContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
};

type CmsSection = {
    key?: string;
    data?: Record<string, unknown>;
};

type ContactPagePayload = {
    success?: boolean;
    data?: {
        sections?: CmsSection[];
    };
};

function text(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function markedTitle(data: Record<string, unknown>) {
    const titleStrong = text(data.titleStrong ?? data.title_strong);
    const titleMuted = text(data.titleMuted ?? data.title_muted);
    if (titleStrong || titleMuted) return { titleStrong, titleMuted };

    const title = text(data.title);
    const match = title.match(/^([\s\S]*?)\*\*([\s\S]+?)\*\*([\s\S]*)$/);
    if (!match) return { titleStrong: title, titleMuted: "" };

    const after = match[3].trim();

    return {
        titleStrong: match[1].trim(),
        titleMuted: after ? `${match[2].trim()} ${after}` : match[2].trim(),
    };
}

const loadContactPage = cache(async (locale: string) => {
    try {
        const payload = (await api.getContactPage(locale)) as ContactPagePayload;
        return payload?.success ? payload : null;
    } catch {
        return null;
    }
});

export async function getContactHeroContent(locale: string): Promise<ContactHeroContent | null> {
    const payload = await loadContactPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "pageHero")?.data ?? null;
    if (!section) return null;

    const title = markedTitle(section);

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section.description),
    };
}

export type ContactHelpPath = {
    source: string;
    title: string;
    description: string;
};

export async function getContactHelpContent(locale: string): Promise<ContactHelpPath[] | null> {
    const payload = await loadContactPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "contactPaths")?.data ?? null;
    if (!section || !Array.isArray(section.paths)) return null;

    const paths = section.paths.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const path = item as Record<string, unknown>;
        if (path.visible === false || path.visible === 0 || path.visible === "0") return [];

        const title = text(path.title);
        const description = text(path.description);
        if (!title && !description) return [];

        return [
            {
                source: text(path.source),
                title,
                description,
            },
        ];
    });

    return paths.length ? paths : null;
}
