import type { ZakatResult, ZakatStatus } from "@/core/types";
import { SourceBadge } from "./SourceBadge";

const toneByStatus: Record<ZakatStatus, string> = {
  due: "border-gold-500 bg-gold-100",
  below_nisab: "border-brand-200 bg-brand-50",
  no_full_year: "border-brand-200 bg-brand-50",
  exempt: "border-brand-200 bg-brand-50",
};

export function ResultSteps({ result }: { result: ZakatResult }) {
  return (
    <section aria-live="polite" className="space-y-8">
      <div className={`animate-pop rounded-2xl border-2 p-6 ${toneByStatus[result.status]}`}>
        <p className="text-sm font-semibold text-brand-700">النتيجة</p>
        <p className="mt-1 text-2xl font-extrabold leading-10 text-brand-900">{result.summary}</p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-brand-800">كيف حسبناها؟</h2>
        <dl className="divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white">
          {result.steps.map((step, index) => (
            <div
              key={`${index}-${step.label}`}
              className="fade-up flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3"
              style={{ animationDelay: `${150 + index * 70}ms` }}
            >
              <dt className="text-ink/80">{step.label}</dt>
              <dd className="font-bold text-brand-800">{step.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-brand-800">المصادر</h2>
        <ul className="space-y-2">
          {result.sources.map((source) => (
            <li key={source.url}>
              <SourceBadge source={source} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink/60">
          آخر مراجعة للقواعد مع دار الإفتاء: <span dir="ltr">{result.lastReviewed}</span>
        </p>
      </div>
    </section>
  );
}
