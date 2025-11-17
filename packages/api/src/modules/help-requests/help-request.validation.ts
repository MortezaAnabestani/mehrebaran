import { z } from "zod";

export const createHelpRequestSchema = z.object({
  body: z.object({
    title: z.string().min(3, "عنوان باید حداقل 3 کاراکتر باشد").max(200, "عنوان نباید بیشتر از 200 کاراکتر باشد"),
    description: z.string().min(10, "توضیحات باید حداقل 10 کاراکتر باشد").max(2000, "توضیحات نباید بیشتر از 2000 کاراکتر باشد"),
    guestName: z.string().min(3, "نام باید حداقل 3 کاراکتر باشد"),
    guestEmail: z.string().email("ایمیل معتبر نیست"),
    guestPhone: z.string().optional(),
  }),
});

export const updateHelpRequestStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "approved", "in_progress", "completed", "rejected"]),
    adminNotes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const deleteHelpRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
