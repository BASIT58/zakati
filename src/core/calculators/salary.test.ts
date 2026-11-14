import { describe, expect, it } from "vitest";
import { calculateSalaryZakat } from "./salary";

const P = "5000";

describe("calculateSalaryZakat", () => {
  it("charges 2.5% on the saved amount only", () => {
    const r = calculateSalaryZakat({ savedAmount: "600000", goldPrice21: P, fullYearPassed: true });
    expect(r.status).toBe("due");
    expect(r.zakat).toBe(1500000n);
  });

  it("is below the nisab for small savings", () => {
    const r = calculateSalaryZakat({ savedAmount: "50000", goldPrice21: P, fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
  });

  it("subtracts debts", () => {
    const r = calculateSalaryZakat({ savedAmount: "430000", debts: "10000", goldPrice21: P, fullYearPassed: true });
    expect(r.status).toBe("below_nisab");
  });
});
