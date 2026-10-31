import { cache } from "react";
import { api } from "@/lib/api";
import homeAr from "@/mock-api/home.ar.json";
import homeEn from "@/mock-api/home.en.json";

export type FooterSocialKey = "facebook" | "instagram" | "x" | "whatsapp" | "linkedin";

export type FooterSocialLink = {
    key: FooterSocialKey;
    url: string;
};

export type FooterSectionData = {
    description: string;
    email: string;
    phone: string;
    address: string;
    socials: FooterSocialLink[];
};

type HomeMock = typeof homeAr;

function getLocaleHome(locale: string): HomeMock {
    return locale === "ar" ? homeAr : homeEn;
}

export async function getFooterSection(locale: string): Promise<FooterSectionData> {
    const home = getLocaleHome(locale);
    const footer = home.footer;

    return {
        description: footer?.description || "",
        email: footer?.email || "",
        phone: footer?.phone || "",
        address: footer?.location || "",
        socials: [],
    };
}

export type HeroContent = {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    primaryUrl: string;
    secondaryUrl: string;
    image: string;
};

type CmsSection = {
    key?: string;
    data?: Record<string, unknown>;
};

type HomePagePayload = {
    success?: boolean;
    data?: {
        sections?: CmsSection[];
    };
};

function text(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function mediaUrl(value: string) {
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;

    const origin = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api(?:\/v1)?\/?$/, "");
    return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
}

const loadHomePage = cache(async (locale: string) => {
    try {
        const payload = (await api.getHome(locale)) as HomePagePayload;
        return payload?.success ? payload : null;
    } catch {
        return null;
    }
});

function sectionData(payload: HomePagePayload | null, key: string) {
    return payload?.data?.sections?.find((item) => item.key === key)?.data ?? null;
}

export async function getHeroContent(locale: string): Promise<HeroContent | null> {
    const data = sectionData(await loadHomePage(locale), "hero");
    if (!data) return null;

    return {
        eyebrow: text(data.eyebrow),
        title: text(data.title),
        titleAccent: text(data.title_accent ?? data.titleAccent),
        description: text(data.description),
        primaryCta: text(data.primaryLabel ?? data.primary_cta),
        secondaryCta: text(data.secondaryLabel ?? data.secondary_cta),
        primaryUrl: text(data.primaryHref ?? data.primary_url),
        secondaryUrl: text(data.secondaryHref ?? data.secondary_url),
        image: mediaUrl(text(data.image)),
    };
}

const whyIcons = [
    "/images/icons/kabaa.svg",
    "/images/icons/report.svg",
    "/images/icons/brand.svg",
    "/images/icons/chart.svg",
];

export type WhyCardContent = {
    title: string;
    titleRest: string;
    text: string;
    icon: string;
};

export type WhyContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    cta: string;
    ctaUrl: string;
    cards: WhyCardContent[];
};

function headingParts(data: Record<string, unknown>) {
    const strong = text(data.titleStrong ?? data.title_strong);
    const muted = text(data.titleMuted ?? data.title_muted);
    if (strong || muted) return { titleStrong: strong, titleMuted: muted };

    const title = text(data.title);
    const splitAt = [".", "،", ","].reduce((earliest, separator) => {
        const index = title.indexOf(separator);
        if (index < 0) return earliest;
        return earliest < 0 || index < earliest ? index : earliest;
    }, -1);

    if (splitAt < 0 || splitAt >= title.length - 1) {
        return { titleStrong: title, titleMuted: "" };
    }

    const titleMuted = title.slice(splitAt + 1).trim();
    if (!titleMuted) return { titleStrong: title, titleMuted: "" };

    return {
        titleStrong: title.slice(0, splitAt + 1).trim(),
        titleMuted,
    };
}

export function headingFromCms(
    content: { titleStrong: string; titleMuted: string } | null,
    fallbackStrong: string,
    fallbackMuted: string,
) {
    if (!content?.titleStrong && !content?.titleMuted) {
        return { titleStrong: fallbackStrong, titleMuted: fallbackMuted };
    }

    if (content.titleMuted) {
        return {
            titleStrong: content.titleStrong || fallbackStrong,
            titleMuted: content.titleMuted,
        };
    }

    const prefix = fallbackStrong.replace(/[.,،]\s*$/, "").trim();
    if (prefix && content.titleStrong.toLowerCase().startsWith(prefix.toLowerCase())) {
        const marks = content.titleStrong.slice(prefix.length).match(/^\p{M}+/u)?.[0] ?? "";
        const titleStrong = `${content.titleStrong.slice(0, prefix.length)}${marks}`.trim();
        const titleMuted = content.titleStrong
            .slice(prefix.length + marks.length)
            .replace(/^[-–—:]\s*/, "")
            .trim();
        if (titleMuted) return { titleStrong, titleMuted };
    }

    return { titleStrong: content.titleStrong, titleMuted: "" };
}

function sectionHeading(data: Record<string, unknown>) {
    const heading = headingParts(data);

    return {
        eyebrow: text(data.eyebrow),
        titleStrong: heading.titleStrong,
        titleMuted: heading.titleMuted,
        description: text(data.description),
        cta: text(data.ctaLabel ?? data.cta),
        ctaUrl: text(data.ctaHref ?? data.cta_url ?? data.ctaUrl),
    };
}

function labels(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
        if (typeof item === "string") return text(item) ? [text(item)] : [];
        if (!item || typeof item !== "object") return [];
        const label = text((item as Record<string, unknown>).label ?? (item as Record<string, unknown>).title);
        return label ? [label] : [];
    });
}

function whyIcon(value: unknown, index: number) {
    const raw =
        value && typeof value === "object"
            ? text(
                  (value as Record<string, unknown>).url ??
                      (value as Record<string, unknown>).src ??
                      (value as Record<string, unknown>).path,
              )
            : text(value);

    if (raw && (/^https?:\/\//i.test(raw) || raw.startsWith("/") || raw.startsWith("images/"))) {
        return mediaUrl(raw);
    }

    return whyIcons[index] ?? whyIcons[whyIcons.length - 1];
}

function whyCards(value: unknown): WhyCardContent[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item, index) => {
        if (!item || typeof item !== "object") return [];
        const card = item as Record<string, unknown>;

        return [
            {
                title: text(card.title),
                titleRest: text(card.titleRest ?? card.title_rest),
                text: text(card.description ?? card.text),
                icon: whyIcon(card.icon, index),
            },
        ];
    });
}

export async function getWhyContent(locale: string): Promise<WhyContent | null> {
    const data = sectionData(await loadHomePage(locale), "why");
    if (!data) return null;

    const heading = headingParts(data);

    return {
        eyebrow: text(data.eyebrow),
        titleStrong: heading.titleStrong,
        titleMuted: heading.titleMuted,
        description: text(data.description),
        cta: text(data.ctaLabel ?? data.cta),
        ctaUrl: text(data.ctaHref ?? data.cta_url ?? data.ctaUrl),
        cards: whyCards(data.cards),
    };
}

const journeyPhaseIds = ["before", "during", "after"];

export type JourneyPhaseContent = {
    id: string;
    number: string;
    label: string;
    title: string;
    text: string;
    points: string[];
    image: string;
};

export type JourneyContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    cta: string;
    ctaUrl: string;
    phases: JourneyPhaseContent[];
};

function lines(value: unknown) {
    if (Array.isArray(value)) {
        return value.map((item) => text(item)).filter(Boolean);
    }

    return text(value)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function journeyImage(value: unknown) {
    const raw =
        value && typeof value === "object"
            ? text(
                  (value as Record<string, unknown>).url ??
                      (value as Record<string, unknown>).src ??
                      (value as Record<string, unknown>).path,
              )
            : text(value);

    if (raw && (/^https?:\/\//i.test(raw) || raw.startsWith("/") || raw.startsWith("images/"))) {
        return mediaUrl(raw);
    }

    return "";
}

function journeyPhases(value: unknown): JourneyPhaseContent[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item, index) => {
        if (!item || typeof item !== "object") return [];
        const phase = item as Record<string, unknown>;

        return [
            {
                id: journeyPhaseIds[index] ?? `phase-${index + 1}`,
                number: String(index + 1).padStart(2, "0"),
                label: text(phase.when ?? phase.label),
                title: text(phase.title),
                text: text(phase.summary ?? phase.description ?? phase.text),
                points: lines(phase.items ?? phase.points),
                image: journeyImage(phase.image),
            },
        ];
    });
}

export async function getJourneyContent(locale: string): Promise<JourneyContent | null> {
    const data = sectionData(await loadHomePage(locale), "journey");
    if (!data) return null;

    const heading = headingParts(data);

    return {
        eyebrow: text(data.eyebrow),
        titleStrong: heading.titleStrong,
        titleMuted: heading.titleMuted,
        description: text(data.description),
        cta: text(data.ctaLabel ?? data.cta),
        ctaUrl: text(data.ctaHref ?? data.cta_url ?? data.ctaUrl),
        phases: journeyPhases(data.phases),
    };
}

export type HomeSectionContent = ReturnType<typeof sectionHeading>;

export async function getSolutionsContent(locale: string): Promise<HomeSectionContent | null> {
    const data = sectionData(await loadHomePage(locale), "solutions");
    return data ? sectionHeading(data) : null;
}

export type OperationsContent = HomeSectionContent & {
    outcomes: string[];
};

export async function getOperationsContent(locale: string): Promise<OperationsContent | null> {
    const data = sectionData(await loadHomePage(locale), "ai");
    if (!data) return null;

    return {
        ...sectionHeading(data),
        outcomes: labels(data.outcomes),
    };
}

export type ProductsSectionContent = HomeSectionContent & {
    onlyAvailable: boolean;
};

export async function getProductsContent(locale: string): Promise<ProductsSectionContent | null> {
    const data = sectionData(await loadHomePage(locale), "products");
    if (!data) return null;

    return {
        ...sectionHeading(data),
        onlyAvailable: data.onlyAvailable === true || data.onlyAvailable === 1,
    };
}

const productImages = [
    "/images/product1.jpg",
    "/images/products/product-2.png",
    "/images/products/product-3.png",
    "/images/products/product-4.png",
];

const productImageBySlug: Record<string, string> = {
    hrh: "/images/product1.jpg",
    miyar: "/images/products/product-2.png",
    maydan: "/images/products/product-3.png",
};

export type CatalogProduct = {
    id: string;
    img: string;
    status: string;
    statusTone: "available" | "soon";
    title: string;
    tagline: string;
    logo: string;
    problemLabel: string;
    problem: string;
    usersLabel: string;
    users: string;
};

function records(value: unknown) {
    if (Array.isArray(value)) {
        return value.filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
    }

    if (value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)) {
        return records((value as { data: unknown }).data);
    }

    return [];
}

export async function getCatalogProducts(
    locale: string,
    labels: { available: string; soon: string; problem: string; users: string },
    onlyAvailable = false,
): Promise<CatalogProduct[]> {
    try {
        const payload = await api.getProducts(locale);
        const items = records((payload as { data?: unknown })?.data ?? payload).filter((item) => {
            if (item.show_on_products_page === false || item.show_on_products_page === 0) return false;
            if (!onlyAvailable) return true;
            return text(item.availability) === "available";
        });

        const cards = await Promise.all(
            items.map(async (item, index) => {
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
                const image = mediaUrl(text(item.image ?? detail.image)) || journeyImage(item.image ?? detail.image);

                return {
                    id: slug || String(item.id ?? index),
                    img: image || productImageBySlug[slug] || productImages[index % productImages.length],
                    status: availability === "available" ? labels.available : labels.soon,
                    statusTone: availability === "available" ? "available" : "soon",
                    title: text(item.name ?? detail.name),
                    tagline: text(item.tagline ?? detail.tagline),
                    logo: "/images/logo1.png",
                    problemLabel: labels.problem,
                    problem: text(detail.problem),
                    usersLabel: labels.users,
                    users: text(detail.audience ?? detail.users),
                } satisfies CatalogProduct;
            }),
        );

        return cards.filter((card) => card.title);
    } catch {
        return [];
    }
}

export type DeliveryContent = HomeSectionContent & {
    steps: string[];
};

export async function getDeliveryContent(locale: string): Promise<DeliveryContent | null> {
    const data = sectionData(await loadHomePage(locale), "delivery");
    if (!data) return null;

    return {
        ...sectionHeading(data),
        steps: labels(data.steps),
    };
}

export async function getProofContent(locale: string): Promise<HomeSectionContent | null> {
    const data = sectionData(await loadHomePage(locale), "proof");
    return data ? sectionHeading(data) : null;
}

const ecosystemIcons = ["/images/icons/gr1.svg", "/images/icons/gr2.svg", "/images/icons/gr3.svg"];

export type EcosystemCardContent = {
    title: string;
    text: string;
    cta: string;
    ctaUrl: string;
    icon: string;
};

export type EcosystemContent = HomeSectionContent & {
    cards: EcosystemCardContent[];
};

export async function getEcosystemContent(locale: string): Promise<EcosystemContent | null> {
    const data = sectionData(await loadHomePage(locale), "ecosystem");
    if (!data) return null;

    const cards = Array.isArray(data.cards)
        ? data.cards.flatMap((item, index) => {
              if (!item || typeof item !== "object") return [];
              const card = item as Record<string, unknown>;
              const icon = journeyImage(card.icon);

              return [
                  {
                      title: text(card.title),
                      text: text(card.description ?? card.text),
                      cta: text(card.ctaLabel ?? card.cta),
                      ctaUrl: text(card.ctaHref ?? card.href ?? card.url),
                      icon: icon || ecosystemIcons[index] || ecosystemIcons[0],
                  },
              ];
          })
        : [];

    return { ...sectionHeading(data), cards };
}

export type ContactPathContent = {
    title: string;
    text: string;
    cta: string;
    ctaUrl: string;
};

export type ContactContent = HomeSectionContent & {
    paths: ContactPathContent[];
};

export async function getContactContent(locale: string): Promise<ContactContent | null> {
    const data = sectionData(await loadHomePage(locale), "contact");
    if (!data) return null;

    const paths = Array.isArray(data.paths)
        ? data.paths.flatMap((item) => {
              if (!item || typeof item !== "object") return [];
              const path = item as Record<string, unknown>;

              return [
                  {
                      title: text(path.title),
                      text: text(path.description ?? path.text),
                      cta: text(path.ctaLabel ?? path.cta),
                      ctaUrl: text(path.ctaHref ?? path.href ?? path.url),
                  },
              ];
          })
        : [];

    return { ...sectionHeading(data), paths };
}
