import { CommentStatus } from "common-types";
import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(3, "متن نظر باید حداقل ۳ حرف باشد."),
    guestName: z.string().min(3, "نام باید حداقل ۳ حرف باشد.").optional(),
    guestEmail: z.string().email("ایمیل وارد شده معتبر نیست.").optional(),
    post: z.string().regex(/^[0-9a-fA-F]{24}$/),
    postType: z.enum(["News", "Article", "Project"]),
    parent: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(3, "متن نظر باید حداقل ۳ حرف باشد.").optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});
