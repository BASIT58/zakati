import fitr from "../../data/fitr.json";
import { formatEGP, parseCount, parseMoney, ZakatInputError } from "../decimal";
import type { ZakatResult } from "../types";
import { egp } from "./shared";

export const FITR_MIN_PER_PERSON = parseMoney(fitr.minPerPersonEgp);

export interface FitrInput {
  /** Number of people you pay for (yourself and those you support). */
  persons: string | number;
  /** Amount per person. Optional: defaults to the minimum announced by Dar al-Ifta. */
  perPerson?: string | number;
}

/**
 * Zakat al-Fitr: a fixed amount per person, set every year by Dar al-Ifta.
 * The announced value is the MINIMUM; paying more is encouraged, paying less is not accepted here.
 */
export function calculateFitr(input: FitrInput): ZakatResult {
  const persons = parseCount(input.persons, "عدد الأفراد");

  const hasOwn = !(
    input.perPerson === undefined ||
    input.perPerson === null ||
    (typeof input.perPerson === "string" && input.perPerson.trim() === "")
  );
  const perPerson = hasOwn ? parseMoney(input.perPerson as string | number, "المبلغ عن الفرد") : FITR_MIN_PER_PERSON;

  if (perPerson < FITR_MIN_PER_PERSON) {
    throw new ZakatInputError(
      `المبلغ عن الفرد أقل من الحد الأدنى المعلن (${formatEGP(FITR_MIN_PER_PERSON)} جنيه)`,
    );
  }

  const total = perPerson * BigInt(persons);
  return {
    status: "due",
    zakat: total,
    nisab: 0n,
    netWealth: 0n,
    summary: `زكاة الفطر عن ${persons} فرد: ${formatEGP(total)} جنيه.`,
    steps: [
      { label: `الحد الأدنى المعلن لعام ${fitr.hijriYear}هـ`, value: `${egp(FITR_MIN_PER_PERSON)} عن الفرد` },
      { label: "المبلغ المحسوب عن الفرد", value: egp(perPerson) },
      { label: "عدد الأفراد", value: String(persons) },
      { label: "الإجمالي = المبلغ × العدد", value: egp(total) },
    ],
    sources: [fitr.source],
    lastReviewed: fitr.lastReviewed,
  };
}
