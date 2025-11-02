import { z } from "zod";

// Award points (admin)
export const awardPointsSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست."),
    action: z.enum([
      "need_created",
      "need_upvote",
      "need_support",
      "supporter_contribution",
      "task_completed",
      "task_assigned",
      "milestone_completed",
      "verification_approved",
      "comment_posted",
      "message_sent",
      "team_created",
      "team_joined",
      "need_completed",
      "daily_login",
      "profile_completed",
      "first_contribution",
      "invite_accepted",
      "badge_earned",
      "level_up",
      "admin_bonus",
      "penalty",
    ]),
    points: z.number().optional(),
    description: z.string().optional(),
    relatedModel: z.string().optional(),
    relatedId: z.string().optional(),
  }),
});

// Deduct points (admin)
export const deductPointsSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست."),
    points: z.number().min(1, "مقدار امتیاز باید مثبت باشد."),
    reason: z.string().min(3, "دلیل کسر امتیاز الزامی است."),
    relatedModel: z.string().optional(),
    relatedId: z.string().optional(),
  }),
});

// Create badge (admin)
export const createBadgeSchema = z.object({
  body: z.object({
    name: z.string().min(3, "نام نشان باید حداقل ۳ حرف باشد."),
    nameEn: z.string().min(3, "نام انگلیسی نشان باید حداقل ۳ حرف باشد."),
    description: z.string().min(10, "توضیحات نشان باید حداقل ۱۰ حرف باشد."),
    category: z.enum([
      "contributor",
      "supporter",
      "creator",
      "helper",
      "communicator",
      "leader",
      "expert",
      "milestone",
      "special",
      "seasonal",
    ]),
    rarity: z.enum(["common", "rare", "epic", "legendary"]).optional(),
    icon: z.string().min(1, "آیکون نشان الزامی است."),
    color: z.string().optional(),
    conditions: z.array(
      z.object({
        type: z.enum(["points", "count", "streak", "milestone", "custom"]),
        target: z.number().optional(),
        action: z
          .enum([
            "need_created",
            "need_upvote",
            "need_support",
            "supporter_contribution",
            "task_completed",
            "task_assigned",
            "milestone_completed",
            "verification_approved",
            "comment_posted",
            "message_sent",
            "team_created",
            "team_joined",
            "need_completed",
            "daily_login",
            "profile_completed",
            "first_contribution",
            "invite_accepted",
            "badge_earned",
            "level_up",
            "admin_bonus",
            "penalty",
          ])
          .optional(),
        description: z.string().min(1, "توضیحات شرط الزامی است."),
      })
    ),
    points: z.number().min(0, "امتیاز نشان نمی‌تواند منفی باشد.").optional(),
    isActive: z.boolean().optional(),
    isSecret: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

// Update badge (admin)
export const updateBadgeSchema = z.object({
  body: z.object({
    name: z.string().min(3, "نام نشان باید حداقل ۳ حرف باشد.").optional(),
    nameEn: z.string().min(3, "نام انگلیسی نشان باید حداقل ۳ حرف باشد.").optional(),
    description: z.string().min(10, "توضیحات نشان باید حداقل ۱۰ حرف باشد.").optional(),
    category: z
      .enum([
        "contributor",
        "supporter",
        "creator",
        "helper",
        "communicator",
        "leader",
        "expert",
        "milestone",
        "special",
        "seasonal",
      ])
      .optional(),
    rarity: z.enum(["common", "rare", "epic", "legendary"]).optional(),
    icon: z.string().min(1, "آیکون نشان الزامی است.").optional(),
    color: z.string().optional(),
    conditions: z
      .array(
        z.object({
          type: z.enum(["points", "count", "streak", "milestone", "custom"]),
          target: z.number().optional(),
          action: z
            .enum([
              "need_created",
              "need_upvote",
              "need_support",
              "supporter_contribution",
              "task_completed",
              "task_assigned",
              "milestone_completed",
              "verification_approved",
              "comment_posted",
              "message_sent",
              "team_created",
              "team_joined",
              "need_completed",
              "daily_login",
              "profile_completed",
              "first_contribution",
              "invite_accepted",
              "badge_earned",
              "level_up",
              "admin_bonus",
              "penalty",
            ])
            .optional(),
          description: z.string().min(1, "توضیحات شرط الزامی است."),
        })
      )
      .optional(),
    points: z.number().min(0, "امتیاز نشان نمی‌تواند منفی باشد.").optional(),
    isActive: z.boolean().optional(),
    isSecret: z.boolean().optional(),
    order: z.number().optional(),
  }),
  params: z.object({
    badgeId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نشان معتبر نیست."),
  }),
});
