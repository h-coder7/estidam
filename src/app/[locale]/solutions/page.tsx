import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import SolutionsHero from "@/components/solutions/SolutionsHero/SolutionsHero";

export default function SolutionsPage() {
    return (
        <div className="inner-page">
            <Navbar className="inner-nav" />

            <main>
                <SolutionsHero />
            </main>

            <Footer />
            <img src="/images/inner-pattern.png" alt="" className="inner-pattern" />
        </div>
    );
}
