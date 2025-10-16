import { z } from "zod";

const responsiveImageSchema = z.object({
  desktop: z.string().url(),
  mobile: z.string().url(),
});

const seoSchema = z.object({
  metaTitle: z.string().min(3),
  metaDescription: z.string().optional(),
});

const videoBodySchema = z.object({
  title: z.string().min(3, "عنوان ویدئو باید حداقل ۳ حرف باشد."),
  subtitle: z.string().optional(),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ حرف باشد."),
  videoUrl: z.string().url("آدرس ویدئو باید یک URL معتبر باشد."),
  coverImage: responsiveImageSchema,
  cameraman: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "شناسه فیلمبردار معتبر نیست.")
    .optional(),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "شناسه دسته‌بندی معتبر نیست.")
    .optional(),
  tags: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  seo: seoSchema,
  relatedVideos: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
});

export const createVideoSchema = z.object({
  body: videoBodySchema,
});

export const updateVideoSchema = z.object({
  body: videoBodySchema.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه ویدئو معتبر نیست."),
  }),
});
