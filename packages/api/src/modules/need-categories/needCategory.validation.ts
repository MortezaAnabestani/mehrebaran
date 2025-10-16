import { z } from "zod";

export const createNeedCategorySchema = z.object({
  body: z.object({
    name: z.string().min(3, "نام حوزه باید حداقل ۳ حرف باشد."),
    description: z.string().optional(),
  }),
});

export const updateNeedCategorySchema = z.object({
  body: z.object({
    name: z.string().min(3, "نام حوزه باید حداقل ۳ حرف باشد.").optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه حوزه معتبر نیست."),
  }),
});
