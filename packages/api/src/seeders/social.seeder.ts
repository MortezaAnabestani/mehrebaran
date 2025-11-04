import { FollowModel } from "../modules/social/follow.model";
import { Like } from "../modules/social/like.model";
import { NeedComment } from "../modules/needs/needComment.model";

/**
 * Social Interactions Seeder
 */

export async function seedSocialInteractions(users: any[], needs: any[]) {
  console.log("🌱 Starting social interactions seeder...");

  try {
    // پاک کردن داده‌های قبلی
    await FollowModel.deleteMany({});
    await Like.deleteMany({});
    await NeedComment.deleteMany({});
    console.log("  ✓ Cleared existing social interactions");

    // ===========================
    // Follows - دنبال کردن‌ها
    // ===========================
    let createdFollowsCount = 0;
    for (const follower of users) {
      // هر کاربر چند نفر را دنبال می‌کند
      const followUserCount = Math.floor(Math.random() * 10) + 1;
      const followedUsers = new Set();
      for (let j = 0; j < followUserCount; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (
          randomUser._id.toString() !== follower._id.toString() &&
          !followedUsers.has(randomUser._id.toString())
        ) {
          followedUsers.add(randomUser._id.toString());
          // استفاده از نام فیلد صحیح `following` بر اساس مدل
          await FollowModel.create({
            follower: follower._id,
            following: randomUser._id, // <<<< این فیلد صحیح است
            followType: "user",
          });
          createdFollowsCount++;
        }
      }

      // هر کاربر چند نیاز را دنبال می‌کند
      const followNeedCount = Math.floor(Math.random() * 5) + 1;
      const followedNeeds = new Set();
      for (let j = 0; j < followNeedCount; j++) {
        const randomNeed = needs[Math.floor(Math.random() * needs.length)];
        if (!followedNeeds.has(randomNeed._id.toString())) {
          followedNeeds.add(randomNeed._id.toString());
          // استفاده از نام فیلد صحیح `followedNeed` بر اساس مدل
          await FollowModel.create({
            follower: follower._id,
            followedNeed: randomNeed._id, // <<<< این فیلد صحیح است
            followType: "need",
          });
          createdFollowsCount++;
        }
      }
    }
    console.log(`  ✓ Created ${createdFollowsCount} follows`);

    // بخش‌های Like و Comment بدون تغییر باقی می‌مانند
    let createdLikesCount = 0;
    for (const user of users) {
      const likeCount = Math.floor(Math.random() * 8) + 1;
      const likedNeeds = new Set();
      for (let j = 0; j < likeCount; j++) {
        const randomNeed = needs[Math.floor(Math.random() * needs.length)];
        if (!likedNeeds.has(randomNeed._id.toString())) {
          likedNeeds.add(randomNeed._id.toString());
          await Like.create({
            user: user._id,
            target: randomNeed._id,
            targetType: "need",
          });
          createdLikesCount++;
        }
      }
    }
    console.log(`  ✓ Created ${createdLikesCount} likes`);

    let createdCommentsCount = 0;
    const commentTexts = [
      "خداقوت! موفق باشید 🙏",
      "ان‌شاالله با کمک همه به هدف می‌رسیم",
      "از همراهی شما متشکریم ❤️",
      "کارتون عالیه، خدا قوت",
      "امیدوارم هرچه زودتر این نیاز برطرف بشه",
      "دستتون درد نکنه واقعاً",
      "ما هم کمک میکنیم 💪",
      "موفق باشید، از ته دل براتون آرزوی موفقیت میکنم",
      "الهی شفا پیدا کنه 🤲",
      "با کمک‌های کوچیک میشه کار بزرگ کرد",
      "چه کار خوبی، تبریک میگم",
      "ایشالا که بهترین‌ها نصیبتون بشه",
      "واقعاً قابل تحسینه 👏",
      "ما پشتیبانتونیم",
      "این کار ثواب داره، ادامه بدین",
    ];
    for (const need of needs) {
      const commentCount = Math.floor(Math.random() * 9) + 2;
      for (let j = 0; j < commentCount; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
        await NeedComment.create({
          content: randomText,
          user: randomUser._id,
          target: need._id,
          targetType: "need",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
        });
        createdCommentsCount++;
      }
    }
    console.log(`  ✓ Created ${createdCommentsCount} comments`);
  } catch (error) {
    console.error("  ✗ Error seeding social interactions:", error);
    throw error;
  }
}
