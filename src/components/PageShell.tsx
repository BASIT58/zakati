import Link from "next/link";
import type { ReactNode } from "react";

/** Frame for the plain content pages (types, fatwas, about, not-covered). */
export function PageShell({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="مسار التنقل" className="mb-4 text-sm text-brand-700">
        <Link href="/" className="hover:underline">
          الرئيسية
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{title}</span>
      </nav>
      <h1 className="text-3xl font-extrabold text-brand-800">{title}</h1>
      {intro && <p className="mt-2 leading-8 text-ink/80">{intro}</p>}
      <div className="mt-8 space-y-6">{children}</div>
    </div>
  );
}
