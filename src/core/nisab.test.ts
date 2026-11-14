import { describe, expect, it } from "vitest";
import { ZakatInputError } from "./decimal";
import { goldNisab, GOLD_NISAB_GRAMS, zakatOf } from "./nisab";

describe("goldNisab", () => {
  it("uses 85 grams", () => {
    expect(GOLD_NISAB_GRAMS).toBe(85n);
  });

  it("multiplies 85 grams by the gram price", () => {
    // 5,000.00 EGP per gram -> 425,000.00 EGP
    expect(goldNisab(500000n)).toBe(42500000n);
  });

  it("keeps piasters exact for prices with decimals", () => {
    // 5,123.50 per gram * 85 = 435,497.50
    expect(goldNisab(512350n)).toBe(43549750n);
  });

  it("rejects a zero price", () => {
    expect(() => goldNisab(0n)).toThrow(ZakatInputError);
  });
});

describe("zakatOf", () => {
  it("is 2.5% (one fortieth)", () => {
    expect(zakatOf(100000n)).toBe(2500n); // 1,000 -> 25
    expect(zakatOf(42500000n)).toBe(1062500n); // 425,000 -> 10,625
  });

  it("is zero for zero", () => {
    expect(zakatOf(0n)).toBe(0n);
  });
});
