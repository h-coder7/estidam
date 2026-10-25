import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import ProductAi from "@/components/product/ProductAi/ProductAi";
import ProductUseCases from "@/components/product/ProductUseCases/ProductUseCases";
import ProductNext from "@/components/product/ProductNext/ProductNext";
import ProductRelated from "@/components/product/ProductRelated/ProductRelated";
import ProductOutcomes from "@/components/product/ProductOutcomes/ProductOutcomes";
import ProductIntegrations from "@/components/product/ProductIntegrations/ProductIntegrations";
import ProductWorks from "@/components/product/ProductWorks/ProductWorks";
import ProductCapabilities from "@/components/product/ProductCapabilities/ProductCapabilities";
import ProductChallenges from "@/components/product/ProductChallenges/ProductChallenges";
import ProductDetailHero from "@/components/product/ProductDetailHero/ProductDetailHero";
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
                <ProductDetailHero productId={product.id} />
                <ProductChallenges />
                <ProductCapabilities />
                <ProductAi />
                <ProductUseCases />
                <ProductWorks />
                <ProductIntegrations />
                <ProductOutcomes />
                <ProductRelated />
                <ProductNext />
            </main>

            <Footer />
            <div className="line-pat"></div>
        </div>
    );
}
