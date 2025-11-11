const decodeHTMLEntities = (html) => {
  if (!html) return "";

  // لیست کامل موجودیت‌های HTML و معادل UTF-8 آنها
  const entityMap = {
    // فاصله‌ها و علائم نگارشی فارسی
    "&zwnj;": "\u200C", // نیم‌فاصله
    "&nbsp;": " ", // فاصله غیرشکستنی
    "&laquo;": "«", // گیومه باز
    "&raquo;": "»", // گیومه بسته
    "&lt;": "<", // کمتر از
    "&gt;": ">", // بیشتر از
    "&amp;": "&", // آمپرسند
    "&quot;": '"', // دبل کوتیشن
    "&apos;": "'", // تک کوتیشن

    // حروف فارسی و علائم خاص
    "&shy;": "\u00AD", // خط تیره شرطی
    "&rlm;": "\u200F", // راست به چپ
    "&lrm;": "\u200E", // چپ به راست

    // اعداد و نمادها
    "&times;": "×", // علامت ضربدر
    "&divide;": "÷", // علامت تقسیم
    "&plusmn;": "±", // علامت مثبت/منفی

    // موجودیت‌های عددی (مثال: &#1617;)
    "&#x200C;": "\u200C", // نیم‌فاصله به صورت عددی
    "&#8204;": "\u200C", // نیم‌فاصله به صورت عددی
    "&#x200F;": "\u200F", // RLM به صورت عددی
    "&#8207;": "\u200F", // RLM به صورت عددی
  };

  // جایگزینی موجودیت‌های شناخته شده
  let decoded = html;
  for (const [entity, char] of Object.entries(entityMap)) {
    decoded = decoded.split(entity).join(char);
  }

  // حذف تمام تگ‌های HTML (بهبود یافته)
  decoded = decoded.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/gi, "");

  // حذف کامنت‌های HTML
  decoded = decoded.replace(/<!--[\s\S]*?-->/g, "");

  // تبدیل موجودیت‌های عددی ناشناخته (مثال: &#1234;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });

  // تبدیل موجودیت‌های هگز ناشناخته (مثال: &#x1f600;)
  decoded = decoded.replace(/&#x([a-f0-9]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
};

const truncateText = (html, maxLength) => {
  const decoded = decodeHTMLEntities(html);
  if (!decoded || decoded.length <= maxLength) return decoded;

  // کوتاه کردن متن با حفظ آخرین کلمه کامل
  const truncated = decoded.substr(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.substr(0, lastSpace) : truncated) + "...";
};

export default truncateText;
