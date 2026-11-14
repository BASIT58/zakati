import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { SalaryForm } from "./SalaryForm";

export const metadata: Metadata = {
  title: "حاسبة زكاة الراتب والمدّخرات",
  description:
    "احسب زكاة ما ادّخرته من راتبك بحسب فتوى دار الإفتاء: لا زكاة على الراتب نفسه، بل على المدّخر منه بعد الضروريات.",
};

export default function Page() {
  return (
    <Calculator
      title="زكاة الراتب والمدّخرات"
      description="لا تجب الزكاة على الراتب نفسه، وإنما على الجزء الذي بقي منه بعد النفقات الضرورية إذا بلغ النصاب ومرّ عليه حول هجري."
    >
      <SalaryForm />
    </Calculator>
  );
}
