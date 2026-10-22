import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import AboutHero from "@/components/about/AboutHero/AboutHero";
import AboutStats from "@/components/about/AboutStats/AboutStats";
import AboutApproach from "@/components/about/AboutApproach/AboutApproach";
import AboutJourney from "@/components/about/AboutJourney/AboutJourney";
import AboutStudio from "@/components/about/AboutStudio/AboutStudio";
import AboutLogos from "@/components/about/AboutLogos/AboutLogos";
import HowWeDeliver from "@/components/home/HowWeDeliver/HowWeDeliver";
import CallToAction from "@/components/solutions/CallToAction/CallToAction";

export default function AboutPage() {
    return (
        <div className="inner-page">
            <Navbar className="inner-nav" />

            <main>
                <AboutHero />
                <AboutStats />
                <AboutApproach />
                <AboutJourney />
                <HowWeDeliver />
                <AboutStudio />
                <AboutLogos />
                <CallToAction />
            </main>

            <Footer />
            <div className="line-pat"></div>
        </div>
    );
}
