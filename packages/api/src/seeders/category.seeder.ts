import { CategoryModel } from "../modules/categories/category.model";

/**
 * Category Seeder - ایجاد دسته‌بندی‌های مقالات
 */

const categoryData = [
  {
    name: "مقالات اجتماعی",
    slug: "social-articles",
    description: "مقالات و تحلیل‌های اجتماعی، مسائل جامعه و راهکارهای بهبود وضعیت اجتماعی",
  },
  {
    name: "آموزش و توانمندسازی",
    slug: "education-empowerment",
    description: "مطالب آموزشی، دوره‌های توانمندسازی و راهنماهای کاربردی",
  },
  {
    name: "محیط زیست",
    slug: "environment",
    description: "موضوعات زیست‌محیطی، حفاظت از طبیعت و توسعه پایدار",
  },
  {
    name: "سلامت و بهداشت",
    slug: "health-hygiene",
    description: "سلامت جسمی و روانی، بهداشت عمومی و پیشگیری از بیماری‌ها",
  },
  {
    name: "کودکان و نوجوانان",
    slug: "children-adolescents",
    description: "مسائل کودکان و نوجوانان، تربیت و پرورش",
  },
  {
    name: "زنان و خانواده",
    slug: "women-family",
    description: "مسائل زنان، خانواده و روابط خانوادگی",
  },
  {
    name: "فقر و توسعه",
    slug: "poverty-development",
    description: "مبارزه با فقر، توسعه اقتصادی و بهبود معیشت",
  },
  {
    name: "داوطلبی و مسئولیت اجتماعی",
    slug: "volunteering-social-responsibility",
    description: "فعالیت‌های داوطلبانه، مسئولیت اجتماعی شرکت‌ها و مشارکت مدنی",
  },
  {
    name: "هنر و فرهنگ",
    slug: "art-culture",
    description: "هنر، فرهنگ، ادبیات و میراث فرهنگی",
  },
  {
    name: "فناوری و نوآوری",
    slug: "technology-innovation",
    description: "فناوری‌های نوین، نوآوری اجتماعی و تحول دیجیتال",
  },
];

export async function seedCategories() {
  console.log("🌱 Starting category seeder...");

  try {
    // پاک کردن دسته‌بندی‌های قبلی
    await CategoryModel.deleteMany({});
    console.log("  ✓ Cleared existing categories");

    // ایجاد دسته‌بندی‌ها
    const categories = await CategoryModel.insertMany(categoryData);
    console.log(`  ✓ Created ${categories.length} categories`);

    return categories;
  } catch (error) {
    console.error("  ✗ Error seeding categories:", error);
    throw error;
  }
}
