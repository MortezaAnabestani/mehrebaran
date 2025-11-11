"use client";

import React, { useState, useEffect } from "react";
import DatePicker, { DayValue } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

interface PersianDatePickerProps {
  value: string; // ISO date string
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minimumDate?: DayValue;
  maximumDate?: DayValue;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "انتخاب تاریخ",
  minimumDate,
  maximumDate,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
    // Add a small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => {
      clearTimeout(timer);
      setMounted(false);
      setIsReady(false);
    };
  }, []);

  // Convert ISO string to Persian date object
  const isoToPersian = (isoDate: string): DayValue => {
    if (!isoDate) return null;
    try {
      const date = new Date(isoDate);
      // Simple conversion (you may want to use a library like moment-jalaali for accurate conversion)
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return { year, month, day };
    } catch (error) {
      console.error("Error converting ISO to Persian:", error);
      return null;
    }
  };

  // Convert Persian date object to ISO string
  const persianToIso = (persianDate: DayValue): string => {
    if (!persianDate) return "";
    try {
      // Simple conversion (you may want to use a library like moment-jalaali for accurate conversion)
      const { year, month, day } = persianDate;
      const date = new Date(year, month - 1, day);
      return date.toISOString();
    } catch (error) {
      console.error("Error converting Persian to ISO:", error);
      return "";
    }
  };

  const [selectedDay, setSelectedDay] = useState<DayValue>(
    value ? isoToPersian(value) : null
  );

  const handleDateChange = (date: DayValue) => {
    setSelectedDay(date);
    onChange(persianToIso(date));
  };

  // Don't render until mounted and ready to avoid SSR and DOM issues
  if (!mounted || !isReady) {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-bold mb-2">{label}</label>}
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-gray-400">در حال بارگذاری تقویم...</span>
        </div>
      </div>
    );
  }

  const myCustomLocale = {
    // months list by order
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

    // week days by order
    weekDays: [
      {
        name: "شنبه",
        short: "ش",
      },
      {
        name: "یکشنبه",
        short: "ی",
      },
      {
        name: "دوشنبه",
        short: "د",
      },
      {
        name: "سه‌شنبه",
        short: "س",
      },
      {
        name: "چهارشنبه",
        short: "چ",
      },
      {
        name: "پنج‌شنبه",
        short: "پ",
      },
      {
        name: "جمعه",
        short: "ج",
        isWeekend: true,
      },
    ],

    // just play around with this number between 0 and 6
    weekStartingIndex: 6,

    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject: any) {
      return gregorainTodayObject;
    },

    // return a native JavaScript date here
    toNativeDate(date: any) {
      return new Date(date.year, date.month - 1, date.day);
    },

    // return a number for date's month length
    getMonthLength(date: any) {
      if (date.month <= 6) return 31;
      if (date.month <= 11) return 30;
      // Check for leap year
      const isLeap = ((date.year % 33) * 8 + 13) % 33 < 8;
      return isLeap ? 30 : 29;
    },

    // return a transformed digit to your locale
    transformDigit(digit: any) {
      return digit;
    },

    // texts in the date picker
    nextMonth: "ماه بعد",
    previousMonth: "ماه قبل",
    openMonthSelector: "انتخاب ماه",
    openYearSelector: "انتخاب سال",
    closeMonthSelector: "بستن",
    closeYearSelector: "بستن",
    defaultPlaceholder: "انتخاب...",

    // for input range value
    from: "از",
    to: "تا",

    // used for input value when multi dates are selected
    digitSeparator: "،",

    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,

    // is your language rtl or ltr?
    isRtl: true,
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold mb-2">{label}</label>}
      <DatePicker
        value={selectedDay}
        onChange={handleDateChange}
        inputPlaceholder={placeholder}
        locale={myCustomLocale}
        shouldHighlightWeekends
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        colorPrimary="#0ea5e9" // mblue color
        colorPrimaryLight="rgba(14, 165, 233, 0.1)"
        calendarClassName="custom-calendar"
        inputClassName="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue text-right"
      />
    </div>
  );
};

export default PersianDatePicker;
