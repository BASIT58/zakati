import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SourceBadge } from "@/components/SourceBadge";
import fitr from "@/data/fitr.json";
import rules from "@/data/rules.json";

export const metadata: Metadata = {
  title: "الفتاوى والمصادر",
  description: "روابط فتاوى دار الإفتاء المصرية التي نعتمد عليها في الحاسبات، لتراجعها بنفسك.",
};

const sources = Object.values(rules.sources);

export default function FatwasPage() {
  return (
    <PageShell
      title="الفتاوى والمصادر"
      intro="هذه كل الصفحات التي نعتمد عليها من دار الإفتاء المصرية. نكتب الأحكام بصياغتنا ونضع لك الرابط لتقرأ الأصل بنفسك."
    >
      <ul className="space-y-3">
        {sources.map((source) => (
          <li key={source.url}>
            <SourceBadge source={source} />
            {!source.verified && (
              <p className="mt-1 ps-1 text-xs text-ink/60">
                قرأنا عنوان هذه الصفحة لكن لم نراجع رقم الفتوى فيها بعد؛ تأكد من الرقم من الرابط.
              </p>
            )}
          </li>
        ))}
        <li>
          <SourceBadge source={fitr.source} />
        </li>
      </ul>

      <p className="text-sm leading-7 text-ink/70">
        آخر مراجعة للقواعد: <span dir="ltr">{rules.meta.lastReviewed}</span>. إن وجدت فرقًا بين ما نكتبه وما في
        الفتوى، فالفتوى هي المرجع.
      </p>
    </PageShell>
  );
}
