import { SectionModel } from "../modules/sections/section.model";

/**
 * Section Seeder - ایجاد بخش‌های محتوایی
 */

const sectionData = [
  {
    title: "مقالات اجتماعی",
    slug: "social-articles",
    description: "مقالات و تحلیل‌های اجتماعی",
    type: "article",
    isActive: true,
  },
  {
    title: "گزارش‌های میدانی",
    slug: "field-reports",
    description: "گزارش‌های میدانی از پروژه‌ها و فعالیت‌ها",
    type: "article",
    isActive: true,
  },
  {
    title: "داستان‌های موفقیت",
    slug: "success-stories",
    description: "داستان‌های الهام‌بخش از تغییرات اجتماعی",
    type: "article",
    isActive: true,
  },
  {
    title: "آموزش و توانمندسازی",
    slug: "education-empowerment",
    description: "مطالب آموزشی و راهنماهای توانمندسازی",
    type: "article",
    isActive: true,
  },
  {
    title: "اخبار و رویدادها",
    slug: "news-events",
    description: "آخرین اخبار و رویدادهای اجتماعی",
    type: "news",
    isActive: true,
  },
  {
    title: "محیط زیست",
    slug: "environment",
    description: "اخبار و مقالات محیط زیست",
    type: "article",
    isActive: true,
  },
  {
    title: "سلامت و درمان",
    slug: "health",
    description: "مطالب مرتبط با سلامت و بهداشت",
    type: "article",
    isActive: true,
  },
  {
    title: "ویدیوهای آموزشی",
    slug: "educational-videos",
    description: "ویدیوهای آموزشی و مستندهای اجتماعی",
    type: "video",
    isActive: true,
  },
  {
    title: "مصاحبه و گفتگو",
    slug: "interviews",
    description: "مصاحبه با فعالان و صاحب‌نظران",
    type: "video",
    isActive: true,
  },
  {
    title: "پروژه‌های خیریه",
    slug: "charity-projects",
    description: "معرفی و گزارش پروژه‌های خیریه",
    type: "article",
    isActive: true,
  },
];

export async function seedSections() {
  console.log("🌱 Starting section seeder...");

  try {
    // پاک کردن بخش‌های قبلی
    await SectionModel.deleteMany({});
    console.log("  ✓ Cleared existing sections");

    // ایجاد بخش‌ها
    const sections = await SectionModel.insertMany(sectionData);
    console.log(`  ✓ Created ${sections.length} sections`);

    return sections;
  } catch (error) {
    console.error("  ✗ Error seeding sections:", error);
    throw error;
  }
}
