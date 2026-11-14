import type { Piasters } from "./types";

/**
 * Money helpers.
 *
 * Amounts are exact integers (bigint) counted in piasters, so
 * 0.1 + 0.2 style floating-point mistakes cannot happen in a calculator
 * whose whole job is to be correct.
 */

/** Thrown when the visitor types something we cannot use. The message is Arabic and safe to show. */
export class ZakatInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZakatInputError";
  }
}

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const EXTENDED_ARABIC_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Turns Arabic-Indic digits and separators into plain ASCII so "١٢٣٫٥" works. */
function normalizeNumberText(input: string): string {
  return input
    .replace(/[٠-٩۰-۹]/g, (ch) => {
      const arabic = ARABIC_INDIC_DIGITS.indexOf(ch);
      return String(arabic >= 0 ? arabic : EXTENDED_ARABIC_DIGITS.indexOf(ch));
    })
    .replace(/٫/g, ".")
    .replace(/[٬،,\s]/g, "");
}

/**
 * Parses a visitor-typed amount into piasters.
 * Accepts "1,000.50", "١٠٠٠٫٥٠", or a plain number. More than two decimals are rounded half up.
 */
export function parseMoney(input: string | number, fieldLabel = "القيمة"): Piasters {
  let text: string;

  if (typeof input === "number") {
    if (!Number.isFinite(input)) {
      throw new ZakatInputError(`${fieldLabel}: قيمة غير صالحة`);
    }
    text = input.toString();
    if (/e/i.test(text)) {
      throw new ZakatInputError(`${fieldLabel}: الرقم كبير جدًا أو صغير جدًا`);
    }
  } else {
    text = normalizeNumberText(input.trim());
  }

  if (text === "") {
    throw new ZakatInputError(`${fieldLabel}: من فضلك أدخل قيمة`);
  }
  if (text.startsWith("-")) {
    throw new ZakatInputError(`${fieldLabel}: لا يمكن أن تكون القيمة سالبة`);
  }
  if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) {
    throw new ZakatInputError(`${fieldLabel}: قيمة غير صالحة، اكتب أرقامًا فقط`);
  }

  const [whole, fraction = ""] = text.split(".");
  let piasters = BigInt(whole) * 100n + BigInt((fraction + "00").slice(0, 2));

  // Round half up on the third decimal digit ('5' has char code 53).
  if (fraction.length > 2 && fraction.charCodeAt(2) >= 53) {
    piasters += 1n;
  }
  return piasters;
}

/** Parses a whole number such as a head count ("٣" or "3"). Must be between min and max. */
export function parseCount(input: string | number, fieldLabel: string, min = 1, max = 1000): number {
  const text = typeof input === "number" ? String(input) : normalizeNumberText(input.trim());
  if (text === "") throw new ZakatInputError(`${fieldLabel}: من فضلك أدخل عددًا`);
  if (!/^\d+$/.test(text)) throw new ZakatInputError(`${fieldLabel}: اكتب عددًا صحيحًا`);
  const value = Number(text);
  if (value < min || value > max) {
    throw new ZakatInputError(`${fieldLabel}: يجب أن يكون العدد بين ${min} و${max}`);
  }
  return value;
}

/** Same as parseMoney, but an empty field means zero (for optional fields like debts). */
export function parseOptionalMoney(
  input: string | number | undefined | null,
  fieldLabel = "القيمة",
): Piasters {
  if (input === undefined || input === null) return 0n;
  if (typeof input === "string" && input.trim() === "") return 0n;
  return parseMoney(input, fieldLabel);
}

/** value × numerator ÷ denominator, rounded half up. Both inputs must be non-negative. */
export function mulDivRound(value: Piasters, numerator: bigint, denominator: bigint): Piasters {
  return (value * numerator * 2n + denominator) / (denominator * 2n);
}

/** "1,234.50" — digits only; the screen adds the currency word. */
export function formatEGP(value: Piasters): string {
  const whole = (value / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fraction = (value % 100n).toString().padStart(2, "0");
  return `${whole}.${fraction}`;
}

export function maxPiasters(a: Piasters, b: Piasters): Piasters {
  return a > b ? a : b;
}
