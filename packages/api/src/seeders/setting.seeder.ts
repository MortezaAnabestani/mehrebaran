import { SettingModel } from "../modules/settings/setting.model";

/**
 * Setting Seeder - ایجاد تنظیمات سایت
 */

const settingData = [
  {
    key: "homePageHero",
    value: {
      image: {
        desktop: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920",
        mobile: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=768",
      },
      title: "با هم می‌توانیم دنیا را بهتر کنیم",
      description: "به جمع مهربانان بپیوندید و با کمک‌های خود، امید و شادی را به زندگی افراد نیازمند ببخشید. هر کمکی، کوچک یا بزرگ، می‌تواند زندگی کسی را متحول کند.",
    },
  },
  {
    key: "blogBackground",
    value: {
      image: "https://images.unsplash.com/photo-1542435503-956c469947f6?w=1920",
    },
  },
  {
    key: "whatWeDidStatistics",
    value: {
      totalProjects: 156,
      schoolsCovered: 42,
      budgetRaised: 12500000000, // 12.5 میلیارد تومان
      partnerOrganizations: 28,
      volunteerHours: 45600,
      activeVolunteers: 892,
    },
  },
  {
    key: "completedProjectsPage",
    value: {
      backgroundImage: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920",
      title: "پروژه‌های تکمیل شده ما",
      description: "با افتخار گزارش می‌دهیم که با کمک حامیان و داوطلبان عزیز، پروژه‌های متعددی را با موفقیت تکمیل کرده‌ایم. هر پروژه داستان تلاش جمعی و مهربانی انسان‌هاست.",
    },
  },
  {
    key: "focusPageHero",
    value: {
      title: "حوزه‌های فعالیت",
      subtitle: "کانون مهرباران",
      description:
        "فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی جهت فرهنگ‌سازی، توسعه پایدار و ایجاد تحول مثبت در جامعه",
      stats: {
        projects: { label: "پروژه فعال", value: "۲۲۰+" },
        volunteers: { label: "داوطلب", value: "۱۵۹۰+" },
        beneficiaries: { label: "ذینفع", value: "۱۴۱۰۰+" },
      },
      dockImages: [
        "/images/1.png",
        "/images/2.png",
        "/images/hero_img.jpg",
        "/images/blog_img.jpg",
      ],
    },
  },
];

export async function seedSettings() {
  console.log("🌱 Starting setting seeder...");

  try {
    // پاک کردن تنظیمات قبلی
    await SettingModel.deleteMany({});
    console.log("  ✓ Cleared existing settings");

    // ایجاد تنظیمات
    const settings = await SettingModel.insertMany(settingData);
    console.log(`  ✓ Created ${settings.length} settings`);

    return settings;
  } catch (error) {
    console.error("  ✗ Error seeding settings:", error);
    throw error;
  }
}
