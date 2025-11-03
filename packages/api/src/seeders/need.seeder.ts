import { NeedModel } from "../modules/needs/need.model";

/**
 * NeedModel Seeder - ایجاد نیازهای فیک
 */

const needTemplates = [
  {
    category: "medical",
    title: "کمک به هزینه درمان کودک مبتلا به سرطان",
    description:
      "این کودک ۷ ساله به سرطان خون مبتلا شده و نیاز به شیمی‌درمانی دارد. خانواده توان پرداخت هزینه‌های درمانی را ندارند.",
    targetAmount: 150000000,
    priority: "high",
    tags: ["سلامت", "کودکان", "سرطان", "درمان"],
  },
  {
    category: "education",
    title: "تامین لوازم‌التحریر برای دانش‌آموزان روستایی",
    description:
      "دانش‌آموزان روستای محروم به لوازم‌التحریر و کیف مدرسه نیاز دارند. با کمک شما می‌توانیم ۵۰ دانش‌آموز را تجهیز کنیم.",
    targetAmount: 25000000,
    priority: "medium",
    tags: ["آموزش", "کودکان", "روستا", "لوازم‌التحریر"],
  },
  {
    category: "housing",
    title: "ساخت خانه برای خانواده آسیب‌دیده از سیل",
    description:
      "این خانواده در سیل اخیر خانه خود را از دست داده‌اند. نیاز به کمک برای ساخت یک خانه ساده دارند.",
    targetAmount: 200000000,
    priority: "critical",
    tags: ["مسکن", "بلایای طبیعی", "سیل", "خانواده"],
  },
  {
    category: "food",
    title: "تهیه بسته غذایی برای خانواده‌های نیازمند",
    description: "با نزدیک شدن به ماه رمضان، قصد داریم ۱۰۰ بسته غذایی برای خانواده‌های نیازمند تهیه کنیم.",
    targetAmount: 30000000,
    priority: "medium",
    tags: ["غذا", "رمضان", "خانواده", "نیازمندان"],
  },
  {
    category: "medical",
    title: "خرید ویلچر برای جانباز جنگ",
    description: "این جانباز گرامی که در دوران دفاع مقدس مجروح شده، به ویلچر برقی نیاز دارد.",
    targetAmount: 45000000,
    priority: "high",
    tags: ["سلامت", "جانبازان", "ویلچر", "دفاع مقدس"],
  },
  {
    category: "education",
    title: "راه‌اندازی کتابخانه روستایی",
    description:
      "قصد داریم یک کتابخانه کوچک در روستای محروم راه‌اندازی کنیم. به کتاب، قفسه و میز و صندلی نیاز داریم.",
    targetAmount: 80000000,
    priority: "low",
    tags: ["آموزش", "کتابخانه", "روستا", "فرهنگ"],
  },
  {
    category: "employment",
    title: "خرید ماشین خیاطی برای مادر سرپرست خانوار",
    description: "این مادر سرپرست خانوار با داشتن مهارت خیاطی، با یک ماشین خیاطی می‌تواند امرار معاش کند.",
    targetAmount: 35000000,
    priority: "medium",
    tags: ["اشتغال", "زنان", "خیاطی", "سرپرست خانوار"],
  },
  {
    category: "medical",
    title: "عمل جراحی قلب باز برای کودک",
    description: "این نوزاد با نقص مادرزادی قلب متولد شده و نیاز به عمل جراحی فوری دارد.",
    targetAmount: 250000000,
    priority: "critical",
    tags: ["سلامت", "کودکان", "قلب", "جراحی"],
  },
  {
    category: "environment",
    title: "کاشت درخت در منطقه کویری",
    description: "پروژه کاشت ۱۰۰۰ اصله درخت در مناطق کویری برای مقابله با ریزگردها و بیابان‌زایی.",
    targetAmount: 50000000,
    priority: "low",
    tags: ["محیط زیست", "درختکاری", "کویر", "آلودگی"],
  },
  {
    category: "food",
    title: "افطاری ساده برای روزه‌داران",
    description: "برگزاری سفره افطار ساده برای ۵۰۰ نفر در ماه رمضان.",
    targetAmount: 40000000,
    priority: "medium",
    tags: ["غذا", "رمضان", "افطاری", "صدقه"],
  },
  {
    category: "housing",
    title: "تعمیر سقف منزل خانواده نیازمند",
    description: "سقف این منزل در آستانه ریزش است و باید فوری تعمیر شود.",
    targetAmount: 60000000,
    priority: "high",
    tags: ["مسکن", "تعمیر", "خانواده", "ایمنی"],
  },
  {
    category: "education",
    title: "کمک هزینه شهریه دانشجوی نیازمند",
    description: "این دانشجوی ممتاز به دلیل مشکلات مالی نمی‌تواند شهریه دانشگاه را پرداخت کند.",
    targetAmount: 70000000,
    priority: "medium",
    tags: ["آموزش", "دانشگاه", "شهریه", "دانشجو"],
  },
  {
    category: "medical",
    title: "خرید عینک طبی برای دانش‌آموزان کم‌بینا",
    description: "تهیه عینک طبی برای ۳۰ دانش‌آموز کم‌بینا که از تحصیل بازمانده‌اند.",
    targetAmount: 18000000,
    priority: "medium",
    tags: ["سلامت", "کودکان", "عینک", "بینایی"],
  },
  {
    category: "employment",
    title: "راه‌اندازی کارگاه صنایع دستی",
    description: "راه‌اندازی کارگاه صنایع دستی برای اشتغال ۱۰ زن روستایی.",
    targetAmount: 90000000,
    priority: "low",
    tags: ["اشتغال", "زنان", "صنایع دستی", "روستا"],
  },
  {
    category: "emergency",
    title: "کمک به آسیب‌دیدگان زلزله",
    description: "کمک فوری به خانواده‌های آسیب‌دیده از زلزله اخیر برای تامین سرپناه و غذا.",
    targetAmount: 500000000,
    priority: "critical",
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

export async function seedNeeds(users: any[]) {
  console.log("🌱 Starting need seeder...");

  try {
    // پاک کردن نیازهای قبلی
    await NeedModel.deleteMany({});
    console.log("  ✓ Cleared existing needs");

    const needs = [];
    const now = new Date();

    // ایجاد نیازها
    for (let i = 0; i < needTemplates.length; i++) {
      const template = needTemplates[i];
      const creator = users[Math.floor(Math.random() * Math.min(users.length, 20))];
      const city = cities[i % cities.length];

      // تعداد تصادفی حامیان (۰ تا ۳۰)
      const supportersCount = Math.floor(Math.random() * 30);
      const supporters: any[] = [];
      for (let j = 0; j < supportersCount; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!supporters.includes(randomUser._id)) {
          supporters.push(randomUser._id);
        }
      }

      // مبلغ جمع‌آوری شده (۱۰٪ تا ۹۰٪ هدف)
      const progressPercent = Math.random() * 0.8 + 0.1; // 10% to 90%
      const currentAmount = Math.floor(template.targetAmount * progressPercent);

      // تاریخ deadline (۱ تا ۶ ماه آینده)
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 180) + 30);

      const need = {
        title: template.title,
        description: template.description,
        category: template.category,
        priority: template.priority,
        targetAmount: template.targetAmount,
        currentAmount,
        deadline,
        location: {
          address: `${city.name}، ایران`,
          city: city.name,
          province: city.name,
          coordinates: {
            latitude: city.lat,
            longitude: city.lng,
          },
        },
        tags: template.tags,
        createdBy: creator._id,
        supporters,
        status: progressPercent >= 0.99 ? "completed" : progressPercent >= 0.7 ? "in_progress" : "pending",
        visibility: "public",
        stats: {
          viewsCount: Math.floor(Math.random() * 500) + 50,
          likesCount: Math.floor(Math.random() * 100) + 10,
          commentsCount: Math.floor(Math.random() * 30) + 2,
          sharesCount: Math.floor(Math.random() * 20) + 1,
        },
      };

      needs.push(need);
    }

    // ذخیره نیازها
    const createdNeeds = await NeedModel.insertMany(needs);
    console.log(`  ✓ Created ${createdNeeds.length} needs`);

    // اضافه کردن updates, milestones و budget برای بعضی از نیازها
    for (let i = 0; i < Math.min(5, createdNeeds.length); i++) {
      const need = createdNeeds[i];

      // اضافه کردن آپدیت‌ها
      const updates = [
        {
          title: "شروع جمع‌آوری کمک‌ها",
          content: "با تشکر از حامیان عزیز، جمع‌آوری کمک‌ها آغاز شد.",
          images: [],
          createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        },
        {
          title: "پیشرفت ۵۰٪",
          content: "با کمک شما عزیزان به نصف راه رسیدیم. از همراهی شما سپاسگزاریم.",
          images: [],
          createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
      ];

      // اضافه کردن milestone ها
      const milestones = [
        {
          title: "تکمیل ۲۵٪ هدف",
          description: "رسیدن به یک چهارم هدف مالی",
          targetAmount: need.targetAmount * 0.25,
          currentAmount:
            need.currentAmount >= need.targetAmount * 0.25 ? need.targetAmount * 0.25 : need.currentAmount,
          isCompleted: need.currentAmount >= need.targetAmount * 0.25,
        },
        {
          title: "تکمیل ۵۰٪ هدف",
          description: "رسیدن به نصف هدف مالی",
          targetAmount: need.targetAmount * 0.5,
          currentAmount:
            need.currentAmount >= need.targetAmount * 0.5
              ? need.targetAmount * 0.5
              : need.currentAmount > need.targetAmount * 0.25
              ? need.currentAmount
              : 0,
          isCompleted: need.currentAmount >= need.targetAmount * 0.5,
        },
        {
          title: "تکمیل ۱۰۰٪ هدف",
          description: "رسیدن به هدف نهایی",
          targetAmount: need.targetAmount,
          currentAmount: need.currentAmount,
          isCompleted: need.currentAmount >= need.targetAmount,
        },
      ];

      // اضافه کردن بودجه
      const budgetItems = [
        {
          category: "هزینه اصلی",
          description: "هزینه اصلی پروژه",
          amount: need.targetAmount * 0.8,
          spent: Math.min(need.currentAmount * 0.8, need.targetAmount * 0.8),
        },
        {
          category: "هزینه‌های جانبی",
          description: "هزینه‌های عملیاتی و اداری",
          amount: need.targetAmount * 0.2,
          spent: Math.min(need.currentAmount * 0.2, need.targetAmount * 0.2),
        },
      ];

      await NeedModel.findByIdAndUpdate(need._id, {
        updates,
        milestones,
        budgetItems,
      });
    }

    console.log("  ✓ Added updates, milestones, and budget to 5 needs");

    return createdNeeds;
  } catch (error) {
    console.error("  ✗ Error seeding needs:", error);
    throw error;
  }
}
