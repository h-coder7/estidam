import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import ReadinessHero from "@/components/ai-readiness/ReadinessHero/ReadinessHero";
import WhatYouReceive from "@/components/ai-readiness/WhatYouReceive/WhatYouReceive";
import ConnectedDimensions from "@/components/ai-readiness/ConnectedDimensions/ConnectedDimensions";
import HowItWorks from "@/components/ai-readiness/HowItWorks/HowItWorks";
import CallToAction from "@/components/solutions/CallToAction/CallToAction";

export default function AiReadinessPage() {
    return (
        <>
            <Navbar />

            <main>
                <ReadinessHero />
                <WhatYouReceive />
                <ConnectedDimensions />
                <HowItWorks />
                <CallToAction />
            </main>

            <Footer />
        </>
    );
}
