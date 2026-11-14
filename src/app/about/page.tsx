import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "عن زكاتي",
  description: "كيف نعمل، وما حدود هذا الموقع، وكيف نتحقق من الأحكام.",
};

const sections = [
  {
    title: "ما هو زكاتي؟",
    text: "موقع عربي مستقل يساعدك على حساب زكاتك بحسب فتاوى دار الإفتاء المصرية، ويعرض لك الخطوات والمصدر مع كل نتيجة.",
  },
  {
    title: "كيف نتحقق؟",
    text: "نقرأ الفتاوى من موقع دار الإفتاء ونكتب الحكم بصياغتنا، ونضع رابط الأصل. كل حاسبة مكتوبة كدوال منفصلة عليها اختبارات آلية، وتاريخ آخر مراجعة ظاهر مع كل نتيجة.",
  },
  {
    title: "ما لا نفعله",
    text: "لا نحسب نوعًا لم نتأكد من حكمه تأكدًا كافيًا. نقول ذلك صراحة ونحيلك إلى الدار. ولا نزعم أن الموقع تابع لدار الإفتاء أو معتمد منها.",
  },
  {
    title: "سعر الذهب",
    text: "تكتب أنت سعر جرام الذهب عيار 21 بنفسك من مصدر تثق به، لأن النصاب يتغير يوميًا بتغير السعر.",
  },
];

export default function AboutPage() {
  return (
    <PageShell title="عن زكاتي">
      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="text-xl font-bold text-brand-800">{s.title}</h2>
          <p className="mt-2 leading-8 text-ink/85">{s.text}</p>
        </section>
      ))}
      <Disclaimer className="mt-4" />
    </PageShell>
  );
}
