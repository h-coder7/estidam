import ProductsListClient from "./ProductsListClient";

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

const ProductsList = () => {
    return <ProductsListClient items={productItems} />;
};

export default ProductsList;
