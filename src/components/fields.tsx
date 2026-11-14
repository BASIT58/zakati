"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ZakatInputError } from "@/core/decimal";
import type { ZakatResult } from "@/core/types";
import { ResultSteps } from "./ResultSteps";

const inputClass =
  "w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-lg outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

interface TextFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** A text box for an amount or a number. Uses text + decimal keypad so Arabic digits also work. */
export function TextField({ id, label, hint, value, onChange, placeholder }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-bold text-brand-800">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      {hint && <p className="mt-1 text-sm leading-7 text-ink/70">{hint}</p>}
    </div>
  );
}

export function GoldPriceField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <TextField
      id="gold"
      label="سعر جرام الذهب عيار 21 اليوم (بالجنيه)"
      hint="تعتمد دار الإفتاء نصاب 85 جرامًا من الذهب عيار 21. اكتب سعر الجرام اليوم من مصدر موثوق."
      value={value}
      onChange={onChange}
      placeholder="مثال: 5000"
    />
  );
}

interface ChoiceOption<T extends string | boolean> {
  value: T;
  label: string;
}

interface ChoiceFieldProps<T extends string | boolean> {
  name: string;
  legend: string;
  hint?: string;
  value: T | null;
  onChange: (value: T) => void;
  options: ChoiceOption<T>[];
}

export function ChoiceField<T extends string | boolean>({
  name,
  legend,
  hint,
  value,
  onChange,
  options,
}: ChoiceFieldProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 font-bold text-brand-800">{legend}</legend>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {options.map((option) => (
          <label key={String(option.value)} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-5 w-5 accent-brand-700"
            />
            {option.label}
          </label>
        ))}
      </div>
      {hint && <p className="mt-1 text-sm leading-7 text-ink/70">{hint}</p>}
    </fieldset>
  );
}

interface YesNoFieldProps {
  name: string;
  legend: string;
  hint?: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export function YesNoField(props: YesNoFieldProps) {
  return (
    <ChoiceField
      {...props}
      options={[
        { value: true, label: "نعم" },
        { value: false, label: "لا" },
      ]}
    />
  );
}

export const FULL_YEAR_LEGEND = "هل مرّ على المال حول هجري كامل (سنة قمرية) وهو بالغ النصاب؟";

interface FormFrameProps {
  /** Runs the calculation. Throw ZakatInputError (or return an error string) for bad input. */
  compute: () => ZakatResult;
  onReset: () => void;
  children: ReactNode;
}

/**
 * The shared form shell: submit button, reset button, error box, and the result below.
 * A missing radio answer is reported by the form by throwing ZakatInputError from `compute`.
 */
export function FormFrame({ compute, onReset, children }: FormFrameProps) {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ZakatResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setResult(compute());
      setError(null);
    } catch (err) {
      if (err instanceof ZakatInputError) {
        setResult(null);
        setError(err.message);
        return;
      }
      throw err;
    }
  }

  function handleReset() {
    onReset();
    setError(null);
    setResult(null);
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-2xl border border-brand-100 bg-white p-6"
      >
        {children}

        {error && (
          <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-800">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-brand-700 px-8 py-3 text-lg font-bold text-white transition duration-200 hover:bg-brand-800 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            احسب الزكاة
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-brand-200 px-6 py-3 font-semibold text-brand-800 transition hover:border-brand-600"
          >
            مسح
          </button>
        </div>
      </form>

      {result && <ResultSteps result={result} />}
    </div>
  );
}

/** Raised by a form when a radio question was left unanswered. */
export function requireAnswer<T>(value: T | null, message: string): T {
  if (value === null) throw new ZakatInputError(message);
  return value;
}
