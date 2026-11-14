import type { SourceRef } from "@/core/types";

export function SourceBadge({ source }: { source: SourceRef }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-brand-100 bg-white px-4 py-3 transition hover:border-brand-600"
    >
      <span className="block text-xs font-semibold text-brand-600">
        دار الإفتاء المصرية
        {source.fatwaNo ? ` — فتوى رقم ${source.fatwaNo}` : ""}
      </span>
      <span className="mt-1 block leading-7 text-ink">{source.title}</span>
    </a>
  );
}
