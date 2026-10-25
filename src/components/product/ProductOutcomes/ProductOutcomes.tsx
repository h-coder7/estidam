import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductOutcomes.scss";

const chipIcons = [
    "/images/product-det/outcomes-chip-check.svg",
    "/images/product-det/outcomes-chip-lock.svg",
    "/images/product-det/outcomes-chip-check.svg",
    "/images/product-det/outcomes-chip-check.svg",
] as const;

const chipTones = ["", "is-dark", "", ""] as const;

const ProductOutcomes = async () => {
    const t = await getTranslations("productsPage.detail.outcomes");
    const chips = t.raw("chips") as string[];

    return (
        <section className="products_outcomes" id="product-outcomes">
            <div className="products_outcomes_band" aria-hidden="true" />
            <div className="products_outcomes_body">
                <span className="products_outcomes_line" aria-hidden="true">
                    <img src="/images/product-det/outcomes-line.svg" alt="" width={656} height={1} />
                </span>
                <div className="container">
                    <div className="products_outcomes_row row align-items-start gy-4 px-lg-4">
                        <div className="col-lg-5">
                            <Reveal animation="fade-up">
                                <span className="products_outcomes_badge">{t("badge")}</span>
                                <h2 className="products_outcomes_title fw-500">
                                    {t("titleStrong")}{" "}
                                    <span className="products_outcomes_title_muted cr-blue">{t("titleMuted")}</span>
                                </h2>
                                <p className="products_outcomes_description">{t("description")}</p>
                                <div className="products_outcomes_chips">
                                    {chips.map((chip, index) => (
                                        <span className={`products_outcomes_chip ${chipTones[index]}`} key={chip}>
                                            <img src={chipIcons[index]} alt="" width={14} height={14} />
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                        <div className="col-lg-7">
                            <Reveal animation="fade-up">
                                <div className="products_outcomes_card">
                                    <div className="products_outcomes_board">
                                        <img
                                            src="/images/product-det/outcomes-board.png"
                                            alt=""
                                            width={1562}
                                            height={1007}
                                        />
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
            <div className="products_outcomes_band" aria-hidden="true" />
        </section>
    );
};

export default ProductOutcomes;
