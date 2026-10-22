import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import ProductCard from "@/components/products/ProductCard/ProductCard";
import { productItems } from "@/components/products/ProductsList/ProductsList";

export function generateStaticParams() {
    return productItems.map((product) => ({ slug: product.id }));
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const index = productItems.findIndex((item) => item.id === slug);
    const product = productItems[index];

    if (!product) {
        notFound();
    }

    return (
        <div className="inner-page">
            <Navbar className="inner-nav" />

            <main>
                <section className="productSingle">
                    <div className="container">
                        <div className="content px-lg-4">
                            <ProductCard product={product} index={index} items={productItems} />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <div className="line-pat"></div>
        </div>
    );
}
