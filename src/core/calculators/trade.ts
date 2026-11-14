import rules from "../../data/rules.json";
import { maxPiasters, parseMoney, parseOptionalMoney } from "../decimal";
import { goldNisab } from "../nisab";
import type { ZakatResult } from "../types";
import { egp, evaluateWealth, priceAndNisabRows } from "./shared";

export interface TradeInput {
  /** Market value of the goods held for sale, at the end of the year. */
  goodsValue: string | number;
  /** Cash and bank balance of the business. Optional. */
  businessCash?: string | number;
  /** Money customers owe you that you expect to collect. Optional. */
  receivables?: string | number;
  /** Debts you owe that are due now. Optional. */
  debts?: string | number;
  goldPrice21: string | number;
  fullYearPassed: boolean;
}

const SOURCES = [
  rules.sources.trade,
  rules.sources.nisabKarat21,
  rules.sources.conditions,
  rules.sources.debtDeduction,
];

/**
 * Zakat on trade goods: the merchant values his goods at the end of the year
 * (market price), adds cash and collectible debts, subtracts what he owes, and pays 2.5%.
 */
export function calculateTradeZakat(input: TradeInput): ZakatResult {
  const goods = parseMoney(input.goodsValue, "قيمة البضاعة");
  const cash = parseOptionalMoney(input.businessCash, "النقد");
  const receivables = parseOptionalMoney(input.receivables, "الديون المستحقة لك");
  const debts = parseOptionalMoney(input.debts, "الديون التي عليك");
  const price = parseMoney(input.goldPrice21, "سعر جرام الذهب عيار 21");

  const nisab = goldNisab(price);
  const total = goods + cash + receivables;
  const net = maxPiasters(total - debts, 0n);

  return evaluateWealth({
    rows: [
      ...priceAndNisabRows(price, nisab),
      { label: "قيمة البضاعة بسعر السوق", value: egp(goods) },
      { label: "النقد", value: egp(cash) },
      { label: "ديون مستحقة لك (مرجوّة التحصيل)", value: egp(receivables) },
      { label: "الإجمالي", value: egp(total) },
      { label: "الديون التي عليك", value: egp(debts) },
      { label: "الصافي بعد خصم الديون", value: egp(net) },
    ],
    net,
    nisab,
    fullYearPassed: input.fullYearPassed,
    sources: SOURCES,
  });
}
