import { describe, expect, it } from "vitest";
import { ZakatInputError } from "../decimal";
import { calculateStocksZakat } from "./stocks";

const P = "5000";

describe("calculateStocksZakat", () => {
  it("trading shares: market value + profits - debts, then 2.5%", () => {
    const r = calculateStocksZakat({
      kind: "trading",
      marketValue: "480000",
      profits: "20000",
      debts: "0",
      goldPrice21: P,
      fullYearPassed: true,
    });
    expect(r.status).toBe("due");
    expect(r.zakat).toBe(1250000n);
  });

  it("investment shares: only the profit counts, not the share value", () => {
    const r = calculateStocksZakat({ kind: "investment", marketValue: "9000000", profits: "20000", goldPrice21: P, fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
    expect(r.netWealth).toBe(2000000n);
  });

  it("investment shares: profit above the nisab is zakatable", () => {
    const r = calculateStocksZakat({ kind: "investment", profits: "500000", goldPrice21: P, fullYearPassed: true });
    expect(r.status).toBe("due");
    expect(r.zakat).toBe(1250000n);
  });

  it("trading shares need the market value", () => {
    expect(() => calculateStocksZakat({ kind: "trading", goldPrice21: P, fullYearPassed: true })).toThrow(ZakatInputError);
  });

  it("rejects an unknown kind", () => {
    expect(() =>
      calculateStocksZakat({ kind: "x" as never, goldPrice21: P, fullYearPassed: true }),
    ).toThrow(ZakatInputError);
  });
});
