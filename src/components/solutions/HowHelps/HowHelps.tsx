import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import type { SolutionHelp } from "@/lib/api/solutionDetail";

import "./_HowHelps.scss";

const icons = [
    "/images/icons/sh1.svg",
    "/images/icons/sh2.svg",
    "/images/icons/sh3.svg",
    "/images/icons/sh4.svg",
    "/images/icons/sh5.svg",
    "/images/icons/sh6.svg",
    "/images/icons/sh7.svg",
] as const;

const HowHelps = async ({ items }: { items: SolutionHelp[] }) => {
    const t = await getTranslations("solutionsPage.howHelps");
    if (!items.length) return null;

    const split = Math.ceil(items.length / 2);
    const columns = [items.slice(0, split), items.slice(split)];

    return (
        <section className="solutions_how_helps border-top" id="how-helps">
            <div className="how_helps_head bg-light-gray border-bottom px-lg-5">
                <div className="container">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="how_helps_num">{t("number")}</span>
                    </Reveal>

                    <div className="row gx-0 justify-content-between align-items-end">
                        <div className="col-lg-6">
                            <Reveal animation="fade-up" trigger="load">
                                <h2 className="how_helps_title fsz-40 fw-600 lh-2">
                                    <span className="how_helps_title_strong">{t("titleStrong")}</span>{" "}
                                    <span className="how_helps_title_muted cr-blue fw-500">{t("titleMuted")}</span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="col-lg-5">
                            <Reveal animation="fade-up" trigger="load">
                                <p className="how_helps_description mb-0 text-lg-end">{t("description")}</p>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="container">
                    <div className="how_helps_body px-lg-5">
                        <div className="row gx-4 gy-4">
                            {columns.map((column, columnIndex) =>
                                column.length ? (
                                    <div className="col-lg-6" key={columnIndex}>
                                        <div className="how_helps_col">
                                            {column.map((item, index) => {
                                                const position = columnIndex === 0 ? index : split + index;
                                                return (
                                                    <Reveal animation="fade-up" trigger="load" key={`${item.title}-${position}`}>
                                                        <article className="help_card">
                                                            <div className="help_card_icon">
                                                                <img src={icons[position % icons.length]} alt="" aria-hidden="true" />
                                                            </div>
                                                            <div className="help_card_content">
                                                                {item.title ? <h3 className="help_card_title">{item.title}</h3> : null}
                                                                {item.text ? <p className="help_card_text mb-0">{item.text}</p> : null}
                                                            </div>
                                                            {item.badge ? <span className="help_card_badge">{item.badge}</span> : null}
                                                        </article>
                                                    </Reveal>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null,
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowHelps;
