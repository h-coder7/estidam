import { getLocale, getTranslations } from "next-intl/server";
import { getProductsListCards, getProductsListContent, type ProductsListCard } from "@/lib/api/productsPage";
import ProductsListClient from "./ProductsListClient";
import type { ProductCardView } from "@/components/products/ProductCard/ProductCard";

import "./_ProductsList.scss";

export const productItems = [
    {
        id: "hrh",
        status: "available",
        image: "/images/products/hrh.png",
    },
    {
        id: "mayar",
        status: "available",
        image: "/images/products/mayar2.png",
        reversed: true,
    },
    {
        id: "maydan",
        status: "soon",
        image: "/images/products/maydan.png",
        notify: true,
    },
] as const;

export type ProductItem = (typeof productItems)[number];

const copyIds: Record<string, "hrh" | "mayar" | "maydan"> = {
    hrh: "hrh",
    miyar: "mayar",
    mayar: "mayar",
    maydan: "maydan",
};

const ProductsList = async () => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.list");
    const content = await getProductsListContent(locale);
    const cards = await getProductsListCards(locale);

    const view: ProductCardView[] = cards.length
        ? cards.map((card, index) => toView(card, index, t))
        : productItems.map((item, index) => ({
              id: item.id,
              status: item.status,
              image: item.image,
              reversed: "reversed" in item && item.reversed,
              notify: "notify" in item && item.notify,
              name: t(`items.${item.id}.name`),
              kicker: t(`items.${item.id}.kicker`),
              headline: t(`items.${item.id}.headline`),
              problem: t(`items.${item.id}.problem`),
              users: t(`items.${item.id}.users`),
              capabilities: t.raw(`items.${item.id}.capabilities`) as string[],
              primaryLabel: t(`items.${item.id}.primary`),
              primaryHref: `/products/${item.id}`,
              secondaryLabel: t(`items.${item.id}.secondary`),
              secondaryHref: "notify" in item && item.notify ? "#" : "#product-demo",
          }));

    return (
        <ProductsListClient
            badge={content?.eyebrow || t("badge")}
            titleStrong={content ? content.titleStrong : t("titleStrong")}
            titleMuted={content ? content.titleMuted : t("titleMuted")}
            showFilter={content ? content.showFilter : true}
            filters={[
                { id: "all", label: t("filterAll") },
                { id: "available", label: t("filterAvailable") },
                { id: "soon", label: t("filterSoon") },
            ]}
            labels={{
                problem: t("problem"),
                users: t("users"),
                capabilities: t("capabilities"),
                statusAvailable: t("statusAvailable"),
                statusSoon: t("statusSoon"),
            }}
            cards={view}
        />
    );
};

function toView(
    card: ProductsListCard,
    index: number,
    t: Awaited<ReturnType<typeof getTranslations>>,
): ProductCardView {
    const copyId = copyIds[card.id] || "hrh";
    const soon = card.status === "soon";

    return {
        id: card.id,
        status: card.status,
        image: card.image,
        reversed: index % 2 === 1,
        notify: soon,
        name: card.name,
        kicker: card.kicker,
        headline: card.headline,
        problem: card.problem,
        users: card.users,
        capabilities: card.capabilities,
        primaryLabel: t(`items.${copyId}.primary`),
        primaryHref: `/products/${card.pageSlug || card.id}`,
        secondaryLabel: soon ? card.notifyLabel || t(`items.${copyId}.secondary`) : t(`items.${copyId}.secondary`),
        secondaryHref: soon ? "#" : "#product-demo",
    };
}

export default ProductsList;
