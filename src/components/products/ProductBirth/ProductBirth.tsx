import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_ProductBirth.scss";

const steps = [
    { number: "step1Number", title: "step1Title", text: "step1Text" },
    { number: "step2Number", title: "step2Title", text: "step2Text" },
    { number: "step3Number", title: "step3Title", text: "step3Text" },
    { number: "step4Number", title: "step4Title", text: "step4Text" },
] as const;

const ProductBirth = async () => {
    const t = await getTranslations("productsPage.birth");

    return (
        <section className="products_birth" id="product-birth">
            <div className="container">
                <div className="products_birth_content">
                    <div className="products_birth_arc" aria-hidden="true"></div>

                    <div className="products_birth_head">
                        <div className="products_birth_head_inner">
                            <Reveal animation="fade-up" trigger="load">
                                <span className="products_birth_badge">{t("badge")}</span>
                            </Reveal>

                            <Reveal animation="fade-up" trigger="load">
                                <h2 className="products_birth_title fw-600">
                                    <span className="d-block">{t("titleLine1")}</span>
                                    <span className="products_birth_title_muted d-block fw-500">{t("titleLine2")}</span>
                                </h2>
                            </Reveal>
                        </div>
                    </div>

                    <div className="products_birth_body">
                        <div className="products_birth_steps row g-0">
                            {steps.map((step) => (
                                <div className="col-lg-3 col-md-6 col-6" key={step.number}>
                                    <Reveal animation="fade-up" trigger="load">
                                        <article className="products_birth_step">
                                            <span className="products_birth_num">{t(step.number)}</span>
                                            <div>
                                                <h3 className="products_birth_step_title fw-600">{t(step.title)}</h3>
                                                <p className="products_birth_step_text mb-0">{t(step.text)}</p>
                                            </div>
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

export default ProductBirth;
