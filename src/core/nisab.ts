import rules from "../data/rules.json";
import { mulDivRound, ZakatInputError } from "./decimal";
import type { Piasters } from "./types";

/** Gold nisab in grams (85) — the Dar al-Ifta standard, measured in karat 21. */
export const GOLD_NISAB_GRAMS = BigInt(rules.nisab.goldGrams);

/** Zakat rate as a fraction: 25 / 1000 = 2.5% (ربع العشر). */
export const RATE_NUMERATOR = BigInt(rules.rate.numerator);
export const RATE_DENOMINATOR = BigInt(rules.rate.denominator);
export const RATE_LABEL: string = rules.rate.label;

/**
 * Nisab in piasters = 85 grams × today's price of one gram of karat-21 gold.
 * The price is typed by the visitor, so we refuse zero or nonsense.
 */
export function goldNisab(pricePerGram21: Piasters): Piasters {
  if (pricePerGram21 <= 0n) {
    throw new ZakatInputError("سعر جرام الذهب عيار 21 يجب أن يكون أكبر من صفر");
  }
  return pricePerGram21 * GOLD_NISAB_GRAMS;
}

/** Zakat on an amount at 2.5%, rounded half up to the nearest piaster. */
export function zakatOf(base: Piasters): Piasters {
  return mulDivRound(base, RATE_NUMERATOR, RATE_DENOMINATOR);
}
