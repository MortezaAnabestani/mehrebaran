"use client";

import React, { useState, useEffect } from "react";
import DatePicker, { DayValue, Day } from "react-modern-calendar-datepicker";

// ─────────────────────────────────────────────────────────────
// Jalali ↔ Gregorian adapter (no external lib needed)
// Algorithm: Borkowski / algorithmic.ir
// ─────────────────────────────────────────────────────────────

function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_no = 365 * gy + div(gy + 3, 4) - div(gy + 99, 100) + div(gy + 399, 400);
  let j_d_no = g_d_no - 79;

  const j_np = div(j_d_no, 12053);
  j_d_no %= 12053;

  let jy = 979 + 33 * j_np + 4 * div(j_d_no, 1461);
  j_d_no %= 1461;

  if (j_d_no >= 366) {
    jy += div(j_d_no - 1, 365);
    j_d_no = (j_d_no - 1) % 365;
  }

  const monthDays = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let jm = 0;
  let jd = 0;
  let remaining = j_d_no;

  for (let i = 1; i <= 12; i++) {
    if (remaining < monthDays[i]) {
      jm = i;
      jd = remaining + 1;
      break;
    }
    remaining -= monthDays[i];
  }

  // subtract gm/gd offset (align to start of year)
  // recalculate properly from day-of-year
  return jalaliFromDayOfYear(jy, j_d_no);
}

function jalaliFromDayOfYear(jy: number, dayOfYear: number): [number, number, number] {
  const monthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let remaining = dayOfYear;
  for (let m = 0; m < 12; m++) {
    if (remaining < monthLengths[m]) {
      return [jy, m + 1, remaining + 1];
    }
    remaining -= monthLengths[m];
  }
  return [jy, 12, 29];
}

function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy: number;
  let gm: number;
  let gd: number;

  jy += 1595;
  const days =
    -355779 +
    365 * jy +
    div(jy, 33) * 8 +
    div((jy % 33) + 3, 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  gy = 400 * div(days, 146097);
  let d = days % 146097;

  if (d > 36524) {
    gy += 100 * div(--d, 36524);
    d %= 36524;
    if (d >= 365) d++;
  }

  gy += 4 * div(d, 1461);
  d %= 1461;

  if (d > 364) {
    gy += div(d - 1, 365);
    d = (d - 1) % 365;
  }

  const sal_a = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  gd = d + 1;
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) {
    gd -= sal_a[gm];
  }

  return [gy, gm, gd];
}

function div(a: number, b: number): number {
  return Math.floor(a / b);
}

// ─────────────────────────────────────────────────────────────
// Date adapter: ISO string ↔ Jalali Day object
// ─────────────────────────────────────────────────────────────

/**
 * Converts a Gregorian ISO date string (YYYY-MM-DD or full ISO) to a Jalali Day object.
 * Returns undefined on invalid input — never null.
 */
function isoToJalali(isoDate: string): Day | undefined {
  if (!isoDate) return undefined;
  try {
    // Parse date parts directly to avoid timezone shifts
    const [datePart] = isoDate.split("T");
    const [gy, gm, gd] = datePart.split("-").map(Number);
    if (!gy || !gm || !gd) return undefined;

    const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
    return { year: jy, month: jm, day: jd };
  } catch {
    return undefined;
  }
}

/**
 * Converts a Jalali Day object to a Gregorian ISO date string (YYYY-MM-DD).
 * Returns empty string on invalid input.
 */
function jalaliToIso(day: Day): string {
  try {
    const [gy, gm, gd] = jalaliToGregorian(day.year, day.month, day.day);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${gy}-${pad(gm)}-${pad(gd)}`;
  } catch {
    return "";
  }
}

// ─────────────────────────────────────────────────────────────
// Locale definition
// ─────────────────────────────────────────────────────────────

const PERSIAN_LOCALE = {
  months: [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ],
  weekDays: [
    { name: "شنبه", short: "ش" },
    { name: "یکشنبه", short: "ی" },
    { name: "دوشنبه", short: "د" },
    { name: "سه‌شنبه", short: "س" },
    { name: "چهارشنبه", short: "چ" },
    { name: "پنج‌شنبه", short: "پ" },
    { name: "جمعه", short: "ج", isWeekend: true },
  ],
  weekStartingIndex: 6,
  getToday: (gregorianToday: Day) => {
    const [jy, jm, jd] = gregorianToJalali(gregorianToday.year, gregorianToday.month, gregorianToday.day);
    return { year: jy, month: jm, day: jd };
  },
  toNativeDate: (date: Day) => {
    const [gy, gm, gd] = jalaliToGregorian(date.year, date.month, date.day);
    return new Date(gy, gm - 1, gd);
  },
  getMonthLength: (date: Day) => {
    if (date.month <= 6) return 31;
    if (date.month <= 11) return 30;
    const isLeap = ((((date.year - 474) % 2820) + 474 + 38) * 682) % 2816 < 682;
    return isLeap ? 30 : 29;
  },
  transformDigit: (digit: string | number) => String(digit),
  nextMonth: "ماه بعد",
  previousMonth: "ماه قبل",
  openMonthSelector: "انتخاب ماه",
  openYearSelector: "انتخاب سال",
  closeMonthSelector: "بستن",
  closeYearSelector: "بستن",
  defaultPlaceholder: "انتخاب...",
  from: "از",
  to: "تا",
  digitSeparator: "،",
  yearLetterSkip: 0,
  isRtl: true,
} as const;

// ─────────────────────────────────────────────────────────────
// Component props
// ─────────────────────────────────────────────────────────────

interface PersianDatePickerProps {
  /** Gregorian ISO date string (YYYY-MM-DD or full ISO) */
  value: string;
  /** Called with a Gregorian ISO date string (YYYY-MM-DD) or "" when cleared */
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  /** Jalali minimum date */
  minimumDate?: Day;
  /** Jalali maximum date */
  maximumDate?: Day;
  disabled?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "انتخاب تاریخ",
  minimumDate,
  maximumDate,
  disabled = false,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Derive Jalali day from the ISO prop — no redundant state needed
  const selectedDay: DayValue = value ? (isoToJalali(value) ?? undefined) : undefined;

  const handleChange = (day: DayValue) => {
    // DayValue = Day | null — normalise null → ""
    onChange(day ? jalaliToIso(day) : "");
  };

  // SSR / hydration guard — render a stable skeleton
  if (!mounted) {
    return (
      <div className={`w-full ${className}`}>
        {label && <label className="block text-sm font-bold mb-2">{label}</label>}
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 animate-pulse">
          <span className="text-gray-400 text-sm">{placeholder}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} dir="rtl">
      {label && <label className="block text-sm font-bold mb-2 text-right">{label}</label>}
      <DatePicker
        value={selectedDay}
        onChange={handleChange}
        inputPlaceholder={placeholder}
        // locale={PERSIAN_LOCALE}
        shouldHighlightWeekends
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        colorPrimary="#0ea5e9"
        colorPrimaryLight="rgba(14, 165, 233, 0.1)"
        calendarClassName="custom-calendar"
        inputClassName={`
          w-full px-4 py-3 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-sky-500
          text-right bg-white
          disabled:opacity-50 disabled:cursor-not-allowed
          ${disabled ? "pointer-events-none opacity-50" : ""}
        `}
      />
    </div>
  );
};

export default PersianDatePicker;

// ─────────────────────────────────────────────────────────────
// Re-export adapter for external use (e.g. form validation)
// ─────────────────────────────────────────────────────────────
export { isoToJalali, jalaliToIso, gregorianToJalali, jalaliToGregorian };
export type { Day };
