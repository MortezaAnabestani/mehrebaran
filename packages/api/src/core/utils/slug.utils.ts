export const createPersianSlug = (text: string): string => {
  if (!text) {
    return "";
  }

  const persianNumbers: { [key: string]: string } = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };

  let processedText = text
    .normalize("NFD")
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");

  processedText = processedText.replace(
    /[^a-zA-Z0-9\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]/g,
    ""
  );

  processedText = processedText.replace(/[۰-۹]/g, (char) => persianNumbers[char]);

  const slug = processedText.trim().replace(/\s+/g, "-").replace(/-+/g, "-");

  return slug;
};
