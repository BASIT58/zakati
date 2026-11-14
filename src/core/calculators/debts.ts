import rules from "../../data/rules.json";
import { formatEGP, parseMoney } from "../decimal";
import { goldNisab, RATE_LABEL, zakatOf } from "../nisab";
import type { Step, ZakatResult } from "../types";
import { egp, LAST_REVIEWED, priceAndNisabRows } from "./shared";

export interface LentDebtInput {
  /** The amount of the loan you have just collected from the borrower. */
  collectedAmount: string | number;
  goldPrice21: string | number;
  /** Did you delay collecting on purpose, to avoid paying zakat? */
  delayedOnPurpose: boolean;
}

const SOURCES = [rules.sources.lentMoney, rules.sources.conditions, rules.sources.service];

/**
 * Zakat for the LENDER, after collecting the loan (fatwa 8906, Grand Mufti, April 2026):
 *  - the lender pays zakat for ONE year only, however long the debt stayed with the borrower;
 *  - the borrower owes no zakat on the borrowed money (it is a debt on him).
 * If the lender delayed collection on purpose to avoid zakat, the fatwa requires all past
 * years — we do not compute that case and send the visitor to Dar al-Ifta.
 */
export function calculateLentDebtZakat(input: LentDebtInput): ZakatResult {
  const collected = parseMoney(input.collectedAmount, "المبلغ الذي قبضته");
  const price = parseMoney(input.goldPrice21, "سعر جرام الذهب عيار 21");
  const nisab = goldNisab(price);

  const rows: Step[] = [
    ...priceAndNisabRows(price, nisab),
    { label: "المبلغ المقبوض من المدين", value: egp(collected) },
  ];
  const base = { nisab, netWealth: collected, sources: SOURCES, lastReviewed: LAST_REVIEWED };

  if (collected < nisab) {
    return {
      ...base,
      status: "below_nisab",
      zakat: 0n,
      summary: "المبلغ المقبوض أقل من النصاب، فلا زكاة عليه.",
      steps: [...rows, { label: "النتيجة", value: "أقل من النصاب" }],
    };
  }

  const zakat = zakatOf(collected);
  const steps: Step[] = [
    ...rows,
    { label: "عدد السنوات التي تُزكّى عنها", value: "سنة واحدة (بعد القبض)" },
    { label: `الزكاة = ${RATE_LABEL} × المبلغ المقبوض`, value: egp(zakat) },
  ];

  if (input.delayedOnPurpose) {
    steps.push({
      label: "تنبيه",
      value: "تأخير القبض عمدًا للهروب من الزكاة يوجب زكاة السنوات السابقة، ولا نحسبها هنا؛ راجع دار الإفتاء (107)",
    });
    return {
      ...base,
      status: "due",
      zakat,
      summary: `الزكاة عن سنة واحدة: ${formatEGP(zakat)} جنيه، وعن السنوات السابقة راجع دار الإفتاء.`,
      steps,
    };
  }

  return {
    ...base,
    status: "due",
    zakat,
    summary: `الزكاة المستحقة: ${formatEGP(zakat)} جنيه.`,
    steps,
  };
}
