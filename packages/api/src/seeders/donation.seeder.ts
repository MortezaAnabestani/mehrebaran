import { DonationModel } from "../modules/donations/donation.model";
import { ProjectModel } from "../modules/projects/project.model";
import { UserModel } from "../modules/users/user.model";

/**
 * Donation Seeder - ایجاد کمک‌های مالی فیک
 */

export async function seedDonations() {
  console.log("🌱 Starting donation seeder...");

  try {
    // پاک کردن کمک‌های مالی قبلی
    await DonationModel.deleteMany({});
    console.log("  ✓ Cleared existing donations");

    // دریافت پروژه‌ها و کاربران
    const projects = await ProjectModel.find({ status: { $in: ["active", "completed"] } }).limit(6);
    const users = await UserModel.find({ role: { $in: ["user", "admin"] } }).limit(30);

    if (projects.length === 0 || users.length === 0) {
      console.warn("  ⚠ Projects or users not found. Please seed them first.");
      return [];
    }

    const donationData = [];
    const now = new Date();

    // برای هر پروژه چند کمک مالی ایجاد می‌کنیم
    for (const project of projects) {
      // تعداد تصادفی کمک مالی برای هر پروژه (بین 5 تا 15)
      const donationCount = Math.floor(Math.random() * 10) + 5;

      for (let i = 0; i < donationCount; i++) {
        // انتخاب تصادفی کاربر
        const donor = users[Math.floor(Math.random() * users.length)];

        // مبلغ تصادفی (بین 50 هزار تا 5 میلیون تومان)
        const amounts = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000];
        const amount = amounts[Math.floor(Math.random() * amounts.length)];

        // وضعیت تصادفی (اکثراً completed/verified)
        const statuses = ["completed", "completed", "completed", "verified", "verified", "pending", "failed"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // روش پرداخت تصادفی
        const paymentMethods = ["online", "online", "online", "bank_transfer", "cash"];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        // آیا ناشناس است؟
        const isAnonymous = Math.random() > 0.7; // 30% احتمال ناشناس

        // تاریخ تصادفی در ماه‌های گذشته
        const daysAgo = Math.floor(Math.random() * 60); // تا 60 روز پیش
        const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        const donation: any = {
          project: project._id,
          donor: isAnonymous ? null : donor._id,
          amount,
          currency: "IRT",
          paymentMethod,
          status,
          donorInfo: {
            fullName: isAnonymous ? "ناشناس" : donor.name,
            email: isAnonymous ? undefined : `${donor.mobile}@example.com`,
            mobile: isAnonymous ? undefined : donor.mobile,
            isAnonymous,
          },
          createdAt,
        };

        // برای پرداخت آنلاین
        if (paymentMethod === "online" && status === "completed") {
          donation.paymentGateway = ["zarinpal", "idpay", "zibal"][Math.floor(Math.random() * 3)];
          donation.transactionId = `TXN${Math.floor(Math.random() * 10000000000)}`;
          donation.refId = `${Math.floor(Math.random() * 1000000)}`;
          donation.completedAt = new Date(createdAt.getTime() + 60000); // یک دقیقه بعد
        }

        // برای واریز بانکی
        if (paymentMethod === "bank_transfer") {
          if (status === "verified") {
            donation.receipt = {
              image: `https://example.com/receipts/${Math.floor(Math.random() * 10000)}.jpg`,
              uploadedAt: createdAt,
              verified: true,
              verifiedAt: new Date(createdAt.getTime() + 86400000), // یک روز بعد
            };
            donation.completedAt = donation.receipt.verifiedAt;
          } else if (status === "pending") {
            donation.receipt = {
              image: `https://example.com/receipts/${Math.floor(Math.random() * 10000)}.jpg`,
              uploadedAt: createdAt,
              verified: false,
            };
          }
        }

        // پیام اختیاری
        const messages = [
          "امیدوارم این کمک کوچک مفید واقع شود",
          "موفق باشید",
          "با آرزوی موفقیت برای پروژه",
          "خدا قوت",
          undefined,
          undefined,
        ];
        donation.message = messages[Math.floor(Math.random() * messages.length)];

        // تقدیم به
        if (Math.random() > 0.8) { // 20% احتمال
          const dedicatedNames = ["پدر و مادرم", "فرزندانم", "استاد گرامی", "دوست عزیزم"];
          donation.dedicatedTo = dedicatedNames[Math.floor(Math.random() * dedicatedNames.length)];
        }

        donationData.push(donation);
      }
    }

    // ایجاد کمک‌های مالی
    const donations = await DonationModel.insertMany(donationData);
    console.log(
      `  ✓ Created ${donations.length} donations (${donationData.filter((d) => d.status === "completed" || d.status === "verified").length} successful)`
    );

    // به‌روزرسانی آمار پروژه‌ها
    for (const project of projects) {
      const projectDonations = donations.filter(
        (d) => d.project.toString() === project._id.toString() && ["completed", "verified"].includes(d.status)
      );
      const totalAmount = projectDonations.reduce((sum, d) => sum + d.amount, 0);
      const donorCount = projectDonations.length;

      await ProjectModel.findByIdAndUpdate(project._id, {
        amountRaised: totalAmount,
        donorCount,
      });
    }
    console.log("  ✓ Updated project donation stats");

    return donations;
  } catch (error) {
    console.error("  ✗ Error seeding donations:", error);
    throw error;
  }
}
