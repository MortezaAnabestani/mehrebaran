import * as XLSX from "xlsx";

/**
 * تبدیل داده‌های UTM Stats به Excel و دانلود
 * @param {Array} data - آرایه داده‌های UTM Stats
 * @param {string} fileName - نام فایل خروجی (بدون پسوند)
 */
export const exportToExcel = (data, fileName = "utm_stats") => {
  const formattedData = data.map((item) => ({
    "نام کمپین": item._id.utmCampaign,
    "سکوی ورود": item._id.utmSource,
    "نوع ورود": item._id.utmMedium,
    "تعداد بازدیدها": item.count,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "UTM Stats");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
