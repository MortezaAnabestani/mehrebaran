import mongoose from "mongoose";
import { SettingModel } from "../modules/settings/setting.model";

/**
 * Script to add focusPageHero setting without clearing existing data
 */

const focusPageHeroSetting = {
  key: "focusPageHero",
  value: {
    title: "حوزه‌های فعالیت",
    subtitle: "کانون مهرباران",
    description:
      "فعالیت‌های داوطلبانه و عام‌المنفعه سازمان دانشجویان جهاد دانشگاهی خراسان رضوی جهت فرهنگ‌سازی، توسعه پایدار و ایجاد تحول مثبت در جامعه",
    stats: {
      projects: { label: "پروژه فعال", value: "۲۲۰+" },
      volunteers: { label: "داوطلب", value: "۱۵۹۰+" },
      beneficiaries: { label: "ذینفع", value: "۱۴۱۰۰+" },
    },
    dockImages: [
      "/images/1.png",
      "/images/2.png",
      "/images/hero_img.jpg",
      "/images/blog_img.jpg",
    ],
  },
};

async function addFocusHeroSetting() {
  try {
    console.log("🌱 Adding focusPageHero setting...\n");

    // اتصال به دیتابیس
    const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/mehrebaran_db";
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB\n");

    // بررسی اینکه آیا تنظیم از قبل وجود دارد
    const existing = await SettingModel.findOne({ key: "focusPageHero" });

    if (existing) {
      console.log("⚠ focusPageHero setting already exists. Updating...");
      await SettingModel.findOneAndUpdate(
        { key: "focusPageHero" },
        { value: focusPageHeroSetting.value },
        { new: true }
      );
      console.log("✓ Updated focusPageHero setting");
    } else {
      console.log("Creating new focusPageHero setting...");
      await SettingModel.create(focusPageHeroSetting);
      console.log("✓ Created focusPageHero setting");
    }

    console.log("\n✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

// اجرا
addFocusHeroSetting();
