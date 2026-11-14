import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { DebtsForm } from "./DebtsForm";

export const metadata: Metadata = {
  title: "حاسبة زكاة الديون",
  description:
    "احسب زكاة المال الذي أقرضته للناس بعد قبضه بحسب فتوى مفتي الجمهورية: زكاة سنة واحدة بعد القبض.",
};

export default function Page() {
  return (
    <Calculator
      title="زكاة الديون"
      description="المقرِض يزكّي المال الذي أقرضه بعد أن يقبضه، لسنة واحدة فقط ولو بقي عند المدين سنوات، أما المقترِض فلا زكاة عليه في المال الذي اقترضه."
    >
      <DebtsForm />
    </Calculator>
  );
}
