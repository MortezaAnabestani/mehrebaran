import dayjs from "dayjs";
import jalali from "jalali-dayjs"; // پلاگین شمسی

import "dayjs/locale/fa";

dayjs.extend(jalali); // فعال‌سازی تقویم شمسی
dayjs.locale("fa"); // اعمال زبان فارسی

export const convertToPersianTime = (date, format = "DD/MM/YYYY") => {
  const d = dayjs(date);
  if (!d.isValid()) return "تاریخ نامعتبر";
  return d.format(format);
};
