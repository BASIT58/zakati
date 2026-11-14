import { describe, expect, it } from "vitest";
import { ZakatInputError } from "../decimal";
import { calculateFitr } from "./fitr";

describe("calculateFitr", () => {
  it("defaults to the announced minimum (35 EGP) per person", () => {
    const r = calculateFitr({ persons: "4" });
    expect(r.zakat).toBe(14000n); // 140.00
    expect(r.status).toBe("due");
  });

  it("accepts Arabic-Indic digits", () => {
    expect(calculateFitr({ persons: "٣" }).zakat).toBe(10500n);
  });

  it("accepts a higher amount per person", () => {
    expect(calculateFitr({ persons: "2", perPerson: "50" }).zakat).toBe(10000n);
  });

  it("rejects an amount below the minimum", () => {
    expect(() => calculateFitr({ persons: "2", perPerson: "20" })).toThrow(ZakatInputError);
  });

  it("rejects zero or non-numeric persons", () => {
    expect(() => calculateFitr({ persons: "0" })).toThrow(ZakatInputError);
    expect(() => calculateFitr({ persons: "abc" })).toThrow(ZakatInputError);
  });
});
