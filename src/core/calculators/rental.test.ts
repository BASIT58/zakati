import { describe, expect, it } from "vitest";
import { calculateRentalZakat } from "./rental";

const P = "5000";

describe("calculateRentalZakat", () => {
  it("combines rental income with other liquid money", () => {
    const r = calculateRentalZakat({ rentalIncome: "300000", otherCash: "200000", goldPrice21: P, fullYearPassed: true });
    expect(r.status).toBe("due");
    expect(r.netWealth).toBe(50000000n);
    expect(r.zakat).toBe(1250000n);
  });

  it("is below the nisab when the income alone is small", () => {
    const r = calculateRentalZakat({ rentalIncome: "100000", goldPrice21: P, fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
  });

  it("is not due before a full year", () => {
    const r = calculateRentalZakat({ rentalIncome: "500000", goldPrice21: P, fullYearPassed: false });
    expect(r.status).toBe("no_full_year");
  });
});
