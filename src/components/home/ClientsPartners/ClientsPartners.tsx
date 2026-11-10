import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getAboutPartnerLogos } from "@/lib/api/about";

import ClientsGrid from "./ClientsGrid";
import PartnersMarquee from "./PartnersMarquee";
import { CLIENT_LOGOS, PARTNER_LOGOS, type BrandLogo } from "./clientsPartnersData";

import "./_ClientsPartners.scss";

const ClientsPartners = async () => {
    const locale = await getLocale();
    const t = await getTranslations("clientsPartners");
    const logos = (await getAboutPartnerLogos(locale)).flatMap((logo) => {
        if (!logo.src) return [];
        const url = logo.url && logo.url !== "#" ? logo.url : undefined;
        return [{ id: logo.id, name: logo.name, src: logo.src, url, type: logo.type.toLowerCase() }];
    });
    const clients: BrandLogo[] = logos
        .filter((logo) => logo.type === "client")
        .map(({ id, name, src, url }) => ({ id, name, src, url }));
    const partners: BrandLogo[] = logos
        .filter((logo) => logo.type !== "client")
        .map(({ id, name, src, url }) => ({ id, name, src, url }));
    const clientLogos = clients.length ? clients : CLIENT_LOGOS;
    const partnerLogos = partners.length ? partners : PARTNER_LOGOS;

    return (
        <section className="clients_partners" id="clients-partners" aria-labelledby="clients-partners-title">
            <div className="container">
                <div className="content px-lg-4">
                    <div className="section-head cp-section-head">
                        <Reveal animation="fade-up" trigger="load">
                            <span className="section-head-badge">{t("eyebrow")}</span>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <h2 className="section-head-title fsz-40 fw-600 lh-2" id="clients-partners-title">
                                <span className="section-head-title-strong">{t("titleStrong")}</span>
                                {t("titleMuted") ? (
                                    <>
                                        <br />
                                        <span className="section-head-title-muted cr-blue fw-500">
                                            {t("titleMuted")}
                                        </span>
                                    </>
                                ) : null}
                            </h2>
                        </Reveal>

                        <Reveal animation="fade-up" trigger="load">
                            <p className="section-head-description mb-0">{t("description")}</p>
                        </Reveal>
                    </div>
                </div>

                {clientLogos.length ? (
                    <>
                        <div className="cp-chapter">
                            <span className="cp-num">01</span>
                            <h3>{t("clients")}</h3>
                        </div>
                        <ClientsGrid logos={clientLogos} label={t("clients")} />
                    </>
                ) : null}
            </div>

            {partnerLogos.length ? (
                <div className="cp-partners">
                    <div className="container">
                        <div className="cp-chapter is-dark">
                            <span className="cp-num">{clientLogos.length ? "02" : "01"}</span>
                            <h3>{t("partners")}</h3>
                        </div>
                    </div>
                    <PartnersMarquee logos={partnerLogos} label={t("partners")} pauseLabel={t("pause")} playLabel={t("play")} />
                </div>
            ) : null}

            <div className="sec-lines">
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default ClientsPartners;
