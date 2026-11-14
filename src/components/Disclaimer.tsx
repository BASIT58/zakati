const ZAKAT_SERVICE_URL = "https://www.dar-alifta.org/ar/services/details/8";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <aside
      aria-label="تنبيه"
      className={`rounded-2xl border border-gold-400 bg-gold-100 p-5 text-sm leading-8 ${className}`}
    >
      <p className="font-bold text-gold-600">تنبيه مهم</p>
      <p className="mt-1">
        هذه الحاسبة استرشادية وتعتمد على ما تدخله من أرقام. لحالتك الخاصة أو للشركات، تقدّم دار
        الإفتاء المصرية خدمة «حساب الزكاة» عبر الخط المختصر <span dir="ltr">107</span> أو موقعها
        وتطبيقها.{" "}
        <a
          href={ZAKAT_SERVICE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-700 underline underline-offset-4"
        >
          تفاصيل الخدمة
        </a>
      </p>
    </aside>
  );
}
