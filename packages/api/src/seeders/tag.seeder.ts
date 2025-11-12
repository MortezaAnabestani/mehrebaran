import { TagModel } from "../modules/tags/tag.model";

/**
 * Tag Seeder - ایجاد برچسب‌های فیک
 */

const tagData = [
  { name: "خیریه", slug: "charity" },
  { name: "آموزش", slug: "education" },
  { name: "سلامت", slug: "health" },
  { name: "محیط زیست", slug: "environment" },
  { name: "کودکان", slug: "children" },
  { name: "زنان", slug: "women" },
  { name: "فقر", slug: "poverty" },
  { name: "توسعه", slug: "development" },
  { name: "داوطلبی", slug: "volunteering" },
  { name: "مسئولیت اجتماعی", slug: "social-responsibility" },
  { name: "حقوق بشر", slug: "human-rights" },
  { name: "مهربانی", slug: "kindness" },
  { name: "امید", slug: "hope" },
  { name: "کمک", slug: "help" },
  { name: "همکاری", slug: "cooperation" },
  { name: "نوآوری اجتماعی", slug: "social-innovation" },
  { name: "کارآفرینی", slug: "entrepreneurship" },
  { name: "توانمندسازی", slug: "empowerment" },
  { name: "جامعه", slug: "community" },
  { name: "همدلی", slug: "empathy" },
  { name: "تغییر اجتماعی", slug: "social-change" },
  { name: "پایداری", slug: "sustainability" },
  { name: "فرهنگ", slug: "culture" },
  { name: "هنر", slug: "art" },
  { name: "ورزش", slug: "sport" },
  { name: "تکنولوژی", slug: "technology" },
  { name: "اشتغال", slug: "employment" },
  { name: "مسکن", slug: "housing" },
  { name: "تغذیه", slug: "nutrition" },
  { name: "بحران", slug: "crisis" },
];

export async function seedTags() {
  console.log("🌱 Starting tag seeder...");

  try {
    // پاک کردن برچسب‌های قبلی
    await TagModel.deleteMany({});
    console.log("  ✓ Cleared existing tags");

    // ایجاد برچسب‌ها
    const tags = await TagModel.insertMany(tagData);
    console.log(`  ✓ Created ${tags.length} tags`);

    return tags;
  } catch (error) {
    console.error("  ✗ Error seeding tags:", error);
    throw error;
  }
}
