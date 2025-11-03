import { z } from "zod";

// Create team
export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(3, "نام تیم باید حداقل ۳ حرف باشد.").max(50, "نام تیم نباید بیشتر از ۵۰ حرف باشد."),
    description: z.string().max(500, "توضیحات نباید بیشتر از ۵۰۰ حرف باشد.").optional(),
    focusArea: z
      .enum(
        ["fundraising", "logistics", "communication", "technical", "volunteer", "coordination", "documentation", "general"],
        { message: "حوزه تمرکز معتبر نیست." }
      )
      .optional(),
    maxMembers: z.number().int().min(2, "حداقل تعداد اعضا باید ۲ نفر باشد.").optional(),
    tags: z.array(z.string()).optional(),
    isPrivate: z.boolean().optional(),
  }),
  params: z.object({
    needId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
  }),
});

// Update team
export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(3, "نام تیم باید حداقل ۳ حرف باشد.").max(50, "نام تیم نباید بیشتر از ۵۰ حرف باشد.").optional(),
    description: z.string().max(500, "توضیحات نباید بیشتر از ۵۰۰ حرف باشد.").optional(),
    focusArea: z
      .enum(
        ["fundraising", "logistics", "communication", "technical", "volunteer", "coordination", "documentation", "general"],
        { message: "حوزه تمرکز معتبر نیست." }
      )
      .optional(),
    status: z.enum(["active", "paused", "completed", "disbanded"], { message: "وضعیت معتبر نیست." }).optional(),
    maxMembers: z.number().int().min(2, "حداقل تعداد اعضا باید ۲ نفر باشد.").optional(),
    tags: z.array(z.string()).optional(),
    isPrivate: z.boolean().optional(),
  }),
  params: z.object({
    teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه تیم معتبر نیست."),
  }),
});

// Add member
export const addMemberSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست."),
    role: z.enum(["leader", "co_leader", "member"], { message: "نقش معتبر نیست." }).optional(),
  }),
  params: z.object({
    teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه تیم معتبر نیست."),
  }),
});

// Update member role
export const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["leader", "co_leader", "member"], { message: "نقش معتبر نیست." }),
  }),
  params: z.object({
    teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه تیم معتبر نیست."),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست."),
  }),
});

// Invite user
export const inviteUserSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست."),
    message: z.string().max(200, "پیام نباید بیشتر از ۲۰۰ حرف باشد.").optional(),
  }),
  params: z.object({
    teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه تیم معتبر نیست."),
  }),
});

// Respond to invitation
export const respondToInvitationSchema = z.object({
  body: z.object({
    accept: z.boolean(),
  }),
  params: z.object({
    invitationId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه دعوت‌نامه معتبر نیست."),
  }),
});
