import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        secret: process.env.NEXT_PUBLIC_API_SECRET,
        lang: "ar",
    },
});

const withLang = (locale?: string) =>
    locale ? { headers: { lang: locale } } : {};

export type PageKey =
    | "hero_section"
    | "footer"
    | (string & {});

export const endpoints = {
    settings: "/settings",
    pages: "/pages",
    page: (pageKey: PageKey) => `/pages/${pageKey}`,
    hero: "/pages/hero_section",
    footer: "/pages/footer",
};

/** Axios API client — ready for when the backend is available. */
export const api = {
    getSettings: (locale?: string) =>
        apiClient.get(endpoints.settings, withLang(locale)).then((res) => res.data),

    getPages: (cmsOnly = true, locale?: string) =>
        apiClient
            .get(endpoints.pages, { ...withLang(locale), params: cmsOnly ? { cms_only: 1 } : {} })
            .then((res) => res.data),

    getPage: (pageKey: PageKey, locale?: string) =>
        apiClient.get(endpoints.page(pageKey), withLang(locale)).then((res) => res.data),

    getHero: (locale?: string) =>
        apiClient.get(endpoints.hero, withLang(locale)).then((res) => res.data),

    getFooter: (locale?: string) =>
        apiClient.get(endpoints.footer, withLang(locale)).then((res) => res.data),
};

export default apiClient;
