import { describe, expect, it } from "vitest";
import {
  formatEGP,
  mulDivRound,
  parseMoney,
  parseOptionalMoney,
  ZakatInputError,
} from "./decimal";

describe("parseMoney", () => {
  it("parses whole numbers and decimals into piasters", () => {
    expect(parseMoney("100")).toBe(10000n);
    expect(parseMoney("1000.5")).toBe(100050n);
    expect(parseMoney("0.99")).toBe(99n);
    expect(parseMoney(250)).toBe(25000n);
  });

  it("ignores thousands separators and spaces", () => {
    expect(parseMoney("1,000.50")).toBe(100050n);
    expect(parseMoney(" 2 500 ")).toBe(250000n);
  });

  it("understands Arabic-Indic digits and the Arabic decimal mark", () => {
    expect(parseMoney("١٢٣٫٤٥")).toBe(12345n);
    expect(parseMoney("٥٠٠٠")).toBe(500000n);
  });

  it("rounds half up beyond two decimals", () => {
    expect(parseMoney("0.005")).toBe(1n);
    expect(parseMoney("0.004")).toBe(0n);
    expect(parseMoney("10.999")).toBe(1100n);
  });

  it("rejects empty, negative and non-numeric input", () => {
    expect(() => parseMoney("")).toThrow(ZakatInputError);
    expect(() => parseMoney("   ")).toThrow(ZakatInputError);
    expect(() => parseMoney("-5")).toThrow(ZakatInputError);
    expect(() => parseMoney("abc")).toThrow(ZakatInputError);
    expect(() => parseMoney("1.2.3")).toThrow(ZakatInputError);
    expect(() => parseMoney(Number.NaN)).toThrow(ZakatInputError);
  });
});

describe("parseOptionalMoney", () => {
  it("treats a blank field as zero", () => {
    expect(parseOptionalMoney("")).toBe(0n);
    expect(parseOptionalMoney(undefined)).toBe(0n);
    expect(parseOptionalMoney(null)).toBe(0n);
  });

  it("still validates when a value is given", () => {
    expect(parseOptionalMoney("12")).toBe(1200n);
    expect(() => parseOptionalMoney("x")).toThrow(ZakatInputError);
  });
});

describe("mulDivRound", () => {
  it("computes 2.5% exactly", () => {
    // 1,000.00 EGP -> 25.00 EGP
    expect(mulDivRound(100000n, 25n, 1000n)).toBe(2500n);
  });

  it("rounds half up", () => {
    // 20 piasters * 2.5% = 0.5 piaster -> 1
    expect(mulDivRound(20n, 25n, 1000n)).toBe(1n);
    // 19 piasters * 2.5% = 0.475 piaster -> 0
    expect(mulDivRound(19n, 25n, 1000n)).toBe(0n);
  });
});

describe("formatEGP", () => {
  it("adds thousands separators and two decimals", () => {
    expect(formatEGP(123456n)).toBe("1,234.56");
    expect(formatEGP(5n)).toBe("0.05");
    expect(formatEGP(0n)).toBe("0.00");
    expect(formatEGP(100000000n)).toBe("1,000,000.00");
  });
});
