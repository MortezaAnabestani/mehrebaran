import { StoryModel } from "../modules/stories/story.model";
import { UserModel } from "../modules/users/user.model";

/**
 * Story Seeder - ایجاد استوری‌های فیک
 */

export async function seedStories() {
  console.log("🌱 Starting story seeder...");

  try {
    // پاک کردن استوری‌های قبلی
    await StoryModel.deleteMany({});
    console.log("  ✓ Cleared existing stories");

    // دریافت کاربران
    const users = await UserModel.find({ role: { $in: ["user", "admin"] } }).limit(20);

    if (users.length === 0) {
      console.warn("  ⚠ Users not found. Please seed them first.");
      return [];
    }

    const storyData = [];
    const now = new Date();

    // برای هر کاربر چند استوری ایجاد می‌کنیم
    for (let i = 0; i < Math.min(users.length, 10); i++) {
      const user = users[i];

      // تعداد تصادفی استوری برای هر کاربر (بین 1 تا 3)
      const storyCount = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < storyCount; j++) {
        // نوع استوری
        const types = ["image", "image", "video", "text"];
        const type = types[Math.floor(Math.random() * types.length)];

        // تاریخ ایجاد (تصادفی در 24 ساعت گذشته)
        const hoursAgo = Math.floor(Math.random() * 24);
        const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

        // تاریخ انقضا (24 ساعت بعد از ایجاد)
        const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

        const story: any = {
          user: user._id,
          type,
          privacy: ["public", "public", "public", "followers"][Math.floor(Math.random() * 4)], // بیشتر عمومی
          allowReplies: Math.random() > 0.2, // 80% اجازه پاسخ
          allowSharing: Math.random() > 0.3, // 70% اجازه اشتراک
          isActive: expiresAt > now, // فعال اگر هنوز منقضی نشده
          expiresAt,
          createdAt,
          viewsCount: Math.floor(Math.random() * 100),
          reactionsCount: Math.floor(Math.random() * 20),
        };

        // محتوای بر اساس نوع
        if (type === "image") {
          const imageUrls = [
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600",
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600",
            "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
            "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600",
          ];
          story.media = {
            type: "image",
            url: imageUrls[Math.floor(Math.random() * imageUrls.length)],
          };
          story.caption = [
            "لحظات خوب فعالیت‌های داوطلبانه 🌟",
            "با هم می‌توانیم دنیا را بهتر کنیم 💚",
            "یک روز پر از خاطرات خوب",
            "همراه تیم در پروژه امروز",
            undefined,
          ][Math.floor(Math.random() * 5)];
        } else if (type === "video") {
          story.media = {
            type: "video",
            url: "https://example.com/videos/sample.mp4",
            thumbnail: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600",
            duration: Math.floor(Math.random() * 30) + 10, // 10 تا 40 ثانیه
          };
          story.caption = [
            "گزارش کوتاه از فعالیت امروز",
            "یک روز معمولی در پروژه ما",
            "کمی از کارهایی که انجام دادیم",
            undefined,
          ][Math.floor(Math.random() * 4)];
        } else if (type === "text") {
          const texts = [
            "امروز روز فوق‌العاده‌ای بود. خوشحالم که تونستم کمک کنم 💚",
            "یادم باشه که مهربانی، زبان جهانیه",
            "هر کمک کوچکی می‌تونه تغییر بزرگی ایجاد کنه",
            "سپاسگزارم از همه کسانی که امروز همراهمون بودن",
            "کار تیمی، کلید موفقیته 🔑",
          ];
          story.text = texts[Math.floor(Math.random() * texts.length)];
          story.backgroundColor = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"][Math.floor(Math.random() * 5)];
          story.textColor = "#FFFFFF";
          story.fontFamily = "IRANSans";
        }

        // افزودن views (برای استوری‌های قدیمی‌تر)
        if (hoursAgo > 2 && story.viewsCount > 0) {
          const viewCount = Math.min(story.viewsCount, users.length - 1);
          story.views = [];
          const viewedUsers = new Set();
          for (let k = 0; k < viewCount; k++) {
            let viewer;
            do {
              viewer = users[Math.floor(Math.random() * users.length)];
            } while (viewer._id.toString() === user._id.toString() || viewedUsers.has(viewer._id.toString()));

            viewedUsers.add(viewer._id.toString());
            story.views.push({
              user: viewer._id,
              viewedAt: new Date(createdAt.getTime() + Math.floor(Math.random() * hoursAgo * 60 * 60 * 1000)),
              viewDuration: Math.floor(Math.random() * 10) + 3, // 3 تا 12 ثانیه
            });
          }
        }

        // افزودن reactions
        if (story.reactionsCount > 0) {
          const reactionCount = Math.min(story.reactionsCount, users.length - 1);
          story.reactions = [];
          const reactedUsers = new Set();
          const emojis = ["❤️", "👍", "😊", "🔥", "👏", "🙏"];

          for (let k = 0; k < reactionCount; k++) {
            let reactor;
            do {
              reactor = users[Math.floor(Math.random() * users.length)];
            } while (reactor._id.toString() === user._id.toString() || reactedUsers.has(reactor._id.toString()));

            reactedUsers.add(reactor._id.toString());
            story.reactions.push({
              user: reactor._id,
              emoji: emojis[Math.floor(Math.random() * emojis.length)],
              reactedAt: new Date(createdAt.getTime() + Math.floor(Math.random() * hoursAgo * 60 * 60 * 1000)),
            });
          }
        }

        storyData.push(story);
      }
    }

    // ایجاد استوری‌ها
    const stories = await StoryModel.insertMany(storyData);
    console.log(
      `  ✓ Created ${stories.length} stories (${storyData.filter((s) => s.isActive).length} active, ${storyData.filter((s) => !s.isActive).length} expired)`
    );

    return stories;
  } catch (error) {
    console.error("  ✗ Error seeding stories:", error);
    throw error;
  }
}
