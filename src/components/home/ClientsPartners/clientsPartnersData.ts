/**
 * Clients & Partners — logo data (approved assets only).
 * Files are trimmed WebP copies of the supplied PNGs (transparent padding removed,
 * colours/proportions untouched). `name` is used as alt text — please confirm the
 * official names (two are uncertain: "Hospital (BH)" and the Hajj coordination council).
 */
type StaticLogo = { name: string; src: string; width: number; height: number };

export type BrandLogo = { id: string; name: string; src: string; url?: string; width?: number; height?: number };

const withId = (logos: StaticLogo[]): BrandLogo[] =>
    logos.map((logo) => ({ id: logo.src, name: logo.name, src: logo.src, width: logo.width, height: logo.height }));

const CLIENT_LOGO_LIST: StaticLogo[] = [
    { name: "NEOM", src: "/images/clients/client-01.webp", width: 252, height: 260 },
    { name: "John Cockerill", src: "/images/clients/client-02.webp", width: 520, height: 204 },
    { name: "AstraZeneca", src: "/images/clients/client-03.webp", width: 520, height: 132 },
    { name: "ICIEC", src: "/images/clients/client-04.webp", width: 520, height: 137 },
    { name: "SNB AlAhli", src: "/images/clients/client-05.webp", width: 520, height: 143 },
    { name: "Nestlé", src: "/images/clients/client-06.webp", width: 251, height: 260 },
    { name: "Coordination Council of Domestic Hajj Companies", src: "/images/clients/client-07.webp", width: 285, height: 260 },
    { name: "Saudi Payments", src: "/images/clients/client-08.webp", width: 401, height: 260 },
    { name: "Ammar Award", src: "/images/clients/client-09.webp", width: 520, height: 251 },
    { name: "Alyom Digital", src: "/images/clients/client-10.webp", width: 520, height: 204 },
    { name: "AlTakamul Tech", src: "/images/clients/client-11.webp", width: 520, height: 180 },
    { name: "Nesma", src: "/images/clients/client-12.webp", width: 519, height: 249 },
    { name: "AlTakamul National Agriculture", src: "/images/clients/client-13.webp", width: 520, height: 167 },
    { name: "NAFT", src: "/images/clients/client-14.webp", width: 520, height: 246 },
    { name: "FLOOR", src: "/images/clients/client-15.webp", width: 427, height: 260 },
    { name: "Self Resources Limited Co.", src: "/images/clients/client-16.webp", width: 520, height: 134 },
    { name: "Money Loop", src: "/images/clients/client-17.webp", width: 520, height: 188 },
    { name: "Holol Alyaom", src: "/images/clients/client-18.webp", width: 520, height: 155 },
    { name: "Mohammed Bin Rashid University of Medicine and Health Sciences", src: "/images/clients/client-19.webp", width: 520, height: 107 },
    { name: "Saudi Cement", src: "/images/clients/client-20.webp", width: 520, height: 181 },
    { name: "Ministry of Health", src: "/images/clients/client-21.webp", width: 287, height: 260 },
    { name: "Al Riyadh", src: "/images/clients/client-22.webp", width: 520, height: 175 },
    { name: "GASCO", src: "/images/clients/client-23.webp", width: 488, height: 237 },
    { name: "KAFOU Energy", src: "/images/clients/client-24.webp", width: 520, height: 237 },
    { name: "Bin Yaala Exchange", src: "/images/clients/client-25.webp", width: 520, height: 120 },
    { name: "Skybridge", src: "/images/clients/client-26.webp", width: 363, height: 260 },
    { name: "ROOM", src: "/images/clients/client-27.webp", width: 261, height: 260 },
    { name: "Quality Healthcare Center", src: "/images/clients/client-28.webp", width: 520, height: 163 },
    { name: "Al-Baha Creativity and Excellence Award", src: "/images/clients/client-29.webp", width: 520, height: 251 },
    { name: "Hospital (BH)", src: "/images/clients/client-30.webp", width: 225, height: 260 },
    { name: "Weqaya", src: "/images/clients/client-31.webp", width: 520, height: 237 },
    { name: "Construction Costs", src: "/images/clients/client-32.webp", width: 430, height: 260 },
    { name: "Visual Experience", src: "/images/clients/client-33.webp", width: 311, height: 260 },
    { name: "Alsarah", src: "/images/clients/client-34.webp", width: 180, height: 260 },
    { name: "Move", src: "/images/clients/client-35.webp", width: 520, height: 177 },
    { name: "Holiday Inn Bakkah", src: "/images/clients/client-36.webp", width: 520, height: 166 },
    { name: "Technical and Vocational Training Corporation", src: "/images/clients/client-37.webp", width: 520, height: 133 },
    { name: "Birrukum", src: "/images/clients/client-38.webp", width: 492, height: 260 },
    { name: "Meta Spaces", src: "/images/clients/client-39.webp", width: 263, height: 260 },
    { name: "Rubath Nizam Hyderabad", src: "/images/clients/client-40.webp", width: 520, height: 153 },
    { name: "WEEL", src: "/images/clients/client-41.webp", width: 473, height: 172 },
    { name: "Saudi Dental Technology Society", src: "/images/clients/client-42.webp", width: 520, height: 206 },
    { name: "Alhamrani Universal", src: "/images/clients/client-43.webp", width: 520, height: 134 },
    { name: "Reqaa", src: "/images/clients/client-44.webp", width: 310, height: 260 },
    { name: "Roznamah", src: "/images/clients/client-45.webp", width: 517, height: 138 },
    { name: "Ministry of National Guard", src: "/images/clients/client-46.webp", width: 297, height: 260 },
    { name: "Mashariq", src: "/images/clients/client-47.webp", width: 520, height: 156 },
    { name: "Novo Nordisk", src: "/images/clients/client-48.webp", width: 520, height: 208 },
    { name: "Saudi Bugshan", src: "/images/clients/client-49.webp", width: 520, height: 132 },
    { name: "Dr. Awwad Albishri Hospital", src: "/images/clients/client-50.webp", width: 520, height: 127 },
    { name: "Saudi Binladin Group", src: "/images/clients/client-51.webp", width: 478, height: 253 },
];

const PARTNER_LOGO_LIST: StaticLogo[] = [
    { name: "Dell", src: "/images/partners/partner-01.webp", width: 261, height: 260 },
    { name: "Alyom Digital", src: "/images/partners/partner-02.webp", width: 520, height: 205 },
    { name: "Ministry of Industry and Mineral Resources", src: "/images/partners/partner-03.webp", width: 520, height: 153 },
    { name: "Monsha'at", src: "/images/partners/partner-04.webp", width: 369, height: 260 },
    { name: "Huawei", src: "/images/partners/partner-05.webp", width: 259, height: 260 },
    { name: "Effat University", src: "/images/partners/partner-06.webp", width: 186, height: 260 },
    { name: "Literature, Publishing & Translation Commission", src: "/images/partners/partner-07.webp", width: 520, height: 49 },
    { name: "CompTIA", src: "/images/partners/partner-08.webp", width: 520, height: 115 },
    { name: "AlTakamul Tech", src: "/images/partners/partner-09.webp", width: 520, height: 180 },
    { name: "Smart Base", src: "/images/partners/partner-10.webp", width: 500, height: 260 },
    { name: "Outstanding Knowledge", src: "/images/partners/partner-11.webp", width: 495, height: 260 },
    { name: "Rakeza", src: "/images/partners/partner-12.webp", width: 520, height: 249 },
    { name: "Almanassa", src: "/images/partners/partner-13.webp", width: 520, height: 180 },
    { name: "Skybridge", src: "/images/partners/partner-14.webp", width: 367, height: 260 },
    { name: "Meta Spaces", src: "/images/partners/partner-15.webp", width: 262, height: 260 },
    { name: "MyFatoorah", src: "/images/partners/partner-16.webp", width: 520, height: 81 },
];

export const CLIENT_LOGOS = withId(CLIENT_LOGO_LIST);
export const PARTNER_LOGOS = withId(PARTNER_LOGO_LIST);
