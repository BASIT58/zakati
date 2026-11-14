"use client";

import { useState } from "react";
import { FormFrame, GoldPriceField, TextField, YesNoField, FULL_YEAR_LEGEND, requireAnswer } from "@/components/fields";
import { calculateLentDebtZakat } from "@/core/calculators/debts";

export function DebtsForm() {
  const [collected, setCollected] = useState("");
  const [gold, setGold] = useState("");
  const [delayed, setDelayed] = useState<boolean | null>(null);

  return (
    <FormFrame
      onReset={() => {
        setCollected("");
        setGold("");
        setDelayed(null);
      }}
      compute={() =>
        calculateLentDebtZakat({
          collectedAmount: collected,
          goldPrice21: gold,
          delayedOnPurpose: requireAnswer(delayed, "اختر إجابة: هل أخّرت قبض الدين عمدًا؟"),
        })
      }
    >
      <p className="rounded-xl bg-brand-50 px-4 py-3 leading-8 text-brand-900">
        هذه الحاسبة لمن <strong>أقرض</strong> غيره ثم قبض المال. أما من <strong>اقترض</strong> فلا زكاة عليه في المال
        الذي اقترضه، لأن الدين يمنع وجوب الزكاة.
      </p>
      <TextField
        id="collected"
        label="المبلغ الذي قبضته من المدين (بالجنيه)"
        value={collected}
        onChange={setCollected}
        placeholder="مثال: 500000"
      />
      <GoldPriceField value={gold} onChange={setGold} />
      <YesNoField
        name="delayed"
        legend="هل أخّرت قبض الدين عمدًا حتى لا تُخرج زكاته؟"
        hint="إن كان الجواب «نعم» فعليك زكاة السنوات السابقة، ولا نحسبها هنا، فراجع دار الإفتاء."
        value={delayed}
        onChange={setDelayed}
      />
    </FormFrame>
  );
}
