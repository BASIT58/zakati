import rules from "../../data/rules.json";
import { maxPiasters, parseMoney, parseOptionalMoney, ZakatInputError } from "../decimal";
import { goldNisab } from "../nisab";
import type { ZakatResult } from "../types";
import { egp, evaluateWealth, priceAndNisabRows } from "./shared";

/**
 * trading    — shares bought to trade (buy and sell for profit), or shares in a trading company.
 * investment — shares in an industrial / service / productive company, kept for the yield.
 */
export type StockKind = "trading" | "investment";

export interface StocksInput {
  kind: StockKind;
  /** Market value of the shares at the end of the year. Used for "trading" only. */
  marketValue?: string | number;
  /** Profits / dividends received. */
  profits?: string | number;
  /** Debts you owe that are due now. Optional. */
  debts?: string | number;
  goldPrice21: string | number;
  fullYearPassed: boolean;
}

const SOURCES = [
  rules.sources.stocksTrading,
  rules.sources.stocksInvested,
  rules.sources.nisabKarat21,
  rules.sources.conditions,
];

/**
 * Zakat on shares, following Dar al-Ifta:
 *  - trading shares are trade goods: market value + profits − debts, then 2.5%;
 *  - shares of productive companies carry no zakat on the share itself; zakat is on the profit only.
 */
export function calculateStocksZakat(input: StocksInput): ZakatResult {
  if (input.kind !== "trading" && input.kind !== "investment") {
    throw new ZakatInputError("اختر نوع الأسهم: متاجرة أم استثمار");
  }

  const price = parseMoney(input.goldPrice21, "سعر جرام الذهب عيار 21");
  const debts = parseOptionalMoney(input.debts, "الديون");
  const profits = parseOptionalMoney(input.profits, "الأرباح");
  const nisab = goldNisab(price);

  if (input.kind === "trading") {
    const market = parseMoney(input.marketValue ?? "", "القيمة السوقية للأسهم");
    const total = market + profits;
    const net = maxPiasters(total - debts, 0n);
    return evaluateWealth({
      rows: [
        ...priceAndNisabRows(price, nisab),
        { label: "نوع الأسهم", value: "أسهم متاجرة (تُزكّى كعروض تجارة)" },
        { label: "القيمة السوقية آخر الحول", value: egp(market) },
        { label: "الأرباح", value: egp(profits) },
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

  const net = maxPiasters(profits - debts, 0n);
  return evaluateWealth({
    rows: [
      ...priceAndNisabRows(price, nisab),
      {
        label: "نوع الأسهم",
        value: "أسهم استثمار في شركة إنتاجية أو خدمية: لا زكاة في أصل السهم",
      },
      { label: "الأرباح المقبوضة", value: egp(profits) },
      { label: "الديون المستحقة", value: egp(debts) },
      { label: "الصافي (الربح بعد الديون)", value: egp(net) },
    ],
    net,
    nisab,
    fullYearPassed: input.fullYearPassed,
    sources: SOURCES,
  });
}
