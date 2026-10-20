import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import ReadinessHero from "@/components/ai-readiness/ReadinessHero/ReadinessHero";
import WhatYouReceive from "@/components/ai-readiness/WhatYouReceive/WhatYouReceive";

export default function AiReadinessPage() {
    return (
        <>
            <Navbar />

            <main>
                <ReadinessHero />
                <WhatYouReceive />
            </main>

            <Footer />
        </>
    );
}
