import { Variants } from "framer-motion";

export const FADE_IN_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const STATS = [
  { value: "۱۵۹۰+", label: "داوطلب فعال" },
  { value: "۲۲۰+", label: "پروژه انجام شده" },
  { value: "۱۴۱۰۰+", label: "ذینفع" },
];

export const ACTIVITIES = [
  { title: "آموزش و پرورش", desc: "برگزاری کلاس‌های آموزشی رایگان برای دانش‌آموزان" },
  { title: "فرهنگی و هنری", desc: "برگزاری رویدادهای فرهنگی و هنری" },
  { title: "محیط زیست", desc: "طرح‌های حفاظت از محیط زیست و کاشت درخت" },
  { title: "سلامت", desc: "ارائه خدمات بهداشتی و درمانی به نیازمندان" },
  { title: "کمک‌های معیشتی", desc: "جمع‌آوری و توزیع کمک‌های مردمی" },
  { title: "توانمندسازی", desc: "آموزش مهارت‌های شغلی و کارآفرینی" },
];

export const SectionHeader = ({ title }: { title: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{title}</h2>
    <div className="w-20 h-1 bg-mblue mx-auto rounded-full"></div>
  </div>
);
