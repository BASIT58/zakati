"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/types", label: "الأنواع" },
  { href: "/fatwas", label: "الفتاوى" },
  { href: "/about", label: "عن الموقع" },
  { href: "/calculators", label: "احسب زكاتك" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={44} height={44} priority className="h-11 w-11 object-contain" />
          <span className="text-2xl font-extrabold text-brand-700">زكاتي</span>
        </Link>

        <nav aria-label="القائمة الرئيسية" className="flex flex-wrap items-center gap-1 text-sm font-semibold sm:gap-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const style = active
              ? "bg-brand-700 text-white"
              : "text-ink hover:bg-brand-50";
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-600/40 sm:px-4 ${style}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
