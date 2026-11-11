import { cache } from "react";
import { api } from "@/lib/api";
import { createSwrCache } from "@/lib/api/swrCache";

export type SolutionHero = {
    eyebrow: string;
    titleStrong: string;
    titleMuted: string;
    description: string;
    image: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
};

export type SolutionChallenge = {
    text: string;
    tag: string;
};

export type SolutionHelp = {
    title: string;
    text: string;
    badge: string;
};

export type SolutionUseCase = {
    title: string;
    challenge: string;
    solution: string;
    outcome: string;
};

export type SolutionStage = {
    label: string;
    text: string;
};

export type SolutionDelivery = {
    titleStrong: string;
    titleMuted: string;
    description: string;
    stages: SolutionStage[];
};

export type SolutionSystem = {
    label: string;
    icon: string;
};

export type SolutionSystems = {
    titleStrong: string;
    titleMuted: string;
    description: string;
    tags: SolutionSystem[];
};

export type SolutionOutcome = {
    text: string;
    icon: string;
};

export type SolutionRelated = {
    slug: string;
    title: string;
    text: string;
    image: string;
};

export type SolutionDetail = {
    slug: string;
    hero: SolutionHero;
    challenges: SolutionChallenge[];
    helps: SolutionHelp[];
    useCases: SolutionUseCase[];
    delivery: SolutionDelivery | null;
    systems: SolutionSystems | null;
    outcomes: SolutionOutcome[];
    related: SolutionRelated[];
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

function records(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value)) {
        return value.filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
    }

    if (value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)) {
        return records((value as { data: unknown }).data);
    }

    return [];
}

function markedTitle(value: unknown) {
    const title = text(value);
    const match = title.match(/^([\s\S]*?)\*\*([\s\S]+?)\*\*([\s\S]*)$/);
    if (!match) return { titleStrong: title, titleMuted: "" };

    const after = match[3].trim();
    return {
        titleStrong: match[1].trim(),
        titleMuted: after ? `${match[2].trim()} ${after}` : match[2].trim(),
    };
}

function fieldText(value: unknown) {
    if (typeof value === "string") return value.trim();
    if (!value || typeof value !== "object") return "";
    const record = value as Record<string, unknown>;
    return text(record.text ?? record.description ?? record.body ?? record.title);
}

function sectionRecord(value: unknown) {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function mapDelivery(raw: unknown): SolutionDelivery | null {
    const section = sectionRecord(raw);
    const items = records(section ? (section.stages ?? section.steps ?? section.items) : raw);
    const stages = items.flatMap((item, index) => {
        const label = text(item.label ?? item.title ?? item.name) || String(index + 1).padStart(2, "0");
        const stageText = fieldText(item.text ?? item.description ?? item.summary);
        if (!stageText && !text(item.label ?? item.title)) return [];
        return [{ label, text: stageText }];
    });
    if (!stages.length) return null;

    const title = markedTitle(section?.title);
    return {
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section?.description),
        stages,
    };
}

function mapSystems(raw: unknown): SolutionSystems | null {
    const section = sectionRecord(raw);
    const items = records(section ? (section.items ?? section.tags ?? section.systems) : raw);
    const stringTags = Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string" && item.trim()) : [];
    const tags = items.length
        ? items.flatMap((item) => {
              const label = text(item.label ?? item.title ?? item.name ?? item.text);
              if (!label) return [];
              return [{ label, icon: text(item.icon) }];
          })
        : stringTags.map((label) => ({ label: label.trim(), icon: "" }));

    if (!tags.length) return null;

    const title = markedTitle(section?.title);
    return {
        titleStrong: title.titleStrong,
        titleMuted: title.titleMuted,
        description: text(section?.description),
        tags,
    };
}

function mapSolution(data: Record<string, unknown>): SolutionDetail | null {
    const slug = text(data.slug);
    const heroTitle = markedTitle(data.hero_title ?? data.heroTitle ?? data.title);
    const hero: SolutionHero = {
        eyebrow: text(data.hero_eyebrow ?? data.heroEyebrow),
        titleStrong: heroTitle.titleStrong,
        titleMuted: heroTitle.titleMuted,
        description: text(data.hero_description ?? data.heroDescription ?? data.summary),
        image: mediaUrl(data.hero_image ?? data.heroImage ?? data.image),
        primaryLabel: text(data.primary_label ?? data.primaryLabel),
        primaryHref: text(data.primary_href ?? data.primaryHref),
        secondaryLabel: text(data.secondary_label ?? data.secondaryLabel),
        secondaryHref: text(data.secondary_href ?? data.secondaryHref),
    };

    const challenges = records(data.challenges).flatMap((item) => {
        const challengeText = fieldText(item.text ?? item.title ?? item.description);
        if (!challengeText) return [];
        return [{ text: challengeText, tag: text(item.tag ?? item.impact) }];
    });

    const helps = records(data.helps ?? data.how_helps ?? data.howHelps).flatMap((item) => {
        const title = text(item.title);
        const helpText = fieldText(item.description ?? item.text);
        if (!title && !helpText) return [];
        return [{ title, text: helpText, badge: text(item.badge) }];
    });

    const useCases = records(data.use_cases ?? data.useCases).flatMap((item) => {
        const title = text(item.title);
        const challenge = fieldText(item.challenge);
        const solution = fieldText(item.solution);
        const outcome = fieldText(item.outcome);
        if (!title && !challenge && !solution && !outcome) return [];
        return [{ title, challenge, solution, outcome }];
    });

    const outcomes = records(data.outcomes).flatMap((item) => {
        const outcomeText = fieldText(item.text ?? item.title ?? item.label);
        if (!outcomeText) return [];
        return [{ text: outcomeText, icon: text(item.icon) }];
    });

    const related = records(data.related_solutions ?? data.relatedSolutions ?? data.related).flatMap((item) => {
        const title = text(item.title);
        const relatedText = fieldText(item.description ?? item.text ?? item.summary);
        if (!title && !relatedText) return [];
        return [
            {
                slug: text(item.slug),
                title,
                text: relatedText,
                image: mediaUrl(item.image_url ?? item.imageUrl ?? item.image),
            },
        ];
    });

    const delivery = mapDelivery(data.delivery_approach ?? data.deliveryApproach ?? data.delivery ?? data.approach);
    const systems = mapSystems(data.systems_integrations ?? data.systemsIntegrations ?? data.systems ?? data.integrations);

    const hasContent =
        slug ||
        hero.titleStrong ||
        hero.description ||
        challenges.length ||
        helps.length ||
        useCases.length ||
        outcomes.length;

    if (!hasContent) return null;

    return { slug, hero, challenges, helps, useCases, delivery, systems, outcomes, related };
}

const readSolution = createSwrCache<Record<string, unknown> | null>(null);

async function fetchSolution(locale: string, slug: string) {
    try {
        const response = await api.getSolution(slug, locale);
        const data = (response as { data?: unknown })?.data;
        if (!data || typeof data !== "object") return null;
        return data as Record<string, unknown>;
    } catch {
        return null;
    }
}

const loadSolution = cache((locale: string, slug: string) =>
    readSolution(`${locale}:${slug}`, () => fetchSolution(locale, slug)),
);

export async function getSolutionDetail(locale: string, slug: string): Promise<SolutionDetail | null> {
    const data = await loadSolution(locale, slug);
    return data ? mapSolution(data) : null;
}
