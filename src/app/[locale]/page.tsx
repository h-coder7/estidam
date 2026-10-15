import Hero from "@/components/home/Hero/Hero";
import WhyEstidam from "@/components/home/WhyEstidam/WhyEstidam";
import HajjJourney from "@/components/home/HajjJourney/HajjJourney";
import Solutions from "@/components/home/Solutions/Solutions";
import Operations from "@/components/home/Operations/Operations";
import Products from "@/components/home/Products/Products";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <WhyEstidam />
                <HajjJourney />
                <Solutions />
                <Operations />
                <Products />
            </main>

            <Footer />
        </>
    );
}
