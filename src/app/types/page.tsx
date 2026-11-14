import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { calculators } from "@/data/calculators";

export const metadata: Metadata = {
  title: "أنواع الزكاة",
  description: "أنواع الزكاة التي نحسبها في زكاتي، وما الذي ننتظر التأكد منه قبل إضافته.",
};

const basics = [
  "بلوغ النصاب: قيمة 85 جرامًا من الذهب عيار 21 بسعر يوم إخراج الزكاة.",
  "مرور حول هجري كامل على المال.",
  "الخلو من الدين.",
  "أن يكون المال زائدًا عن الحاجات الأصلية لصاحبه ولمن يعولهم (المسكن والمركب الخاص لا يدخلان).",
];

export default function TypesPage() {
  return (
    <PageShell
      title="أنواع الزكاة"
      intro="هذه الأنواع التي نوفّر لها حاسبة. لكل نوع صفحة توضّح الحكم وتعرض الخطوات والمصدر."
    >
      <section className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
        <h2 className="text-lg font-bold text-brand-800">شروط وجوب زكاة المال عمومًا</h2>
        <ul className="mt-3 list-disc space-y-2 pe-5 leading-8">
          {basics.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 leading-8">النسبة ربع العشر (2.5%) في المال والذهب والفضة وعروض التجارة.</p>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2">
        {calculators.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/calculators/${item.slug}`}
              className="block h-full rounded-2xl border-2 border-brand-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-600 hover:shadow-lg"
            >
              <span className="text-xl font-bold text-brand-800">{item.title}</span>
              <span className="mt-1 block text-ink/70">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="leading-8">
        هناك أنواع لم نضف لها حاسبة بعد، مثل زكاة الأنعام والزروع والركاز.{" "}
        <Link href="/not-covered" className="font-semibold text-brand-700 underline underline-offset-4">
          اعرف السبب وأين تحسبها
        </Link>
        .
      </p>
    </PageShell>
  );
}
