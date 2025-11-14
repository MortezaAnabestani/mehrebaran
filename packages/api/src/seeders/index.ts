import mongoose from "mongoose";
import { seedUsers } from "./user.seeder";
import { seedNeedCategories } from "./needCategory.seeder";
import { seedNeeds } from "./need.seeder";
import { seedTeams } from "./team.seeder";
import { seedSocialInteractions } from "./social.seeder";
import { seedGamification } from "./gamification.seeder";
import { seedCategories } from "./category.seeder";
import { seedAuthors } from "./author.seeder";
import { seedTags } from "./tag.seeder";
import { seedArticles } from "./article.seeder";
import { seedNews } from "./news.seeder";
import { seedVideos } from "./video.seeder";
import { seedGalleries } from "./gallery.seeder";
import { seedProjects } from "./project.seeder";
import { seedDonations } from "./donation.seeder";
import { seedVolunteers } from "./volunteer.seeder";
import { seedStories } from "./story.seeder";
import { seedFaqs } from "./faq.seeder";
import { seedSettings } from "./setting.seeder";
import { seedFocusAreas } from "./focus-area.seeder";

/**
 * Master Seeder - اجرای تمام seeders
 */

async function runSeeders() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // اتصال به دیتابیس
    const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/mehrebaran_db";
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB\n");

    // ========== اجرای seeders اصلی (برای needs و teams) ==========
    const users = await seedUsers();
    console.log("");

    const needCategories = await seedNeedCategories();
    console.log("");

    const needs = await seedNeeds(users, needCategories);
    console.log("");

    const teams = await seedTeams(users, needs);
    console.log("");

    await seedSocialInteractions(users, needs);
    console.log("");

    const gamificationStats = await seedGamification(users);
    console.log("");

    // ========== اجرای seeders جدید (برای وبلاگ، پروژه‌ها و...) ==========
    console.log("📰 Seeding blog and content...\n");

    const categories = await seedCategories();
    console.log("");

    const authors = await seedAuthors();
    console.log("");

    const tags = await seedTags();
    console.log("");

    const articles = await seedArticles();
    console.log("");

    const news = await seedNews();
    console.log("");

    const videos = await seedVideos();
    console.log("");

    const galleries = await seedGalleries();
    console.log("");

    console.log("💼 Seeding projects and donations...\n");

    const projects = await seedProjects();
    console.log("");

    const donations = await seedDonations();
    console.log("");

    const volunteers = await seedVolunteers();
    console.log("");

    console.log("📱 Seeding social features...\n");

    const stories = await seedStories();
    console.log("");

    console.log("⚙️ Seeding settings and FAQs...\n");

    const faqs = await seedFaqs();
    console.log("");

    const settings = await seedSettings();
    console.log("");

    const focusAreas = await seedFocusAreas();
    console.log("");

    // خلاصه نتایج
    console.log("=".repeat(60));
    console.log("🎉 Seeding completed successfully!");
    console.log("=".repeat(60));
    console.log("Core Data:");
    console.log(`  ✓ ${users.length} users created`);
    console.log(`  ✓ ${needCategories.length} need categories created`);
    console.log(`  ✓ ${needs.length} needs created`);
    console.log(`  ✓ ${teams.length} teams created`);
    console.log(`  ✓ ${gamificationStats.length} user stats created`);
    console.log("");
    console.log("Blog & Content:");
    console.log(`  ✓ ${categories.length} categories created`);
    console.log(`  ✓ ${authors.length} authors created`);
    console.log(`  ✓ ${tags.length} tags created`);
    console.log(`  ✓ ${articles.length} articles created`);
    console.log(`  ✓ ${news.length} news items created`);
    console.log(`  ✓ ${videos.length} videos created`);
    console.log(`  ✓ ${galleries.length} galleries created`);
    console.log("");
    console.log("Projects & Charity:");
    console.log(`  ✓ ${projects.length} projects created`);
    console.log(`  ✓ ${donations.length} donations created`);
    console.log(`  ✓ ${volunteers.length} volunteer registrations created`);
    console.log("");
    console.log("Social & Settings:");
    console.log(`  ✓ ${stories.length} stories created`);
    console.log(`  ✓ ${faqs.length} FAQs created`);
    console.log(`  ✓ ${settings.length} settings created`);
    console.log(`  ✓ ${focusAreas.length} focus areas created`);
    console.log("=".repeat(60));
    console.log("\n📝 Test Account:");
    console.log("   Mobile: 09120000000");
    console.log("   Password: password123");
    console.log("   Role: super_admin");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

// اجرای seeder
runSeeders();
