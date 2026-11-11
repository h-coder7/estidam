import { cache } from "react";
import { api } from "@/lib/api";
import { createSwrCache, REVALIDATE_MS } from "@/lib/api/swrCache";

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

/** Admin preview (EST-009 `preview_image_url`), then the product image field. */
function productPreview(record: Record<string, unknown>) {
    return (
        mediaUrl(record.preview_image_url) ||
        mediaUrl(record.previewImageUrl) ||
        mediaUrl(record.preview_image) ||
        mediaUrl(record.image)
    );
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

type ProductsPageCacheEntry = {
    payload: ProductsPagePayload | null;
    freshUntil: number;
    refreshing?: Promise<void>;
};

const productsPageCache = new Map<string, ProductsPageCacheEntry>();

async function fetchProductsPage(locale: string) {
    try {
        const payload = (await api.getProductsPage(locale)) as ProductsPagePayload;
        return payload?.success ? payload : null;
    } catch {
        return null;
    }
}

function storeProductsPage(locale: string, payload: ProductsPagePayload | null, previous?: ProductsPagePayload | null) {
    productsPageCache.set(locale, {
        payload: payload ?? previous ?? null,
        freshUntil: Date.now() + REVALIDATE_MS,
    });
}

const loadProductsPage = cache(async (locale: string) => {
    const hit = productsPageCache.get(locale);
    const now = Date.now();

    if (hit && now < hit.freshUntil) return hit.payload;

    if (hit) {
        if (!hit.refreshing) {
            hit.refreshing = fetchProductsPage(locale)
                .then((payload) => {
                    storeProductsPage(locale, payload, hit.payload);
                })
                .finally(() => {
                    const current = productsPageCache.get(locale);
                    if (current) delete current.refreshing;
                });
        }

        return hit.payload;
    }

    const payload = await fetchProductsPage(locale);
    storeProductsPage(locale, payload);
    return payload;
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

type ProductsCardsCacheEntry = {
    cards: ProductsListCard[];
    freshUntil: number;
    refreshing?: Promise<void>;
};

const productsCardsCache = new Map<string, ProductsCardsCacheEntry>();

async function fetchProductsListCards(locale: string): Promise<ProductsListCard[] | null> {
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
                const image = productPreview(item) || productPreview(detail) || listImages[slug] || "";

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
        return null;
    }
}

function storeProductsCards(locale: string, cards: ProductsListCard[] | null, previous?: ProductsListCard[]) {
    productsCardsCache.set(locale, {
        cards: cards ?? previous ?? [],
        freshUntil: Date.now() + REVALIDATE_MS,
    });
}

const loadProductsListCards = cache(async (locale: string) => {
    const hit = productsCardsCache.get(locale);
    const now = Date.now();

    if (hit && now < hit.freshUntil) return hit.cards;

    if (hit) {
        if (!hit.refreshing) {
            hit.refreshing = fetchProductsListCards(locale)
                .then((cards) => {
                    storeProductsCards(locale, cards, hit.cards);
                })
                .finally(() => {
                    const current = productsCardsCache.get(locale);
                    if (current) delete current.refreshing;
                });
        }

        return hit.cards;
    }

    const cards = await fetchProductsListCards(locale);
    storeProductsCards(locale, cards);
    return cards ?? [];
});

export async function getProductsListCards(locale: string): Promise<ProductsListCard[]> {
    return loadProductsListCards(locale);
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

const readProduct = createSwrCache<Record<string, unknown> | null>(null);

async function fetchProduct(locale: string, pageSlug: string) {
    try {
        const response = await api.getProduct(apiSlugs[pageSlug] || pageSlug, locale);
        const data = (response as { data?: unknown })?.data;
        if (!data || typeof data !== "object") return null;
        return data as Record<string, unknown>;
    } catch {
        return null;
    }
}

const loadProduct = cache((locale: string, pageSlug: string) =>
    readProduct(`${locale}:${pageSlug}`, () => fetchProduct(locale, pageSlug)),
);

export async function getProductHeroContent(locale: string, pageSlug: string): Promise<ProductHeroContent | null> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return null;

    const name = splitName(text(product.name));
    const soon = text(product.availability) === "soon";

    return {
        badge: name.kicker || name.name,
        title: text(product.tagline),
        description: text(product.overview),
        image: productPreview(product) || listImages[pageSlug] || listImages[apiSlugs[pageSlug]] || "",
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

export type ProductUseCaseMetric = {
    label: string;
    icon: string;
};

export type ProductUseCase = {
    icon: string;
    title: string;
    image: string;
    challenge: string;
    solution: string;
    value: string;
    metrics: ProductUseCaseMetric[];
};

export type ProductUseCasesSection = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    measureLabel: string;
    scenarios: ProductUseCase[];
};

function fieldText(value: unknown) {
    if (typeof value === "string") return value.trim();
    if (!value || typeof value !== "object") return "";

    const record = value as Record<string, unknown>;
    return text(record.text ?? record.description ?? record.body ?? record.title);
}

function metricItems(value: unknown): ProductUseCaseMetric[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
        if (typeof item === "string") {
            const label = item.trim();
            return label ? [{ label, icon: "" }] : [];
        }

        if (!item || typeof item !== "object") return [];

        const record = item as Record<string, unknown>;
        const label = text(record.label ?? record.title ?? record.text ?? record.name ?? record.value);
        if (!label) return [];

        return [{ label, icon: text(record.icon) }];
    });
}

export async function getProductUseCases(locale: string, pageSlug: string): Promise<ProductUseCasesSection | null> {
    const product = await loadProduct(locale, pageSlug);
    const raw = product?.use_cases_section;
    if (!raw || typeof raw !== "object") return null;

    const section = raw as Record<string, unknown>;
    const title = markedTitle(section);
    const scenarios = records(section.scenarios ?? section.items ?? section.tabs).flatMap((item) => {
        const scenario: ProductUseCase = {
            icon: text(item.icon),
            title: text(item.title ?? item.tab ?? item.name),
            image: mediaUrl(item.image_url ?? item.imageUrl ?? item.image),
            challenge: fieldText(item.challenge),
            solution: fieldText(item.solution ?? item.helps ?? item.response),
            value: fieldText(item.value ?? item.expected_value ?? item.expectedValue),
            metrics: metricItems(item.metrics ?? item.measures ?? item.what_we_measure),
        };

        const hasContent =
            scenario.title ||
            scenario.image ||
            scenario.challenge ||
            scenario.solution ||
            scenario.value ||
            scenario.metrics.length;

        return hasContent ? [scenario] : [];
    });

    const content: ProductUseCasesSection = {
        eyebrow: text(section.eyebrow ?? section.badge),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section.description),
        measureLabel: text(section.measure_label ?? section.metrics_label ?? section.measureLabel),
        scenarios,
    };

    const hasContent =
        content.eyebrow ||
        content.titleStrong ||
        content.titleMuted ||
        content.description ||
        content.scenarios.length;

    return hasContent ? content : null;
}

export type ProductAiCard = {
    icon: string;
    title: string;
    text: string;
};

export type ProductAiSection = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    cards: ProductAiCard[];
    badgeTitle: string;
    badgeText: string;
    governanceTitle: string;
    governanceText: string;
    image: string;
};

export async function getProductAi(locale: string, pageSlug: string): Promise<ProductAiSection | null> {
    const product = await loadProduct(locale, pageSlug);
    const raw = product?.ai_section;
    if (!raw || typeof raw !== "object") return null;

    const section = raw as Record<string, unknown>;
    const title = markedTitle(section);
    const badge =
        section.badge && typeof section.badge === "object" ? (section.badge as Record<string, unknown>) : {};
    const governance =
        section.governance && typeof section.governance === "object"
            ? (section.governance as Record<string, unknown>)
            : {};
    const cards = records(section.cards).flatMap((item) => {
        const cardTitle = text(item.title);
        const cardText = text(item.description ?? item.text);
        if (!cardTitle && !cardText) return [];

        return [{ icon: text(item.icon), title: cardTitle, text: cardText }];
    });

    const content: ProductAiSection = {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section.description),
        cards,
        badgeTitle: text(badge.title),
        badgeText: text(badge.subtitle ?? badge.text),
        governanceTitle: text(governance.title),
        governanceText: text(governance.text ?? governance.description),
        image: mediaUrl(section.image_url ?? section.imageUrl ?? section.image),
    };

    const hasContent =
        content.eyebrow ||
        content.titleStrong ||
        content.titleMuted ||
        content.description ||
        content.cards.length ||
        content.badgeTitle ||
        content.badgeText ||
        content.governanceTitle ||
        content.governanceText ||
        content.image;

    return hasContent ? content : null;
}

export type ProductCapability = {
    title: string;
    text: string;
    points: string[];
    image: string;
};

function capabilityPoints(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
        if (typeof item === "string") {
            const line = item.trim();
            return line ? [line] : [];
        }

        if (!item || typeof item !== "object") return [];
        const record = item as Record<string, unknown>;
        const line = text(record.title ?? record.text ?? record.description ?? record.label);
        return line ? [line] : [];
    });
}

export async function getProductCapabilities(locale: string, pageSlug: string): Promise<ProductCapability[]> {
    const product = await loadProduct(locale, pageSlug);
    if (!product) return [];

    return records(product.capabilities).flatMap((item) => {
        const title = text(item.title);
        const capabilityText = text(item.description ?? item.text);
        const points = capabilityPoints(item.points);
        const image = mediaUrl(item.image_url ?? item.imageUrl ?? item.image);
        if (!title && !capabilityText && !points.length && !image) return [];

        return [{ title, text: capabilityText, points, image }];
    });
}
