import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductsBirthContent } from "@/lib/api/productsPage";

import "./_ProductBirth.scss";

const fallbackSteps = [1, 2, 3, 4] as const;

const ProductBirth = async () => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.birth");
    const content = await getProductsBirthContent(locale);
    const badge = content?.eyebrow || t("badge");
    const titleStrong = content ? content.titleStrong : t("titleLine1");
    const titleMuted = content ? content.titleMuted : t("titleLine2");
    const steps =
        content && content.steps.length
            ? content.steps.map((step, index) => ({
                  number: String(index + 1).padStart(2, "0"),
                  title: step.title,
                  text: step.text,
              }))
            : fallbackSteps.map((step) => ({
                  number: t(`step${step}Number`),
                  title: t(`step${step}Title`),
                  text: t(`step${step}Text`),
              }));

    return (
        <section className="products_birth" id="product-birth">
            <div className="container">
                <div className="products_birth_content">
                    <div className="products_birth_arc" aria-hidden="true"></div>

                    <div className="products_birth_head">
                        <div className="products_birth_head_inner">
                            <Reveal animation="fade-up" trigger="load">
                                <span className="products_birth_badge">{badge}</span>
                            </Reveal>

                            <Reveal animation="fade-up" trigger="load">
                                <h2 className="products_birth_title fw-600">
                                    {titleStrong ? <span className="d-block">{titleStrong}</span> : null}
                                    {titleMuted ? (
                                        <span className="products_birth_title_muted d-block fw-500">{titleMuted}</span>
                                    ) : null}
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
                                            <span className="products_birth_num">{step.number}</span>
                                            <div>
                                                <h3 className="products_birth_step_title fw-600">{step.title}</h3>
                                                <p className="products_birth_step_text mb-0">{step.text}</p>
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
