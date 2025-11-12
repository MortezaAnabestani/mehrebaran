import { z } from "zod";

const dayOfWeekEnum = z.enum([
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
]);

const timeSlotEnum = z.enum(["morning", "afternoon", "evening"]);

const availabilitySchema = z.object({
  days: z.array(dayOfWeekEnum).min(1, "حداقل یک روز باید انتخاب شود."),
  timeSlots: z.array(timeSlotEnum).min(1, "حداقل یک بازه زمانی باید انتخاب شود."),
});

const emergencyContactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد."),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است."),
  relationship: z.string().min(2, "نسبت باید حداقل ۲ حرف باشد."),
});

export const registerVolunteerSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "شناسه پروژه الزامی است."),
    skills: z.array(z.string()).min(1, "حداقل یک مهارت باید وارد شود."),
    availableHours: z
      .number()
      .min(1, "حداقل ۱ ساعت در هفته باید در دسترس باشید.")
      .max(168, "حداکثر ۱۶۸ ساعت در هفته امکان‌پذیر است."),
    preferredRole: z.string().optional(),
    experience: z.string().max(1000, "تجربه نباید بیشتر از ۱۰۰۰ کاراکتر باشد.").optional(),
    motivation: z.string().max(1000, "انگیزه نباید بیشتر از ۱۰۰۰ کاراکتر باشد.").optional(),
    availability: availabilitySchema,
    emergencyContact: emergencyContactSchema.optional(),
  }),
});

export const updateVolunteerSchema = z.object({
  body: z.object({
    status: z
      .enum(["pending", "approved", "rejected", "active", "completed", "withdrawn", "suspended"])
      .optional(),
    reviewNotes: z.string().max(500).optional(),
    rejectionReason: z.string().max(500).optional(),
    hoursContributed: z.number().min(0).optional(),
    tasksCompleted: z.number().min(0).optional(),
  }),
  params: z.object({
    id: z.string().min(1, "شناسه ثبت‌نام الزامی است."),
  }),
});

export const approveVolunteerSchema = z.object({
  body: z.object({
    notes: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().min(1, "شناسه ثبت‌نام الزامی است."),
  }),
});

export const rejectVolunteerSchema = z.object({
  body: z.object({
    reason: z.string().min(10, "دلیل رد باید حداقل ۱۰ کاراکتر باشد.").max(500),
  }),
  params: z.object({
    id: z.string().min(1, "شناسه ثبت‌نام الزامی است."),
  }),
});

export const getVolunteersSchema = z.object({
  query: z.object({
    status: z
      .enum(["pending", "approved", "rejected", "active", "completed", "withdrawn", "suspended"])
      .optional(),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  }),
  params: z.object({
    projectId: z.string().min(1, "شناسه پروژه الزامی است."),
  }),
});
