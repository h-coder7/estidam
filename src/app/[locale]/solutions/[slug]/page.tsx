import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
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
import { api } from "@/lib/api";
import { getSolutionDetail } from "@/lib/api/solutionDetail";

export const revalidate = 300;

export async function generateStaticParams() {
    try {
        const payload = await api.getSolutions("en");
        const data = (payload as { data?: unknown })?.data;
        const items = Array.isArray(data) ? data : [];

        return items.flatMap((item) => {
            const slug = item && typeof item === "object" ? String((item as { slug?: unknown }).slug || "").trim() : "";
            return slug ? [{ slug }] : [];
        });
    } catch {
        return [];
    }
}

export default async function SolutionDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const locale = await getLocale();
    const solution = await getSolutionDetail(locale, slug);

    if (!solution) {
        notFound();
    }

    return (
        <div className="inner-page">
            <Navbar className="inner-nav" />

            <main>
                <SolutionsHero hero={solution.hero} />
                <Challenges items={solution.challenges} />
                <HowHelps items={solution.helps} />
                <UseCases items={solution.useCases} />
                <DeliveryApproach delivery={solution.delivery} />
                <SystemsIntegrations systems={solution.systems} />
                <OutcomesIndicators items={solution.outcomes} />
                <RelatedSolutions items={solution.related} />
                <CallToAction source="about" />
            </main>

            <Footer />
            <div className="line-pat"></div>
        </div>
    );
}
