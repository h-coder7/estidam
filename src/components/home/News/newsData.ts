export type NewsItem = {
    id: string | number;
    slug: string;
    title: string;
    date: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    featured: boolean;
};

export const HOME_NEWS_COUNT = 5;

type SampleSeed = Omit<NewsItem, "title"> & { title: { en: string; ar: string } };

const SAMPLE: SampleSeed[] = [
    {
        id: 1,
        slug: "sample-news-1",
        title: {
            en: "Sample headline: Mayar introduces a pilgrim satisfaction survey for service centres",
            ar: "عنوان تجريبي: معيار يطلق استبيان رضا الحجاج لمراكز الخدمة",
        },
        date: "2026-10-28",
        image: "/images/news/sample-news-01.webp",
        imageWidth: 900,
        imageHeight: 600,
        featured: true,
    },
    {
        id: 2,
        slug: "sample-news-2",
        title: { en: "Sample headline about the seasonal hiring platform", ar: "عنوان تجريبي عن منصة التوظيف الموسمي" },
        date: "2026-10-14",
        image: "/images/news/sample-news-02.webp",
        imageWidth: 900,
        imageHeight: 600,
        featured: false,
    },
    {
        id: 3,
        slug: "sample-news-3",
        title: { en: "Sample headline about a new integration partner", ar: "عنوان تجريبي عن شريك تكامل جديد" },
        date: "2026-10-02",
        image: "/images/news/sample-news-03.webp",
        imageWidth: 900,
        imageHeight: 675,
        featured: false,
    },
    {
        id: 4,
        slug: "sample-news-4",
        title: { en: "Sample headline about season readiness work", ar: "عنوان تجريبي عن أعمال الجاهزية للموسم" },
        date: "2026-09-18",
        image: "/images/news/sample-news-04.webp",
        imageWidth: 900,
        imageHeight: 675,
        featured: false,
    },
    {
        id: 5,
        slug: "sample-news-5",
        title: { en: "Sample headline about Maidan field operations", ar: "عنوان تجريبي عن العمليات الميدانية في ميدان" },
        date: "2026-09-05",
        image: "/images/news/sample-news-05.webp",
        imageWidth: 900,
        imageHeight: 600,
        featured: false,
    },
];

export async function getHomeNews(locale: string): Promise<NewsItem[]> {
    const lang = locale === "ar" ? "ar" : "en";
    const items: NewsItem[] = SAMPLE.map(({ title, ...rest }) => ({ ...rest, title: title[lang] }));
    return arrangeHomeNews(items);
}

export function arrangeHomeNews(items: NewsItem[]): NewsItem[] {
    const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
    if (!sorted.length) return [];
    const lead = sorted.find((item) => item.featured) ?? sorted[0];
    const rest = sorted.filter((item) => item !== lead).slice(0, HOME_NEWS_COUNT - 1);
    return [lead, ...rest];
}
