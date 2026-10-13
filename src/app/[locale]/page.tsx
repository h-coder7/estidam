import Hero from "@/components/home/Hero/Hero";
import WhyEstidam from "@/components/home/WhyEstidam/WhyEstidam";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <WhyEstidam />
            </main>

            <Footer />
        </>
    );
}
