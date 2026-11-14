"use client";

import { useState } from "react";
import { FormFrame, GoldPriceField, TextField, YesNoField, FULL_YEAR_LEGEND, requireAnswer } from "@/components/fields";
import { calculateMoneyZakat } from "@/core/calculators/money";

export function MoneyForm() {
  const [cash, setCash] = useState("");
  const [debts, setDebts] = useState("");
  const [gold, setGold] = useState("");
  const [year, setYear] = useState<boolean | null>(null);

  return (
    <FormFrame
      onReset={() => {
        setCash("");
        setDebts("");
        setGold("");
        setYear(null);
      }}
      compute={() =>
        calculateMoneyZakat({
          cash,
          debts,
          goldPrice21: gold,
          fullYearPassed: requireAnswer(year, "اختر إجابة: هل مرّ على المال حول هجري كامل؟"),
        })
      }
    >
      <TextField
        id="cash"
        label="المال المدّخر (بالجنيه)"
        hint="النقود والأرصدة البنكية والودائع الفائضة عن حاجتك وحاجة من تعول. المسكن والسيارة الخاصة لا يدخلان في الحساب."
        value={cash}
        onChange={setCash}
        placeholder="مثال: 500000"
      />
      <TextField
        id="debts"
        label="الديون المستحقة عليك الآن (اختياري)"
        hint="من شروط وجوب الزكاة أن يكون المال خاليًا من الدين، فنخصمه قبل الحساب."
        value={debts}
        onChange={setDebts}
        placeholder="اتركه فارغًا إن لم يكن عليك دين"
      />
      <GoldPriceField value={gold} onChange={setGold} />
      <YesNoField name="year" legend={FULL_YEAR_LEGEND} value={year} onChange={setYear} />
    </FormFrame>
  );
}
