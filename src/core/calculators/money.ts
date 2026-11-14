import rules from "../../data/rules.json";
import { maxPiasters, parseMoney, parseOptionalMoney } from "../decimal";
import { goldNisab } from "../nisab";
import type { ZakatResult } from "../types";
import { egp, evaluateWealth, priceAndNisabRows } from "./shared";

export interface MoneyInput {
  /** Savings: cash, bank balances, deposits. Only the part beyond your basic needs. */
  cash: string | number;
  /** Debts you owe that are due now. Optional. */
  debts?: string | number;
  /** Today's price of one gram of karat-21 gold, in EGP. */
  goldPrice21: string | number;
  /** Has a full Hijri year passed since the money reached the nisab? */
  fullYearPassed: boolean;
}

const SOURCES = [rules.sources.moneyNisab, rules.sources.nisabKarat21, rules.sources.conditions];

/**
 * Zakat on money (savings). Rules, as set out by Dar al-Ifta:
 *  1. Nisab = 85 grams of karat-21 gold, at today's price.
 *  2. The money must be free of debts, so debts are subtracted first.
 *  3. A full Hijri year must have passed.
 *  4. Rate = 2.5%.
 */
export function calculateMoneyZakat(input: MoneyInput): ZakatResult {
  const cash = parseMoney(input.cash, "المال المدّخر");
  const debts = parseOptionalMoney(input.debts, "الديون");
  const price = parseMoney(input.goldPrice21, "سعر جرام الذهب عيار 21");

  const nisab = goldNisab(price);
  const net = maxPiasters(cash - debts, 0n);

  return evaluateWealth({
    rows: [
      ...priceAndNisabRows(price, nisab),
      { label: "المال المدّخر", value: egp(cash) },
      { label: "الديون المستحقة", value: egp(debts) },
      { label: "الصافي بعد خصم الديون", value: egp(net) },
    ],
    net,
    nisab,
    fullYearPassed: input.fullYearPassed,
    sources: SOURCES,
  });
}
