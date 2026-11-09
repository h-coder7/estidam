import { notFound } from "next/navigation";
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
import { SOLUTION_DETAIL_SLUG } from "@/components/solutions/solutionRoutes";

export const revalidate = 300;

export function generateStaticParams() {
    return [{ slug: SOLUTION_DETAIL_SLUG }];
}

export default async function SolutionDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (slug !== SOLUTION_DETAIL_SLUG) {
        notFound();
    }

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
            <div className="line-pat"></div>
        </div>
    );
}
