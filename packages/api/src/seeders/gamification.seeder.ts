import { UserStatsModel } from "../modules/gamification/userStats.model";

/**
 * Gamification Seeder - ایجاد UserStats برای کاربران
 */

export async function seedGamification(users: any[]) {
  console.log("🌱 Starting gamification seeder...");

  try {
    // پاک کردن UserStats قبلی
    await UserStatsModel.deleteMany({});
    console.log("  ✓ Cleared existing UserStats");

    const userStats = [];

    // ایجاد UserStats برای هر کاربر
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // امتیازات تصادفی بین 0 تا 5000
      const totalPoints = Math.floor(Math.random() * 5000);

      // سطح بر اساس امتیاز (هر 500 امتیاز = 1 سطح)
      const currentLevel = Math.floor(totalPoints / 500) + 1;

      // تعداد نیازها و فعالیت‌ها
      const needsCreated = Math.floor(Math.random() * 20);
      const needsSupported = Math.floor(Math.random() * 30);
      const tasksCompleted = Math.floor(Math.random() * 50);
      const badgesCount = Math.floor(Math.random() * 10);

      // امتیازات روزانه، هفتگی و ماهانه
      const pointsEarnedToday = Math.floor(Math.random() * 100);
      const pointsEarnedThisWeek = pointsEarnedToday + Math.floor(Math.random() * 300);
      const pointsEarnedThisMonth = pointsEarnedThisWeek + Math.floor(Math.random() * 500);

      userStats.push({
        userId: user._id,
        totalPoints,
        currentLevel,
        pointsInCurrentLevel: totalPoints % 500,
        needsCreated,
        needsSupported,
        tasksCompleted,
        badgesCount,
        pointsEarnedToday,
        pointsEarnedThisWeek,
        pointsEarnedThisMonth,
        lastDailyBonus: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // آخرین 7 روز
        totalActiveDays: Math.floor(Math.random() * 100),
        lastActivityAt: new Date(),
      });
    }

    // ذخیره UserStats
    const createdStats = await UserStatsModel.insertMany(userStats);
    console.log(`  ✓ Created ${createdStats.length} UserStats`);
    console.log(`    - Total points range: 0-5000`);
    console.log(`    - Levels range: 1-11`);

    return createdStats;
  } catch (error) {
    console.error("  ✗ Error seeding gamification:", error);
    throw error;
  }
}
