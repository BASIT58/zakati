import { describe, expect, it } from "vitest";
import { ZakatInputError } from "../decimal";
import { calculateGoldSilverZakat } from "./goldsilver";

const P = "5000"; // karat-21 gram

describe("calculateGoldSilverZakat", () => {
  it("85 g of karat 21 savings is exactly the nisab", () => {
    const r = calculateGoldSilverZakat({ gold21: "85", goldPrice21: P, purpose: "savings", fullYearPassed: true });
    expect(r.status).toBe("due");
    expect(r.netWealth).toBe(42500000n);
    expect(r.zakat).toBe(1062500n);
  });

  it("84.99 g of karat 21 is below the nisab", () => {
    const r = calculateGoldSilverZakat({ gold21: "84.99", goldPrice21: P, purpose: "savings", fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
  });

  it("converts karat 18 to karat-21 equivalents (100 g of 18 = 85.71 g of 21)", () => {
    const r = calculateGoldSilverZakat({ gold18: "100", goldPrice21: P, purpose: "savings", fullYearPassed: true });
    expect(r.status).toBe("due");
  });

  it("99 g of karat 18 (84.86 g of 21) is below the nisab", () => {
    const r = calculateGoldSilverZakat({ gold18: "99", goldPrice21: P, purpose: "savings", fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
  });

  it("converts karat 24 (85 g of 24 = 97.14 g of 21)", () => {
    const r = calculateGoldSilverZakat({ gold24: "85", goldPrice21: P, purpose: "savings", fullYearPassed: true });
    expect(r.status).toBe("due");
    expect(r.netWealth).toBe(48571429n);
  });

  it("adds gold of several karats together", () => {
    const r = calculateGoldSilverZakat({ gold21: "50", gold18: "50", goldPrice21: P, purpose: "savings", fullYearPassed: true });
    // 50 + 50*18/21 = 92.857 g equivalent -> above 85
    expect(r.status).toBe("due");
  });

  it("adornment is exempt", () => {
    const r = calculateGoldSilverZakat({ gold21: "200", goldPrice21: P, purpose: "adornment", fullYearPassed: true });
    expect(r.status).toBe("exempt");
    expect(r.zakat).toBe(0n);
  });

  it("is not due before a full year", () => {
    const r = calculateGoldSilverZakat({ gold21: "100", goldPrice21: P, purpose: "savings", fullYearPassed: false });
    expect(r.status).toBe("no_full_year");
  });

  it("silver: 595 g reaches the nisab, priced by the visitor", () => {
    const r = calculateGoldSilverZakat({ silverGrams: "595", silverPrice: "60", goldPrice21: P, purpose: "savings", fullYearPassed: true });
    expect(r.status).toBe("due");
    expect(r.zakat).toBe(89250n); // 35,700 * 2.5% = 892.50
  });

  it("silver below 595 g is not due", () => {
    const r = calculateGoldSilverZakat({ silverGrams: "594.99", silverPrice: "60", goldPrice21: P, purpose: "savings", fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
  });

  it("silver needs a price", () => {
    expect(() =>
      calculateGoldSilverZakat({ silverGrams: "600", goldPrice21: P, purpose: "savings", fullYearPassed: true }),
    ).toThrow(ZakatInputError);
  });

  it("needs at least one weight", () => {
    expect(() => calculateGoldSilverZakat({ goldPrice21: P, purpose: "savings", fullYearPassed: true })).toThrow(ZakatInputError);
  });
});
