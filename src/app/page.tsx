import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { calculators } from "@/data/calculators";

const promises = [
  {
    title: "كل رقم له مصدر",
    text: "النصاب والنسب مأخوذة من فتاوى دار الإفتاء المصرية، وبجانب كل نتيجة رابط الفتوى لتراجعها بنفسك.",
  },
  {
    title: "نعرض لك الخطوات",
    text: "لا نعطيك رقمًا نهائيًا فقط، بل نوضّح كيف وصلنا إليه خطوة بخطوة.",
  },
  {
    title: "نقول لك حين لا نعرف",
    text: "الأنواع التي لم نتأكد منها بعد لا نحسبها، ونحيلك إلى دار الإفتاء مباشرة.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="relative isolate py-14 text-center sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="blob absolute -top-16 start-[6%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.28),transparent_70%)]" />
          <div className="blob absolute top-24 end-[4%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(19,107,67,0.22),transparent_70%)] [animation-delay:-4s]" />
        </div>
        <h1 className="fade-up text-4xl font-extrabold text-brand-800 sm:text-6xl">
          احسب زكاتك بثقة
        </h1>
        <p className="fade-up mx-auto mt-4 max-w-2xl text-lg leading-9 text-ink/80" style={{ animationDelay: "120ms" }}>
          حاسبة زكاة مبنية على فتاوى دار الإفتاء المصرية، تعرض لك الخطوات والمصدر مع كل نتيجة.
        </p>
        <Link
          href="/calculators"
          className="fade-up mt-8 inline-block rounded-full bg-brand-700 px-8 py-3 text-lg font-bold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          style={{ animationDelay: "240ms" }}
        >
          احسب زكاتك الآن
        </Link>
      </section>

      <section aria-labelledby="calculators-heading" className="pb-12">
        <h2 id="calculators-heading" className="mb-6 text-2xl font-extrabold text-brand-800">
          الحاسبات
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {calculators.map((item, i) => (
            <li key={item.slug}>
              <Reveal delay={(i % 2) * 80} className="h-full">
              <Link
                href={`/calculators/${item.slug}`}
                className="block h-full rounded-2xl border-2 border-brand-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-600 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <span aria-hidden="true" className="text-2xl">{item.icon} </span>
                <span className="text-xl font-bold text-brand-800">{item.title}</span>
                <span className="mt-1 block text-ink/70">{item.description}</span>
              </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-ink/70">
          أنواع أخرى (الأنعام والزروع والركاز) لم نضف لها حاسبة بعد.{" "}
          <Link href="/not-covered" className="font-semibold text-brand-700 underline underline-offset-4">
            التفاصيل
          </Link>
        </p>
      </section>

      <section aria-labelledby="trust-heading" className="pb-8">
        <h2 id="trust-heading" className="mb-6 text-2xl font-extrabold text-brand-800">
          لماذا تثق بنا؟
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {promises.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 120} className="h-full">
                <div className="h-full rounded-2xl border border-brand-100 bg-brand-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <h3 className="text-lg font-bold text-brand-800">{item.title}</h3>
                  <p className="mt-2 leading-8 text-ink/80">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
