import { z } from "zod";

export const createFaqSchema = z.object({
  body: z.object({
    question: z.string().min(5, "متن سوال باید حداقل ۵ حرف باشد."),
    answer: z.string().min(10, "متن پاسخ باید حداقل ۱۰ حرف باشد."),
    order: z.number().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateFaqSchema = z.object({
  body: createFaqSchema.shape.body.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه سوال معتبر نیست."),
  }),
});
