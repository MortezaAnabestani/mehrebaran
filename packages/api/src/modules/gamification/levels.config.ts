import { ILevel } from "common-types";

// Level system configuration
// Formula: level N requires N * 1000 points (progressive)
export const LEVELS: ILevel[] = [
  { level: 1, minPoints: 0, maxPoints: 999, title: "تازه‌وارد", titleEn: "Newcomer" },
  { level: 2, minPoints: 1000, maxPoints: 2999, title: "مبتدی", titleEn: "Beginner" },
  { level: 3, minPoints: 3000, maxPoints: 5999, title: "فعال", titleEn: "Active" },
  { level: 4, minPoints: 6000, maxPoints: 9999, title: "متعهد", titleEn: "Committed" },
  { level: 5, minPoints: 10000, maxPoints: 14999, title: "حامی", titleEn: "Supporter" },
  { level: 6, minPoints: 15000, maxPoints: 20999, title: "مشارکت‌کننده", titleEn: "Contributor" },
  { level: 7, minPoints: 21000, maxPoints: 27999, title: "فعال برتر", titleEn: "Top Active" },
  { level: 8, minPoints: 28000, maxPoints: 35999, title: "متخصص", titleEn: "Expert" },
  { level: 9, minPoints: 36000, maxPoints: 44999, title: "استاد", titleEn: "Master" },
  { level: 10, minPoints: 45000, maxPoints: 54999, title: "رهبر", titleEn: "Leader" },
  { level: 11, minPoints: 55000, maxPoints: 65999, title: "الهام‌بخش", titleEn: "Inspirational" },
  { level: 12, minPoints: 66000, maxPoints: 77999, title: "قهرمان", titleEn: "Champion" },
  { level: 13, minPoints: 78000, maxPoints: 90999, title: "افسانه", titleEn: "Legend" },
  { level: 14, minPoints: 91000, maxPoints: 104999, title: "ستاره", titleEn: "Star" },
  { level: 15, minPoints: 105000, maxPoints: 119999, title: "ستاره درخشان", titleEn: "Shining Star" },
  { level: 16, minPoints: 120000, maxPoints: 139999, title: "الماس", titleEn: "Diamond" },
  { level: 17, minPoints: 140000, maxPoints: 164999, title: "الماس سبز", titleEn: "Emerald" },
  { level: 18, minPoints: 165000, maxPoints: 194999, title: "یاقوت", titleEn: "Ruby" },
  { level: 19, minPoints: 195000, maxPoints: 229999, title: "افسانه‌ای", titleEn: "Mythical" },
  { level: 20, minPoints: 230000, maxPoints: Infinity, title: "افسانه جاودان", titleEn: "Eternal Legend" },
];

// Point values for different actions
export const POINT_VALUES: Record<string, number> = {
  need_created: 100,
  need_upvote: 5,
  need_support: 50,
  task_completed: 30,
  task_assigned: 10,
  milestone_completed: 100,
  verification_approved: 50,
  comment_posted: 5,
  message_sent: 2,
  team_created: 75,
  team_joined: 25,
  need_completed: 500,
  daily_login: 10,
  profile_completed: 50,
  first_contribution: 100,
  invite_accepted: 30,
};

// Helper: Get level by points
export function getLevelByPoints(points: number): ILevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Helper: Get points to next level
export function getPointsToNextLevel(currentPoints: number): number {
  const currentLevel = getLevelByPoints(currentPoints);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0; // Max level reached
  return nextLevel.minPoints - currentPoints;
}
