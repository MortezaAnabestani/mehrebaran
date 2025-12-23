export const toPersianDigits = (str) => {
  if (str === null || str === undefined) return '';
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(str).replace(/\d/g, (d) => persianDigits[d]);
};
