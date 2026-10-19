import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import ProductsCascade from "./ProductsCascade";

import "./_Products.scss";

const Products = async () => {
    const t = await getTranslations("products");

    return (
        <section className="products" id="products">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="section-head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="section-head-badge">{t("badge")}</span>
                        </Reveal>

                        <div className="row gx-0 justify-content-between">
                            <div className="col-lg-6">
                                <div className="section-head-left mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h2 className="section-head-title">
                                            <span className="section-head-title-strong">
                                                {t("titleStrong")}
                                            </span>
                                            <br />
                                            <span className="section-head-title-muted">
                                                {t("titleMuted")}
                                            </span>
                                        </h2>
                                    </Reveal>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="section-head-right mt-3">
                                    <Reveal animation="fade-up" trigger="load">
                                        <p className="section-head-description">
                                            {t("description")}
                                        </p>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <a href="#products-cascade" className="butn butn-outline">
                                            <span>{t("cta")}</span>
                                            <img
                                                src="/images/icons/arrow-bl.svg"
                                                alt=""
                                                className="butn-icon"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="products-cascade">
                    <ProductsCascade />
                </div>
            </div>

            <div className="sec-lines"><span></span><span></span></div>
        </section>
    );
};

export default Products;
