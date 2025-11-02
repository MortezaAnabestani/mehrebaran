import { z } from "zod";

const attachmentSchema = z.object({
  fileType: z.enum(["image", "audio", "video"]),
  url: z.string().url(),
});

const geoLocationSchema = z.object({
  type: z.literal("Point").default("Point"),
  coordinates: z.array(z.number()).length(2),
  address: z.string().optional(),
  locationName: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional().default("ایران"),
  isLocationApproximate: z.boolean().optional().default(false),
});

const needBodySchema = z.object({
  title: z.string().min(5, "عنوان نیاز باید حداقل ۵ حرف باشد."),
  description: z.string().min(20, "توضیحات نیاز باید حداقل ۲۰ حرف باشد."),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه حوزه معتبر نیست."),

  // Status & Priority
  urgencyLevel: z.enum(["low", "medium", "high", "critical"]).optional().default("medium"),

  // Media
  attachments: z.array(attachmentSchema).optional().default([]),

  // Planning
  estimatedDuration: z.string().optional(),
  requiredSkills: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),

  // Location
  location: geoLocationSchema.optional(),

  // Timeline
  deadline: z.string().datetime().optional().or(z.date().optional()),

  // Guest submission
  guestName: z.string().min(3).optional(),
  guestEmail: z.string().email().optional(),
});

export const createNeedSchema = z.object({
  body: needBodySchema,
});

export const updateNeedSchema = z.object({
  body: needBodySchema.partial().extend({
    status: z
      .enum(["draft", "pending", "under_review", "approved", "in_progress", "completed", "rejected", "archived", "cancelled"])
      .optional(),
    statusChangeReason: z.string().optional(), // دلیل تغییر وضعیت
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

// Validation for Need Updates
export const createNeedUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(3, "عنوان به‌روزرسانی باید حداقل ۳ حرف باشد."),
    description: z.string().min(10, "توضیحات به‌روزرسانی باید حداقل ۱۰ حرف باشد."),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
  }),
});

export const updateNeedUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(3, "عنوان به‌روزرسانی باید حداقل ۳ حرف باشد.").optional(),
    description: z.string().min(10, "توضیحات به‌روزرسانی باید حداقل ۱۰ حرف باشد.").optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
    updateId: z.string(), // Index of update in array
  }),
});

// Validation for Milestones
export const createMilestoneSchema = z.object({
  body: z.object({
    title: z.string().min(3, "عنوان مایلستون باید حداقل ۳ حرف باشد."),
    description: z.string().min(10, "توضیحات مایلستون باید حداقل ۱۰ حرف باشد."),
    targetDate: z.string().datetime("تاریخ هدف معتبر نیست.").or(z.date()),
    order: z.number().int().min(1, "ترتیب مایلستون باید عدد مثبت باشد."),
    progressPercentage: z.number().min(0).max(100).optional().default(0),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
  }),
});

export const updateMilestoneSchema = z.object({
  body: z.object({
    title: z.string().min(3, "عنوان مایلستون باید حداقل ۳ حرف باشد.").optional(),
    description: z.string().min(10, "توضیحات مایلستون باید حداقل ۱۰ حرف باشد.").optional(),
    targetDate: z.string().datetime().or(z.date()).optional(),
    completionDate: z.string().datetime().or(z.date()).optional(),
    status: z.enum(["pending", "in_progress", "completed", "delayed"]).optional(),
    progressPercentage: z.number().min(0).max(100).optional(),
    order: z.number().int().min(1).optional(),
    evidence: z.array(z.string().url("لینک مدرک معتبر نیست.")).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
    milestoneId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه مایلستون معتبر نیست."),
  }),
});

export const completeMilestoneSchema = z.object({
  body: z.object({
    evidence: z.array(z.string().url("لینک مدرک معتبر نیست.")).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
    milestoneId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه مایلستون معتبر نیست."),
  }),
});

// Validation for Budget Items
export const createBudgetItemSchema = z.object({
  body: z.object({
    title: z.string().min(3, "عنوان قلم بودجه باید حداقل ۳ حرف باشد."),
    description: z.string().optional(),
    category: z.string().min(2, "دسته‌بندی الزامی است."),
    estimatedCost: z.number().min(0, "هزینه تخمینی باید عدد مثبت باشد."),
    actualCost: z.number().min(0).optional(),
    currency: z.string().optional().default("IRR"),
    priority: z.number().min(1).max(5).optional().default(3),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
  }),
});

export const updateBudgetItemSchema = z.object({
  body: z.object({
    title: z.string().min(3, "عنوان قلم بودجه باید حداقل ۳ حرف باشد.").optional(),
    description: z.string().optional(),
    category: z.string().min(2, "دسته‌بندی الزامی است.").optional(),
    estimatedCost: z.number().min(0, "هزینه تخمینی باید عدد مثبت باشد.").optional(),
    actualCost: z.number().min(0).optional(),
    amountRaised: z.number().min(0, "مبلغ جمع‌آوری شده باید عدد مثبت باشد.").optional(),
    currency: z.string().optional(),
    priority: z.number().min(1).max(5).optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
    budgetItemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه قلم بودجه معتبر نیست."),
  }),
});

export const addFundsToBudgetItemSchema = z.object({
  body: z.object({
    amount: z.number().min(1, "مبلغ باید بزرگتر از صفر باشد."),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
    budgetItemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه قلم بودجه معتبر نیست."),
  }),
});

// Validation for Verification Requests
const verificationEvidenceSchema = z.object({
  type: z.enum(["image", "document", "video"], { message: "نوع مدرک معتبر نیست." }),
  url: z.string().url("لینک مدرک معتبر نیست."),
  description: z.string().optional(),
});

export const createVerificationRequestSchema = z.object({
  body: z.object({
    type: z.enum(["milestone_completion", "budget_expense", "need_completion", "progress_update"], {
      message: "نوع درخواست تایید معتبر نیست.",
    }),
    description: z.string().min(10, "توضیحات درخواست تایید باید حداقل ۱۰ حرف باشد."),
    evidence: z.array(verificationEvidenceSchema).min(1, "حداقل یک مدرک الزامی است."),
    relatedItemId: z.string().optional(),
    relatedItemType: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
  }),
});

export const reviewVerificationRequestSchema = z.object({
  body: z.object({
    status: z.enum(["approved", "rejected", "needs_revision"], {
      message: "وضعیت بررسی معتبر نیست.",
    }),
    adminComments: z.string().optional(),
    rejectionReason: z.string().optional(),
    revisionNotes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
    verificationId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه درخواست تایید معتبر نیست."),
  }),
});
