import { cache } from "react";
import { api } from "@/lib/api";
import { createSwrCache } from "@/lib/api/swrCache";
import { getSiteSettings, type SiteSocialKey } from "@/lib/api/settings";
import homeAr from "@/mock-api/home.ar.json";
import homeEn from "@/mock-api/home.en.json";

export type FooterSocialKey = SiteSocialKey;

export type FooterSocialLink = {
    key: FooterSocialKey;
    url: string;
};

export type FooterSectionData = {
    description: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
    socials: FooterSocialLink[];
};

type HomeMock = typeof homeAr;

function getLocaleHome(locale: string): HomeMock {
    return locale === "ar" ? homeAr : homeEn;
}

const footerSocialKeys: FooterSocialKey[] = ["facebook", "x", "instagram", "linkedin", "whatsapp"];

const adminLogo = "/assets/admin/images/logo.svg";

export async function getFooterSection(locale: string): Promise<FooterSectionData> {
    const home = getLocaleHome(locale);
    const footer = home.footer;
    const settings = await getSiteSettings(locale);
    const logo = settings?.logo && !settings.logo.includes(adminLogo) ? settings.logo : "";

    return {
        description: footer?.description || "",
        name: settings?.name || "",
        email: settings?.email || footer?.email || "",
        phone: settings?.phone || footer?.phone || "",
        address: settings?.address || footer?.location || "",
        logo,
        socials: footerSocialKeys.flatMap((key) => {
            const url = settings?.social[key];
            return url ? [{ key, url }] : [];
        }),
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

const readHomePage = createSwrCache<HomePagePayload | null>(null);

async function fetchHomePage(locale: string) {
    try {
        const payload = (await api.getHome(locale)) as HomePagePayload;
        return payload?.success ? payload : null;
    } catch {
        return null;
    }
}

const loadHomePage = cache((locale: string) => readHomePage(locale, () => fetchHomePage(locale)));

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
    "fa-regular fa-kaaba",
    "fa-regular fa-file-lines",
    "fa-regular fa-share-nodes",
    "fa-regular fa-chart-column",
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

const iconAliases: Record<string, string> = {
    workflow: "diagram-project",
    barChart3: "chart-column",
    "bar-chart3": "chart-column",
    "bar-chart": "chart-column",
    fileCheck2: "file-check",
    "file-check2": "file-check",
    brainCircuit: "brain-circuit",
    target: "bullseye",
    layers: "layer-group",
    "line-chart": "chart-line",
};

function fontAwesomeIcon(value: unknown, index: number, fallbacks: string[]) {
    const fallback = fallbacks[index] ?? fallbacks[fallbacks.length - 1] ?? "fa-regular fa-circle";
    const record = value && typeof value === "object" ? (value as Record<string, unknown>) : null;
    const raw = record
        ? text(record.class ?? record.className ?? record.name ?? record.value ?? record.icon)
        : text(value);
    const source = (raw.match(/class=["']([^"']+)["']/i)?.[1] ?? raw).replace(/<[^>]+>/g, "").trim();

    if (!source) return fallback;
    if (/\bfa-/.test(source)) return source;

    const name = source
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .replace(/^fa-/, "")
        .replace(/(\D)\d+$/, "$1")
        .toLowerCase();

    if (!name || /^https?:/.test(name) || name.startsWith("/") || name.startsWith("images")) return fallback;

    const aliased = iconAliases[name] ?? iconAliases[source] ?? name;
    return `fa-regular fa-${aliased}`;
}

function whyIcon(value: unknown, index: number) {
    return fontAwesomeIcon(value, index, whyIcons);
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

export type SolutionCubeSlide = {
    id: string;
    title: string;
    titleStrong: string;
    titleMuted: string;
    text: string;
    highlight: string;
    image: string;
};

function solutionTitleParts(title: string) {
    const ampersand = title.indexOf("&");
    if (ampersand > 0 && ampersand < title.length - 1) {
        return {
            titleStrong: title.slice(0, ampersand).trim(),
            titleMuted: title.slice(ampersand + 1).trim(),
        };
    }

    return headingParts({ title });
}

const readSolutionSlides = createSwrCache<SolutionCubeSlide[]>([]);

async function fetchSolutionSlides(locale: string): Promise<SolutionCubeSlide[] | null> {
    const section = sectionData(await loadHomePage(locale), "solutions");
    const limitRaw = Number(section?.limit);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 6;

    try {
        const payload = await api.getSolutions(locale);
        const items = records((payload as { data?: unknown })?.data ?? payload);

        return items.slice(0, limit).flatMap((item, index) => {
            const title = text(item.title);
            const textBody = text(item.summary ?? item.description ?? item.text);
            const highlight = text(item.outcome ?? item.highlight);
            if (!title && !textBody && !highlight) return [];

            const parts = solutionTitleParts(title);

            return [
                {
                    id: text(item.id) || `solution-${index + 1}`,
                    title,
                    titleStrong: parts.titleStrong || title,
                    titleMuted: parts.titleMuted,
                    text: textBody,
                    highlight,
                    image: journeyImage(item.image ?? item.cover ?? item.photo ?? item.media),
                },
            ];
        });
    } catch {
        return null;
    }
}

export async function getSolutionCubeSlides(locale: string): Promise<SolutionCubeSlide[]> {
    return readSolutionSlides(locale, () => fetchSolutionSlides(locale));
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
    "/images/products/product-01-hrh-seasonal-hiring.jpg",
    "/images/products/product-02-mayar-quality.jpg",
    "/images/products/product-03-maidan-field-ops.jpg",
    "/images/products/product-4.png",
];

const productImageBySlug: Record<string, string> = {
    hrh: "/images/products/product-01-hrh-seasonal-hiring.jpg",
    miyar: "/images/products/product-02-mayar-quality.jpg",
    mayar: "/images/products/product-02-mayar-quality.jpg",
    maydan: "/images/products/product-03-maidan-field-ops.jpg",
    maidan: "/images/products/product-03-maidan-field-ops.jpg",
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

const readCatalogProducts = createSwrCache<CatalogProduct[]>([]);

async function fetchCatalogProducts(
    locale: string,
    labels: { available: string; soon: string; problem: string; users: string },
    onlyAvailable = false,
): Promise<CatalogProduct[] | null> {
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
                    logo: mediaUrl(text(item.logo ?? detail.logo)) || "/images/logo1.png",
                    problemLabel: labels.problem,
                    problem: text(detail.problem),
                    usersLabel: labels.users,
                    users: text(detail.audience ?? detail.users),
                } satisfies CatalogProduct;
            }),
        );

        return cards.filter((card) => card.title);
    } catch {
        return null;
    }
}

export async function getCatalogProducts(
    locale: string,
    labels: { available: string; soon: string; problem: string; users: string },
    onlyAvailable = false,
): Promise<CatalogProduct[]> {
    const key = `${locale}:${onlyAvailable ? "available" : "all"}`;
    return readCatalogProducts(key, () => fetchCatalogProducts(locale, labels, onlyAvailable));
}

export type DeliveryStep = {
    title: string;
    icon: string;
};

const deliveryIcons = [
    "fa-regular fa-bullseye",
    "fa-regular fa-magnifying-glass",
    "fa-regular fa-lightbulb",
    "fa-regular fa-code",
    "fa-regular fa-rocket",
    "fa-regular fa-chart-simple",
    "fa-regular fa-arrows-rotate",
];

function deliverySteps(value: unknown): DeliveryStep[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item, index) => {
        if (typeof item === "string") {
            const title = text(item);
            return title ? [{ title, icon: fontAwesomeIcon(null, index, deliveryIcons) }] : [];
        }

        if (!item || typeof item !== "object") return [];
        const step = item as Record<string, unknown>;
        const title = text(step.title ?? step.label);
        if (!title) return [];

        return [{ title, icon: fontAwesomeIcon(step.icon, index, deliveryIcons) }];
    });
}

export type DeliveryContent = HomeSectionContent & {
    steps: DeliveryStep[];
};

export async function getDeliveryContent(locale: string): Promise<DeliveryContent | null> {
    const data = sectionData(await loadHomePage(locale), "delivery");
    if (!data) return null;

    return {
        ...sectionHeading(data),
        steps: deliverySteps(data.steps),
    };
}

export async function getProofContent(locale: string): Promise<HomeSectionContent | null> {
    const data = sectionData(await loadHomePage(locale), "proof");
    return data ? sectionHeading(data) : null;
}

export type ProofCaseCard = {
    id: string;
    eyebrow: string;
    title: string;
    proof: string;
    proofLabel: string;
    challenge: string;
    solution: string;
    role: string;
    logo: string;
};

const proofLogos = ["/images/exp-logo1.png", "/images/exp-logo2.png", "/images/exp-logo3.png"];

function firstRecord(value: unknown) {
    return records(value)[0] ?? null;
}

export async function getProofCases(locale: string): Promise<ProofCaseCard[]> {
    const section = sectionData(await loadHomePage(locale), "proof");
    const limitRaw = Number(section?.limit);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 3;

    try {
        const payload = await api.getProducts(locale);
        const items = records((payload as { data?: unknown })?.data ?? payload)
            .filter((item) => item.show_on_products_page !== false && item.show_on_products_page !== 0)
            .sort((a, b) => {
                const featuredA = a.featured === true || a.featured === 1 ? 0 : 1;
                const featuredB = b.featured === true || b.featured === 1 ? 0 : 1;
                return featuredA - featuredB;
            })
            .slice(0, limit);

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

                const name = text(item.name ?? detail.name);
                const tagline = text(item.tagline ?? detail.tagline);
                const outcome = firstRecord(detail.outcomes);
                const capability = firstRecord(detail.capabilities);
                const useCase = firstRecord(detail.use_cases);
                const logo =
                    mediaUrl(text(item.logo ?? detail.logo)) ||
                    journeyImage(item.image ?? detail.image) ||
                    proofLogos[index % proofLogos.length];

                return {
                    id: slug || String(item.id ?? index),
                    eyebrow: name,
                    title: tagline || name,
                    proof: text(outcome?.value),
                    proofLabel: text(outcome?.label),
                    challenge: text(detail.problem),
                    solution:
                        text(detail.overview) ||
                        text(capability?.description ?? capability?.title) ||
                        text(useCase?.description ?? useCase?.title),
                    role: text(detail.audience ?? detail.users),
                    logo,
                } satisfies ProofCaseCard;
            }),
        );

        return cards.filter((card) => card.eyebrow || card.title);
    } catch {
        return [];
    }
}

const ecosystemIcons = [
    "fa-regular fa-sprout",
    "fa-regular fa-diagram-project",
    "fa-regular fa-handshake",
];

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

              return [
                  {
                      title: text(card.title),
                      text: text(card.description ?? card.text),
                      cta: text(card.ctaLabel ?? card.cta),
                      ctaUrl: text(card.ctaHref ?? card.href ?? card.url),
                      icon: fontAwesomeIcon(card.icon, index, ecosystemIcons),
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
