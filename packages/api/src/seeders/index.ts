import mongoose from "mongoose";
import { seedUsers } from "./user.seeder";
import { seedNeedCategories } from "./needCategory.seeder";
import { seedNeeds } from "./need.seeder";
import { seedTeams } from "./team.seeder";
import { seedSocialInteractions } from "./social.seeder";

/**
 * Master Seeder - اجرای تمام seeders
 */

async function runSeeders() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // اتصال به دیتابیس
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mehrebaran";
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB\n");

    // اجرای seeders به ترتیب
    const users = await seedUsers();
    console.log("");

    const categories = await seedNeedCategories();
    console.log("");

    const needs = await seedNeeds(users, categories);
    console.log("");

    const teams = await seedTeams(users, needs);
    console.log("");

    const social = await seedSocialInteractions(users, needs);
    console.log("");

    // خلاصه نتایج
    console.log("=" .repeat(50));
    console.log("🎉 Seeding completed successfully!");
    console.log("=" .repeat(50));
    console.log(`✓ ${users.length} users created`);
    console.log(`✓ ${categories.length} need categories created`);
    console.log(`✓ ${needs.length} needs created`);
    console.log(`✓ ${teams.length} teams created`);
    console.log(`✓ ${social.follows.length} follows created`);
    console.log(`✓ ${social.likes.length} likes created`);
    console.log(`✓ ${social.comments.length} comments created`);
    console.log("=" .repeat(50));
    console.log("\n📝 Test Account:");
    console.log("   Email: admin@mehrebaran.ir");
    console.log("   Password: password123");
    console.log("=" .repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

// اجرای seeder
runSeeders();
