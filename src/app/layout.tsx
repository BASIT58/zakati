import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "زكاتي — حاسبة الزكاة بحسب دار الإفتاء المصرية",
    template: "%s | زكاتي",
  },
  description:
    "احسب زكاتك بخطوات واضحة، وكل رقم معه رابط فتوى دار الإفتاء المصرية التي بُني عليها.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <noscript>
          <style>{".reveal{opacity:1;transform:none}"}</style>
        </noscript>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
