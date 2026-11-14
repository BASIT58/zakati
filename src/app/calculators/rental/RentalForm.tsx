"use client";

import { useState } from "react";
import { FormFrame, GoldPriceField, TextField, YesNoField, FULL_YEAR_LEGEND, requireAnswer } from "@/components/fields";
import { calculateRentalZakat } from "@/core/calculators/rental";

export function RentalForm() {
  const [income, setIncome] = useState("");
  const [other, setOther] = useState("");
  const [debts, setDebts] = useState("");
  const [gold, setGold] = useState("");
  const [year, setYear] = useState<boolean | null>(null);

  return (
    <FormFrame
      onReset={() => {
        setIncome("");
        setOther("");
        setDebts("");
        setGold("");
        setYear(null);
      }}
      compute={() =>
        calculateRentalZakat({
          rentalIncome: income,
          otherCash: other,
          debts,
          goldPrice21: gold,
          fullYearPassed: requireAnswer(year, "اختر إجابة: هل مرّ على المال حول هجري كامل؟"),
        })
      }
    >
      <TextField
        id="income"
        label="إيراد الإيجار المدّخر (بالجنيه)"
        hint="ما تبقّى من الإيجار بعد نفقاتك الضرورية. هذه الحاسبة للعقار المؤجر، أما العقار المعدّ للبيع فيُحسب في حاسبة عروض التجارة."
        value={income}
        onChange={setIncome}
        placeholder="مثال: 300000"
      />
      <TextField
        id="other"
        label="أموالك السائلة الأخرى (اختياري)"
        hint="يُضم الإيراد إلى بقية مالك السائل عند النظر في بلوغ النصاب."
        value={other}
        onChange={setOther}
      />
      <TextField id="debts" label="ديون عليك مستحقة الآن (اختياري)" value={debts} onChange={setDebts} />
      <GoldPriceField value={gold} onChange={setGold} />
      <YesNoField name="year" legend={FULL_YEAR_LEGEND} value={year} onChange={setYear} />
    </FormFrame>
  );
}
