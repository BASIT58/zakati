export interface CalculatorInfo {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

/** Every calculator on the site. Home page, header menu and "types" page read from this list. */
export const calculators: CalculatorInfo[] = [
  { slug: "money", icon: "💰", title: "زكاة المال", description: "المدّخرات والأرصدة البنكية والودائع." },
  { slug: "gold-silver", icon: "🪙", title: "الذهب والفضة", description: "الذهب والفضة المدّخرَين، والحلي." },
  { slug: "trade", icon: "🏪", title: "عروض التجارة", description: "البضاعة المعدّة للبيع." },
  { slug: "stocks", icon: "📈", title: "الأسهم والاستثمارات", description: "أسهم المتاجرة وأسهم الاستثمار." },
  { slug: "rental", icon: "🏢", title: "العقارات المؤجرة", description: "زكاة إيراد العقار المؤجر." },
  { slug: "salary", icon: "💼", title: "الرواتب والمدّخرات", description: "الزكاة على ما تدّخره من راتبك." },
  { slug: "debts", icon: "🤝", title: "الديون", description: "زكاة المال الذي أقرضته للناس." },
  { slug: "fitr", icon: "🌙", title: "زكاة الفطر", description: "قيمة زكاة الفطر المعتمدة هذا العام." },
];
