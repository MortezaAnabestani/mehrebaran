// packages/api/src/modules/projects/project.validation.ts
import { z } from "zod";

const responsiveImageSchema = z.object({
  desktop: z.string().url("آدرس تصویر دسکتاپ باید یک URL معتبر باشد."),
  mobile: z.string().url("آدرس تصویر موبایل باید یک URL معتبر باشد."),
});

const seoSchema = z.object({
  metaTitle: z.string().min(3, "متاتایتل باید حداقل ۳ حرف باشد."),
  metaDescription: z.string().optional(),
});

const projectBodySchema = z.object({
  title: z.string().min(3, "عنوان پروژه باید حداقل ۳ حرف باشد."),
  subtitle: z.string().optional(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  description: z.string().min(20, "توضیحات پروژه باید حداقل ۲۰ حرف باشد."),
  excerpt: z.string().optional(),
  // featuredImage will be handled by multer middleware, not in validation
  category: z.string().min(1, "دسته‌بندی الزامی است."),
  status: z.enum(["draft", "active", "completed"]).default("draft"),
  targetAmount: z.coerce.number().min(0, "مبلغ هدف نمی‌تواند منفی باشد."),
  amountRaised: z.coerce.number().min(0, "مبلغ جمع‌آوری شده نمی‌تواند منفی باشد.").optional(),
  targetVolunteer: z.coerce.number().min(0, "تعداد داوطلب هدف نمی‌تواند منفی باشد."),
  collectedVolunteer: z.coerce.number().min(0, "تعداد داوطلب جذب شده نمی‌تواند منفی باشد.").optional(),
  deadline: z
    .string()
    .pipe(z.coerce.date()),
});

export const createProjectSchema = z.object({
  body: projectBodySchema,
});

export const updateProjectSchema = z.object({
  body: projectBodySchema.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه پروژه معتبر نیست."),
  }),
});
