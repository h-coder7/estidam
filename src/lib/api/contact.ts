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

const directSocials = ["linkedin", "x", "instagram", "facebook"] as const;

export type ContactDirectSocialId = (typeof directSocials)[number];

export type ContactDirectChannel = {
    id: "email" | "phone" | "whatsapp" | "address";
    value: string;
    ltr: boolean;
};

export type ContactDirectContent = {
    title: string;
    channels: ContactDirectChannel[];
    socials: { id: ContactDirectSocialId; href: string }[];
};

type SettingsPayload = {
    success?: boolean;
    data?: {
        site_address?: unknown;
        contact?: Record<string, unknown>;
        social?: Record<string, unknown>;
    };
};

function shown(value: unknown) {
    return !(value === false || value === 0 || value === "0" || value === "false");
}

function link(value: unknown) {
    const href = text(value);
    if (!href || href === "#" || href === "#0") return "";
    return href;
}

export async function getContactDirectContent(locale: string): Promise<ContactDirectContent | null> {
    const payload = await loadContactPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "infoCard")?.data ?? null;
    if (!section) return null;

    let settings: SettingsPayload["data"] = null;
    try {
        const response = (await api.getSettings(locale)) as SettingsPayload;
        settings = response?.success ? response.data ?? null : null;
    } catch {
        settings = null;
    }

    const contact = settings?.contact ?? {};
    const social = settings?.social ?? {};
    const email = text(section.email) || text(contact.email);
    const phone = text(section.phone) || text(contact.phone);
    const whatsapp = text(section.whatsapp) || text(contact.whatsapp);
    const address = text(section.address) || text(settings?.site_address);

    const channels = [
        email ? { id: "email" as const, value: email, ltr: true } : null,
        phone ? { id: "phone" as const, value: phone, ltr: true } : null,
        whatsapp ? { id: "whatsapp" as const, value: whatsapp, ltr: true } : null,
        address ? { id: "address" as const, value: address, ltr: false } : null,
    ].filter((channel) => channel !== null);

    const socials = shown(section.showSocial)
        ? directSocials.flatMap((id) => {
              const href = link(section[id] ?? social[id]);
              return href ? [{ id, href }] : [];
          })
        : [];

    return {
        title: text(section.title),
        channels,
        socials,
    };
}

export type ContactFaqItem = {
    question: string;
    answer: string;
};

export type ContactFaqContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    items: ContactFaqItem[];
};

type FaqPayload = {
    success?: boolean;
    data?: unknown;
};

function faqTitle(title: string) {
    const marked = markedTitle({ title });
    if (marked.titleMuted) return marked;

    const words = title.split(/\s+/).filter(Boolean);
    if (words.length < 2) return { titleStrong: title, titleMuted: "" };

    return {
        titleStrong: words.slice(0, -1).join(" "),
        titleMuted: words[words.length - 1],
    };
}

export async function getContactFaqContent(locale: string): Promise<ContactFaqContent | null> {
    const payload = await loadContactPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "faq")?.data ?? null;
    if (!section) return null;

    let items: ContactFaqItem[] = [];
    try {
        const response = (await api.getFaqs(locale)) as FaqPayload;
        const rows = Array.isArray(response?.data) ? response.data : [];
        items = rows.flatMap((item) => {
            if (!item || typeof item !== "object") return [];
            const row = item as Record<string, unknown>;
            if (text(row.page).toLowerCase() !== "contact") return [];
            if (row.visible === false || row.visible === 0 || row.visible === "0") return [];

            const question = text(row.question);
            const answer = text(row.answer);
            if (!question && !answer) return [];

            return [{ question, answer }];
        });
    } catch {
        items = [];
    }

    const title = faqTitle(text(section.title));

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        items,
    };
}

export type ContactCtaContent = {
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
};

function ctaTitle(data: Record<string, unknown>) {
    const titleBefore = text(data.titleBefore ?? data.title_before);
    const titleAccent = text(data.titleAccent ?? data.title_accent);
    const titleAfter = text(data.titleAfter ?? data.title_after);
    if (titleBefore || titleAccent || titleAfter) return { titleBefore, titleAccent, titleAfter };

    const title = text(data.title);
    const match = title.match(/^([\s\S]*?)\*\*([\s\S]+?)\*\*([\s\S]*)$/);
    if (!match) return { titleBefore: title, titleAccent: "", titleAfter: "" };

    return {
        titleBefore: match[1].trim(),
        titleAccent: match[2].trim(),
        titleAfter: match[3].trim(),
    };
}

export async function getContactCtaContent(locale: string): Promise<ContactCtaContent | null> {
    const payload = await loadContactPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "readinessBanner")?.data ?? null;
    if (!section) return null;

    const title = ctaTitle(section);

    return {
        ...title,
        description: text(section.description),
        primaryLabel: text(section.ctaLabel ?? section.primaryLabel ?? section.primary_label),
        primaryHref: text(section.ctaHref ?? section.primaryHref ?? section.primary_href),
        secondaryLabel: text(section.secondaryLabel ?? section.secondary_label),
        secondaryHref: text(section.secondaryHref ?? section.secondary_href),
    };
}
