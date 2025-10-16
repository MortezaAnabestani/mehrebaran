import { z } from "zod";

const responsiveImageSchema = z.object({
  desktop: z.string().url(),
  mobile: z.string().url(),
});

const seoSchema = z.object({
  metaTitle: z.string().min(3),
  metaDescription: z.string().optional(),
});

const galleryBodySchema = z.object({
  title: z.string().min(3, "عنوان گالری باید حداقل ۳ حرف باشد."),
  subtitle: z.string().optional(),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ حرف باشد."),
  images: z.array(responsiveImageSchema).min(1, "حداقل یک تصویر برای گالری الزامی است."),
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "شناسه عکاس معتبر نیست.")
    .optional(),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "شناسه دسته‌بندی معتبر نیست.")
    .optional(),
  tags: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  seo: seoSchema,
  relatedGalleries: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
});

export const createGallerySchema = z.object({
  body: galleryBodySchema,
});

export const updateGallerySchema = z.object({
  body: galleryBodySchema.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه گالری معتبر نیست."),
  }),
});
