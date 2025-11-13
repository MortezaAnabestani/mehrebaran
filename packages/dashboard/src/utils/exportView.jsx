import * as XLSX from "xlsx";
import { toPersianDigits } from "./useConvertNumbersToPersian";
import { convertToPersianTime } from "./convertTime";

export const exportView = (view, options = {}) => {
  const { fileName = "آمار_بازدیدهای_سایت", rtl = true } = options;

  if (!Array.isArray(view) || view.length === 0) {
    console.warn("داده‌ای برای خروجی وجود ندارد");
    return;
  }

  let cumulativeTotal = 0; // مجموع بازدیدها تا هر روز

  const formattedData = view.map((item) => {
    const dailyVisits = item.visits || 0;
    cumulativeTotal += dailyVisits;
    return {
      date: item.date?.trim() || toPersianDigits(convertToPersianTime(new Date(), "YYYY/MM/DD")),
      dailyVisits,
      cumulativeTotal,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // تغییر عنوان ستون‌ها به فارسی
  const header = {
    date: "تاریخ",
    dailyVisits: "بازدید روزانه",
    cumulativeTotal: "بازدید تجمیعی",
  };

  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1"; // ردیف ۱
    const key = worksheet[address]?.v;
    if (header[key]) {
      worksheet[address].v = header[key];
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "آمار بازدیدها");

  XLSX.writeFile(workbook, `${fileName}_${convertToPersianTime(new Date(), "YYYY/MM/DD")}.xlsx`);
};
