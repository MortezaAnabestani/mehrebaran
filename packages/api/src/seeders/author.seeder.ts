import { AuthorModel } from "../modules/authors/author.model";

/**
 * Author Seeder - ایجاد نویسندگان فیک
 */

const authorData = [
  {
    name: "دکتر محمدرضا شریفی",
    slug: "dr-mohammadreza-sharifi",
    bio: "استاد دانشگاه و محقق در حوزه توسعه پایدار و مسئولیت اجتماعی. نویسنده چندین کتاب در زمینه مدیریت اجتماعی.",
    expertise: ["مسئولیت اجتماعی", "توسعه پایدار", "مدیریت NGO"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    socialMedia: {
      twitter: "https://twitter.com/mrsharifi",
      linkedin: "https://linkedin.com/in/mrsharifi",
    },
  },
  {
    name: "زهرا احمدی",
    slug: "zahra-ahmadi",
    bio: "فعال اجتماعی و مدیر پروژه‌های خیریه. تجربه ۱۰ ساله در زمینه کمک به کودکان محروم.",
    expertise: ["کودکان محروم", "آموزش", "توانمندسازی"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    socialMedia: {
      instagram: "https://instagram.com/zahra.ahmadi",
    },
  },
  {
    name: "علی کریمی",
    slug: "ali-karimi",
    bio: "روزنامه‌نگار و مستندساز. علاقه‌مند به پوشش موضوعات اجتماعی و محیط زیست.",
    expertise: ["خبرنگاری اجتماعی", "محیط زیست", "مستندسازی"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    socialMedia: {
      twitter: "https://twitter.com/alikarimi",
      instagram: "https://instagram.com/ali.karimi",
    },
  },
  {
    name: "دکتر فاطمه نوری",
    slug: "dr-fatemeh-nouri",
    bio: "روانشناس بالینی و مشاور خانواده. مدرس دانشگاه و نویسنده مقالات تخصصی.",
    expertise: ["روانشناسی اجتماعی", "مشاوره خانواده", "کودک و نوجوان"],
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    socialMedia: {
      linkedin: "https://linkedin.com/in/fnouri",
      website: "https://drfatemehnouri.com",
    },
  },
  {
    name: "حسین رضایی",
    slug: "hossein-rezaei",
    bio: "مدیر اجرایی بنیاد خیریه و کارآفرین اجتماعی. تجربه راه‌اندازی چندین پروژه نوآورانه اجتماعی.",
    expertise: ["کارآفرینی اجتماعی", "مدیریت NGO", "جذب سرمایه"],
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
    socialMedia: {
      linkedin: "https://linkedin.com/in/hrezaei",
      twitter: "https://twitter.com/hrezaei",
    },
  },
  {
    name: "مریم صادقی",
    slug: "maryam-sadeghi",
    bio: "فعال محیط زیست و مدیر پروژه‌های سبز. عضو هیئت مدیره چندین سازمان زیست‌محیطی.",
    expertise: ["محیط زیست", "توسعه پایدار", "منابع طبیعی"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    socialMedia: {
      instagram: "https://instagram.com/maryam.sadeghi",
      twitter: "https://twitter.com/msadeghi",
    },
  },
  {
    name: "امیرحسین مهدوی",
    slug: "amirhossein-mahdavi",
    bio: "نویسنده و پژوهشگر در حوزه فقر و توسعه انسانی. مشاور چندین سازمان بین‌المللی.",
    expertise: ["فقر", "توسعه انسانی", "سیاست‌گذاری اجتماعی"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    socialMedia: {
      linkedin: "https://linkedin.com/in/ahmahdavi",
      website: "https://ahmahdavi.ir",
    },
  },
  {
    name: "سارا موسوی",
    slug: "sara-mousavi",
    bio: "روزنامه‌نگار تحقیقی و مستندساز. متخصص در پوشش موضوعات زنان و کودکان.",
    expertise: ["زنان", "کودکان", "حقوق بشر"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    socialMedia: {
      twitter: "https://twitter.com/saramousavi",
      instagram: "https://instagram.com/sara.mousavi",
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
