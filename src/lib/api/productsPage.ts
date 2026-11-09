import { cache } from "react";
import { api } from "@/lib/api";

export type ProductsHeroContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    image: string;
};

type CmsSection = {
    key?: string;
    data?: Record<string, unknown>;
};

type ProductsPagePayload = {
    success?: boolean;
    data?: {
        sections?: CmsSection[];
    };
};

function text(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function mediaUrl(value: unknown) {
    const raw =
        value && typeof value === "object"
            ? text(
                  (value as Record<string, unknown>).url ??
                      (value as Record<string, unknown>).src ??
                      (value as Record<string, unknown>).path,
              )
            : text(value);

    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;

    const origin = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api(?:\/v1)?\/?$/, "");
    return `${origin}${raw.startsWith("/") ? raw : `/${raw}`}`;
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

const loadProductsPage = cache(async (locale: string) => {
    try {
        const payload = (await api.getProductsPage(locale)) as ProductsPagePayload;
        return payload?.success ? payload : null;
    } catch {
        return null;
    }
});

export async function getProductsHeroContent(locale: string): Promise<ProductsHeroContent | null> {
    const payload = await loadProductsPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "pageHero")?.data ?? null;
    if (!section) return null;

    const title = markedTitle(section);

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section.description),
        primaryLabel: text(section.primaryLabel ?? section.primary_label),
        primaryHref: text(section.primaryHref ?? section.primary_href),
        secondaryLabel: text(section.secondaryLabel ?? section.secondary_label),
        secondaryHref: text(section.secondaryHref ?? section.secondary_href),
        image: mediaUrl(section.image),
    };
}

export type ProductsBirthStep = {
    title: string;
    text: string;
};

export type ProductsBirthContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    steps: ProductsBirthStep[];
};

export async function getProductsBirthContent(locale: string): Promise<ProductsBirthContent | null> {
    const payload = await loadProductsPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "born")?.data ?? null;
    if (!section) return null;

    const title = markedTitle(section);
    const steps = records(section.steps).flatMap((step) => {
        const stepTitle = text(step.title);
        const stepText = text(step.description ?? step.text);
        if (!stepTitle && !stepText) return [];
        return [{ title: stepTitle, text: stepText }];
    });

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        steps,
    };
}

export type ProductsConfigureCard = {
    title: string;
    text: string;
    icon: string;
};

export type ProductsConfigureContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    cards: ProductsConfigureCard[];
};

function fontAwesomeClass(value: unknown) {
    const raw = text(value);
    if (!raw) return "";
    if (/\bfa-/.test(raw)) return raw;

    const name = raw
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();

    return `fa-regular fa-${name}`;
}

export async function getProductsConfigureContent(locale: string): Promise<ProductsConfigureContent | null> {
    const payload = await loadProductsPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "configured")?.data ?? null;
    if (!section) return null;

    const title = markedTitle(section);
    const cards = records(section.items ?? section.cards).flatMap((item) => {
        const cardTitle = text(item.title);
        const cardText = text(item.description ?? item.text);
        if (!cardTitle && !cardText) return [];
        return [{ title: cardTitle, text: cardText, icon: fontAwesomeClass(item.icon) }];
    });

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        cards,
    };
}

export type ProductsDemoContent = {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    description: string;
    points: string[];
};

function accentTitle(title: string) {
    const match = title.match(/^([\s\S]*?)\*\*([\s\S]+?)\*\*([\s\S]*)$/);
    if (!match) return { titleBefore: title, titleAccent: "", titleAfter: "" };

    return {
        titleBefore: match[1].trim(),
        titleAccent: match[2].trim(),
        titleAfter: match[3].trim(),
    };
}

export async function getProductsDemoContent(locale: string): Promise<ProductsDemoContent | null> {
    const payload = await loadProductsPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "demoCta")?.data ?? null;
    if (!section) return null;

    const title = accentTitle(text(section.title));
    const points = records(section.points)
        .map((point) => text(point.label ?? point.title ?? point.text))
        .filter(Boolean);

    return {
        eyebrow: text(section.eyebrow),
        ...title,
        description: text(section.description),
        points,
    };
}

export type ProductsListContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    showFilter: boolean;
};

export type ProductsListCard = {
    id: string;
    status: "available" | "soon";
    image: string;
    name: string;
    kicker: string;
    headline: string;
    problem: string;
    users: string;
    capabilities: string[];
    notifyLabel: string;
    pageSlug: string;
};

const listImages: Record<string, string> = {
    hrh: "/images/products/product-01-hrh-seasonal-hiring.jpg",
    miyar: "/images/products/product-02-mayar-quality.jpg",
    mayar: "/images/products/product-02-mayar-quality.jpg",
    maydan: "/images/products/product-03-maidan-field-ops.jpg",
    maidan: "/images/products/product-03-maidan-field-ops.jpg",
};

const pageSlugs: Record<string, string> = {
    miyar: "mayar",
};

function records(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value)) {
        return value.filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
    }

    if (value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)) {
        return records((value as { data: unknown }).data);
    }

    return [];
}

function splitName(name: string) {
    const parts = name.split(/\s+[—–-]\s+/);
    if (parts.length < 2) return { name, kicker: "" };

    return {
        name: parts[0].trim(),
        kicker: parts.slice(1).join(" ").trim(),
    };
}

function capabilityTitles(value: unknown) {
    return records(value)
        .map((item) => text(item.title ?? item.name ?? item.label))
        .filter(Boolean);
}

export async function getProductsListContent(locale: string): Promise<ProductsListContent | null> {
    const payload = await loadProductsPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "productsList")?.data ?? null;
    if (!section) return null;

    const title = markedTitle(section);

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        showFilter: !(section.showFilter === false || section.showFilter === 0 || section.showFilter === "0"),
    };
}

export async function getProductsListCards(locale: string): Promise<ProductsListCard[]> {
    try {
        const payload = await api.getProducts(locale);
        const items = records((payload as { data?: unknown })?.data ?? payload).filter(
            (item) => item.show_on_products_page !== false && item.show_on_products_page !== 0,
        );

        const cards = await Promise.all(
            items.map(async (item) => {
                const slug = text(item.slug);
                let detail: Record<string, unknown> = {};

                if (slug) {
                    try {
                        const response = await api.getProduct(slug, locale);
                        const data = (response as { data?: unknown })?.data;
                        if (data && typeof data === "object") detail = data as Record<string, unknown>;
                    } catch {
                        detail = {};
                    }
                }

                const availability = text(item.availability ?? detail.availability);
                const name = splitName(text(item.name ?? detail.name));
                const image = mediaUrl(item.image ?? detail.image) || listImages[slug] || "";

                return {
                    id: slug || String(item.id ?? name.name),
                    status: availability === "available" ? "available" : "soon",
                    image,
                    name: name.name,
                    kicker: name.kicker,
                    headline: text(item.tagline ?? detail.tagline),
                    problem: text(detail.problem),
                    users: text(detail.audience ?? detail.users),
                    capabilities: capabilityTitles(detail.capabilities),
                    notifyLabel: text(detail.notify_label ?? detail.notifyLabel),
                    pageSlug: pageSlugs[slug] || slug,
                } satisfies ProductsListCard;
            }),
        );

        return cards.filter((card) => card.name);
    } catch {
        return [];
    }
}

export type ProductHeroContent = {
    badge: string;
    title: string;
    description: string;
    image: string;
    secondaryLabel: string;
};

const apiSlugs: Record<string, string> = {
    mayar: "miyar",
};

const loadProduct = cache(async (locale: string, pageSlug: string) => {
    try {
        const response = await api.getProduct(apiSlugs[pageSlug] || pageSlug, locale);
        const data = (response as { data?: unknown })?.data;
        if (!data || typeof data !== "object") return null;
        return data as Record<string, unknown>;
    } catch {
        return null;
    }
});

export async function getProductHeroContent(locale: string, pageSlug: string): Promise<ProductHeroContent | null> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return null;

    const name = splitName(text(product.name));
    const soon = text(product.availability) === "soon";

    return {
        badge: name.kicker || name.name,
        title: text(product.tagline),
        description: text(product.overview),
        image: mediaUrl(product.image) || listImages[pageSlug] || listImages[apiSlugs[pageSlug]] || "",
        secondaryLabel: soon ? text(product.notify_label ?? product.notifyLabel) : "",
    };
}

export type ProductChallenge = {
    title: string;
    text: string;
};

export async function getProductChallenges(locale: string, pageSlug: string): Promise<ProductChallenge[]> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return [];

    return records(product.challenges).flatMap((item) => {
        const title = text(item.title);
        const challengeText = text(item.description ?? item.text);
        if (!title && !challengeText) return [];
        return [{ title, text: challengeText }];
    });
}

export type ProductOutcome = {
    value: string;
    label: string;
};

export async function getProductOutcomes(locale: string, pageSlug: string): Promise<ProductOutcome[]> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return [];

    return records(product.outcomes).flatMap((item) => {
        const value = text(item.value);
        const label = text(item.label ?? item.title);
        if (!value && !label) return [];
        return [{ value, label }];
    });
}

export async function getProductWorks(locale: string, pageSlug: string): Promise<ProductChallenge[]> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return [];

    return records(product.how_it_works).flatMap((item) => {
        const title = text(item.title);
        const stepText = text(item.description ?? item.text);
        if (!title && !stepText) return [];
        return [{ title, text: stepText }];
    });
}

export async function getProductUseCases(locale: string, pageSlug: string): Promise<ProductChallenge[]> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return [];

    return records(product.use_cases).flatMap((item) => {
        const title = text(item.title);
        const caseText = text(item.description ?? item.text);
        if (!title && !caseText) return [];
        return [{ title, text: caseText }];
    });
}

export async function getProductAi(locale: string, pageSlug: string): Promise<ProductChallenge[]> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return [];

    return records(product.ai).flatMap((item) => {
        const title = text(item.title);
        const aiText = text(item.description ?? item.text);
        if (!title && !aiText) return [];
        return [{ title, text: aiText }];
    });
}

export async function getProductCapabilities(locale: string, pageSlug: string): Promise<ProductChallenge[]> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return [];

    return records(product.capabilities).flatMap((item) => {
        const title = text(item.title);
        const capabilityText = text(item.description ?? item.text);
        if (!title && !capabilityText) return [];
        return [{ title, text: capabilityText }];
    });
}
