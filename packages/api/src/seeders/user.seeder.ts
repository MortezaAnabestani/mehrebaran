import { UserModel } from "../modules/users/user.model";
import bcrypt from "bcryptjs";

/**
 * UserModel Seeder - ایجاد کاربران فیک
 */

const persianNames = [
  { first: "علی", last: "محمدی" },
  { first: "زهرا", last: "احمدی" },
  { first: "محمد", last: "رضایی" },
  { first: "فاطمه", last: "کریمی" },
  { first: "حسین", last: "حسینی" },
  { first: "مریم", last: "علوی" },
  { first: "رضا", last: "نوری" },
  { first: "سارا", last: "محمودی" },
  { first: "مهدی", last: "صادقی" },
  { first: "نرگس", last: "جعفری" },
  { first: "امیر", last: "موسوی" },
  { first: "نازنین", last: "کاظمی" },
  { first: "حامد", last: "رحیمی" },
  { first: "الهام", last: "عباسی" },
  { first: "مصطفی", last: "حیدری" },
  { first: "پریسا", last: "اکبری" },
  { first: "سعید", last: "زارعی" },
  { first: "ندا", last: "رستمی" },
  { first: "پوریا", last: "باقری" },
  { first: "شیدا", last: "اسدی" },
  { first: "بهزاد", last: "ملکی" },
  { first: "مهسا", last: "یوسفی" },
  { first: "کامران", last: "فتحی" },
  { first: "لیلا", last: "قاسمی" },
  { first: "سینا", last: "جلالی" },
  { first: "آرزو", last: "میرزایی" },
  { first: "آرش", last: "سلیمانی" },
  { first: "مینا", last: "امینی" },
  { first: "فرهاد", last: "نجفی" },
  { first: "سمیرا", last: "صالحی" },
  { first: "داود", last: "تقوی" },
  { first: "زینب", last: "فروغی" },
  { first: "بابک", last: "شریفی" },
  { first: "سمانه", last: "طاهری" },
  { first: "مجید", last: "رمضانی" },
  { first: "شقایق", last: "کرمی" },
  { first: "فرزاد", last: "منصوری" },
  { first: "نیلوفر", last: "خانی" },
  { first: "پیمان", last: "سعیدی" },
  { first: "مهناز", last: "پورعلی" },
  { first: "نیما", last: "فرهادی" },
  { first: "ترانه", last: "توکلی" },
  { first: "شهاب", last: "غلامی" },
  { first: "پانته‌آ", last: "حکیمی" },
  { first: "کیوان", last: "اصغری" },
  { first: "سپیده", last: "شاکری" },
  { first: "مسعود", last: "رحمانی" },
  { first: "گلناز", last: "افشار" },
  { first: "امید", last: "حسنی" },
  { first: "ساناز", last: "بهرامی" },
];

/**
 * تولید کد ملی تصادفی (فرمت ساده برای تست)
 */
function generateNationalId(index: number): string {
  const num = (1000000000 + index).toString();
  return num;
}

/**
 * تولید شماره موبایل تصادفی
 */
function generateMobile(index: number): string {
  const prefix = "0912"; // یکی از پیش‌شماره‌های ایران
  const num = (3000000 + index).toString().padStart(7, "0");
  return prefix + num;
}

export async function seedUsers() {
  console.log("🌱 Starting user seeder...");

  try {
    // پاک کردن کاربران قبلی
    await UserModel.deleteMany({});
    console.log("  ✓ Cleared existing users");

    const hashedPassword = await bcrypt.hash("password123", 12);
    const users = [];

    // ایجاد admin
    users.push({
      name: "مدیر سیستم",
      mobile: "09120000000",
      nationalId: "0000000000",
      password: hashedPassword,
      role: "super_admin",
      profile: {
        major: "مدیریت سیستم",
        yearOfAdmission: "1400",
      },
    });

    // ایجاد کاربران عادی
    for (let i = 0; i < persianNames.length; i++) {
      const name = persianNames[i];

      users.push({
        name: `${name.first} ${name.last}`,
        mobile: generateMobile(i + 1),
        nationalId: generateNationalId(i + 1),
        password: hashedPassword,
        role: i < 5 ? "admin" : "user",
        profile: {
          major: i % 3 === 0 ? "مهندسی کامپیوتر" : i % 3 === 1 ? "پزشکی" : "حقوق",
          yearOfAdmission: (1398 + (i % 5)).toString(),
        },
      });
    }

    // ذخیره کاربران
    const createdUsers = await UserModel.insertMany(users);
    console.log(`  ✓ Created ${createdUsers.length} users`);
    console.log(`    - Admin: admin@mehrebaran.ir / password123`);
    console.log(
      `    - Users: user1@mehrebaran.ir ... user${persianNames.length}@mehrebaran.ir / password123`
    );

    return createdUsers;
  } catch (error) {
    console.error("  ✗ Error seeding users:", error);
    throw error;
  }
}
