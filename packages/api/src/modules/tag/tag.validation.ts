import { z } from "zod";

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(2, "نام تگ باید حداقل ۲ حرف باشد."),
  }),
});

export const updateTagSchema = z.object({
  body: z.object({
    name: z.string().min(2, "نام تگ باید حداقل ۲ حرف باشد.").optional(),
    slug: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه تگ معتبر نیست."),
  }),
});
