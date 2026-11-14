"use client";

import { useState } from "react";
import { FormFrame, GoldPriceField, TextField, YesNoField, FULL_YEAR_LEGEND, requireAnswer } from "@/components/fields";
import { calculateSalaryZakat } from "@/core/calculators/salary";

export function SalaryForm() {
  const [saved, setSaved] = useState("");
  const [debts, setDebts] = useState("");
  const [gold, setGold] = useState("");
  const [year, setYear] = useState<boolean | null>(null);

  return (
    <FormFrame
      onReset={() => {
        setSaved("");
        setDebts("");
        setGold("");
        setYear(null);
      }}
      compute={() =>
        calculateSalaryZakat({
          savedAmount: saved,
          debts,
          goldPrice21: gold,
          fullYearPassed: requireAnswer(year, "اختر إجابة: هل مرّ على المال حول هجري كامل؟"),
        })
      }
    >
      <TextField
        id="saved"
        label="كم المبلغ الذي ادّخرته من راتبك (بالجنيه)؟"
        hint="لا نسألك عن راتبك، بل عمّا بقي منه بعد المصروفات الضرورية وادّخرته."
        value={saved}
        onChange={setSaved}
        placeholder="مثال: 600000"
      />
      <TextField id="debts" label="ديون عليك مستحقة الآن (اختياري)" value={debts} onChange={setDebts} />
      <GoldPriceField value={gold} onChange={setGold} />
      <YesNoField name="year" legend={FULL_YEAR_LEGEND} value={year} onChange={setYear} />
    </FormFrame>
  );
}
