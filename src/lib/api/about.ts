import { cache } from "react";
import { api } from "@/lib/api";
import { createSwrCache } from "@/lib/api/swrCache";

export type AboutHeroContent = {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    description: string;
    image: string;
};

export type AboutStat = {
    value: string;
    strong: string;
    muted: string;
};

export type AboutStatsContent = {
    stats: AboutStat[];
    highlightTitle: string;
    highlightNote: string;
};

export type AboutApproachCard = {
    icon: string;
    title: string;
    text: string;
    points: string[];
};

export type AboutApproachContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    cards: AboutApproachCard[];
};

export type AboutJourneyPhase = {
    label: string;
    title: string;
    text: string;
    points: string[];
};

export type AboutJourneyContent = {
    eyebrow: string;
    titleBefore: string;
    titleMutedStart: string;
    titleMutedRest: string;
    titleAfter: string;
    phases: AboutJourneyPhase[];
};

export type AboutCtaContent = {
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
};

export type AboutPartnerLogo = {
    id: string;
    name: string;
    url: string;
    src: string;
    type: string;
};

export type AboutLogosContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    cta: string;
    ctaUrl: string;
    logos: AboutPartnerLogo[];
};

export type AboutStudioPoint = {
    title: string;
    text: string;
};

export type AboutStudioContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    points: AboutStudioPoint[];
    cta: string;
    ctaUrl: string;
};

export type AboutDeliveryContent = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    cta: string;
    ctaUrl: string;
    steps: string[];
    estidam: string[];
    inspire: string[];
    togetherLabel: string;
    together: string;
};

type CmsSection = {
    key?: string;
    data?: Record<string, unknown>;
};

type AboutPagePayload = {
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

function titleParts(data: Record<string, unknown>) {
    const before = text(data.titleBefore ?? data.title_before);
    const accent = text(data.titleAccent ?? data.title_accent);
    const after = text(data.titleAfter ?? data.title_after);
    if (before || accent || after) return { titleBefore: before, titleAccent: accent, titleAfter: after };

    const title = text(data.title);
    const match = title.match(/^([\s\S]*?)\*\*([\s\S]+?)\*\*([\s\S]*)$/);
    if (!match) return { titleBefore: title, titleAccent: "", titleAfter: "" };

    return {
        titleBefore: match[1].trim(),
        titleAccent: match[2].trim(),
        titleAfter: match[3].trim(),
    };
}

const ABOUT_PAGE_REVALIDATE_MS = 300_000;

type AboutCacheEntry = {
    payload: AboutPagePayload | null;
    freshUntil: number;
    refreshing?: Promise<void>;
};

const aboutPageCache = new Map<string, AboutCacheEntry>();

async function fetchAboutPage(locale: string) {
    try {
        const payload = (await api.getAbout(locale)) as AboutPagePayload;
        return payload?.success ? payload : null;
    } catch {
        return null;
    }
}

function storeAboutPage(locale: string, payload: AboutPagePayload | null, previous?: AboutPagePayload | null) {
    aboutPageCache.set(locale, {
        payload: payload ?? previous ?? null,
        freshUntil: Date.now() + ABOUT_PAGE_REVALIDATE_MS,
    });
}

const loadAboutPage = cache(async (locale: string) => {
    const hit = aboutPageCache.get(locale);
    const now = Date.now();

    if (hit && now < hit.freshUntil) return hit.payload;

    if (hit) {
        if (!hit.refreshing) {
            hit.refreshing = fetchAboutPage(locale)
                .then((payload) => {
                    storeAboutPage(locale, payload, hit.payload);
                })
                .finally(() => {
                    const current = aboutPageCache.get(locale);
                    if (current) delete current.refreshing;
                });
        }

        return hit.payload;
    }

    const payload = await fetchAboutPage(locale);
    storeAboutPage(locale, payload);
    return payload;
});

export async function getAboutHeroContent(locale: string): Promise<AboutHeroContent | null> {
    const payload = await loadAboutPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "aboutHero")?.data ?? null;
    if (!section) return null;

    const title = titleParts(section);

    return {
        eyebrow: text(section.eyebrow),
        titleBefore: title.titleBefore,
        titleAccent: title.titleAccent,
        titleAfter: title.titleAfter,
        description: text(section.description),
        image: mediaUrl(section.image),
    };
}

function labelParts(label: string) {
    const space = label.search(/\s/);
    if (space < 0) return { strong: label, muted: "" };

    return {
        strong: label.slice(0, space),
        muted: label.slice(space + 1).trim(),
    };
}

export async function getAboutStatsContent(locale: string): Promise<AboutStatsContent | null> {
    const payload = await loadAboutPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "aboutHero")?.data ?? null;
    if (!section) return null;

    const stats = Array.isArray(section.stats)
        ? section.stats
              .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
              .map((item) => {
                  const strong = text(item.labelStrong ?? item.label_strong);
                  const muted = text(item.labelMuted ?? item.label_muted);
                  const parts = strong || muted ? { strong, muted } : labelParts(text(item.label));

                  return {
                      value: text(item.value),
                      strong: parts.strong,
                      muted: parts.muted,
                  };
              })
              .filter((item) => item.value || item.strong || item.muted)
        : [];

    const highlightTitle = text(section.badgeText);
    const highlightNote = text(section.badgeEyebrow);
    if (!stats.length && !highlightTitle && !highlightNote) return null;

    return { stats, highlightTitle, highlightNote };
}

const approachIcons = ["fal fa-landmark", "fal fa-gears", "fal fa-sparkles", "fal fa-chart-line"];

function approachTitle(data: Record<string, unknown>) {
    const strong = text(data.titleStrong ?? data.title_strong);
    const muted = text(data.titleMuted ?? data.title_muted);
    if (strong || muted) return { titleStrong: strong, titleMuted: muted };

    const title = text(data.title);
    const match = title.match(/^([\s\S]*?)\*\*([\s\S]+?)\*\*([\s\S]*)$/);
    if (!match) return { titleStrong: title, titleMuted: "" };

    return {
        titleStrong: match[1].trim(),
        titleMuted: `${match[2].trim()} ${match[3].trim()}`.replace(/\s+/g, " ").trim(),
    };
}

function approachIcon(value: unknown, index: number) {
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

    return approachIcons[index] ?? approachIcons[approachIcons.length - 1];
}

function pointList(value: unknown) {
    if (Array.isArray(value)) {
        return value.flatMap((item) => {
            if (typeof item === "string") return text(item) ? [text(item)] : [];
            if (!item || typeof item !== "object") return [];
            const label = text((item as Record<string, unknown>).label ?? (item as Record<string, unknown>).title);
            return label ? [label] : [];
        });
    }

    return text(value)
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export async function getAboutApproachContent(locale: string): Promise<AboutApproachContent | null> {
    const payload = await loadAboutPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "approach")?.data ?? null;
    if (!section) return null;

    const title = approachTitle(section);
    const cards = Array.isArray(section.cards)
        ? section.cards.flatMap((item, index) => {
              if (!item || typeof item !== "object") return [];
              const card = item as Record<string, unknown>;

              return [
                  {
                      icon: approachIcon(card.icon, index),
                      title: text(card.title),
                      text: text(card.description ?? card.text),
                      points: pointList(card.points ?? card.items),
                  },
              ];
          })
        : [];

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section.description),
        cards,
    };
}

function journeyTitle(data: Record<string, unknown>) {
    const titleBefore = text(data.titleBefore ?? data.title_before);
    const titleMutedStart = text(data.titleMutedStart ?? data.title_muted_start);
    const titleMutedRest = text(data.titleMutedRest ?? data.title_muted_rest);
    const titleAfter = text(data.titleAfter ?? data.title_after);
    if (titleBefore || titleMutedStart || titleMutedRest || titleAfter) {
        return { titleBefore, titleMutedStart, titleMutedRest, titleAfter };
    }

    const title = text(data.title);
    const match = title.match(/^([\s\S]*?)\*\*([\s\S]+?)\*\*([\s\S]*)$/);
    if (!match) return { titleBefore: title, titleMutedStart: "", titleMutedRest: "", titleAfter: "" };

    const accent = match[2].trim();
    const comma = accent.search(/[,،]/);

    if (comma < 0) {
        return {
            titleBefore: match[1].trim(),
            titleMutedStart: accent,
            titleMutedRest: "",
            titleAfter: match[3].trim(),
        };
    }

    return {
        titleBefore: match[1].trim(),
        titleMutedStart: accent.slice(0, comma + 1).trim(),
        titleMutedRest: accent.slice(comma + 1).trim(),
        titleAfter: match[3].trim(),
    };
}

export async function getAboutJourneyContent(locale: string): Promise<AboutJourneyContent | null> {
    const payload = await loadAboutPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "aboutJourney")?.data ?? null;
    if (!section) return null;

    const title = journeyTitle(section);
    const phases = Array.isArray(section.phases)
        ? section.phases.flatMap((item) => {
              if (!item || typeof item !== "object") return [];
              const phase = item as Record<string, unknown>;

              return [
                  {
                      label: text(phase.when ?? phase.label),
                      title: text(phase.title),
                      text: text(phase.summary ?? phase.description ?? phase.text),
                      points: pointList(phase.items ?? phase.points),
                  },
              ];
          })
        : [];

    return {
        eyebrow: text(section.eyebrow),
        titleBefore: title.titleBefore,
        titleMutedStart: title.titleMutedStart,
        titleMutedRest: title.titleMutedRest,
        titleAfter: title.titleAfter,
        phases,
    };
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

function titledList(value: unknown) {
    return pointList(value);
}

export async function getAboutDeliveryContent(locale: string): Promise<AboutDeliveryContent | null> {
    const payload = await loadAboutPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "aboutDelivery")?.data ?? null;
    if (!section) return null;

    const title = markedTitle(section);
    const together =
        section.together && typeof section.together === "object"
            ? (section.together as Record<string, unknown>)
            : null;

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section.description),
        cta: text(section.ctaLabel ?? section.cta),
        ctaUrl: text(section.ctaHref ?? section.cta_url ?? section.ctaUrl),
        steps: Array.isArray(section.steps)
            ? section.steps.flatMap((item) => {
                  if (typeof item === "string") return text(item) ? [text(item)] : [];
                  if (!item || typeof item !== "object") return [];
                  const label = text((item as Record<string, unknown>).title ?? (item as Record<string, unknown>).label);
                  return label ? [label] : [];
              })
            : [],
        estidam: titledList(section.estidam),
        inspire: titledList(section.inspire),
        togetherLabel: text(together?.label ?? together?.title),
        together: together ? text(together.text ?? together.description) : text(section.together),
    };
}

export async function getAboutStudioContent(locale: string): Promise<AboutStudioContent | null> {
    const payload = await loadAboutPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "studio")?.data ?? null;
    if (!section) return null;

    const title = markedTitle(section);
    const points = Array.isArray(section.points)
        ? section.points.flatMap((item) => {
              if (typeof item === "string") return text(item) ? [{ title: text(item), text: "" }] : [];
              if (!item || typeof item !== "object") return [];
              const point = item as Record<string, unknown>;
              const pointTitle = text(point.title ?? point.label);
              const pointText = text(point.text ?? point.description);
              if (!pointTitle && !pointText) return [];
              return [{ title: pointTitle, text: pointText }];
          })
        : [];

    return {
        eyebrow: text(section.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section.description),
        points,
        cta: text(section.ctaLabel ?? section.cta),
        ctaUrl: text(section.ctaHref ?? section.cta_url ?? section.ctaUrl),
    };
}

function partnerRecords(value: unknown) {
    if (Array.isArray(value)) {
        return value.filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
    }

    if (value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)) {
        return partnerRecords((value as { data: unknown }).data);
    }

    return [];
}

const readPartnerLogos = createSwrCache<AboutPartnerLogo[]>([]);

async function fetchPartnerLogos(locale: string): Promise<AboutPartnerLogo[] | null> {
    try {
        const payload = await api.getPartners(locale);
        return partnerRecords((payload as { data?: unknown })?.data ?? payload).flatMap((item, index) => {
            const name = text(item.name);
            const src = mediaUrl(item.logo ?? item.image ?? item.icon);
            if (!name && !src) return [];

            return [
                {
                    id: text(item.id) || `partner-${index + 1}`,
                    name,
                    url: text(item.url ?? item.href ?? item.link) || "#",
                    src,
                    type: text(item.type ?? item.category ?? item.kind),
                },
            ];
        });
    } catch {
        return null;
    }
}

export async function getAboutPartnerLogos(locale: string): Promise<AboutPartnerLogo[]> {
    return readPartnerLogos(locale, () => fetchPartnerLogos(locale));
}

export async function getAboutLogosContent(locale: string): Promise<AboutLogosContent | null> {
    const payload = await loadAboutPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "partners")?.data ?? null;
    const logos = await getAboutPartnerLogos(locale);
    if (!section && !logos.length) return null;

    const title = section ? markedTitle(section) : { titleStrong: "", titleMuted: "" };

    return {
        eyebrow: text(section?.eyebrow),
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section?.description),
        cta: text(section?.ctaLabel ?? section?.cta),
        ctaUrl: text(section?.ctaHref ?? section?.cta_url ?? section?.ctaUrl),
        logos,
    };
}

export async function getAboutCtaContent(locale: string): Promise<AboutCtaContent | null> {
    const payload = await loadAboutPage(locale);
    const section = payload?.data?.sections?.find((item) => item.key === "closingCta")?.data ?? null;
    if (!section) return null;

    const title = titleParts(section);

    return {
        titleBefore: title.titleBefore,
        titleAccent: title.titleAccent,
        titleAfter: title.titleAfter,
        primaryLabel: text(section.primaryLabel ?? section.primary_label),
        primaryHref: text(section.primaryHref ?? section.primary_href),
        secondaryLabel: text(section.secondaryLabel ?? section.secondary_label),
        secondaryHref: text(section.secondaryHref ?? section.secondary_href),
    };
}
