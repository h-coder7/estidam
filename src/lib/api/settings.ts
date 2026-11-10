import { api } from "@/lib/api";
import { createSwrCache } from "@/lib/api/swrCache";

export type SiteSocialKey = "facebook" | "x" | "instagram" | "linkedin" | "whatsapp";

export type SiteSettings = {
    name: string;
    address: string;
    logo: string;
    email: string;
    phone: string;
    social: Partial<Record<SiteSocialKey, string>>;
};

type SettingsPayload = {
    success?: boolean;
    data?: {
        website_name?: unknown;
        site_address?: unknown;
        website_logo?: unknown;
        contact?: Record<string, unknown>;
        social?: Record<string, unknown>;
    };
};

const socialKeys: SiteSocialKey[] = ["facebook", "x", "instagram", "linkedin", "whatsapp"];

function text(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function link(value: unknown) {
    const href = text(value);
    if (!href || href === "#" || href === "#0") return "";
    return href;
}

const readSettings = createSwrCache<SiteSettings | null>(null);

async function fetchSettings(locale: string): Promise<SiteSettings | null> {
    try {
        const response = (await api.getSettings(locale)) as SettingsPayload;
        const data = response?.success ? response.data : null;
        if (!data) return null;

        const contact = data.contact ?? {};
        const social = data.social ?? {};

        return {
            name: text(data.website_name),
            address: text(data.site_address),
            logo: link(data.website_logo),
            email: text(contact.email),
            phone: text(contact.phone),
            social: Object.fromEntries(
                socialKeys.flatMap((key) => {
                    const href = link(social[key]);
                    return href ? [[key, href]] : [];
                }),
            ),
        };
    } catch {
        return null;
    }
}

export function getSiteSettings(locale: string) {
    return readSettings(locale, () => fetchSettings(locale));
}
