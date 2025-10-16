import { z } from "zod";

const responsiveImageSchema = z.object({
  desktop: z.string().url(),
  mobile: z.string().url(),
});

export const createAuthorSchema = z.object({
  body: z.object({
    name: z.string().min(3, "نام نویسنده باید حداقل ۳ حرف باشد."),
    metaTitle: z.string().min(3, "متاتایتل باید حداقل ۳ حرف باشد."),
    bio: z.string().optional(),
    metaDescription: z.string().optional(),
    avatar: responsiveImageSchema.optional(),
  }),
});

export const updateAuthorSchema = z.object({
  body: createAuthorSchema.shape.body.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نویسنده معتبر نیست."),
  }),
});
