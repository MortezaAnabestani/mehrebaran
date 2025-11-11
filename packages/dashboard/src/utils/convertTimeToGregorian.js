import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";

export const convertToGregorian = (persianDate) => {
  const date = new DateObject({
    date: persianDate.length === 7 ? `${persianDate}/01` : `${persianDate}`,
    calendar: persian,
    locale: persian_fa,
    format: "YYYY-MM-DD",
  }).convert(gregorian, gregorian_en);
  return date.format();
};
