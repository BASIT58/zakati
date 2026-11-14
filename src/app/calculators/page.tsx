import type { Metadata } from "next";
import { CalculatorCarousel } from "@/components/CalculatorCarousel";
import { PageShell } from "@/components/PageShell";
import { calculators } from "@/data/calculators";

export const metadata: Metadata = {
  title: "احسب زكاتك",
  description: "اختر نوع الزكاة الذي تريد حسابه: المال، الذهب والفضة، التجارة، الأسهم، العقارات، الرواتب، الديون، الفطر.",
};

export default function CalculatorsIndexPage() {
  return (
    <PageShell title="احسب زكاتك" intro="اختر نوع الزكاة من البطاقات ثم اضغط «احسب الآن». مرّر البطاقات بالسهمين أو بالسحب على الهاتف.">
      <CalculatorCarousel items={calculators} />
    </PageShell>
  );
}
