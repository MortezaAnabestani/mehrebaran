"use client";

import React, { useState, useEffect } from "react";
import DatePicker, { DayValue, Day } from "react-modern-calendar-datepicker";

// ─────────────────────────────────────────────────────────────
// Jalali ↔ Gregorian adapter (no external lib needed)
// Algorithm: Borkowski / algorithmic.ir
// ─────────────────────────────────────────────────────────────

function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  const days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1] -
    1;
  let jy = days - 79 > 0 ? 979 : 978;
  const j_d_no = days - 79 > 0 ? days - 79 : days + 286;
  const j_np = Math.floor(j_d_no / 12053);
  let j_d = j_d_no % 12053;
  jy += 33 * j_np + 4 * Math.floor(j_d / 1461);
  j_d %= 1461;
  if (j_d >= 366) {
    jy += Math.floor((j_d - 1) / 365);
    j_d = (j_d - 1) % 365;
  }
  const jm = j_d < 186 ? Math.floor(j_d / 31) + 1 : Math.floor((j_d - 186) / 30) + 7;
  const jd = j_d < 186 ? (j_d % 31) + 1 : ((j_d - 186) % 30) + 1;
  return [jy, jm, jd];
}

function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy = jy <= 979 ? 621 : 1600;
  jy -= jy <= 979 ? 0 : 979;
  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 364) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const gd = days + 1;
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  let remainingDays = gd;
  for (gm = 1; gm <= 12; gm++) {
    if (remainingDays <= sal_a[gm]) break;
    remainingDays -= sal_a[gm];
  }
  return [gy, gm, remainingDays];
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
