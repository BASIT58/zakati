"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { CalculatorInfo } from "@/data/calculators";

const AUTO_MS = 3500;
const SWIPE_PX = 40;

/**
 * Cards to pick a calculator from. The chosen card sits in the middle, bigger and green;
 * the others are smaller and white, so only one card ever has the "selected" look.
 * Moves by itself every few seconds (loops), and stops while the visitor is touching,
 * hovering or focused on it. Swipe, arrows, dots and keyboard also work.
 */
export function CalculatorCarousel({ items }: { items: CalculatorInfo[] }) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startX = useRef<number | null>(null);
  const dragged = useRef(false);

  const go = (next: number) => setIndex(((next % n) + n) % n);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // One timer per card: any manual move changes `index`, which restarts the wait.
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % n), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reducedMotion, n]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    // The stage is laid out left-to-right, later cards sit further left.
    if (e.key === "ArrowLeft") go(index + 1);
    if (e.key === "ArrowRight") go(index - 1);
  }

  return (
    <div>
      <div
        dir="ltr"
        role="group"
        aria-roledescription="شريط البطاقات"
        aria-label="اختر نوع الزكاة"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={(e) => {
          startX.current = e.clientX;
          dragged.current = false;
          setPaused(true);
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = startX.current - e.clientX;
          startX.current = null;
          if (Math.abs(dx) > SWIPE_PX) {
            dragged.current = true;
            go(index + (dx > 0 ? 1 : -1));
          }
          // On touch screens there is no "leave", so resume right after the finger lifts.
          if (e.pointerType !== "mouse") setPaused(false);
        }}
        onPointerCancel={() => {
          startX.current = null;
          setPaused(false);
        }}
        style={{ touchAction: "pan-y" }}
        className="relative mx-auto h-[25rem] max-w-5xl select-none overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-brand-600 [--step:9rem] sm:h-[26rem] sm:[--step:15rem]"
      >
        {items.map((item, i) => {
          let offset = i - index;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const active = offset === 0;
          const visible = Math.abs(offset) <= 3;
          const scale = active ? 1 : Math.abs(offset) === 1 ? 0.86 : 0.74;

          return (
            <div
              key={item.slug}
              dir="rtl"
              aria-hidden={!active}
              onClick={active ? undefined : () => !dragged.current && go(i)}
              style={{
                transform: `translateX(calc(-50% + ${-offset} * var(--step))) scale(${scale})`,
                zIndex: 10 - Math.abs(offset),
                opacity: !visible ? 0 : active ? 1 : Math.abs(offset) === 1 ? 0.8 : 0.45,
                willChange: "transform, opacity",
                transition: visible
                  ? "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease"
                  : "none",
                pointerEvents: visible ? "auto" : "none",
              }}
              className={`absolute start-auto left-1/2 top-4 flex h-[22rem] w-60 cursor-pointer flex-col items-center rounded-3xl border-2 p-6 text-center sm:w-72 ${
                active
                  ? "border-gold-500 bg-brand-800 text-white shadow-xl"
                  : "border-brand-200 bg-white text-brand-900"
              }`}
            >
              {active && (
                <span className="absolute -top-3 rounded-full bg-gold-500 px-3 py-0.5 text-xs font-bold text-brand-900">
                  المختار
                </span>
              )}
              <span aria-hidden="true" className="mt-4 text-5xl">
                {item.icon}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold">{item.title}</h2>
              <p className={`mt-3 leading-8 ${active ? "text-brand-100" : "text-ink/70"}`}>{item.description}</p>
              {active && (
                <Link
                  href={`/calculators/${item.slug}`}
                  className="mt-auto w-full rounded-full bg-gold-500 px-6 py-3 text-lg font-bold text-brand-900 transition hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  احسب الآن
                </Link>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="البطاقة التالية"
          className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand-600 bg-white/90 text-2xl text-brand-700 transition hover:bg-brand-50"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="البطاقة السابقة"
          className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand-600 bg-white/90 text-2xl text-brand-700 transition hover:bg-brand-50"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="اختيار البطاقة">
        {items.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={item.title}
            onClick={() => go(i)}
            className={`h-3 rounded-full transition-all ${i === index ? "w-8 bg-brand-700" : "w-3 bg-brand-200"}`}
          />
        ))}
      </div>
    </div>
  );
}
