import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import SolutionsHero from "@/components/solutions/SolutionsHero/SolutionsHero";
import Challenges from "@/components/solutions/Challenges/Challenges";
import HowHelps from "@/components/solutions/HowHelps/HowHelps";
import UseCases from "@/components/solutions/UseCases/UseCases";
import DeliveryApproach from "@/components/solutions/DeliveryApproach/DeliveryApproach";
import SystemsIntegrations from "@/components/solutions/SystemsIntegrations/SystemsIntegrations";
import OutcomesIndicators from "@/components/solutions/OutcomesIndicators/OutcomesIndicators";
import RelatedSolutions from "@/components/solutions/RelatedSolutions/RelatedSolutions";
import CallToAction from "@/components/solutions/CallToAction/CallToAction";

export default function SolutionsPage() {
    return (
        <div className="inner-page">
            <Navbar className="inner-nav" />

            <main>
                <SolutionsHero />
                <Challenges />
                <HowHelps />
                <UseCases />
                <DeliveryApproach />
                <SystemsIntegrations />
                <OutcomesIndicators />
                <RelatedSolutions />
                <CallToAction />
            </main>

            <Footer />
            {/* <img src="/images/inner-pattern.png" alt="" className="inner-pattern" /> */}
            <div className="line-pat"></div>
        </div>
    );
}
