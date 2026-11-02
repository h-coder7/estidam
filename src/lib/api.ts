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
    home: "cms/pages/home",
    about: "cms/pages/about",
    contact: "cms/pages/contact",
    productsPage: "cms/pages/products",
    contactUs: "contact-us",
    products: "products",
    product: (slug: string) => `products/${slug}`,
    solutions: "solutions",
    partners: "partners",
    faqs: "faqs",
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

    getHome: (locale?: string) =>
        apiClient.get(endpoints.home, withLang(locale)).then((res) => res.data),

    getAbout: (locale?: string) =>
        apiClient.get(endpoints.about, withLang(locale)).then((res) => res.data),

    getContactPage: (locale?: string) =>
        apiClient.get(endpoints.contact, withLang(locale)).then((res) => res.data),

    getProductsPage: (locale?: string) =>
        apiClient.get(endpoints.productsPage, withLang(locale)).then((res) => res.data),

    submitContact: (
        body: {
            name: string;
            email: string;
            phone: string;
            organization: string;
            job_title: string;
            source: string;
            message: string;
            consent: boolean;
        },
        locale?: string,
    ) =>
        apiClient
            .post(endpoints.contactUs, body, {
                headers: {
                    ...(locale ? { lang: locale } : {}),
                    "Idempotency-Key": crypto.randomUUID(),
                },
            })
            .then((res) => res.data),

    getProducts: (locale?: string) =>
        apiClient
            .get(endpoints.products, { ...withLang(locale), params: { per_page: 50 } })
            .then((res) => res.data),

    getProduct: (slug: string, locale?: string) =>
        apiClient.get(endpoints.product(slug), withLang(locale)).then((res) => res.data),

    getSolutions: (locale?: string) =>
        apiClient
            .get(endpoints.solutions, { ...withLang(locale), params: { per_page: 50 } })
            .then((res) => res.data),

    getPartners: (locale?: string) =>
        apiClient
            .get(endpoints.partners, { ...withLang(locale), params: { per_page: 50 } })
            .then((res) => res.data),

    getFaqs: (locale?: string) =>
        apiClient.get(endpoints.faqs, withLang(locale)).then((res) => res.data),

    getFooter: (locale?: string) =>
        apiClient.get(endpoints.footer, withLang(locale)).then((res) => res.data),
};

export default apiClient;
