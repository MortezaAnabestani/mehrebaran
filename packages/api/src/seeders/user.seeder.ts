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

const cities = [
  "تهران",
  "مشهد",
  "اصفهان",
  "شیراز",
  "تبریز",
  "کرج",
  "اهواز",
  "قم",
  "کرمانشاه",
  "ارومیه",
  "رشت",
  "زاهدان",
  "همدان",
  "کرمان",
  "یزد",
  "اردبیل",
  "بندرعباس",
  "قزوین",
  "زنجان",
  "سنندج",
];

const bios = [
  "عاشق کمک به دیگران و ایجاد تغییرات مثبت در جامعه",
  "فعال اجتماعی و علاقه‌مند به پروژه‌های خیریه",
  "به دنبال کمک به نیازمندان و ایجاد امید در دل‌ها",
  "معتقدم با کمک‌های کوچک می‌توانیم جهان را بهتر کنیم",
  "همیشه آماده کمک به هم‌نوعان و حمایت از نیازمندان",
  "داوطلب فعال در پروژه‌های خیرخواهانه",
  "علاقه‌مند به کارهای گروهی و کمک به جامعه",
  "باور دارم که هر کمک کوچکی می‌تواند تفاوت بزرگی ایجاد کند",
  "فعال در حوزه مسئولیت اجتماعی",
  "کمک به دیگران بخشی از زندگی روزمره من است",
];

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
      email: "admin@mehrebaran.ir",
      password: hashedPassword,
      role: "super_admin",
      isEmailVerified: true,
      profile: {
        avatar: "https://ui-avatars.com/api/?name=Admin&background=3b80c3&color=fff&size=200",
        bio: "مدیر ارشد پلتفرم مهربانان",
        city: "تهران",
        province: "تهران",
      },
      stats: {
        reputation: 1000,
        level: 10,
        points: 5000,
      },
    });

    // ایجاد کاربران عادی
    for (let i = 0; i < persianNames.length; i++) {
      const name = persianNames[i];
      const city = cities[i % cities.length];
      const bio = bios[i % bios.length];

      const username = `${name.first}_${name.last}_${i}`.replace(/\s/g, "_");
      const email = `user${i + 1}@mehrebaran.ir`;

      users.push({
        name: `${name.first} ${name.last}`,
        email,
        password: hashedPassword,
        role: i < 5 ? "admin" : "user",
        isEmailVerified: true,
        profile: {
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name.first + "+" + name.last
          )}&background=${i % 2 === 0 ? "3b80c3" : "ff9434"}&color=fff&size=200`,
          bio,
          city,
          province: city,
        },
        stats: {
          reputation: Math.floor(Math.random() * 500) + 50,
          level: Math.floor(Math.random() * 8) + 1,
          points: Math.floor(Math.random() * 2000) + 100,
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
