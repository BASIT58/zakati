import { describe, expect, it } from "vitest";
import { calculateLentDebtZakat } from "./debts";

const P = "5000";

describe("calculateLentDebtZakat", () => {
  it("charges one year only on the collected amount", () => {
    const r = calculateLentDebtZakat({ collectedAmount: "500000", goldPrice21: P, delayedOnPurpose: false });
    expect(r.status).toBe("due");
    expect(r.zakat).toBe(1250000n);
  });

  it("is below the nisab for a small loan", () => {
    const r = calculateLentDebtZakat({ collectedAmount: "100000", goldPrice21: P, delayedOnPurpose: false });
    expect(r.status).toBe("below_nisab");
    expect(r.zakat).toBe(0n);
  });

  it("still computes one year, and refers the past years to Dar al-Ifta, when delayed on purpose", () => {
    const r = calculateLentDebtZakat({ collectedAmount: "500000", goldPrice21: P, delayedOnPurpose: true });
    expect(r.zakat).toBe(1250000n);
    expect(r.steps.some((s) => s.label === "تنبيه")).toBe(true);
  });
});
