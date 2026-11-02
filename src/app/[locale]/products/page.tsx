import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import ProductsHero from "@/components/products/ProductsHero/ProductsHero";
import ProductBirth from "@/components/products/ProductBirth/ProductBirth";
import ProductConfigure from "@/components/products/ProductConfigure/ProductConfigure";
import ProductDemo from "@/components/products/ProductDemo/ProductDemo";
import ProductsList from "@/components/products/ProductsList/ProductsList";
import CallToAction from "@/components/solutions/CallToAction/CallToAction";

export const revalidate = 0;

export default function ProductsPage() {
    return (
        <div className="inner-page">
            <Navbar className="inner-nav" />

            <main>
                <ProductsHero />
                <ProductsList />
                <ProductBirth />
                <ProductConfigure />
                <ProductDemo />
                <CallToAction source="contact" />
            </main>

            <Footer />
            <div className="line-pat"></div>
        </div>
    );
}
