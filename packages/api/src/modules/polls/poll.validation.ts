import { z } from "zod";

export const createPollSchema = z.object({
  params: z.object({
    needId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: z.object({
    question: z.string().min(5, "متن سوال باید حداقل ۵ حرف باشد."),
    options: z
      .array(z.string().min(1, "متن گزینه نمی‌تواند خالی باشد."))
      .min(2, "نظرسنجی باید حداقل ۲ گزینه داشته باشد."),
    expiresAt: z.coerce.date().optional(),
  }),
});

export const voteOnPollSchema = z.object({
  params: z.object({
    pollId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    optionId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});
