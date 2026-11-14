import rules from "../../data/rules.json";
import { formatEGP } from "../decimal";
import { RATE_LABEL, zakatOf } from "../nisab";
import type { Piasters, SourceRef, Step, ZakatResult } from "../types";

export const LAST_REVIEWED: string = rules.meta.lastReviewed;

/** The two rows every wealth calculator starts with: gold price and the nisab it gives. */
export function priceAndNisabRows(price: Piasters, nisab: Piasters): Step[] {
  return [
    { label: "سعر جرام الذهب عيار 21", value: `${formatEGP(price)} جنيه` },
    {
      label: `النصاب = ${rules.nisab.goldGrams} جرام × سعر الجرام`,
      value: `${formatEGP(nisab)} جنيه`,
    },
  ];
}

export function egp(value: Piasters): string {
  return `${formatEGP(value)} جنيه`;
}

interface EvaluateArgs {
  /** Rows shown before the verdict (inputs, totals, debts, net). */
  rows: Step[];
  /** Wealth the zakat is measured on, after debts. */
  net: Piasters;
  nisab: Piasters;
  fullYearPassed: boolean;
  sources: SourceRef[];
}

/**
 * The common verdict for money-like wealth:
 * below the nisab -> no zakat; nisab reached but no full year -> not yet; otherwise 2.5%.
 */
export function evaluateWealth(a: EvaluateArgs): ZakatResult {
  const base = {
    nisab: a.nisab,
    netWealth: a.net,
    sources: a.sources,
    lastReviewed: LAST_REVIEWED,
  };

  if (a.net < a.nisab) {
    return {
      ...base,
      status: "below_nisab",
      zakat: 0n,
      summary: "المال أقل من النصاب، فلا زكاة عليك.",
      steps: [...a.rows, { label: "النتيجة", value: "الصافي أقل من النصاب" }],
    };
  }

  if (!a.fullYearPassed) {
    return {
      ...base,
      status: "no_full_year",
      zakat: 0n,
      summary: "المال بلغ النصاب لكن لم يمرّ عليه حول هجري كامل، فلا تجب الزكاة الآن.",
      steps: [...a.rows, { label: "مرور حول هجري كامل", value: "لا" }],
    };
  }

  const zakat = zakatOf(a.net);
  return {
    ...base,
    status: "due",
    zakat,
    summary: `الزكاة المستحقة: ${formatEGP(zakat)} جنيه.`,
    steps: [
      ...a.rows,
      { label: "مرور حول هجري كامل", value: "نعم" },
      { label: `الزكاة = ${RATE_LABEL} × الصافي`, value: egp(zakat) },
    ],
  };
}
