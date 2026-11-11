import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import ClientsMarquee from "./ClientsMarquee";
import { CLIENT_LOGOS } from "./clientsData";

import "./_Clients.scss";

const Clients = async () => {
    const t = await getTranslations("clients");

    return (
        <section className="clients_home" id="clients" aria-labelledby="clients-home-title">
            <div className="container">
                <div className="section-head text-center">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="section-head-badge">{t("badge")}</span>
                    </Reveal>
                    <Reveal animation="fade-up" trigger="load">
                        <h2 id="clients-home-title" className="section-head-title fsz-40 fw-600 lh-2 mt-3">
                            <span className="section-head-title-strong">{t("titleStrong")}</span>{" "}
                            <span className="section-head-title-muted cr-blue fw-500">{t("titleMuted")}</span>
                        </h2>
                    </Reveal>
                </div>
            </div>

            <ClientsMarquee logos={CLIENT_LOGOS} label={t("listLabel")} />

        </section>
    );
};

export default Clients;
