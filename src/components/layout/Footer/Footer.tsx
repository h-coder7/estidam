import { getLocale, getTranslations } from "next-intl/server";

import { getFooterSection, type FooterSocialKey } from "@/lib/api/home";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/animations/Reveal";
import BackToTop from "./BackToTop";

import "./_Footer.scss";

const socialIcons: Record<FooterSocialKey, { icon: string; label: string }> = {
    facebook: { icon: "fa-brands fa-facebook-f", label: "Facebook" },
    instagram: { icon: "fa-brands fa-instagram", label: "Instagram" },
    x: { icon: "fa-brands fa-x-twitter", label: "X" },
    whatsapp: { icon: "fa-brands fa-whatsapp", label: "WhatsApp" },
    linkedin: { icon: "fa-brands fa-linkedin-in", label: "LinkedIn" },
};

const platformLinks = [
    { href: "/#why-estidam", labelKey: "whyEstidam" as const },
];

const Footer = async () => {
    const locale = await getLocale();
    const t = await getTranslations("footer");
    const footer = await getFooterSection(locale);

    const currentYear = new Date().getFullYear();
    const hasContact = Boolean(footer.email || footer.phone || footer.address);

    return (
        <footer className="footer">

            <div className="container">

                {/* Top Content */}
                <div className="footer_top">
                    <div className="row justify-content-between">

                        {/* Brand */}
                        <div className="col-lg-5 col-md-12">
                            <div className="footer_brand">

                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <Link
                                        href="/"
                                        className="footer_logo"
                                    >
                                        <img
                                            src="/images/logo.png"
                                            alt="Estidam"
                                        />
                                    </Link>
                                </Reveal>

                                {footer.description ? (
                                    <Reveal
                                        animation="fade-up"
                                        trigger="load"
                                    >
                                        <p className="footer_description fsz-18 mb-0 col-lg-10">
                                            {footer.description}
                                        </p>
                                    </Reveal>
                                ) : null}

                            </div>
                        </div>


                        {/* Contact */}
                        <div className="col-lg-3 col-md-6">
                            <div className="footer_column">

                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <h3 className="fsz-22 fw-500">
                                        {t("contact")}
                                    </h3>
                                </Reveal>

                                {hasContact ? (
                                    <ul>
                                        {footer.email ? (
                                            <li>
                                                <a href={`mailto:${footer.email}`}>
                                                    {footer.email}
                                                </a>
                                            </li>
                                        ) : null}

                                        {footer.phone ? (
                                            <li>
                                                <a href={`tel:${footer.phone.replace(/\s/g, "")}`}>
                                                    {footer.phone}
                                                </a>
                                            </li>
                                        ) : null}

                                        {footer.address ? (
                                            <li>
                                                <span>
                                                    {footer.address}
                                                </span>
                                            </li>
                                        ) : null}
                                    </ul>
                                ) : null}

                            </div>
                        </div>


                        {/* Platform — home sections only */}
                        <div className="col-lg-3 col-md-6">
                            <div className="footer_column">

                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <h3 className="fsz-18 fw-500">
                                        {t("platform")}
                                    </h3>
                                </Reveal>

                                <ul>
                                    {platformLinks.map((item) => (
                                        <li key={item.href}>
                                            <Link href={item.href}>
                                                {t(item.labelKey)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>

                    </div>
                </div>


                {/* Bottom */}
                <div className="footer_bottom">

                    {/* Copyright */}
                    <div className="copyright fsz-15">
                        © {currentYear} {t("copyright")}
                    </div>


                    {footer.socials.length > 0 ? (
                        <div className="social_links">
                            {footer.socials.map((social) => {
                                const item = socialIcons[social.key];

                                return (
                                    <a
                                        key={social.key}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={item.label}
                                    >
                                        <i className={item.icon}></i>
                                    </a>
                                );
                            })}
                        </div>
                    ) : null}


                    {/* Back To Top */}
                    <BackToTop
                        label={t("backToTop")}
                    />

                </div>

            </div>

        </footer>
    );
};

export default Footer;
