import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { TradeForm } from "./TradeForm";

export const metadata: Metadata = {
  title: "حاسبة زكاة عروض التجارة",
  description:
    "احسب زكاة البضاعة المعدّة للبيع: تقويم البضاعة بسعر السوق آخر الحول ثم إخراج 2.5% بحسب فتاوى دار الإفتاء.",
};

export default function Page() {
  return (
    <Calculator
      title="زكاة عروض التجارة"
      description="التاجر يقوّم بضاعته آخر الحول بسعر السوق، ويضيف النقد والديون المرجوّة، ويخصم ما عليه من ديون، ثم يخرج ربع العشر إن بلغ النصاب."
    >
      <TradeForm />
    </Calculator>
  );
}
