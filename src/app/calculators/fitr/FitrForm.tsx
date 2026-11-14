"use client";

import { useState } from "react";
import { FormFrame, TextField } from "@/components/fields";
import { calculateFitr } from "@/core/calculators/fitr";
import fitr from "@/data/fitr.json";

export function FitrForm() {
  const [persons, setPersons] = useState("");
  const [perPerson, setPerPerson] = useState("");

  return (
    <FormFrame
      onReset={() => {
        setPersons("");
        setPerPerson("");
      }}
      compute={() => calculateFitr({ persons, perPerson })}
    >
      <p className="rounded-xl bg-gold-100 px-4 py-3 leading-8 text-brand-900">
        القيمة المعلنة لعام {fitr.hijriYear}هـ ({fitr.gregorianYear}م):{" "}
        <strong>{fitr.minPerPersonEgp} جنيهًا</strong> عن كل فرد كحد أدنى. {fitr.note}
      </p>
      <TextField
        id="persons"
        label="عدد الأفراد الذين تُخرج عنهم"
        hint="نفسك ومن تلزمك نفقتهم."
        value={persons}
        onChange={setPersons}
        placeholder="مثال: 4"
      />
      <TextField
        id="perPerson"
        label="المبلغ عن الفرد (اختياري)"
        hint="اتركه فارغًا لاستخدام الحد الأدنى المعلن، أو اكتب مبلغًا أكبر إن أحببت."
        value={perPerson}
        onChange={setPerPerson}
      />
    </FormFrame>
  );
}
