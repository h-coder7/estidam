import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import Assessment from "@/components/ai-readiness/Assessment/Assessment";

export const revalidate = 300;

export default function AiReadinessAssessmentPage() {
    return (
        <>
            <Navbar className="inner-nav" />

            <main>
                <Assessment />
            </main>

            <Footer />
        </>
    );
}
