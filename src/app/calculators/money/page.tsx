import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { MoneyForm } from "./MoneyForm";

export const metadata: Metadata = {
  title: "حاسبة زكاة المال",
  description:
    "احسب زكاة مدّخراتك وأرصدتك البنكية بحسب فتاوى دار الإفتاء المصرية: النصاب 85 جرامًا من الذهب عيار 21 والنسبة 2.5%.",
};

export default function Page() {
  return (
    <Calculator
      title="زكاة المال"
      description="تجب الزكاة في المال إذا بلغ النصاب ومرّ عليه حول هجري كامل وكان خاليًا من الدين وفائضًا عن الحاجات الأصلية. أدخل أرقامك ونوضّح لك الحساب خطوة بخطوة."
    >
      <MoneyForm />
    </Calculator>
  );
}
