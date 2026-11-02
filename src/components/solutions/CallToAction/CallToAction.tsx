import { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/animations/Reveal";
import { getAboutCtaContent } from "@/lib/api/about";
import { getContactCtaContent } from "@/lib/api/contact";
import { Link } from "@/i18n/routing";

import "./_CallToAction.scss";

function CmsLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
    if (/^https?:\/\//i.test(href) || href.startsWith("#")) {
        return (
            <a href={href} className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}

const CallToAction = async ({ source }: { source?: "about" | "contact" }) => {
    const locale = await getLocale();
    const t = await getTranslations("solutionsPage.callToAction");
    const content =
        source === "about"
            ? await getAboutCtaContent(locale)
            : source === "contact"
              ? await getContactCtaContent(locale)
              : null;
    const primaryLabel = content?.primaryLabel || t("primaryCta");
    const primaryHref = content?.primaryHref || "#";
    const secondaryLabel = content?.secondaryLabel || (source === "contact" ? "" : t("secondaryCta"));
    const secondaryHref = content?.secondaryHref || "#";
    const description = source === "contact" && content ? content.description : t("description");

    return (
        <section className="solutions_call_to_action" id="call-to-action">
            <img src="/images/call-action-pattern.png" alt="" className="lines" />
            <div className="container">
                <div className="call_to_action_inner">
                    <Reveal animation="fade-up" trigger="load">
                        <span className="call_to_action_badge">{t("badge")}</span>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <h2 className="call_to_action_title fsz-40 fw-600 lh-2">
                            {content ? (
                                <>
                                    {content.titleBefore ? <span>{content.titleBefore}</span> : null}
                                    {content.titleBefore && content.titleAccent ? " " : null}
                                    {content.titleAccent ? (
                                        <span className="call_to_action_title_accent">{content.titleAccent}</span>
                                    ) : null}
                                    {content.titleAfter ? <span> {content.titleAfter}</span> : null}
                                </>
                            ) : (
                                t("title")
                            )}
                        </h2>
                    </Reveal>

                    <Reveal animation="fade-up" trigger="load">
                        <p className="call_to_action_description mb-0">{description}</p>
                    </Reveal>

                    <div className="call_to_action_actions mt-5">
                        <Reveal animation="fade-up" trigger="load">
                            <CmsLink href={primaryHref} className="butn butn-blue">
                                <span>{primaryLabel}</span>
                                <img
                                    src="/images/icons/arrow-wh.svg"
                                    alt=""
                                    className="butn-icon"
                                    aria-hidden="true"
                                />
                            </CmsLink>
                        </Reveal>

                        {secondaryLabel ? (
                            <Reveal animation="fade-up" trigger="load">
                                <CmsLink href={secondaryHref} className="butn butn-ghost border-wh-2">
                                    <span>{secondaryLabel}</span>
                                    <img
                                        src="/images/icons/arrow-bl.svg"
                                        alt=""
                                        className="butn-icon"
                                        aria-hidden="true"
                                    />
                                </CmsLink>
                            </Reveal>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
