import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 text-sm leading-7">
        <p className="text-lg font-bold text-white">زكاتي</p>
        <p>
          موقع مستقل لحساب الزكاة، مبني على فتاوى وبيانات دار الإفتاء المصرية. الموقع لا يتبع دار
          الإفتاء ولا يتحدث باسمها.
        </p>
        <nav aria-label="روابط التذييل" className="flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/types" className="hover:text-white">أنواع الزكاة</Link>
          <Link href="/fatwas" className="hover:text-white">الفتاوى والمصادر</Link>
          <Link href="/not-covered" className="hover:text-white">أنواع لم نغطّها</Link>
          <Link href="/about" className="hover:text-white">عن زكاتي</Link>
        </nav>
        <p>
          للفتوى الرسمية في حالتك الخاصة:{" "}
          <a
            href="https://www.dar-alifta.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gold-400 underline underline-offset-4"
          >
            موقع دار الإفتاء المصرية
          </a>{" "}
          أو الخط المختصر <span dir="ltr">107</span>.
        </p>
      </div>
    </footer>
  );
}
