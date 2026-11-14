"use client";

import { useState } from "react";
import { ChoiceField, FormFrame, GoldPriceField, TextField, YesNoField, requireAnswer } from "@/components/fields";
import { calculateGoldSilverZakat, type GoldPurpose } from "@/core/calculators/goldsilver";

export function GoldSilverForm() {
  const [purpose, setPurpose] = useState<GoldPurpose | null>(null);
  const [g24, setG24] = useState("");
  const [g21, setG21] = useState("");
  const [g18, setG18] = useState("");
  const [silver, setSilver] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [gold, setGold] = useState("");
  const [year, setYear] = useState<boolean | null>(null);

  return (
    <FormFrame
      onReset={() => {
        setPurpose(null);
        setG24("");
        setG21("");
        setG18("");
        setSilver("");
        setSilverPrice("");
        setGold("");
        setYear(null);
      }}
      compute={() => {
        const chosen = requireAnswer(purpose, "اختر الغرض: ادخار أم زينة");
        return calculateGoldSilverZakat({
          gold24: g24,
          gold21: g21,
          gold18: g18,
          silverGrams: silver,
          silverPrice,
          goldPrice21: gold,
          purpose: chosen,
          // For adornment the year does not matter, so a missing answer is accepted.
          fullYearPassed: chosen === "adornment" ? true : requireAnswer(year, "اختر إجابة: هل مرّ على المال حول هجري كامل؟"),
        });
      }}
    >
      <ChoiceField<GoldPurpose>
        name="purpose"
        legend="ما الغرض من الذهب والفضة؟"
        hint="الزينة: حلي تلبسه بحسب عُرف أمثالك فلا زكاة فيه. الادخار: سبائك أو جنيهات أو حلي مدّخر للاستثمار."
        value={purpose}
        onChange={setPurpose}
        options={[
          { value: "savings", label: "ادخار أو استثمار" },
          { value: "adornment", label: "زينة" },
        ]}
      />
      <div className="grid gap-6 sm:grid-cols-3">
        <TextField id="g24" label="ذهب عيار 24 (جرام)" value={g24} onChange={setG24} />
        <TextField id="g21" label="ذهب عيار 21 (جرام)" value={g21} onChange={setG21} />
        <TextField id="g18" label="ذهب عيار 18 (جرام)" value={g18} onChange={setG18} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="silver" label="الفضة (جرام)" value={silver} onChange={setSilver} />
        <TextField
          id="silverPrice"
          label="سعر جرام الفضة (بالجنيه)"
          hint="مطلوب فقط إذا أدخلت فضة."
          value={silverPrice}
          onChange={setSilverPrice}
        />
      </div>
      <GoldPriceField value={gold} onChange={setGold} />
      {purpose === "savings" && (
        <YesNoField
          name="year"
          legend="هل مرّ حول هجري كامل على الذهب أو الفضة وهو بالغ النصاب؟"
          value={year}
          onChange={setYear}
        />
      )}
    </FormFrame>
  );
}
