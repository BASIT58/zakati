import rules from "../../data/rules.json";
import { maxPiasters, parseMoney, parseOptionalMoney } from "../decimal";
import { goldNisab } from "../nisab";
import type { ZakatResult } from "../types";
import { egp, evaluateWealth, priceAndNisabRows } from "./shared";

export interface SalaryInput {
  /** The amount you saved from your salary after necessary expenses. NOT the salary itself. */
  savedAmount: string | number;
  /** Debts you owe that are due now. Optional. */
  debts?: string | number;
  goldPrice21: string | number;
  fullYearPassed: boolean;
}

const SOURCES = [rules.sources.salary, rules.sources.nisabKarat21, rules.sources.conditions];

/** No zakat on the salary itself; zakat is on the part saved after necessities. */
export function calculateSalaryZakat(input: SalaryInput): ZakatResult {
  const saved = parseMoney(input.savedAmount, "المبلغ المدّخر من الراتب");
  const debts = parseOptionalMoney(input.debts, "الديون");
  const price = parseMoney(input.goldPrice21, "سعر جرام الذهب عيار 21");

  const nisab = goldNisab(price);
  const net = maxPiasters(saved - debts, 0n);

  return evaluateWealth({
    rows: [
      ...priceAndNisabRows(price, nisab),
      { label: "الراتب نفسه", value: "لا زكاة فيه (الزكاة في المدّخر منه)" },
      { label: "المدّخر من الراتب بعد الضروريات", value: egp(saved) },
      { label: "الديون المستحقة", value: egp(debts) },
      { label: "الصافي بعد خصم الديون", value: egp(net) },
    ],
    net,
    nisab,
    fullYearPassed: input.fullYearPassed,
    sources: SOURCES,
  });
}
