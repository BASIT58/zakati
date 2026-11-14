"use client";

import { useState } from "react";
import { FormFrame, GoldPriceField, TextField, YesNoField, FULL_YEAR_LEGEND, requireAnswer } from "@/components/fields";
import { calculateTradeZakat } from "@/core/calculators/trade";

export function TradeForm() {
  const [goods, setGoods] = useState("");
  const [cash, setCash] = useState("");
  const [receivables, setReceivables] = useState("");
  const [debts, setDebts] = useState("");
  const [gold, setGold] = useState("");
  const [year, setYear] = useState<boolean | null>(null);

  return (
    <FormFrame
      onReset={() => {
        setGoods("");
        setCash("");
        setReceivables("");
        setDebts("");
        setGold("");
        setYear(null);
      }}
      compute={() =>
        calculateTradeZakat({
          goodsValue: goods,
          businessCash: cash,
          receivables,
          debts,
          goldPrice21: gold,
          fullYearPassed: requireAnswer(year, "اختر إجابة: هل مرّ على المال حول هجري كامل؟"),
        })
      }
    >
      <TextField
        id="goods"
        label="قيمة البضاعة بسعر السوق اليوم (بالجنيه)"
        hint="قدّر ما تُباع به بضاعتك الآن (لا سعر شرائها). الأصول الثابتة كالمحل والأجهزة لا تدخل."
        value={goods}
        onChange={setGoods}
        placeholder="مثال: 400000"
      />
      <TextField
        id="cash"
        label="نقد المتجر والأرصدة البنكية (اختياري)"
        value={cash}
        onChange={setCash}
      />
      <TextField
        id="receivables"
        label="ديون لك عند العملاء ترجو تحصيلها (اختياري)"
        value={receivables}
        onChange={setReceivables}
      />
      <TextField
        id="debts"
        label="ديون عليك مستحقة الآن (اختياري)"
        hint="مثل ما عليك للموردين. للشركات الكبيرة أو الحالات المعقدة راجع دار الإفتاء."
        value={debts}
        onChange={setDebts}
      />
      <GoldPriceField value={gold} onChange={setGold} />
      <YesNoField
        name="year"
        legend="هل مرّ حول هجري كامل على التجارة وهي بالغة النصاب؟"
        value={year}
        onChange={setYear}
      />
    </FormFrame>
  );
}
