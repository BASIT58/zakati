/**
 * Egyptian pounds counted in piasters (1 EGP = 100 piasters),
 * stored as an exact integer so we never hit floating-point errors.
 */
export type Piasters = bigint;

/** One line in the "how we got this number" breakdown shown to the visitor. */
export interface Step {
  label: string;
  value: string;
}

/** A link back to the Dar al-Ifta page that a rule comes from. */
export interface SourceRef {
  title: string;
  url: string;
  fatwaNo?: string;
}

/**
 * due          — zakat is owed.
 * below_nisab  — the amount is under the nisab.
 * no_full_year — nisab reached, but a full Hijri year has not passed.
 * exempt       — the asset carries no zakat at all (e.g. gold worn as adornment).
 */
export type ZakatStatus = "due" | "below_nisab" | "no_full_year" | "exempt";

/** What every calculator returns. */
export interface ZakatResult {
  status: ZakatStatus;
  /** Zakat due, in piasters. Zero when status is not "due". */
  zakat: Piasters;
  /** Nisab for this calculation, in piasters. */
  nisab: Piasters;
  /** Wealth the zakat is measured on (after debts), in piasters. */
  netWealth: Piasters;
  /** One Arabic sentence with the outcome. */
  summary: string;
  steps: Step[];
  sources: SourceRef[];
  /** Date the rules were last checked against Dar al-Ifta (YYYY-MM-DD). */
  lastReviewed: string;
}
