"use client";

import { useState } from "react";
import { ChoiceField, FormFrame, GoldPriceField, TextField, YesNoField, FULL_YEAR_LEGEND, requireAnswer } from "@/components/fields";
import { calculateStocksZakat, type StockKind } from "@/core/calculators/stocks";

export function StocksForm() {
  const [kind, setKind] = useState<StockKind | null>(null);
  const [market, setMarket] = useState("");
  const [profits, setProfits] = useState("");
  const [debts, setDebts] = useState("");
  const [gold, setGold] = useState("");
  const [year, setYear] = useState<boolean | null>(null);

  return (
    <FormFrame
      onReset={() => {
        setKind(null);
        setMarket("");
        setProfits("");
        setDebts("");
        setGold("");
        setYear(null);
      }}
      compute={() =>
        calculateStocksZakat({
          kind: requireAnswer(kind, "اختر نوع الأسهم: متاجرة أم استثمار"),
          marketValue: market,
          profits,
          debts,
          goldPrice21: gold,
          fullYearPassed: requireAnswer(year, "اختر إجابة: هل مرّ على المال حول هجري كامل؟"),
        })
      }
    >
      <ChoiceField<StockKind>
        name="kind"
        legend="ما نوع أسهمك؟"
        hint="المتاجرة: تشتري وتبيع طلبًا للربح، أو أسهم في شركة تجارية. الاستثمار: أسهم في شركة صناعية أو خدمية أو إنتاجية تحتفظ بها لعائدها."
        value={kind}
        onChange={setKind}
        options={[
          { value: "trading", label: "أسهم متاجرة" },
          { value: "investment", label: "أسهم استثمار" },
        ]}
      />
      {kind === "trading" && (
        <TextField
          id="market"
          label="القيمة السوقية للأسهم آخر الحول (بالجنيه)"
          value={market}
          onChange={setMarket}
          placeholder="مثال: 480000"
        />
      )}
      <TextField
        id="profits"
        label={kind === "investment" ? "الأرباح التي قبضتها (بالجنيه)" : "الأرباح (اختياري)"}
        value={profits}
        onChange={setProfits}
      />
      <TextField id="debts" label="ديون عليك مستحقة الآن (اختياري)" value={debts} onChange={setDebts} />
      <GoldPriceField value={gold} onChange={setGold} />
      <YesNoField name="year" legend={FULL_YEAR_LEGEND} value={year} onChange={setYear} />
    </FormFrame>
  );
}
