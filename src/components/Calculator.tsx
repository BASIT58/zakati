import Link from "next/link";
import type { ReactNode } from "react";
import { Disclaimer } from "./Disclaimer";

interface CalculatorProps {
  title: string;
  description: string;
  children: ReactNode;
}

/** The shared page frame for every calculator: breadcrumb, title, intro, the form, and the disclaimer. */
export function Calculator({ title, description, children }: CalculatorProps) {
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
      <p className="mt-2 leading-8 text-ink/80">{description}</p>

      <div className="mt-8">{children}</div>

      <Disclaimer className="mt-10" />
    </div>
  );
}
