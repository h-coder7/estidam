import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import PartnersSpotlight from "./PartnersSpotlight";
import { PARTNER_LOGOS } from "./partnersData";

import "./_Partners.scss";

const Partners = async () => {
    const t = await getTranslations("partners");

    return (
        <section className="partners_home" id="partners" aria-labelledby="partners-home-title">
            <div className="container">
                <PartnersSpotlight
                    logos={PARTNER_LOGOS}
                    chooseLabel={t("choose")}
                    title={
                        <Reveal animation="fade-up" trigger="load">
                            <h2 id="partners-home-title" className="partners_title">
                                {t("titleStrong")} <span>{t("titleMuted")}</span>
                            </h2>
                        </Reveal>
                    }
                />
            </div>
        </section>
    );
};

export default Partners;
