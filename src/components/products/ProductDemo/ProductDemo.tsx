import { getLocale, getTranslations } from "next-intl/server";
import { getProductsDemoContent, getProductsListCards } from "@/lib/api/productsPage";
import ProductDemoForm, { type ProductDemoOption } from "./ProductDemoForm";

import "./_ProductDemo.scss";

const fallbackIds = ["hrh", "mayar", "maydan"] as const;

const ProductDemo = async () => {
    const locale = await getLocale();
    const t = await getTranslations("productsPage.demo");
    const content = await getProductsDemoContent(locale);
    const cards = await getProductsListCards(locale);
    const products: ProductDemoOption[] = cards.length
        ? cards.map((card) => ({ id: card.id, label: card.name }))
        : fallbackIds.map((id) => ({ id, label: t(`products.${id}`) }));
    const points =
        content && content.points.length
            ? content.points
            : [t("point1"), t("point2"), t("point3")];

    return (
        <ProductDemoForm
            badge={content?.eyebrow || t("badge")}
            titleBefore={content ? content.titleBefore : t("title1")}
            titleAccent={content ? content.titleAccent : t("title2")}
            titleAfter={content ? content.titleAfter : t("title3")}
            description={content?.description || t("text")}
            points={points}
            products={products}
        />
    );
};

export default ProductDemo;
