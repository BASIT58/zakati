import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { StocksForm } from "./StocksForm";

export const metadata: Metadata = {
  title: "حاسبة زكاة الأسهم",
  description:
    "احسب زكاة الأسهم بحسب فتاوى دار الإفتاء: أسهم المتاجرة تُزكّى كعروض التجارة، وأسهم الاستثمار في الشركات الإنتاجية الزكاة في ربحها.",
};

export default function Page() {
  return (
    <Calculator
      title="زكاة الأسهم"
      description="نوع السهم يغيّر الحكم: أسهم المتاجرة تُزكّى قيمتها السوقية مع الأرباح، أما أسهم الشركات الصناعية والخدمية والإنتاجية فلا زكاة في أصل السهم، وإنما في الربح."
    >
      <StocksForm />
    </Calculator>
  );
}
