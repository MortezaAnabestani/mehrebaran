import { NeedCategoryModel } from "../modules/need-categories/needCategory.model";

/**
 * NeedCategory Seeder - ایجاد دسته‌بندی‌های نیاز
 */

const categories = [
  {
    name: "سلامت و درمان",
    description: "نیازهای مربوط به سلامت، درمان، دارو و تجهیزات پزشکی",
  },
  {
    name: "آموزش",
    description: "نیازهای آموزشی شامل لوازم‌التحریر، شهریه، کتاب و تجهیزات آموزشی",
  },
  {
    name: "مسکن",
    description: "نیازهای مسکن شامل ساخت، تعمیر و تجهیز منازل",
  },
  {
    name: "غذا و تغذیه",
    description: "تامین غذا، بسته‌های غذایی و نیازهای تغذیه‌ای",
  },
  {
    name: "اشتغال و کسب‌وکار",
    description: "کمک به ایجاد شغل، خرید تجهیزات کاری و راه‌اندازی کسب‌وکار",
  },
  {
    name: "محیط زیست",
    description: "پروژه‌های زیست محیطی، درختکاری و حفاظت از طبیعت",
  },
  {
    name: "اضطراری",
    description: "کمک‌های اورژانسی به آسیب‌دیدگان بلایای طبیعی و حوادث",
  },
  {
    name: "فرهنگ و هنر",
    description: "پروژه‌های فرهنگی، هنری و کتابخانه‌ای",
  },
];

export async function seedNeedCategories() {
  console.log("🌱 Starting need category seeder...");

  try {
    // پاک کردن دسته‌بندی‌های قبلی
    await NeedCategoryModel.deleteMany({});
    console.log("  ✓ Cleared existing need categories");

    const createdCategories = [];
    for (const categoryData of categories) {
      const newCategory = await NeedCategoryModel.create(categoryData);
      createdCategories.push(newCategory);
    }

    console.log(`  ✓ Created ${createdCategories.length} need categories`);

    return createdCategories;
  } catch (error) {
    console.error("  ✗ Error seeding need categories:", error);
    throw error;
  }
}
