import { describe, expect, it } from "vitest";
import { calculateTradeZakat } from "./trade";

const P = "5000"; // nisab 425,000

describe("calculateTradeZakat", () => {
  it("adds goods, cash and receivables, subtracts debts, then 2.5%", () => {
    const r = calculateTradeZakat({
      goodsValue: "400000",
      businessCash: "100000",
      receivables: "50000",
      debts: "50000",
      goldPrice21: P,
      fullYearPassed: true,
    });
    expect(r.status).toBe("due");
    expect(r.netWealth).toBe(50000000n);
    expect(r.zakat).toBe(1250000n);
  });

  it("is below the nisab when debts bring it under", () => {
    const r = calculateTradeZakat({ goodsValue: "430000", debts: "10000", goldPrice21: P, fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
  });

  it("is not due before a full year", () => {
    const r = calculateTradeZakat({ goodsValue: "500000", goldPrice21: P, fullYearPassed: false });
    expect(r.status).toBe("no_full_year");
    expect(r.zakat).toBe(0n);
  });
});
