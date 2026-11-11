import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import type { SolutionChallenge } from "@/lib/api/solutionDetail";

import "./_Challenges.scss";

const icons = [
    "/images/icons/ch1.svg",
    "/images/icons/ch2.svg",
    "/images/icons/ch3.svg",
    "/images/icons/ch4.svg",
    "/images/icons/ch5.svg",
    "/images/icons/ch6.svg",
] as const;

const Challenges = async ({ items }: { items: SolutionChallenge[] }) => {
    const t = await getTranslations("solutionsPage.challenges");
    if (!items.length) return null;

    return (
        <section className="solutions_challenges border-top mb-5 border-bottom" id="challenges">
            <div className="challenges_head border-bottom">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="challenges_num">{t("number")}</span>
                    </Reveal>

                    <div className="row gx-0 justify-content-between align-items-end">
                        <div className="col-lg-6">
                            <Reveal animation="fade-up" trigger="load">
                                <h2 className="challenges_title fsz-40 fw-600 lh-2">
                                    <span className="challenges_title_strong">{t("titleStrong")}</span>{" "}
                                    <span className="challenges_title_muted cr-blue fw-500">{t("titleMuted")}</span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <p className="challenges_description mb-0 text-lg-end">{t("description")}</p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content border-bottom">
                <div className="container">
                    <div className="challenges_grid">
                        <div className="row gx-0">
                            {items.map((item, index) => (
                                <div className="col-lg-4 col-md-6" key={`${item.text}-${index}`}>
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="challenge_card">
                                            <div className="challenge_card_top">
                                                <div className="challenge_card_icon">
                                                    <img src={icons[index % icons.length]} alt="" aria-hidden="true" />
                                                </div>
                                                <span className="challenge_card_arrow" aria-hidden="true">
                                                    <i className="fa-regular fa-arrow-right"></i>
                                                </span>
                                            </div>

                                            <h3 className="challenge_card_title">{item.text}</h3>

                                            {item.tag ? (
                                                <div className="challenge_card_footer">
                                                    <span>{item.tag}</span>
                                                </div>
                                            ) : null}
                                        </article>
                                    </Reveal>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Challenges;
