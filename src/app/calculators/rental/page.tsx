import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { RentalForm } from "./RentalForm";

export const metadata: Metadata = {
  title: "حاسبة زكاة العقارات المؤجرة",
  description:
    "احسب زكاة إيراد العقار المؤجر بحسب فتوى دار الإفتاء: لا زكاة في العقار نفسه والزكاة في الإيراد مع بقية مالك السائل.",
};

export default function Page() {
  return (
    <Calculator
      title="زكاة العقارات المؤجرة"
      description="العقار المؤجر لا زكاة في ذاته، وإنما تجب الزكاة في إيراده إذا بلغ مع مالك السائل النصاب ومرّ عليه حول هجري كامل."
    >
      <RentalForm />
    </Calculator>
  );
}
