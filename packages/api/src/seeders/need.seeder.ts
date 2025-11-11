import { NeedModel } from "../modules/needs/need.model";
import { Types } from "mongoose";

/**
 * NeedModel Seeder - ایجاد نیازهای فیک
 */

// ... (بخش needTemplates و cities و categoryMap بدون تغییر باقی می‌ماند)
const categoryMap: Record<string, string> = {
  medical: "سلامت و درمان",
  education: "آموزش",
  housing: "مسکن",
  food: "غذا و تغذیه",
  employment: "اشتغال و کسب‌وکار",
  environment: "محیط زیست",
  emergency: "اضطراری",
  culture: "فرهنگ و هنر",
};

// Sample attachments for different file types
const sampleAttachments = [
  // Images
  {
    fileType: "image",
    url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
    fileName: "hospital-patient.jpg",
    fileSize: 256000,
  },
  {
    fileType: "image",
    url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    fileName: "children-school.jpg",
    fileSize: 312000,
  },
  {
    fileType: "image",
    url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    fileName: "family-home.jpg",
    fileSize: 289000,
  },
  {
    fileType: "image",
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
    fileName: "food-basket.jpg",
    fileSize: 278000,
  },
  // Videos
  {
    fileType: "video",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    fileName: "project-introduction.mp4",
    fileSize: 5242880,
  },
  {
    fileType: "video",
    url: "https://www.w3schools.com/html/movie.mp4",
    fileName: "beneficiary-interview.mp4",
    fileSize: 3145728,
  },
  // Audio
  {
    fileType: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    fileName: "project-description.mp3",
    fileSize: 1048576,
  },
  {
    fileType: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    fileName: "testimonial-audio.mp3",
    fileSize: 987654,
  },
  // Documents
  {
    fileType: "document",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileName: "medical-report.pdf",
    fileSize: 524288,
  },
  {
    fileType: "document",
    url: "https://example.com/documents/project-proposal.pdf",
    fileName: "project-proposal.pdf",
    fileSize: 1048576,
  },
  {
    fileType: "document",
    url: "https://example.com/documents/financial-report.xlsx",
    fileName: "financial-report.xlsx",
    fileSize: 327680,
  },
  {
    fileType: "document",
    url: "https://example.com/documents/beneficiary-list.docx",
    fileName: "beneficiary-list.docx",
    fileSize: 245760,
  },
];

const needTemplates = [
  // ... محتوای آرایه بدون تغییر
  {
    categoryKey: "medical",
    title: "کمک به هزینه درمان کودک مبتلا به سرطان",
    description:
      "این کودک ۷ ساله به سرطان خون مبتلا شده و نیاز به شیمی‌درمانی دارد. خانواده توان پرداخت هزینه‌های درمانی را ندارند.",
    targetAmount: 150000000,
    urgencyLevel: "high" as const,
    tags: ["سلامت", "کودکان", "سرطان", "درمان"],
  },
  {
    categoryKey: "education",
    title: "تامین لوازم‌التحریر برای دانش‌آموزان روستایی",
    description:
      "دانش‌آموزان روستای محروم به لوازم‌التحریر و کیف مدرسه نیاز دارند. با کمک شما می‌توانیم ۵۰ دانش‌آموز را تجهیز کنیم.",
    targetAmount: 25000000,
    urgencyLevel: "medium" as const,
    tags: ["آموزش", "کودکان", "روستا", "لوازم‌التحریر"],
  },
  {
    categoryKey: "housing",
    title: "ساخت خانه برای خانواده آسیب‌دیده از سیل",
    description:
      "این خانواده در سیل اخیر خانه خود را از دست داده‌اند. نیاز به کمک برای ساخت یک خانه ساده دارند.",
    targetAmount: 200000000,
    urgencyLevel: "critical" as const,
    tags: ["مسکن", "بلایای طبیعی", "سیل", "خانواده"],
  },
  {
    categoryKey: "food",
    title: "تهیه بسته غذایی برای خانواده‌های نیازمند",
    description: "با نزدیک شدن به ماه رمضان، قصد داریم ۱۰۰ بسته غذایی برای خانواده‌های نیازمند تهیه کنیم.",
    targetAmount: 30000000,
    urgencyLevel: "medium" as const,
    tags: ["غذا", "رمضان", "خانواده", "نیازمندان"],
  },
  {
    categoryKey: "medical",
    title: "خرید ویلچر برای جانباز جنگ",
    description: "این جانباز گرامی که در دوران دفاع مقدس مجروح شده، به ویلچر برقی نیاز دارد.",
    targetAmount: 45000000,
    urgencyLevel: "high" as const,
    tags: ["سلامت", "جانبازان", "ویلچر", "دفاع مقدس"],
  },
  {
    categoryKey: "education",
    title: "راه‌اندازی کتابخانه روستایی",
    description:
      "قصد داریم یک کتابخانه کوچک در روستای محروم راه‌اندازی کنیم. به کتاب، قفسه و میز و صندلی نیاز داریم.",
    targetAmount: 80000000,
    urgencyLevel: "low" as const,
    tags: ["آموزش", "کتابخانه", "روستا", "فرهنگ"],
  },
  {
    categoryKey: "employment",
    title: "خرید ماشین خیاطی برای مادر سرپرست خانوار",
    description: "این مادر سرپرست خانوار با داشتن مهارت خیاطی، با یک ماشین خیاطی می‌تواند امرار معاش کند.",
    targetAmount: 35000000,
    urgencyLevel: "medium" as const,
    tags: ["اشتغال", "زنان", "خیاطی", "سرپرست خانوار"],
  },
  {
    categoryKey: "medical",
    title: "عمل جراحی قلب باز برای کودک",
    description: "این نوزاد با نقص مادرزادی قلب متولد شده و نیاز به عمل جراحی فوری دارد.",
    targetAmount: 250000000,
    urgencyLevel: "critical" as const,
    tags: ["سلامت", "کودکان", "قلب", "جراحی"],
  },
  {
    categoryKey: "environment",
    title: "کاشت درخت در منطقه کویری",
    description: "پروژه کاشت ۱۰۰۰ اصله درخت در مناطق کویری برای مقابله با ریزگردها و بیابان‌زایی.",
    targetAmount: 50000000,
    urgencyLevel: "low" as const,
    tags: ["محیط زیست", "درختکاری", "کویر", "آلودگی"],
  },
  {
    categoryKey: "food",
    title: "افطاری ساده برای روزه‌داران",
    description: "برگزاری سفره افطار ساده برای ۵۰۰ نفر در ماه رمضان.",
    targetAmount: 40000000,
    urgencyLevel: "medium" as const,
    tags: ["غذا", "رمضان", "افطاری", "صدقه"],
  },
  {
    categoryKey: "housing",
    title: "تعمیر سقف منزل خانواده نیازمند",
    description: "سقف این منزل در آستانه ریزش است و باید فوری تعمیر شود.",
    targetAmount: 60000000,
    urgencyLevel: "high" as const,
    tags: ["مسکن", "تعمیر", "خانواده", "ایمنی"],
  },
  {
    categoryKey: "education",
    title: "کمک هزینه شهریه دانشجوی نیازمند",
    description: "این دانشجوی ممتاز به دلیل مشکلات مالی نمی‌تواند شهریه دانشگاه را پرداخت کند.",
    targetAmount: 70000000,
    urgencyLevel: "medium" as const,
    tags: ["آموزش", "دانشگاه", "شهریه", "دانشجو"],
  },
  {
    categoryKey: "medical",
    title: "خرید عینک طبی برای دانش‌آموزان کم‌بینا",
    description: "تهیه عینک طبی برای ۳۰ دانش‌آموز کم‌بینا که از تحصیل بازمانده‌اند.",
    targetAmount: 18000000,
    urgencyLevel: "medium" as const,
    tags: ["سلامت", "کودکان", "عینک", "بینایی"],
  },
  {
    categoryKey: "employment",
    title: "راه‌اندازی کارگاه صنایع دستی",
    description: "راه‌اندازی کارگاه صنایع دستی برای اشتغال ۱۰ زن روستایی.",
    targetAmount: 90000000,
    urgencyLevel: "low" as const,
    tags: ["اشتغال", "زنان", "صنایع دستی", "روستا"],
  },
  {
    categoryKey: "emergency",
    title: "کمک به آسیب‌دیدگان زلزله",
    description: "کمک فوری به خانواده‌های آسیب‌دیده از زلزله اخیر برای تامین سرپناه و غذا.",
    targetAmount: 500000000,
    urgencyLevel: "critical" as const,
    tags: ["اورژانس", "زلزله", "بلایای طبیعی", "سرپناه"],
  },
];
const cities = [
  { name: "تهران", lat: 35.6892, lng: 51.389 },
  { name: "مشهد", lat: 36.2605, lng: 59.6168 },
  { name: "اصفهان", lat: 32.6546, lng: 51.668 },
  { name: "شیراز", lat: 29.5918, lng: 52.5836 },
  { name: "تبریز", lat: 38.0962, lng: 46.2738 },
  { name: "کرج", lat: 35.8327, lng: 50.9916 },
  { name: "اهواز", lat: 31.3183, lng: 48.6706 },
  { name: "قم", lat: 34.6416, lng: 50.8746 },
];

export async function seedNeeds(users: any[], categories: any[]) {
  console.log("🌱 Starting need seeder...");

  try {
    // پاک کردن نیازهای قبلی
    await NeedModel.deleteMany({});
    console.log("  ✓ Cleared existing needs");

    // Create a map from category names to their IDs
    const categoryNameToId: Record<string, any> = {};
    categories.forEach((cat) => {
      categoryNameToId[cat.name] = cat._id;
    });

    // ======================= تغییر اصلی در این بخش است =======================
    const createdNeeds = []; // آرایه‌ای برای نگهداری نیازهای ایجاد شده
    const now = new Date();

    // ایجاد نیازها به صورت تکی در یک حلقه
    for (let i = 0; i < needTemplates.length; i++) {
      const template = needTemplates[i];
      // ... (بقیه منطق ساختن آبجکت need بدون تغییر باقی می‌ماند)
      const creator = users[Math.floor(Math.random() * Math.min(users.length, 20))];
      const city = cities[i % cities.length];
      const categoryName = categoryMap[template.categoryKey];
      const categoryId = categoryNameToId[categoryName];

      if (!categoryId) {
        console.warn(`  ⚠ Category not found for ${template.categoryKey}, skipping need`);
        continue;
      }

      const supportersCount = Math.floor(Math.random() * 30);
      const supporters: any[] = [];
      for (let j = 0; j < supportersCount; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!supporters.includes(randomUser._id)) {
          supporters.push(randomUser._id);
        }
      }

      const progressPercent = Math.random() * 0.8 + 0.1;
      const amountRaised = Math.floor(template.targetAmount * progressPercent);
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 180) + 30);

      const budgetItems = [
        {
          title: "هزینه اصلی",
          description: "هزینه اصلی پروژه",
          category: "primary",
          estimatedCost: Math.floor(template.targetAmount * 0.8),
          amountRaised: Math.floor(amountRaised * 0.8),
          priority: 5,
        },
        {
          title: "هزینه‌های جانبی",
          description: "هزینه‌های عملیاتی و اداری",
          category: "operational",
          estimatedCost: Math.floor(template.targetAmount * 0.2),
          amountRaised: Math.floor(amountRaised * 0.2),
          priority: 3,
        },
      ];

      let status: "draft" | "pending" | "approved" | "in_progress" | "completed" =
        progressPercent >= 0.99 ? "completed" : progressPercent >= 0.5 ? "in_progress" : "approved";

      // Select random attachments for this need (2-5 attachments)
      const attachmentCount = Math.floor(Math.random() * 4) + 2; // 2 to 5 attachments
      const selectedAttachments = [];
      const attachmentIndices = new Set<number>();

      // Make sure we have at least one image
      const imageAttachments = sampleAttachments.filter(a => a.fileType === "image");
      if (imageAttachments.length > 0) {
        const randomImage = imageAttachments[Math.floor(Math.random() * imageAttachments.length)];
        selectedAttachments.push(randomImage);
      }

      // Add random attachments (could be any type)
      while (selectedAttachments.length < attachmentCount && selectedAttachments.length < sampleAttachments.length) {
        const randomIndex = Math.floor(Math.random() * sampleAttachments.length);
        if (!attachmentIndices.has(randomIndex)) {
          attachmentIndices.add(randomIndex);
          selectedAttachments.push(sampleAttachments[randomIndex]);
        }
      }

      const needData = {
        // نام متغیر را به needData تغییر دادیم تا با متغیر need در حلقه بعدی تداخل نکند
        title: template.title,
        description: template.description,
        category: categoryId,
        urgencyLevel: template.urgencyLevel,
        status,
        deadline,
        location: {
          type: "Point",
          coordinates: [city.lng, city.lat],
          address: `${city.name}، ایران`,
          city: city.name,
          province: city.name,
          country: "ایران",
        },
        tags: template.tags,
        submittedBy: {
          user: creator._id,
        },
        supporters,
        upvotes: supporters.slice(0, Math.floor(supporters.length * 0.6)),
        viewsCount: Math.floor(Math.random() * 500) + 50,
        budgetItems,
        attachments: selectedAttachments,
        estimatedDuration: ["۱ ماه", "۲ ماه", "۳ ماه", "۶ ماه", "۱ سال"][Math.floor(Math.random() * 5)],
        requiredSkills: [
          ["پزشکی", "پرستاری"],
          ["آموزش", "مدیریت کلاس"],
          ["ساختمان‌سازی", "تعمیرات"],
          ["آشپزی", "توزیع غذا"],
          ["خیاطی", "طراحی"],
          ["کشاورزی", "باغبانی"],
        ][i % 6],
      };

      // **به جای push کردن، مستقیماً نیاز را ایجاد می‌کنیم**
      const newNeed = await NeedModel.create(needData);
      createdNeeds.push(newNeed); // نیاز ایجاد شده را به آرایه اضافه می‌کنیم
    }
    // =======================================================================

    // **دیگر نیازی به خط insertMany نیست**
    // const createdNeeds = await NeedModel.insertMany(needs);
    console.log(`  ✓ Created ${createdNeeds.length} needs`);

    // ... (بخش اضافه کردن updates و milestones بدون تغییر کار خواهد کرد)
    for (let i = 0; i < Math.min(5, createdNeeds.length); i++) {
      const need = createdNeeds[i];

      const updates = [
        {
          title: "شروع جمع‌آوری کمک‌ها",
          description: "با تشکر از حامیان عزیز، جمع‌آوری کمک‌ها آغاز شد.",
          date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          title: "پیشرفت ۵۰٪",
          description: "با کمک شما عزیزان به نصف راه رسیدیم. از همراهی شما سپاسگزاریم.",
          date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        },
      ];

      // کد اصلاح‌شده
      const totalBudget = (need.budgetItems || []).reduce(
        (sum: number, item: any) => sum + item.estimatedCost,
        0
      );
      const totalRaised = (need.budgetItems || []).reduce(
        (sum: number, item: any) => sum + item.amountRaised,
        0
      );

      const milestones = [
        {
          title: "تکمیل ۲۵٪ هدف",
          description: "رسیدن به یک چهارم هدف مالی",
          targetDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          status: totalRaised >= totalBudget * 0.25 ? "completed" : "in_progress",
          progressPercentage: Math.min(100, Math.round((totalRaised / (totalBudget * 0.25)) * 100)),
          order: 1,
        },
        {
          title: "تکمیل ۵۰٪ هدف",
          description: "رسیدن به نصف هدف مالی",
          targetDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          status:
            totalRaised >= totalBudget * 0.5
              ? "completed"
              : totalRaised >= totalBudget * 0.25
              ? "in_progress"
              : "pending",
          progressPercentage:
            totalRaised >= totalBudget * 0.25
              ? Math.min(100, Math.round(((totalRaised - totalBudget * 0.25) / (totalBudget * 0.25)) * 100))
              : 0,
          order: 2,
        },
        {
          title: "تکمیل ۱۰۰٪ هدف",
          description: "رسیدن به هدف نهایی",
          targetDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
          status:
            totalRaised >= totalBudget
              ? "completed"
              : totalRaised >= totalBudget * 0.5
              ? "in_progress"
              : "pending",
          progressPercentage:
            totalRaised >= totalBudget * 0.5
              ? Math.min(100, Math.round(((totalRaised - totalBudget * 0.5) / (totalBudget * 0.5)) * 100))
              : 0,
          order: 3,
        },
      ];

      await NeedModel.findByIdAndUpdate(need._id, {
        $set: {
          updates,
          milestones,
        },
      });
    }

    console.log("  ✓ Added updates and milestones to 5 needs");

    return createdNeeds;
  } catch (error) {
    console.error("  ✗ Error seeding needs:", error);
    throw error;
  }
}
