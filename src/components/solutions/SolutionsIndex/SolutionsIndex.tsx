import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { Link } from "@/i18n/routing";
import { getSolutionCubeSlides } from "@/lib/api/home";
import { SOLUTION_DETAIL_SLUG } from "@/components/solutions/solutionRoutes";

import "./_SolutionsIndex.scss";

type CatalogCard = {
    key: string;
    number: string;
    titleStrong: string;
    titleMuted: string;
    text: string;
    highlight: string;
    href: string;
    label: string;
    image: string;
    photo: boolean;
    featured: boolean;
};

const fallbackImages = [
    "/images/solution-hero.png",
    "/images/icons/rs1.png",
    "/images/icons/rs2.png",
];

const SolutionsIndex = async () => {
    const locale = await getLocale();
    const t = await getTranslations("solutions");
    const index = await getTranslations("solutionsIndex");
    const slides = await getSolutionCubeSlides(locale);

    const cards: CatalogCard[] = slides.map((item, position) => {
        const featured = position === 0;
        const image = item.image || fallbackImages[position] || "";

        return {
            key: item.id || `solution-${position + 1}`,
            number: String(position + 1).padStart(2, "0"),
            titleStrong: item.titleStrong || "",
            titleMuted: item.titleMuted || "",
            text: item.text,
            highlight: item.highlight,
            href: featured ? `/solutions/${SOLUTION_DETAIL_SLUG}` : "/contact",
            label: featured ? index("explore") : index("discuss"),
            image,
            photo: Boolean(image) && !image.includes("/icons/"),
            featured,
        };
    });

    return (
        <>
            <section className="solutions_index_hero border-bottom">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="solutions_index_hero_copy">
                                <span className="solutions_index_badge">{t("badge")}</span>
                                <h1 className="solutions_index_title fsz-50">
                                    <span>{t("titleStrong")}</span>{" "}
                                    <span className="cr-blue fw-500">{t("titleMuted")}</span>
                                </h1>
                                <p className="solutions_index_lead">{t("description")}</p>
                                <div className="solutions_index_actions">
                                    <a href="#solutions-catalog" className="butn butn-blue">
                                        <span>{index("primaryCta")}</span>
                                        <img src="/images/icons/arrow-wh.svg" alt="" className="butn-icon" aria-hidden="true" />
                                    </a>
                                    <Link href="/contact" className="butn border">
                                        <span>{index("secondaryCta")}</span>
                                        <img src="/images/icons/arrow-bl.svg" alt="" className="butn-icon" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="solutions_index_photos">
                                <img src="/images/solutions.jpg" alt="" className="solutions_index_photo is_back" />
                                {/* <img src="/images/solution-hero.png" alt="" className="solutions_index_photo is_front" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="solutions_index_catalog" id="solutions-catalog">
                <div className="container">
                    <div className="content px-lg-4">
                        <div className="solutions_index_catalog_head">
                            <Reveal animation="fade-up" trigger="load">
                                <span className="solutions_index_badge">{index("catalogBadge")}</span>
                            </Reveal>
                            <Reveal animation="fade-up" trigger="load">
                                <h2 className="solutions_index_title fsz-40 fw-600 lh-2">
                                    <span>{index("catalogTitleStrong")}</span>{" "}
                                    <span className="cr-blue fw-500">{index("catalogTitleMuted")}</span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="solutions_index_grid">
                            {cards.map((card) => (
                                <Reveal
                                    key={card.key}
                                    className="solutions_index_tile"
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <article>
                                        {card.photo ? (
                                            <img src={card.image} alt="" className="is_photo" />
                                        ) : null}
                                        <span className="solutions_index_number">{card.number}</span>
                                        <h3>
                                            {card.titleStrong}{" "}
                                            <span className="cr-blue fw-500">{card.titleMuted}</span>
                                        </h3>
                                        <p>{card.text}</p>
                                        {card.highlight ? (
                                            <p className="solutions_index_outcome">
                                                <span>{index("outcome")}</span>
                                                {card.highlight}
                                            </p>
                                        ) : null}
                                        <Link href={card.href} className="solutions_index_card_link">
                                            <span>{card.label}</span>
                                            <img src="/images/icons/arrow-bl.svg" alt="" aria-hidden="true" />
                                        </Link>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SolutionsIndex;
