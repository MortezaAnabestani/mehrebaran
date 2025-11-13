import { AuthorModel } from "../modules/author/author.model";

/**
 * Author Seeder - ایجاد نویسندگان فیک
 */

const authorData = [
  {
    name: "دکتر محمدرضا شریفی",
    slug: "dr-mohammadreza-sharifi",
    metaTitle: "دکتر محمدرضا شریفی - متخصص توسعه پایدار",
    bio: "استاد دانشگاه و محقق در حوزه توسعه پایدار و مسئولیت اجتماعی. نویسنده چندین کتاب در زمینه مدیریت اجتماعی.",
    metaDescription: "دکتر محمدرضا شریفی، استاد دانشگاه و متخصص مسئولیت اجتماعی و توسعه پایدار",
    avatar: {
      desktop: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      mobile: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
  },
  {
    name: "زهرا احمدی",
    slug: "zahra-ahmadi",
    metaTitle: "زهرا احمدی - فعال اجتماعی",
    bio: "فعال اجتماعی و مدیر پروژه‌های خیریه. تجربه ۱۰ ساله در زمینه کمک به کودکان محروم.",
    metaDescription: "زهرا احمدی، فعال اجتماعی و مدیر پروژه‌های خیریه با تمرکز بر کودکان محروم",
    avatar: {
      desktop: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      mobile: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    },
  },
  {
    name: "علی کریمی",
    slug: "ali-karimi",
    metaTitle: "علی کریمی - روزنامه‌نگار و مستندساز",
    bio: "روزنامه‌نگار و مستندساز. علاقه‌مند به پوشش موضوعات اجتماعی و محیط زیست.",
    metaDescription: "علی کریمی، روزنامه‌نگار و مستندساز موضوعات اجتماعی و محیط زیست",
    avatar: {
      desktop: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      mobile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    },
  },
  {
    name: "دکتر فاطمه نوری",
    slug: "dr-fatemeh-nouri",
    metaTitle: "دکتر فاطمه نوری - روانشناس بالینی",
    bio: "روانشناس بالینی و مشاور خانواده. مدرس دانشگاه و نویسنده مقالات تخصصی.",
    metaDescription: "دکتر فاطمه نوری، روانشناس بالینی و مشاور خانواده",
    avatar: {
      desktop: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
      mobile: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200",
    },
  },
  {
    name: "حسین رضایی",
    slug: "hossein-rezaei",
    metaTitle: "حسین رضایی - کارآفرین اجتماعی",
    bio: "مدیر اجرایی بنیاد خیریه و کارآفرین اجتماعی. تجربه راه‌اندازی چندین پروژه نوآورانه اجتماعی.",
    metaDescription: "حسین رضایی، مدیر اجرایی بنیاد خیریه و کارآفرین اجتماعی",
    avatar: {
      desktop: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
      mobile: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200",
    },
  },
  {
    name: "مریم صادقی",
    slug: "maryam-sadeghi",
    metaTitle: "مریم صادقی - فعال محیط زیست",
    bio: "فعال محیط زیست و مدیر پروژه‌های سبز. عضو هیئت مدیره چندین سازمان زیست‌محیطی.",
    metaDescription: "مریم صادقی، فعال محیط زیست و مدیر پروژه‌های سبز",
    avatar: {
      desktop: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      mobile: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
  },
  {
    name: "امیرحسین مهدوی",
    slug: "amirhossein-mahdavi",
    metaTitle: "امیرحسین مهدوی - پژوهشگر توسعه انسانی",
    bio: "نویسنده و پژوهشگر در حوزه فقر و توسعه انسانی. مشاور چندین سازمان بین‌المللی.",
    metaDescription: "امیرحسین مهدوی، پژوهشگر فقر و توسعه انسانی",
    avatar: {
      desktop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      mobile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
  },
  {
    name: "سارا موسوی",
    slug: "sara-mousavi",
    metaTitle: "سارا موسوی - روزنامه‌نگار تحقیقی",
    bio: "روزنامه‌نگار تحقیقی و مستندساز. متخصص در پوشش موضوعات زنان و کودکان.",
    metaDescription: "سارا موسوی، روزنامه‌نگار تحقیقی و مستندساز با تمرکز بر زنان و کودکان",
    avatar: {
      desktop: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      mobile: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    },
  },
];

export async function seedAuthors() {
  console.log("🌱 Starting author seeder...");

  try {
    // پاک کردن نویسندگان قبلی
    await AuthorModel.deleteMany({});
    console.log("  ✓ Cleared existing authors");

    // ایجاد نویسندگان
    const authors = await AuthorModel.insertMany(authorData);
    console.log(`  ✓ Created ${authors.length} authors`);

    return authors;
  } catch (error) {
    console.error("  ✗ Error seeding authors:", error);
    throw error;
  }
}
