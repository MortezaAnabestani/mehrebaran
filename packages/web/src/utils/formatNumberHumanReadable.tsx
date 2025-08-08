export function formatNumberHumanReadable(number: number): string {
  if (number === 0) return "0";

  const parts: string[] = [];

  const billion = Math.floor(number / 1_000_000_000);
  const million = Math.floor((number % 1_000_000_000) / 1_000_000);
  const thousand = Math.floor((number % 1_000_000) / 1_000);

  if (billion > 0) {
    parts.push(`${billion} میلیارد`);
  }

  if (million > 0) {
    parts.push(`${million} میلیون`);
  }

  if (thousand > 0) {
    parts.push(`${thousand} هزار`);
  }

  return parts.join(" و ") + " تومان";
}
