import { ProjectModel } from "../modules/projects/project.model";
import { CategoryModel } from "../modules/categories/category.model";

/**
 * Project Seeder - ایجاد پروژه‌های خیریه با تنظیمات کمک مالی و داوطلبی
 */

export async function seedProjects() {
  console.log("🌱 Starting project seeder...");

  try {
    // پاک کردن پروژه‌های قبلی
    await ProjectModel.deleteMany({});
    console.log("  ✓ Cleared existing projects");

    // دریافت دسته‌بندی‌ها
    const categories = await CategoryModel.find({});

    if (categories.length === 0) {
      console.warn("  ⚠ Categories not found. Please seed them first.");
      return [];
    }

    // محاسبه تاریخ‌های deadline
    const now = new Date();
    const twoMonthsLater = new Date(now);
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
    const threeMonthsLater = new Date(now);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    const sixMonthsLater = new Date(now);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    const projectData = [
      {
        title: "ساخت مدرسه برای کودکان روستاهای دورافتاده",
        subtitle: "تحصیل، حق هر کودکی است",
        description: `در بسیاری از روستاهای دورافتاده کشور، کودکان از دسترسی به آموزش محروم هستند. این پروژه هدف دارد یک مدرسه مجهز با ۶ کلاس درس، کتابخانه، و آزمایشگاه علوم بسازد.

مدرسه برای ۲۰۰ دانش‌آموز طراحی شده و شامل امکانات مدرن آموزشی خواهد بود. همچنین برنامه‌ای برای آموزش معلمان محلی نیز در نظر گرفته شده است.

با کمک شما، می‌توانیم آینده روشن‌تری برای این کودکان بسازیم. هر کمکی، کوچک یا بزرگ، در رسیدن به این هدف مؤثر است.`,
        excerpt: "ساخت مدرسه مجهز برای ۲۰۰ دانش‌آموز در روستاهای محروم",
        featuredImage: {
          desktop: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
          mobile: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
        },
        category: categories.find((c) => c.slug === "education-empowerment")?._id,
        status: "active",
        targetAmount: 500000000, // 500 میلیون تومان
        amountRaised: 325000000, // 325 میلیون جمع‌آوری شده (65%)
        targetVolunteer: 20,
        collectedVolunteer: 12,
        deadline: threeMonthsLater,
        views: 3450,
        donationSettings: {
          enabled: true,
          minimumAmount: 50000,
          allowAnonymous: true,
          showDonors: true,
        },
        volunteerSettings: {
          enabled: true,
          requiredSkills: ["ساخت و ساز", "نجاری", "نقاشی ساختمان", "برقکاری"],
          maxVolunteers: 20,
          autoApprove: false,
        },
        bankInfo: {
          bankName: "بانک ملی",
          accountNumber: "1234567890",
          cardNumber: "6037997123456789",
          iban: "IR123456789012345678901234",
          accountHolderName: "بنیاد خیریه مهربانان",
        },
        paymentGateway: "zarinpal",
        merchantId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        donorCount: 486,
        volunteerCount: 12,
        pendingVolunteers: 5,
        seo: {
          metaTitle: "پروژه ساخت مدرسه برای کودکان روستاهای دورافتاده",
          metaDescription: "با کمک به این پروژه، آینده ۲۰۰ کودک را روشن کنید",
        },
        certificateSettings: {
          customMessage: "با تشکر از حمایت شما در ساخت مدرسه و روشن کردن آینده کودکان",
        },
      },
      {
        title: "تأمین غذای گرم برای کودکان محروم",
        subtitle: "هیچ کودکی نباید گرسنه بخوابد",
        description: `این پروژه به تأمین غذای گرم و مقوی برای ۵۰۰ کودک در مناطق کم‌برخوردار می‌پردازد. بسیاری از این کودکان روزانه تنها یک وعده غذای ناکافی دریافت می‌کنند.

ما با همکاری مدارس محلی و خانواده‌ها، برنامه تغذیه مناسبی طراحی کرده‌ایم که شامل سه وعده غذای کامل با توجه به نیازهای تغذیه‌ای کودکان است.

همچنین برنامه آموزش تغذیه سالم به والدین نیز در این پروژه گنجانده شده است. با کمک شما، می‌توانیم سلامت و آینده این کودکان را تضمین کنیم.`,
        excerpt: "تأمین سه وعده غذای گرم و مقوی برای ۵۰۰ کودک محروم",
        featuredImage: {
          desktop: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
          mobile: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400",
        },
        category: categories.find((c) => c.slug === "poverty-development")?._id,
        status: "active",
        targetAmount: 240000000, // 240 میلیون تومان (سالانه)
        amountRaised: 187000000, // 187 میلیون (78%)
        targetVolunteer: 15,
        collectedVolunteer: 10,
        deadline: twoMonthsLater,
        views: 5680,
        donationSettings: {
          enabled: true,
          minimumAmount: 10000,
          allowAnonymous: true,
          showDonors: true,
        },
        volunteerSettings: {
          enabled: true,
          requiredSkills: ["آشپزی", "توزیع غذا", "هماهنگی"],
          maxVolunteers: 15,
          autoApprove: false,
        },
        bankInfo: {
          bankName: "بانک سپه",
          accountNumber: "9876543210",
          cardNumber: "6037691234567890",
          iban: "IR987654321098765432109876",
          accountHolderName: "موسسه خیریه امید",
        },
        paymentGateway: "idpay",
        merchantId: "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY",
        donorCount: 934,
        volunteerCount: 10,
        pendingVolunteers: 3,
        seo: {
          metaTitle: "پروژه تأمین غذای گرم برای کودکان محروم",
          metaDescription: "به ۵۰۰ کودک کمک کنید هر روز غذای مقوی داشته باشند",
        },
        certificateSettings: {
          customMessage: "سپاس از مهربانی شما در تأمین غذای کودکان نیازمند",
        },
      },
      {
        title: "کلینیک سیار برای مناطق محروم",
        subtitle: "سلامت، حق همه است",
        description: `این پروژه با هدف راه‌اندازی کلینیک سیار برای ارائه خدمات پزشکی رایگان در روستاها و مناطق دورافتاده طراحی شده است. کلینیک شامل پزشک عمومی، دندانپزشک، و داروخانه متحرک است.

هر ماه به ۱۰ روستا سرویس‌دهی می‌کنیم و تخمین می‌زنیم بیش از ۲۰۰۰ نفر از خدمات این کلینیک بهره‌مند شوند. همچنین برنامه‌های پیشگیری و آموزش بهداشت عمومی نیز ارائه می‌شود.

برای خرید و تجهیز یک خودروی پزشکی و پرداخت حقوق کادر درمان به کمک شما نیاز داریم.`,
        excerpt: "راه‌اندازی کلینیک سیار برای ارائه خدمات پزشکی رایگان در روستاها",
        featuredImage: {
          desktop: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
          mobile: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400",
        },
        category: categories.find((c) => c.slug === "health-hygiene")?._id,
        status: "active",
        targetAmount: 800000000, // 800 میلیون تومان
        amountRaised: 456000000, // 456 میلیون (57%)
        targetVolunteer: 25,
        collectedVolunteer: 18,
        deadline: sixMonthsLater,
        views: 4320,
        donationSettings: {
          enabled: true,
          minimumAmount: 100000,
          allowAnonymous: true,
          showDonors: true,
        },
        volunteerSettings: {
          enabled: true,
          requiredSkills: ["پزشک", "پرستار", "داروساز", "راننده", "هماهنگی"],
          maxVolunteers: 25,
          autoApprove: false,
        },
        bankInfo: {
          bankName: "بانک ملت",
          accountNumber: "5555666677",
          cardNumber: "6104337123456789",
          iban: "IR555566667777888899990000",
          accountHolderName: "بنیاد خیریه سلامت",
        },
        paymentGateway: "zarinpal",
        merchantId: "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZ",
        donorCount: 678,
        volunteerCount: 18,
        pendingVolunteers: 7,
        seo: {
          metaTitle: "پروژه کلینیک سیار برای مناطق محروم",
          metaDescription: "کمک به راه‌اندازی کلینیک سیار برای خدمات پزشکی رایگان",
        },
        certificateSettings: {
          customMessage: "با قدردانی از کمک شما به تأمین سلامت هم‌میهنان محروم",
        },
      },
      {
        title: "کمک به زنان سرپرست خانوار",
        subtitle: "توانمندسازی و اشتغال",
        description: `این پروژه به ۱۰۰ زن سرپرست خانوار کمک می‌کند تا با آموزش مهارت‌های حرفه‌ای و دریافت وام خرد، کسب‌وکار کوچک خود را راه‌اندازی کنند.

برنامه شامل دوره‌های آموزشی (خیاطی، آشپزی، آرایشگری، حسابداری)، مشاوره کسب‌وکار، و وام بدون بهره برای خرید تجهیزات اولیه است.

هدف ما ایجاد استقلال مالی پایدار برای این زنان است تا بتوانند خودشان و فرزندانشان را تأمین کنند. هر کمکی به یک خانواده امید می‌دهد.`,
        excerpt: "توانمندسازی و ایجاد اشتغال برای ۱۰۰ زن سرپرست خانوار",
        featuredImage: {
          desktop: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
          mobile: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        category: categories.find((c) => c.slug === "women-family")?._id,
        status: "active",
        targetAmount: 300000000, // 300 میلیون تومان
        amountRaised: 245000000, // 245 میلیون (82%)
        targetVolunteer: 10,
        collectedVolunteer: 8,
        deadline: twoMonthsLater,
        views: 2890,
        donationSettings: {
          enabled: true,
          minimumAmount: 50000,
          allowAnonymous: true,
          showDonors: true,
        },
        volunteerSettings: {
          enabled: true,
          requiredSkills: ["آموزش مهارت", "مشاوره کسب‌وکار", "حسابداری"],
          maxVolunteers: 10,
          autoApprove: false,
        },
        bankInfo: {
          bankName: "بانک تجارت",
          accountNumber: "3333444455",
          cardNumber: "5859831234567890",
          iban: "IR333344445555666677778888",
          accountHolderName: "موسسه توانمندسازی زنان",
        },
        paymentGateway: "zibal",
        merchantId: "WWWWWWWW-WWWW-WWWW-WWWW-WWWWWWWWWWWW",
        donorCount: 567,
        volunteerCount: 8,
        pendingVolunteers: 2,
        seo: {
          metaTitle: "پروژه توانمندسازی زنان سرپرست خانوار",
          metaDescription: "کمک به ۱۰۰ زن برای راه‌اندازی کسب‌وکار و استقلال مالی",
        },
        certificateSettings: {
          customMessage: "سپاس از حمایت شما در توانمندسازی زنان سرپرست خانوار",
        },
      },
      {
        title: "حفاظت از جنگل‌های شمال",
        subtitle: "نجات ریه‌های سبز کشور",
        description: `جنگل‌های شمال کشور در خطر نابودی هستند. این پروژه با هدف حفاظت، بازسازی، و جلوگیری از قطع غیرقانونی درختان راه‌اندازی شده است.

فعالیت‌های پروژه شامل نصب دوربین‌های مراقبتی، استخدام محیط‌بان‌ها، کاشت درخت، و آموزش به مردم محلی است. همچنین برنامه‌های اکوتوریسم برای ایجاد درآمد پایدار برای ساکنان محلی نیز طراحی شده است.

با کمک شما می‌توانیم این میراث طبیعی را برای نسل‌های آینده حفظ کنیم.`,
        excerpt: "حفاظت و بازسازی جنگل‌های شمالی کشور",
        featuredImage: {
          desktop: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
          mobile: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400",
        },
        category: categories.find((c) => c.slug === "environment")?._id,
        status: "active",
        targetAmount: 600000000, // 600 میلیون تومان
        amountRaised: 234000000, // 234 میلیون (39%)
        targetVolunteer: 30,
        collectedVolunteer: 15,
        deadline: sixMonthsLater,
        views: 3210,
        donationSettings: {
          enabled: true,
          minimumAmount: 50000,
          allowAnonymous: true,
          showDonors: true,
        },
        volunteerSettings: {
          enabled: true,
          requiredSkills: ["محیط‌بانی", "کاشت درخت", "عکاسی", "آموزش محیط زیست"],
          maxVolunteers: 30,
          autoApprove: false,
        },
        bankInfo: {
          bankName: "بانک کشاورزی",
          accountNumber: "7777888899",
          cardNumber: "6037697123456789",
          iban: "IR777788889999000011112222",
          accountHolderName: "سازمان حفاظت محیط زیست مردمی",
        },
        paymentGateway: "zarinpal",
        merchantId: "QQQQQQQQ-QQQQ-QQQQ-QQQQ-QQQQQQQQQQQQ",
        donorCount: 445,
        volunteerCount: 15,
        pendingVolunteers: 8,
        seo: {
          metaTitle: "پروژه حفاظت از جنگل‌های شمال",
          metaDescription: "کمک به حفاظت و بازسازی جنگل‌های شمالی کشور",
        },
        certificateSettings: {
          customMessage: "با سپاس از مشارکت شما در حفظ میراث طبیعی کشور",
        },
      },
      // پروژه تکمیل شده برای تست
      {
        title: "ساخت خانه محرومان - فاز اول",
        subtitle: "پروژه تکمیل شده",
        description: `این پروژه با موفقیت تکمیل شد و ۵۰ خانواده صاحب خانه شدند. تشکر از تمام حامیان و داوطلبانی که در این پروژه مشارکت کردند.`,
        excerpt: "ساخت ۵۰ واحد مسکونی برای خانواده‌های نیازمند - تکمیل شده",
        featuredImage: {
          desktop: "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800",
          mobile: "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400",
        },
        category: categories.find((c) => c.slug === "poverty-development")?._id,
        status: "completed",
        targetAmount: 1000000000,
        amountRaised: 1050000000, // بیش از هدف
        targetVolunteer: 40,
        collectedVolunteer: 45,
        deadline: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // یک ماه پیش
        views: 8940,
        isFeaturedInCompleted: true,
        donationSettings: {
          enabled: false, // غیرفعال چون تکمیل شده
          minimumAmount: 100000,
          allowAnonymous: true,
          showDonors: true,
        },
        volunteerSettings: {
          enabled: false, // غیرفعال چون تکمیل شده
          requiredSkills: [],
          maxVolunteers: 40,
          autoApprove: false,
        },
        bankInfo: {
          bankName: "بانک مسکن",
          accountNumber: "1111222233",
          cardNumber: "6280231234567890",
          iban: "IR111122223333444455556666",
          accountHolderName: "بنیاد مسکن محرومان",
        },
        donorCount: 1245,
        volunteerCount: 45,
        pendingVolunteers: 0,
        seo: {
          metaTitle: "پروژه تکمیل شده: ساخت خانه محرومان",
          metaDescription: "پروژه با موفقیت تکمیل شد و ۵۰ خانواده صاحب خانه شدند",
        },
      },
    ];

    // ایجاد پروژه‌ها
    const projects = await ProjectModel.insertMany(projectData.filter((p) => p.category));
    console.log(
      `  ✓ Created ${projects.length} projects (${projectData.filter((p) => p.status === "active").length} active, ${projectData.filter((p) => p.status === "completed").length} completed)`
    );

    return projects;
  } catch (error) {
    console.error("  ✗ Error seeding projects:", error);
    throw error;
  }
}
