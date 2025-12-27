export function formatNumberHumanReadable(number: number, includeUnit: boolean = false): string {
  if (number === 0) return "0";

  const parts: string[] = [];

  const billion = Math.floor(number / 1_000_000_000);
  const million = Math.floor((number % 1_000_000_000) / 1_000_000);
  const thousand = Math.floor((number % 1_000_000) / 1_000);
  const remainder = number % 1_000;

  if (billion > 0) {
    parts.push(`${billion} میلیارد`);
  }

  if (million > 0) {
    parts.push(`${million} میلیون`);
  }

  if (thousand > 0) {
    parts.push(`${thousand} هزار`);
  }

  // اگر عددی کمتر از 1000 باشد، خود عدد را نمایش بده
  if (parts.length === 0 && remainder > 0) {
    parts.push(remainder.toLocaleString('fa-IR'));
  }

  const result = parts.join(" و ");
  return includeUnit ? result + " تومان" : result;
}
