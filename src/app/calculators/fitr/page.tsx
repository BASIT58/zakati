import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { FitrForm } from "./FitrForm";

export const metadata: Metadata = {
  title: "حاسبة زكاة الفطر",
  description:
    "احسب زكاة الفطر عن أفراد أسرتك بالقيمة المعلنة من دار الإفتاء المصرية لهذا العام.",
};

export default function Page() {
  return (
    <Calculator
      title="زكاة الفطر"
      description="زكاة الفطر مبلغ ثابت عن كل فرد تعلنه دار الإفتاء كل عام كحد أدنى، ويُستحب الزيادة. اكتب عدد من تُخرج عنهم."
    >
      <FitrForm />
    </Calculator>
  );
}
