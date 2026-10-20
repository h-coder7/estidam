import { getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";

import "./_WhatYouReceive.scss";

const WhatYouReceive = async () => {
    const t = await getTranslations("aiReadinessPage.whatYouReceive");

    const cards = [
        { key: "card1", number: "01" },
        { key: "card2", number: "02" },
        { key: "card3", number: "03" },
        { key: "card4", number: "04" },
        { key: "card5", number: "05" },
    ] as const;

    return (
        <section className="readiness_what_you_receive" id="what-you-receive">
            <div className="container">
                <div className="what_you_receive_head">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="what_you_receive_badge">{t("badge")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="what_you_receive_title">
                            <span className="what_you_receive_title_strong">
                                {t("titleStrong")}
                            </span>
                            <span className="what_you_receive_title_muted">
                                {t("titleMuted")}
                            </span>
                        </h2>
                    </Reveal>
                </div>

                <div className="what_you_receive_body">
                    <div className="row gx-0 gy-3 align-items-end">
                        {cards.map((card) => (
                            <div key={card.key} className="col-xl col-md-4 col-sm-6">
                                <Reveal animation="fade-up" trigger="load">
                                    <article className="receive_card">
                                        <span className="receive_card_num">{card.number}</span>
                                        <h3 className="receive_card_title mb-0">{t(card.key)}</h3>
                                    </article>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatYouReceive;
