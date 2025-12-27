import { FocusAreaModel } from "../modules/focus-areas/focus-area.model";

/**
 * Focus Area Seeder - ایجاد حوزه‌های فعالیت
 */

const focusAreaData = [
  {
    title: "شبکه نیازسنجی",
    description: "شناسایی و پاسخگویی به نیازهای واقعی جامعه از طریق شبکه‌ای از داوطلبان متخصص و متعهد",
    icon: "🤝",
    gradient: "from-blue-500 to-cyan-600",
    order: 0,
    isActive: true,
  },
  {
    title: "محیط زیست",
    description: "پاکسازی طبیعت، درخت‌کاری و ارتقای فرهنگ زیست‌محیطی در جامعه",
    icon: "🌱",
    gradient: "from-green-500 to-emerald-600",
    order: 1,
    isActive: true,
  },
  {
    title: "خیر مؤثر",
    description: "کمک‌های هدفمند و مبتنی بر داده برای بیشینه‌سازی تأثیرگذاری اجتماعی",
    icon: "💡",
    gradient: "from-purple-500 to-pink-600",
    order: 2,
    isActive: true,
  },
  {
    title: "اردوهای جهادی",
    description: "خدمت‌رسانی به مناطق محروم و کمک به توسعه پایدار زیرساخت‌ها",
    icon: "⛺",
    gradient: "from-orange-500 to-red-600",
    order: 3,
    isActive: true,
  },
  {
    title: "مسئولیت اجتماعی",
    description: "آموزش، فرهنگ‌سازی و ارتقای سطح آگاهی و مشارکت اجتماعی",
    icon: "/icons/goal.svg",
    gradient: "from-amber-500 to-yellow-600",
    order: 4,
    isActive: true,
  },
  {
    title: "سلامت و بهداشت",
    description: "کمپین‌های سلامت، ارائه خدمات پزشکی رایگان و آموزش بهداشت عمومی",
    icon: "🏥",
    gradient: "from-rose-500 to-red-600",
    order: 5,
    isActive: true,
  },
];

export async function seedFocusAreas() {
  console.log("🌱 Starting focus area seeder...");

  try {
    // پاک کردن حوزه‌های فعالیت قبلی
    await FocusAreaModel.deleteMany({});
    console.log("  ✓ Cleared existing focus areas");

    // ایجاد حوزه‌های فعالیت
    const focusAreas = await FocusAreaModel.insertMany(focusAreaData);
    console.log(`  ✓ Created ${focusAreas.length} focus areas`);

    return focusAreas;
  } catch (error) {
    console.error("  ✗ Error seeding focus areas:", error);
    throw error;
  }
}
