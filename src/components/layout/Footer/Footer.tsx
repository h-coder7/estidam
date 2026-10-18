import { getLocale, getTranslations } from "next-intl/server";

import { getFooterSection } from "@/lib/api/home";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/animations/Reveal";

import "./_Footer.scss";

const Footer = async () => {
    const locale = await getLocale();
    const t = await getTranslations("footer");
    const footer = await getFooterSection(locale);

    const currentYear = new Date().getFullYear();
    const address = footer.address || t("address");
    const email = footer.email || t("email");
    const phone = footer.phone || t("phone");

    return (
        <footer className="footer">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="footer_top">
                        <div className="row gx-0">
                            <div className="col-lg-3 col-md-6">
                                <div className="footer_col footer_brand">
                                    <Reveal animation="fade-up" trigger="load">
                                        <Link href="/" className="footer_logo">
                                            <img
                                                src="/images/logo-wh.svg"
                                                alt="Estidam"
                                            />
                                        </Link>
                                    </Reveal>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <div className="footer_col">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h3 className="footer_col_title">{t("resource")}</h3>
                                    </Reveal>

                                    <ul className="footer_links">
                                        <li>
                                            <Link href="/#solutions">{t("works")}</Link>
                                        </li>
                                        <li>
                                            <Link href="/#how-we-deliver">{t("studio")}</Link>
                                        </li>
                                        <li>
                                            <Link href="/">{t("home")}</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <div className="footer_col">
                                    <Reveal animation="fade-up" trigger="load">
                                        <h3 className="footer_col_title">{t("topLinks")}</h3>
                                    </Reveal>

                                    <ul className="footer_links">
                                        <li>
                                            <Link href="/#why-estidam">{t("aboutUs")}</Link>
                                        </li>
                                        <li>
                                            <Link href="/#growth-ecosystem">{t("careers")}</Link>
                                        </li>
                                        <li>
                                            <Link href="/#get-in-touch">{t("partners")}</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <div className="footer_col footer_contact">
                                    <Reveal animation="fade-up" trigger="load">
                                        <div className="footer_contact_block">
                                            <h3 className="footer_col_title">{t("location")}</h3>
                                            <p className="footer_contact_text mb-0">{address}</p>
                                        </div>
                                    </Reveal>

                                    <Reveal animation="fade-up" trigger="load">
                                        <div className="footer_contact_block">
                                            <h3 className="footer_col_title">{t("inquiry")}</h3>
                                            <a
                                                href={`mailto:${email}`}
                                                className="footer_contact_text"
                                            >
                                                {email}
                                            </a>
                                            <a
                                                href={`tel:${phone.replace(/\s/g, "")}`}
                                                className="footer_contact_text"
                                            >
                                                {phone}
                                            </a>
                                        </div>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer_bottom">
                        <div className="row gx-0 align-items-center justify-content-between">
                            <div className="col-lg-8">
                                <div className="footer_socials">
                                    <a
                                        href="#"
                                        className="footer_social_link"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <span>{t("facebook")}</span>
                                        <i
                                            className="fat fa-arrow-up-right fsz-16 ms-2"
                                            aria-hidden="true"
                                        ></i>
                                    </a>

                                    <a
                                        href="#"
                                        className="footer_social_link"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <span>{t("twitter")}</span>
                                        <i
                                            className="fat fa-arrow-up-right fsz-16 ms-2"
                                            aria-hidden="true"
                                        ></i>
                                    </a>

                                    <a
                                        href="#"
                                        className="footer_social_link"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <span>{t("instagram")}</span>
                                        <i
                                            className="fat fa-arrow-up-right fsz-16 ms-2"
                                            aria-hidden="true"
                                        ></i>
                                    </a>

                                    <a
                                        href="#"
                                        className="footer_social_link"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <span>{t("dribbble")}</span>
                                        <i
                                            className="fat fa-arrow-up-right fsz-16 ms-2"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <p className="footer_copyright mb-0">
                                    © {currentYear} {t("copyrightPrefix")}{" "}
                                    <Link href="/" className="footer_copyright_brand">
                                        {t("copyrightBrand")}
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
