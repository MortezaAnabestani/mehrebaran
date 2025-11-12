import { GalleryModel } from "../modules/blog/gallery/gallery.model";
import { AuthorModel } from "../modules/author/author.model";
import { CategoryModel } from "../modules/categories/category.model";
import { TagModel } from "../modules/tag/tag.model";

/**
 * Gallery Seeder - ایجاد گالری‌های تصویری
 */

export async function seedGalleries() {
  console.log("🌱 Starting gallery seeder...");

  try {
    // پاک کردن گالری‌های قبلی
    await GalleryModel.deleteMany({});
    console.log("  ✓ Cleared existing galleries");

    // دریافت نویسندگان، دسته‌بندی‌ها و برچسب‌ها
    const authors = await AuthorModel.find({});
    const categories = await CategoryModel.find({});
    const tags = await TagModel.find({});

    if (authors.length === 0) {
      console.warn("  ⚠ Authors not found. Please seed them first.");
      return [];
    }

    const galleryData = [
      {
        title: "گزارش تصویری افتتاح مدرسه روستایی",
        subtitle: "روستای کوهستانی - بهمن ۱۴۰۲",
        description: `مجموعه تصاویر از مراسم افتتاح مدرسه جدید در روستای کوهستانی. این پروژه با همکاری خیرین و مشارکت مردمی ساخته شد و حالا محل تحصیل ۲۰۰ دانش‌آموز است.

تصاویر شامل لحظات افتتاح، شادی کودکان، بازدید از کلاس‌ها، و گفتگو با معلمان و اولیای دانش‌آموزان است.`,
        images: [
          {
            desktop: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
            mobile: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
            mobile: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
            mobile: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
            mobile: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            mobile: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
          },
        ],
        photographer: authors[2]?._id,
        category: categories.find((c) => c.slug === "education-empowerment")?._id,
        tags: [
          tags.find((t) => t.slug === "education")?._id,
          tags.find((t) => t.slug === "children")?._id,
          tags.find((t) => t.slug === "charity")?._id,
        ].filter(Boolean),
        seo: {
          metaTitle: "گزارش تصویری افتتاح مدرسه روستایی",
          metaDescription: "تصاویر مراسم افتتاح مدرسه جدید در روستای کوهستانی",
        },
        status: "published",
        views: 1240,
      },
      {
        title: "کمپین تمیزسازی سواحل شمال",
        subtitle: "ساحل چمخاله - تابستان ۱۴۰۲",
        description: `گزارش تصویری از کمپین تمیزسازی سواحل با حضور بیش از ۵۰۰ داوطلب. این تصاویر نشان‌دهنده همبستگی اجتماعی و تلاش جمعی برای حفظ محیط زیست دریایی هستند.`,
        images: [
          {
            desktop: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800",
            mobile: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800",
            mobile: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
            mobile: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
            mobile: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
          },
        ],
        photographer: authors[5]?._id,
        category: categories.find((c) => c.slug === "environment")?._id,
        tags: [
          tags.find((t) => t.slug === "environment")?._id,
          tags.find((t) => t.slug === "volunteering")?._id,
          tags.find((t) => t.slug === "community")?._id,
        ].filter(Boolean),
        seo: {
          metaTitle: "گزارش تصویری کمپین تمیزسازی سواحل",
          metaDescription: "تصاویر کمپین تمیزسازی سواحل با حضور ۵۰۰ داوطلب",
        },
        status: "published",
        views: 980,
      },
      {
        title: "کلینیک سیار در مناطق محروم",
        subtitle: "بازدید از روستاهای دورافتاده",
        description: `تصاویر از فعالیت کلینیک سیار که به روستاهای دورافتاده می‌رود و خدمات درمانی رایگان ارائه می‌دهد. پزشکان و پرستاران داوطلب در این کلینیک خدمت می‌کنند.`,
        images: [
          {
            desktop: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
            mobile: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
            mobile: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800",
            mobile: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400",
          },
        ],
        photographer: authors[3]?._id,
        category: categories.find((c) => c.slug === "health-hygiene")?._id,
        tags: [
          tags.find((t) => t.slug === "health")?._id,
          tags.find((t) => t.slug === "charity")?._id,
          tags.find((t) => t.slug === "help")?._id,
        ].filter(Boolean),
        seo: {
          metaTitle: "گزارش تصویری کلینیک سیار در مناطق محروم",
          metaDescription: "تصاویر فعالیت کلینیک سیار و پزشکان داوطلب در روستاها",
        },
        status: "published",
        views: 670,
      },
      {
        title: "جشنواره هنری کودکان کار",
        subtitle: "نمایش استعدادها",
        description: `گالری تصاویر جشنواره هنری کودکان کار که در آن نقاشی‌ها، صنایع دستی، و آثار هنری این کودکان به نمایش درآمد. تصاویر شادی و امید در چهره این کودکان را نشان می‌دهند.`,
        images: [
          {
            desktop: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
            mobile: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            mobile: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
            mobile: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=800",
            mobile: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=400",
          },
        ],
        photographer: authors[2]?._id,
        category: categories.find((c) => c.slug === "art-culture")?._id,
        tags: [
          tags.find((t) => t.slug === "children")?._id,
          tags.find((t) => t.slug === "art")?._id,
          tags.find((t) => t.slug === "empowerment")?._id,
        ].filter(Boolean),
        seo: {
          metaTitle: "گزارش تصویری جشنواره هنری کودکان کار",
          metaDescription: "تصاویر نمایشگاه آثار هنری ۱۰۰ کودک کار",
        },
        status: "published",
        views: 1450,
      },
      {
        title: "کارگاه آموزشی توانمندسازی زنان",
        subtitle: "آموزش مهارت‌های حرفه‌ای",
        description: `تصاویر از کارگاه‌های آموزش مهارت به زنان سرپرست خانوار. این کارگاه‌ها شامل آموزش خیاطی، آشپزی، آرایشگری، و کامپیوتر است.`,
        images: [
          {
            desktop: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
            mobile: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
            mobile: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
          },
          {
            desktop: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
            mobile: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
          },
        ],
        photographer: authors[7]?._id,
        category: categories.find((c) => c.slug === "women-family")?._id,
        tags: [
          tags.find((t) => t.slug === "women")?._id,
          tags.find((t) => t.slug === "empowerment")?._id,
          tags.find((t) => t.slug === "education")?._id,
        ].filter(Boolean),
        seo: {
          metaTitle: "گزارش تصویری کارگاه توانمندسازی زنان",
          metaDescription: "تصاویر کارگاه‌های آموزش مهارت به زنان سرپرست خانوار",
        },
        status: "published",
        views: 890,
      },
    ];

    // ایجاد گالری‌ها
    const galleries = await GalleryModel.insertMany(galleryData.filter((g) => g.images && g.images.length > 0));
    console.log(`  ✓ Created ${galleries.length} galleries`);

    return galleries;
  } catch (error) {
    console.error("  ✗ Error seeding galleries:", error);
    throw error;
  }
}
