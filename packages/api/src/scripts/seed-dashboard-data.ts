import mongoose from "mongoose";
import { UserModel, UserRole } from "../modules/users/user.model";
import { NeedModel } from "../modules/needs/need.model";
import { StoryModel } from "../modules/stories/story.model";
import { DonationModel } from "../modules/donations/donation.model";
import { NeedComment } from "../modules/needs/needComment.model";

/**
 * Script to seed the database with sample data for dashboard testing
 * اسکریپت برای پر کردن دیتابیس با داده‌های نمونه جهت تست داشبورد
 */

async function seedDashboardData() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mehrebaran";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Create sample users
    console.log("📝 Creating sample users...");
    const users = await UserModel.create([
      {
        username: "user1",
        email: "user1@example.com",
        password: "password123",
        fullName: "کاربر اول",
        role: UserRole.USER,
        lastLogin: new Date(),
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: "password123",
        fullName: "کاربر دوم",
        role: UserRole.USER,
        lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        username: "user3",
        email: "user3@example.com",
        password: "password123",
        fullName: "کاربر سوم",
        role: UserRole.USER,
        lastLogin: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create sample needs
    console.log("📝 Creating sample needs...");
    const needs = await NeedModel.create([
      {
        title: "نیاز به کمک مالی برای درمان",
        description: "توضیحات نیاز اول",
        category: "health",
        submittedBy: {
          user: users[0]._id,
        },
        status: "active",
        urgency: "high",
        tags: ["درمان", "پزشکی"],
      },
      {
        title: "نیاز به لوازم التحریر",
        description: "توضیحات نیاز دوم",
        category: "education",
        submittedBy: {
          user: users[1]._id,
        },
        status: "pending",
        urgency: "medium",
        tags: ["تحصیل", "مدرسه"],
      },
      {
        title: "نیاز به مواد غذایی",
        description: "توضیحات نیاز سوم",
        category: "food",
        submittedBy: {
          user: users[2]._id,
        },
        status: "active",
        urgency: "high",
        tags: ["غذا", "کمک"],
      },
      {
        title: "نیاز به پوشاک",
        description: "توضیحات نیاز چهارم",
        category: "clothing",
        submittedBy: {
          user: users[0]._id,
        },
        status: "completed",
        urgency: "low",
        tags: ["لباس", "زمستان"],
      },
      {
        title: "نیاز به مسکن",
        description: "توضیحات نیاز پنجم",
        category: "housing",
        submittedBy: {
          user: users[1]._id,
        },
        status: "pending",
        urgency: "high",
        tags: ["خانه", "اجاره"],
      },
    ]);
    console.log(`✅ Created ${needs.length} needs`);

    // Create sample stories
    console.log("📝 Creating sample stories...");
    const stories = await StoryModel.create([
      {
        user: users[0]._id,
        mediaType: "image",
        mediaUrl: "https://via.placeholder.com/500",
        caption: "استوری اول",
        viewers: [users[1]._id, users[2]._id],
        reactions: [{ user: users[1]._id, reactionType: "❤️" }],
      },
      {
        user: users[1]._id,
        mediaType: "video",
        mediaUrl: "https://via.placeholder.com/500",
        caption: "استوری دوم",
        viewers: [users[0]._id],
        reactions: [],
      },
      {
        user: users[2]._id,
        mediaType: "image",
        mediaUrl: "https://via.placeholder.com/500",
        caption: "استوری امروز",
        viewers: [],
        reactions: [],
        createdAt: new Date(), // Today
      },
    ]);
    console.log(`✅ Created ${stories.length} stories`);

    // Create sample donations (requires Project model - skip for now)
    console.log("ℹ️  Skipping donations (requires Project model)");

    // Create sample comments
    console.log("📝 Creating sample comments...");
    const comments = await NeedComment.create([
      {
        content: "نظر اول روی نیاز اول",
        user: users[1]._id,
        target: needs[0]._id,
        targetType: "need",
      },
      {
        content: "نظر دوم روی نیاز اول",
        user: users[2]._id,
        target: needs[0]._id,
        targetType: "need",
      },
      {
        content: "نظر روی نیاز دوم",
        user: users[0]._id,
        target: needs[1]._id,
        targetType: "need",
      },
    ]);
    console.log(`✅ Created ${comments.length} comments`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nSummary:");
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Needs: ${needs.length}`);
    console.log(`  - Stories: ${stories.length}`);
    console.log(`  - Comments: ${comments.length}`);

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed script
if (require.main === module) {
  seedDashboardData().then(() => {
    console.log("Done!");
    process.exit(0);
  });
}

export default seedDashboardData;
