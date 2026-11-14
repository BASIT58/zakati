import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import rules from "@/data/rules.json";

export const metadata: Metadata = {
  title: "أنواع لم نغطّها بعد",
  description: "أنواع زكاة لم نضف لها حاسبة لأننا لم نتأكد منها بما يكفي، وأين تحسبها.",
};

const items = [
  {
    title: "زكاة الأنعام (الإبل والبقر والغنم)",
    text: "تعتمد على جداول شرائح وأعمار حيوانات، ولم نجد الجداول كاملة في صفحات دار الإفتاء نفسها لنعتمدها.",
  },
  {
    title: "زكاة الزروع والثمار",
    text: "نصابها خمسة أوسق (خمسون كيلة)، لكننا لم نجد تحويلًا رسميًا للكيلة إلى كيلوجرامات، ولا نريد أن نعطيك رقمًا تقريبيًا.",
  },
  {
    title: "الركاز والمعادن",
    text: "في الركاز الخمس (20%) ويُصرف في مصارف الزكاة، وللآثار المدفونة في أرض مصر حكم قانوني خاص. ولم نجد موقف الدار من المعادن المستخرجة.",
  },
];

export default function NotCoveredPage() {
  return (
    <PageShell
      title="أنواع لم نغطّها بعد"
      intro="نفضّل ألا نحسب شيئًا على أن نعطيك رقمًا لسنا واثقين منه. هذه الأنواع سنضيفها حين نتأكد من أحكامها وأرقامها."
    >
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.title} className="rounded-2xl border border-brand-100 bg-white p-5">
            <h2 className="text-lg font-bold text-brand-800">{item.title}</h2>
            <p className="mt-2 leading-8 text-ink/80">{item.text}</p>
          </li>
        ))}
      </ul>

      <section className="rounded-2xl border-2 border-gold-500 bg-gold-100 p-5">
        <h2 className="text-lg font-bold text-brand-900">أين تحسبها الآن؟</h2>
        <p className="mt-2 leading-8">
          لدى دار الإفتاء خدمة رسمية لحساب الزكاة، يمكنك الوصول إليها من{" "}
          <a
            href={rules.sources.service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-800 underline underline-offset-4"
          >
            صفحة الخدمة
          </a>{" "}
          أو بالاتصال على <span dir="ltr">107</span>.
        </p>
      </section>
    </PageShell>
  );
}
