import { z } from "zod";

const responsiveImageSchema = z.object({
  desktop: z.string().url(),
  mobile: z.string().url(),
});

const seoSchema = z.object({
  metaTitle: z.string().min(3, "متاتایتل باید حداقل ۳ حرف باشد."),
  metaDescription: z.string().optional(),
});

const articleBodySchema = z.object({
  title: z.string().min(3, "عنوان مقاله باید حداقل ۳ حرف باشد."),
  subtitle: z.string().optional(),
  content: z.string().min(20, "محتوای مقاله باید حداقل ۲۰ حرف باشد."),
  excerpt: z.string().min(10, "خلاصه مقاله باید حداقل ۱۰ حرف باشد."),
  featuredImage: responsiveImageSchema,
  gallery: z.array(responsiveImageSchema).optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه دسته‌بندی معتبر نیست."),
  tags: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  author: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نویسنده معتبر نیست."),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seo: seoSchema,
  relatedArticles: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
});

export const createArticleSchema = z.object({
  body: articleBodySchema,
});

export const updateArticleSchema = z.object({
  body: articleBodySchema.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه مقاله معتبر نیست."),
  }),
});
