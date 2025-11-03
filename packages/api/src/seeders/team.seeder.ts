import { Team } from "../modules/teams/team.model";
import { Need } from "../modules/needs/need.model";

/**
 * Team Seeder - ایجاد تیم‌های فیک
 */

const teamTemplates = [
  {
    name: "تیم امداد و نجات",
    description: "تیم داوطلب برای کمک‌رسانی در بلایای طبیعی",
    type: "volunteer",
  },
  {
    name: "گروه جهادی نور",
    description: "فعالیت‌های عمرانی و خدماتی در مناطق محروم",
    type: "organization",
  },
  {
    name: "تیم سلامت",
    description: "ارائه خدمات پزشکی رایگان به نیازمندان",
    type: "volunteer",
  },
  {
    name: "گروه فرهنگی مهربانان",
    description: "برگزاری کلاس‌های آموزشی و فرهنگی",
    type: "organization",
  },
  {
    name: "تیم محیط زیست",
    description: "فعالیت‌های زیست‌محیطی و درختکاری",
    type: "volunteer",
  },
  {
    name: "گروه اشتغال زایی",
    description: "کمک به ایجاد فرصت‌های شغلی برای نیازمندان",
    type: "organization",
  },
  {
    name: "تیم تحصیلات",
    description: "حمایت از دانش‌آموزان و دانشجویان نیازمند",
    type: "volunteer",
  },
  {
    name: "گروه غذای گرم",
    description: "تهیه و توزیع غذای گرم برای نیازمندان",
    type: "volunteer",
  },
];

export async function seedTeams(users: any[], needs: any[]) {
  console.log("🌱 Starting team seeder...");

  try {
    // پاک کردن تیم‌های قبلی
    await Team.deleteMany({});
    console.log("  ✓ Cleared existing teams");

    const teams = [];

    // ایجاد تیم‌ها
    for (let i = 0; i < teamTemplates.length; i++) {
      const template = teamTemplates[i];
      const leader = users[Math.floor(Math.random() * Math.min(users.length, 10))];
      const need = needs[i % needs.length];

      // اعضای تیم (۳ تا ۱۰ نفر)
      const memberCount = Math.floor(Math.random() * 8) + 3;
      const members = [
        {
          user: leader._id,
          role: "leader",
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
      ];

      for (let j = 1; j < memberCount; j++) {
        const member = users[Math.floor(Math.random() * users.length)];
        if (!members.find((m) => m.user.toString() === member._id.toString())) {
          members.push({
            user: member._id,
            role: j === 1 ? "co_leader" : "member",
            joinedAt: new Date(Date.now() - Math.floor(Math.random() * 25) * 24 * 60 * 60 * 1000),
          });
        }
      }

      const team = {
        name: template.name,
        description: template.description,
        type: template.type,
        need: need._id,
        members,
        leader: leader._id,
        isActive: true,
        stats: {
          tasksCompleted: Math.floor(Math.random() * 20),
          totalHours: Math.floor(Math.random() * 100) + 10,
        },
      };

      teams.push(team);
    }

    // ذخیره تیم‌ها
    const createdTeams = await Team.insertMany(teams);
    console.log(`  ✓ Created ${createdTeams.length} teams`);

    return createdTeams;
  } catch (error) {
    console.error("  ✗ Error seeding teams:", error);
    throw error;
  }
}
