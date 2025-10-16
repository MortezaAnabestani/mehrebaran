import { z } from "zod";
import { createPersianSlug } from "../../core/utils/slug.utils";

export const createCategorySchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "نام دسته‌بندی الزامی است."),
      description: z.string().optional(),
      slug: z.string().optional(),
    })
    .transform((data) => {
      if (!data.slug) {
        data.slug = createPersianSlug(data.name);
      }
      return data;
    }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "نام دسته‌بندی باید حداقل ۲ حرف باشد.").optional(),
    description: z.string().optional(),
    slug: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "شناسه دسته‌بندی الزامی است."),
  }),
});
