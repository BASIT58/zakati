import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { GoldSilverForm } from "./GoldSilverForm";

export const metadata: Metadata = {
  title: "حاسبة زكاة الذهب والفضة",
  description:
    "احسب زكاة الذهب والفضة المدّخرين: نصاب الذهب 85 جرامًا عيار 21 ونصاب الفضة 595 جرامًا، والحلي للزينة لا زكاة فيه.",
};

export default function Page() {
  return (
    <Calculator
      title="زكاة الذهب والفضة"
      description="الذهب أو الفضة المدّخر يُزكّى إذا بلغ النصاب ومرّ عليه حول هجري كامل، أما الحلي المتّخذ للزينة بحسب عُرف صاحبه فلا زكاة فيه. نحوّل العيارات إلى ما يعادل عيار 21."
    >
      <GoldSilverForm />
    </Calculator>
  );
}
