import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { Link } from "@/i18n/routing";
import { getHomeNews, type NewsItem } from "./newsData";

import "./_News.scss";

const newsHref = (item: NewsItem) => `/news/${item.slug}`;

function formatDay(date: string, locale: string) {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
        day: "2-digit",
        month: "short",
    }).format(new Date(`${date}T00:00:00`));
}

const News = async () => {
    const locale = await getLocale();
    const t = await getTranslations("news");
    const items = await getHomeNews(locale);

    if (!items.length) return null;

    const [lead, ...rest] = items;

    return (
        <section className="news_home border-top" id="news" aria-labelledby="news-home-title">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="section-head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="section-head-badge">{t("badge")}</span>
                        </Reveal>
                        <Reveal animation="fade-up" trigger="load">
                            <h2 id="news-home-title" className="section-head-title fsz-40 fw-600 lh-2 mt-3">
                                <span className="section-head-title-strong">{t("titleStrong")}</span>{" "}
                                <span className="section-head-title-muted cr-blue fw-500">{t("titleMuted")}</span>
                            </h2>
                        </Reveal>
                    </div>

                    <ul className="news_grid">
                        <li className="news_grid_lead">
                            <Reveal animation="fade-up" trigger="load" className="news_reveal">
                                <NewsCard item={lead} locale={locale} featured label={t("featured")} cta={t("readStory")} />
                            </Reveal>
                        </li>
                        {rest.map((item, index) => (
                            <li key={item.id}>
                                <Reveal animation="fade-up" delay={0.3 + index * 0.08} trigger="load" className="news_reveal">
                                    <NewsCard item={item} locale={locale} cta={t("readMore")} />
                                </Reveal>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="sec-lines" aria-hidden="true">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

function NewsCard({
    item,
    locale,
    cta,
    featured = false,
    label,
}: {
    item: NewsItem;
    locale: string;
    cta: string;
    featured?: boolean;
    label?: string;
}) {
    return (
        <Link href={newsHref(item)} className={`news_card${featured ? " is_featured" : ""}`}>
            <div className="news_card_media">
                <time className="news_card_date" dateTime={item.date}>
                    {formatDay(item.date, locale)}
                </time>
                <img
                    src={item.image}
                    alt=""
                    width={item.imageWidth}
                    height={item.imageHeight}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="news_card_body">
                {featured && label ? <span className="news_card_badge">{label}</span> : null}
                <h3 className="news_card_title">{item.title}</h3>
                <span className="news_card_more">
                    {cta}
                    <span className="news_card_arrow" aria-hidden="true">
                        →
                    </span>
                </span>
            </div>
        </Link>
    );
}

export default News;
