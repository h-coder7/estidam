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
