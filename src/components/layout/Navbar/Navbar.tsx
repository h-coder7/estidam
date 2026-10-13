"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";

import "./_Navbar.scss";

export default function Navbar() {
    const t = useTranslations("navbar");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const changeLanguage = (nextLocale: "en" | "ar") => {
        if (nextLocale === locale) return;
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <nav className={`navbar navbar-expand-lg homeNav${scrolled ? " scrolled" : ""}`}>
            <div className="container">

                <Link className="navbar-brand" href="/">
                    <img
                        src="/images/logo.svg"
                        alt="Estidam"
                        className="logo"
                        width={160}
                        height={48}
                    />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">{t("home")}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">{t("studio")}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">{t("cases")}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">{t("news")}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">{t("contact")}</a>
                        </li>
                    </ul>

                    <div className="nav-side">
                        <div className="lang-switch">
                            <button
                                type="button"
                                className={locale === "en" ? "active" : ""}
                                onClick={() => changeLanguage("en")}
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                className={locale === "ar" ? "active" : ""}
                                onClick={() => changeLanguage("ar")}
                            >
                                AR
                            </button>
                        </div>

                        <button type="button" className="nav-icon" aria-label="Search">
                            <i className="fa-regular fa-magnifying-glass"></i>
                        </button>

                        <button type="button" className="nav-menu-btn" aria-label="Menu">
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

            </div>
        </nav>
    );
}
