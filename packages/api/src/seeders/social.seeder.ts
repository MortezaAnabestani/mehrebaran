import { Follow } from "../modules/social/follow.model";
import { Like } from "../modules/social/like.model";
import { NeedComment } from "../modules/needs/needComment.model";

/**
 * Social Interactions Seeder
 */

export async function seedSocialInteractions(users: any[], needs: any[]) {
  console.log("🌱 Starting social interactions seeder...");

  try {
    // پاک کردن داده‌های قبلی
    await Follow.deleteMany({});
    await Like.deleteMany({});
    await NeedComment.deleteMany({});
    console.log("  ✓ Cleared existing social interactions");

    // ===========================
    // Follows - دنبال کردن‌ها
    // ===========================
    const follows = [];
    for (let i = 0; i < users.length; i++) {
      const follower = users[i];

      // هر کاربر چند نفر را دنبال می‌کند (۱ تا ۱۰ نفر)
      const followCount = Math.floor(Math.random() * 10) + 1;
      const followedUsers = new Set();

      for (let j = 0; j < followCount; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (randomUser._id.toString() !== follower._id.toString() && !followedUsers.has(randomUser._id.toString())) {
          followedUsers.add(randomUser._id.toString());
          follows.push({
            follower: follower._id,
            following: randomUser._id,
            followingType: "user",
          });
        }
      }

      // دنبال کردن چند نیاز (۱ تا ۵ نیاز)
      const followNeedCount = Math.floor(Math.random() * 5) + 1;
      const followedNeeds = new Set();

      for (let j = 0; j < followNeedCount; j++) {
        const randomNeed = needs[Math.floor(Math.random() * needs.length)];
        if (!followedNeeds.has(randomNeed._id.toString())) {
          followedNeeds.add(randomNeed._id.toString());
          follows.push({
            follower: follower._id,
            following: randomNeed._id,
            followingType: "need",
          });
        }
      }
    }

    await Follow.insertMany(follows);
    console.log(`  ✓ Created ${follows.length} follows`);

    // ===========================
    // Likes - لایک‌ها
    // ===========================
    const likes = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // هر کاربر چند نیاز را لایک می‌کند (۱ تا ۸ نیاز)
      const likeCount = Math.floor(Math.random() * 8) + 1;
      const likedNeeds = new Set();

      for (let j = 0; j < likeCount; j++) {
        const randomNeed = needs[Math.floor(Math.random() * needs.length)];
        if (!likedNeeds.has(randomNeed._id.toString())) {
          likedNeeds.add(randomNeed._id.toString());
          likes.push({
            user: user._id,
            target: randomNeed._id,
            targetType: "need",
          });
        }
      }
    }

    await Like.insertMany(likes);
    console.log(`  ✓ Created ${likes.length} likes`);

    // ===========================
    // Comments - کامنت‌ها
    // ===========================
    const comments = [];
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

    for (let i = 0; i < needs.length; i++) {
      const need = needs[i];

      // هر نیاز چند کامنت دارد (۲ تا ۱۰ کامنت)
      const commentCount = Math.floor(Math.random() * 9) + 2;

      for (let j = 0; j < commentCount; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];

        comments.push({
          content: randomText,
          user: randomUser._id,
          target: need._id,
          targetType: "need",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
        });
      }
    }

    await NeedComment.insertMany(comments);
    console.log(`  ✓ Created ${comments.length} comments`);

    return { follows, likes, comments };
  } catch (error) {
    console.error("  ✗ Error seeding social interactions:", error);
    throw error;
  }
}
