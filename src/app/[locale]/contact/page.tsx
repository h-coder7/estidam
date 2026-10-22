import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import ContactHero from "@/components/contact/ContactHero/ContactHero";
import ContactHelp from "@/components/contact/ContactHelp/ContactHelp";
import ContactDirect from "@/components/contact/ContactDirect/ContactDirect";
import ContactFaq from "@/components/contact/ContactFaq/ContactFaq";
import CallToAction from "@/components/solutions/CallToAction/CallToAction";

export default function ContactPage() {
    return (
        <div className="inner-page">
            <Navbar className="inner-nav" />

            <main>
                <ContactHero />
                <ContactHelp />
                <ContactDirect />
                <ContactFaq />
                <CallToAction />
            </main>

            <Footer />
            <div className="line-pat"></div>
        </div>
    );
}
