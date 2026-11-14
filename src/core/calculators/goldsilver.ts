import rules from "../../data/rules.json";
import { formatEGP, mulDivRound, parseMoney, parseOptionalMoney, ZakatInputError } from "../decimal";
import { goldNisab, RATE_LABEL, zakatOf } from "../nisab";
import type { Piasters, Step, ZakatResult, ZakatStatus } from "../types";
import { egp, LAST_REVIEWED, priceAndNisabRows } from "./shared";

/** savings = kept as savings / investment; adornment = worn as jewellery within one's custom. */
export type GoldPurpose = "savings" | "adornment";

export interface GoldSilverInput {
  /** Grams of pure gold (karat 24). Optional. */
  gold24?: string | number;
  /** Grams of karat-21 gold. Optional. */
  gold21?: string | number;
  /** Grams of karat-18 gold. Optional. */
  gold18?: string | number;
  /** Grams of silver. Optional. */
  silverGrams?: string | number;
  /** Price of one gram of silver. Required only when silver is entered. */
  silverPrice?: string | number;
  goldPrice21: string | number;
  purpose: GoldPurpose;
  fullYearPassed: boolean;
}

const SOURCES = [
  rules.sources.adornment,
  rules.sources.adornmentWomen,
  rules.sources.nisabKarat21,
  rules.sources.conditions,
];

const GOLD_NISAB_HUNDREDTHS = BigInt(rules.nisab.goldGrams) * 100n;
const SILVER_NISAB_HUNDREDTHS = BigInt(rules.nisab.silverGrams) * 100n;
const KARAT = BigInt(rules.nisab.goldKarat);

/** Grams are held as hundredths of a gram, using the same two-decimal parser as money. */
function grams(value: string | number | undefined, label: string): bigint {
  return parseOptionalMoney(value, label);
}

/**
 * Gold: the nisab is 85 g of karat-21 gold, so other karats are converted to karat-21 equivalents
 * (grams × karat ÷ 21). Silver: nisab 595 g. Gold and silver are judged separately.
 * Gold or silver kept as normal adornment carries no zakat (fatwa 3171).
 */
export function calculateGoldSilverZakat(input: GoldSilverInput): ZakatResult {
  if (input.purpose !== "savings" && input.purpose !== "adornment") {
    throw new ZakatInputError("اختر الغرض: ادخار أم زينة");
  }

  const g24 = grams(input.gold24, "ذهب عيار 24");
  const g21 = grams(input.gold21, "ذهب عيار 21");
  const g18 = grams(input.gold18, "ذهب عيار 18");
  const silver = grams(input.silverGrams, "الفضة");
  const price = parseMoney(input.goldPrice21, "سعر جرام الذهب عيار 21");

  if (g24 + g21 + g18 + silver === 0n) {
    throw new ZakatInputError("أدخل وزن الذهب أو الفضة بالجرام");
  }

  let silverPrice = 0n;
  if (silver > 0n) {
    silverPrice = parseMoney(input.silverPrice ?? "", "سعر جرام الفضة");
    if (silverPrice <= 0n) throw new ZakatInputError("سعر جرام الفضة يجب أن يكون أكبر من صفر");
  }

  const nisab = goldNisab(price);

  // weighted = Σ grams(hundredths) × karat. Equivalent karat-21 hundredths = weighted ÷ 21.
  const weighted = g24 * 24n + g21 * KARAT + g18 * 18n;
  const goldEquivalent = mulDivRound(weighted, 1n, KARAT);
  const goldReached = weighted >= GOLD_NISAB_HUNDREDTHS * KARAT;
  const goldValue: Piasters = mulDivRound(price * weighted, 1n, KARAT * 100n);

  const silverReached = silver >= SILVER_NISAB_HUNDREDTHS;
  const silverValue: Piasters = mulDivRound(silverPrice * silver, 1n, 100n);

  const rows: Step[] = [...priceAndNisabRows(price, nisab)];
  if (weighted > 0n) {
    rows.push(
      { label: "الذهب بما يعادل عيار 21", value: `${formatEGP(goldEquivalent)} جرام` },
      {
        label: `نصاب الذهب (${rules.nisab.goldGrams} جرام عيار 21)`,
        value: goldReached ? "بلغه" : "لم يبلغه",
      },
      { label: "قيمة الذهب", value: egp(goldValue) },
    );
  }
  if (silver > 0n) {
    rows.push(
      { label: "الفضة", value: `${formatEGP(silver)} جرام` },
      {
        label: `نصاب الفضة (${rules.nisab.silverGrams} جرام)`,
        value: silverReached ? "بلغه" : "لم يبلغه",
      },
      { label: "قيمة الفضة", value: egp(silverValue) },
    );
  }

  const worth = goldValue + silverValue;
  const base = { nisab, netWealth: worth, sources: SOURCES, lastReviewed: LAST_REVIEWED };
  const result = (status: ZakatStatus, zakat: Piasters, summary: string, extra: Step[]): ZakatResult => ({
    ...base,
    status,
    zakat,
    summary,
    steps: [...rows, ...extra],
  });

  if (input.purpose === "adornment") {
    return result(
      "exempt",
      0n,
      "الحلي المتخذ للزينة بحسب عُرف صاحبه لا زكاة فيه.",
      [
        { label: "الغرض", value: "زينة" },
        { label: "النتيجة", value: "لا زكاة" },
        {
          label: "تنبيه",
          value: "إن تغيّرت نيتك إلى الادخار فإن الزكاة تجب من وقت تغيّر النية",
        },
      ],
    );
  }

  if (!goldReached && !silverReached) {
    return result("below_nisab", 0n, "الذهب والفضة أقل من النصاب، فلا زكاة عليك.", [
      { label: "النتيجة", value: "لم يبلغ أي منهما النصاب" },
    ]);
  }

  if (!input.fullYearPassed) {
    return result(
      "no_full_year",
      0n,
      "بلغ النصاب لكن لم يمرّ حول هجري كامل، فلا تجب الزكاة الآن.",
      [{ label: "مرور حول هجري كامل", value: "لا" }],
    );
  }

  const zakat = zakatOf(goldReached ? goldValue : 0n) + zakatOf(silverReached ? silverValue : 0n);
  return result("due", zakat, `الزكاة المستحقة: ${formatEGP(zakat)} جنيه.`, [
    { label: "مرور حول هجري كامل", value: "نعم" },
    { label: `الزكاة = ${RATE_LABEL} × القيمة`, value: egp(zakat) },
  ]);
}
