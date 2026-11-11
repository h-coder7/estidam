import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { Link } from "@/i18n/routing";
import type { SolutionRelated } from "@/lib/api/solutionDetail";

import "./_RelatedSolutions.scss";

const fallbacks = ["/images/icons/rs1.png", "/images/icons/rs2.png", "/images/icons/rs3.png"] as const;

const RelatedSolutions = async ({ items }: { items: SolutionRelated[] }) => {
    const t = await getTranslations("solutionsPage.relatedSolutions");
    if (!items.length) return null;

    return (
        <section className="solutions_related_solutions" id="related-solutions">
            <div className="related_solutions_head pt-100 pb-40 border-bottom bg-light-gray">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="related_solutions_num">{t("number")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="related_solutions_title fsz-40 fw-600 lh-2">
                            <span className="related_solutions_title_strong">{t("titleStrong")}</span>{" "}
                            <span className="related_solutions_title_muted cr-blue fw-500">{t("titleMuted")}</span>
                        </h2>
                    </Reveal>
                </div>
            </div>

            <div className="container">
                <div className="related_solutions_body px-lg-5">
                    <div className="row g-4">
                        {items.map((item, index) => {
                            const href = item.slug ? `/solutions/${item.slug}` : "/solutions";
                            return (
                                <div key={`${item.slug || item.title}-${index}`} className="col-lg-4 col-md-6">
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="related_card">
                                            <div className="related_card_visual">
                                                <img src={item.image || fallbacks[index % fallbacks.length]} alt="" aria-hidden="true" />
                                            </div>

                                            {item.title ? <h3 className="related_card_title">{item.title}</h3> : null}

                                            {item.text ? <p className="related_card_text mb-0">{item.text}</p> : null}

                                            <Link href={href} className="related_card_link">
                                                <span>{t("cta")}</span>
                                                <img src="/images/icons/arrow-bl.svg" alt="" className="related_card_arrow" aria-hidden="true" />
                                            </Link>
                                        </article>
                                    </Reveal>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RelatedSolutions;
