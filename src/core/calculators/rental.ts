import rules from "../../data/rules.json";
import { maxPiasters, parseMoney, parseOptionalMoney } from "../decimal";
import { goldNisab } from "../nisab";
import type { ZakatResult } from "../types";
import { egp, evaluateWealth, priceAndNisabRows } from "./shared";

export interface RentalInput {
  /** Rental income you saved (beyond your basic needs). */
  rentalIncome: string | number;
  /** Your other liquid money. Optional. */
  otherCash?: string | number;
  /** Debts you owe that are due now. Optional. */
  debts?: string | number;
  goldPrice21: string | number;
  fullYearPassed: boolean;
}

const SOURCES = [rules.sources.rental, rules.sources.nisabKarat21, rules.sources.conditions];

/**
 * Rented property: no zakat on the building itself, the zakat is on the rental income,
 * counted together with your other liquid money, once it reaches the nisab and a year passes.
 */
export function calculateRentalZakat(input: RentalInput): ZakatResult {
  const income = parseMoney(input.rentalIncome, "إيراد الإيجار المدّخر");
  const other = parseOptionalMoney(input.otherCash, "أموالك السائلة الأخرى");
  const debts = parseOptionalMoney(input.debts, "الديون");
  const price = parseMoney(input.goldPrice21, "سعر جرام الذهب عيار 21");

  const nisab = goldNisab(price);
  const total = income + other;
  const net = maxPiasters(total - debts, 0n);

  return evaluateWealth({
    rows: [
      ...priceAndNisabRows(price, nisab),
      { label: "العقار نفسه", value: "لا زكاة فيه (الزكاة في الإيراد)" },
      { label: "إيراد الإيجار المدّخر", value: egp(income) },
      { label: "أموالك السائلة الأخرى", value: egp(other) },
      { label: "الإجمالي", value: egp(total) },
      { label: "الديون المستحقة", value: egp(debts) },
      { label: "الصافي بعد خصم الديون", value: egp(net) },
    ],
    net,
    nisab,
    fullYearPassed: input.fullYearPassed,
    sources: SOURCES,
  });
}
