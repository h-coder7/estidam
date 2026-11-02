import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getProductWorks } from "@/lib/api/productsPage";
import ProductWorksSteps from "./ProductWorksSteps";

import "./_ProductWorks.scss";

type WorkStep = {
    title: string;
    text: string;
};

const ProductWorks = async ({ productId }: { productId: "hrh" | "mayar" | "maydan" }) => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.detail.works");
    const works = await getProductWorks(locale, productId);
    const steps = works.length ? works : (t.raw("steps") as WorkStep[]);

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
                            <ProductWorksSteps steps={steps} />
                        </Reveal>
                    </div>
                    <div className="sec-lines"><span></span><span></span></div>
                </div>
            </div>
        </section>
    );
};

export default ProductWorks;
