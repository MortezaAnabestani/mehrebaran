import { VolunteerRegistrationModel } from "../modules/volunteers/volunteer.model";
import { ProjectModel } from "../modules/projects/project.model";
import { UserModel } from "../modules/users/user.model";

/**
 * Volunteer Seeder - ایجاد ثبت‌نام‌های داوطلبی فیک
 */

export async function seedVolunteers() {
  console.log("🌱 Starting volunteer seeder...");

  try {
    // پاک کردن ثبت‌نام‌های داوطلبی قبلی
    await VolunteerRegistrationModel.deleteMany({});
    console.log("  ✓ Cleared existing volunteer registrations");

    // دریافت پروژه‌ها و کاربران
    const projects = await ProjectModel.find({ status: { $in: ["active", "completed"] } }).limit(6);
    const users = await UserModel.find({ role: { $in: ["user", "admin"] } }).limit(30);

    if (projects.length === 0 || users.length === 0) {
      console.warn("  ⚠ Projects or users not found. Please seed them first.");
      return [];
    }

    const volunteerData = [];
    const now = new Date();
    const usedCombinations = new Set(); // برای جلوگیری از تکرار (project + volunteer باید یونیک باشد)

    // برای هر پروژه چند داوطلب ایجاد می‌کنیم
    for (const project of projects) {
      // تعداد تصادفی داوطلب برای هر پروژه (بین 3 تا 8)
      const volunteerCount = Math.floor(Math.random() * 5) + 3;

      for (let i = 0; i < volunteerCount; i++) {
        // انتخاب تصادفی کاربر
        let volunteer;
        let attempts = 0;
        do {
          volunteer = users[Math.floor(Math.random() * users.length)];
          attempts++;
          if (attempts > 20) break; // جلوگیری از loop بی‌نهایت
        } while (usedCombinations.has(`${project._id}-${volunteer._id}`));

        if (usedCombinations.has(`${project._id}-${volunteer._id}`)) {
          continue; // اگر ترکیب تکراری است، skip کن
        }

        usedCombinations.add(`${project._id}-${volunteer._id}`);

        // مهارت‌های تصادفی
        const allSkills = [
          "ساخت و ساز",
          "نجاری",
          "نقاشی ساختمان",
          "برقکاری",
          "آشپزی",
          "توزیع غذا",
          "هماهنگی",
          "پزشک",
          "پرستار",
          "داروساز",
          "راننده",
          "آموزش مهارت",
          "مشاوره کسب‌وکار",
          "حسابداری",
          "محیط‌بانی",
          "کاشت درخت",
          "عکاسی",
          "آموزش محیط زیست",
        ];
        const skillCount = Math.floor(Math.random() * 3) + 1; // 1 تا 3 مهارت
        const skills = [];
        for (let j = 0; j < skillCount; j++) {
          const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
          if (!skills.includes(skill)) skills.push(skill);
        }

        // ساعات در دسترس (بین 5 تا 40 ساعت در ماه)
        const availableHours = [5, 10, 15, 20, 30, 40][Math.floor(Math.random() * 6)];

        // نقش مورد علاقه
        const preferredRoles = ["عضو تیم", "سرگروه", "هماهنگ‌کننده", "مجری", undefined];
        const preferredRole = preferredRoles[Math.floor(Math.random() * preferredRoles.length)];

        // وضعیت
        const statuses = ["approved", "approved", "approved", "active", "active", "pending", "rejected", "completed"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // تاریخ ثبت‌نام (تصادفی در ماه‌های گذشته)
        const daysAgo = Math.floor(Math.random() * 90); // تا 90 روز پیش
        const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        // در دسترس بودن
        const days = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
        const availableDays = [];
        const dayCount = Math.floor(Math.random() * 4) + 2; // 2 تا 5 روز
        for (let j = 0; j < dayCount; j++) {
          const day = days[Math.floor(Math.random() * days.length)];
          if (!availableDays.includes(day)) availableDays.push(day);
        }

        const timeSlots = ["morning", "afternoon", "evening"];
        const availableTimeSlots = [];
        const slotCount = Math.floor(Math.random() * 2) + 1; // 1 تا 2 بازه زمانی
        for (let j = 0; j < slotCount; j++) {
          const slot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
          if (!availableTimeSlots.includes(slot)) availableTimeSlots.push(slot);
        }

        const registration: any = {
          project: project._id,
          volunteer: volunteer._id,
          skills,
          availableHours,
          preferredRole,
          experience: `تجربه ${Math.floor(Math.random() * 5) + 1} ساله در زمینه فعالیت‌های داوطلبانه و اجتماعی.`,
          motivation: "علاقه‌مند به کمک به جامعه و ایجاد تغییرات مثبت هستم.",
          availability: {
            days: availableDays,
            timeSlots: availableTimeSlots,
          },
          status,
          createdAt,
          emergencyContact: {
            name: `${["علی", "زهرا", "محمد", "فاطمه"][Math.floor(Math.random() * 4)]} ${["محمدی", "احمدی", "رضایی"][Math.floor(Math.random() * 3)]}`,
            phone: `0912${Math.floor(Math.random() * 10000000).toString().padStart(7, "0")}`,
            relationship: ["پدر", "مادر", "همسر", "برادر", "خواهر"][Math.floor(Math.random() * 5)],
          },
        };

        // برای وضعیت‌های خاص، تاریخ‌های مربوطه را اضافه می‌کنیم
        if (status === "approved" || status === "active") {
          registration.reviewedAt = new Date(createdAt.getTime() + 86400000); // یک روز بعد
          registration.approvedAt = registration.reviewedAt;
          registration.reviewNotes = "واجد شرایط و تأیید شد.";
        }

        if (status === "rejected") {
          registration.reviewedAt = new Date(createdAt.getTime() + 86400000);
          registration.rejectionReason = "متأسفانه ظرفیت پروژه تکمیل شده است.";
        }

        if (status === "active") {
          // ساعات انجام شده (بین 0 تا availableHours)
          registration.hoursContributed = Math.floor(Math.random() * availableHours);
          registration.tasksCompleted = Math.floor(Math.random() * 10);
          registration.lastActivity = new Date(now.getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000);
          registration.contributionScore = registration.hoursContributed * 10 + registration.tasksCompleted * 20;
        }

        if (status === "completed") {
          registration.reviewedAt = new Date(createdAt.getTime() + 86400000);
          registration.approvedAt = registration.reviewedAt;
          registration.hoursContributed = availableHours;
          registration.tasksCompleted = Math.floor(Math.random() * 15) + 5;
          registration.completedAt = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
          registration.lastActivity = registration.completedAt;
          registration.contributionScore = registration.hoursContributed * 10 + registration.tasksCompleted * 20;
        }

        volunteerData.push(registration);
      }
    }

    // ایجاد ثبت‌نام‌های داوطلبی
    const volunteers = await VolunteerRegistrationModel.insertMany(volunteerData);
    console.log(
      `  ✓ Created ${volunteers.length} volunteer registrations (${volunteerData.filter((v) => ["approved", "active", "completed"].includes(v.status)).length} approved/active/completed, ${volunteerData.filter((v) => v.status === "pending").length} pending)`
    );

    // به‌روزرسانی آمار پروژه‌ها
    for (const project of projects) {
      const projectVolunteers = volunteers.filter((v) => v.project.toString() === project._id.toString());
      const approvedCount = projectVolunteers.filter((v) => ["approved", "active", "completed"].includes(v.status)).length;
      const pendingCount = projectVolunteers.filter((v) => v.status === "pending").length;

      await ProjectModel.findByIdAndUpdate(project._id, {
        volunteerCount: approvedCount,
        collectedVolunteer: approvedCount,
        pendingVolunteers: pendingCount,
      });
    }
    console.log("  ✓ Updated project volunteer stats");

    return volunteers;
  } catch (error) {
    console.error("  ✗ Error seeding volunteers:", error);
    throw error;
  }
}
