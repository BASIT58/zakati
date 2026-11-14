import { describe, expect, it } from "vitest";
import rules from "../../data/rules.json";
import { ZakatInputError } from "../decimal";
import { calculateMoneyZakat } from "./money";

// Gram of karat-21 gold = 5,000 EGP  ->  nisab = 425,000 EGP
const PRICE = "5000";

describe("calculateMoneyZakat", () => {
  it("is due when money is above the nisab and a year has passed", () => {
    const r = calculateMoneyZakat({ cash: "500000", goldPrice21: PRICE, fullYearPassed: true });
    expect(r.status).toBe("due");
    expect(r.nisab).toBe(42500000n);
    expect(r.netWealth).toBe(50000000n);
    expect(r.zakat).toBe(1250000n); // 12,500.00
  });

  it("is due exactly at the nisab", () => {
    const r = calculateMoneyZakat({ cash: "425000", goldPrice21: PRICE, fullYearPassed: true });
    expect(r.status).toBe("due");
    expect(r.zakat).toBe(1062500n); // 10,625.00
  });

  it("is not due just below the nisab", () => {
    const r = calculateMoneyZakat({ cash: "424999.99", goldPrice21: PRICE, fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
    expect(r.zakat).toBe(0n);
  });

  it("is not due for a small amount (100,000 vs 425,000)", () => {
    const r = calculateMoneyZakat({ cash: "100000", goldPrice21: PRICE, fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
  });

  it("subtracts debts before comparing with the nisab", () => {
    const r = calculateMoneyZakat({
      cash: "500000",
      debts: "100000",
      goldPrice21: PRICE,
      fullYearPassed: true,
    });
    expect(r.netWealth).toBe(40000000n);
    expect(r.status).toBe("below_nisab");
  });

  it("charges zakat on the amount after debts", () => {
    const r = calculateMoneyZakat({
      cash: "600000",
      debts: "100000",
      goldPrice21: PRICE,
      fullYearPassed: true,
    });
    expect(r.status).toBe("due");
    expect(r.zakat).toBe(1250000n); // 2.5% of 500,000
  });

  it("never goes negative when debts exceed savings", () => {
    const r = calculateMoneyZakat({
      cash: "1000",
      debts: "5000",
      goldPrice21: PRICE,
      fullYearPassed: true,
    });
    expect(r.netWealth).toBe(0n);
    expect(r.status).toBe("below_nisab");
  });

  it("waits for a full Hijri year even above the nisab", () => {
    const r = calculateMoneyZakat({ cash: "500000", goldPrice21: PRICE, fullYearPassed: false });
    expect(r.status).toBe("no_full_year");
    expect(r.zakat).toBe(0n);
  });

  it("accepts Arabic digits and treats blank debts as zero", () => {
    const r = calculateMoneyZakat({
      cash: "٥٠٠٬٠٠٠",
      debts: "",
      goldPrice21: "٥٠٠٠",
      fullYearPassed: true,
    });
    expect(r.status).toBe("due");
    expect(r.zakat).toBe(1250000n);
  });

  it("rounds the zakat to the nearest piaster", () => {
    // 1,000,000.02 * 2.5% = 25,000.0005 -> 25,000.00
    const r = calculateMoneyZakat({ cash: "1000000.02", goldPrice21: PRICE, fullYearPassed: true });
    expect(r.zakat).toBe(2500000n);
  });

  it("always returns steps, sources and a review date", () => {
    const r = calculateMoneyZakat({ cash: "500000", goldPrice21: PRICE, fullYearPassed: true });
    expect(r.steps.length > 0).toBe(true);
    expect(r.sources.length > 0).toBe(true);
    expect(r.lastReviewed).toBe(rules.meta.lastReviewed);
  });

  it("rejects a missing gold price and bad amounts", () => {
    expect(() =>
      calculateMoneyZakat({ cash: "500000", goldPrice21: "0", fullYearPassed: true }),
    ).toThrow(ZakatInputError);
    expect(() =>
      calculateMoneyZakat({ cash: "", goldPrice21: PRICE, fullYearPassed: true }),
    ).toThrow(ZakatInputError);
    expect(() =>
      calculateMoneyZakat({ cash: "-1", goldPrice21: PRICE, fullYearPassed: true }),
    ).toThrow(ZakatInputError);
  });
});
