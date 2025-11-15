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
    // avatar is handled by upload middleware and added to req.processedFiles
    email: z.string().email("ایمیل معتبر نیست").optional(),
    mobile: z.string().optional(),
    birthday: z.string().optional(),
    instagramId: z.string().optional(),
    favoriteTemplate: z.enum(["poetic", "scientific"]).optional(),
  }),
});

export const updateAuthorSchema = z.object({
  body: createAuthorSchema.shape.body.partial(),
  params: z.object({
    identifier: z.string().min(1, "شناسه نویسنده الزامی است."),
  }),
});
