import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductWorks.scss";

type WorkStep = {
    title: string;
    text: string;
};

const ProductWorks = async () => {
    const t = await getTranslations("productsPage.detail.works");
    const steps = t.raw("steps") as WorkStep[];

    return (
        <section className="products_works" id="product-works">
            <div className="container">
                <div className="products_works_stage">
                    <img
                        className="products_works_arch"
                        src="/images/product-det/works-arch.svg"
                        alt=""
                        width={1340}
                        height={796}
                    />
                    <div className="products_works_stripes" aria-hidden="true" />
                    <div className="products_works_content container">
                        <Reveal animation="fade-up">
                            <span className="products_works_badge">{t("badge")}</span>
                            <h2 className="products_works_title fw-500">
                                <span className="d-block">{t("titleStrong")}</span>
                                <span className="d-block products_works_title_muted cr-blue">{t("titleMuted")}</span>
                            </h2>
                        </Reveal>
                        <Reveal animation="fade-up">
                            <ol className="products_works_steps">
                                <img
                                    className="products_works_line"
                                    src="/images/product-det/works-line.svg"
                                    alt=""
                                    width={1286}
                                    height={1}
                                />
                                <img
                                    className="products_works_line_active"
                                    src="/images/product-det/works-line-active.svg"
                                    alt=""
                                    width={313}
                                    height={1}
                                />
                                {steps.map((step, index) => {
                                    const active = index < 2;
                                    const number = String(index + 1).padStart(2, "0");

                                    return (
                                        <li className={`products_works_step${active ? " is-active" : ""}`} key={number}>
                                            <span className="products_works_marker">
                                                {active && (
                                                    <img
                                                        className="products_works_ring"
                                                        src="/images/product-det/works-step-ring.svg"
                                                        alt=""
                                                        width={46}
                                                        height={46}
                                                    />
                                                )}
                                                <img
                                                    className="products_works_face"
                                                    src={
                                                        active
                                                            ? "/images/product-det/works-step-active.svg"
                                                            : "/images/product-det/works-step-idle.svg"
                                                    }
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                />
                                                <span className="products_works_num">{number}</span>
                                            </span>
                                            <h3 className="products_works_step_title fw-500">{step.title}</h3>
                                            <p className="products_works_step_text mb-0">{step.text}</p>
                                        </li>
                                    );
                                })}
                            </ol>
                        </Reveal>
                    </div>
                    <div className="sec-lines"><span></span><span></span></div>
                </div>
            </div>
        </section>
    );
};

export default ProductWorks;
