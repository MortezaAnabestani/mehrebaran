import { z } from "zod";

export const createMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, "متن پیام نمی‌تواند خالی باشد."),
    parentMessage: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
  }),
  params: z.object({
    needId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
  }),
});

export const likeMessageSchema = z.object({
  params: z.object({
    messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه پیام معتبر نیست."),
  }),
});
