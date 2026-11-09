import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import CallToAction from "@/components/solutions/CallToAction/CallToAction";
import SolutionsIndex from "@/components/solutions/SolutionsIndex/SolutionsIndex";

export const revalidate = 300;

export default function SolutionsPage() {
    return (
        <div className="inner-page">
            <Navbar className="inner-nav" />

            <main>
                <SolutionsIndex />
                <CallToAction />
            </main>

            <Footer />
            <div className="line-pat"></div>
        </div>
    );
}
