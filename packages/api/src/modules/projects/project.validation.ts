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
  seo: seoSchema,
  description: z.string().min(20, "توضیحات پروژه باید حداقل ۲۰ حرف باشد."),
  excerpt: z.string().min(10, "خلاصه پروژه باید حداقل ۱۰ حرف باشد."),
  featuredImage: responsiveImageSchema,
  gallery: z.array(responsiveImageSchema).optional().default([]),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه دسته‌بندی معتبر نیست."),
  status: z.enum(["draft", "active", "completed"]).default("draft"),
  targetAmount: z.number().min(0, "مبلغ هدف نمی‌تواند منفی باشد."),
  amountRaised: z.number().min(0, "مبلغ جمع‌آوری شده نمی‌تواند منفی باشد.").optional(),
  targetVolunteer: z.number().min(0, "تعداد داوطلب هدف نمی‌تواند منفی باشد."),
  collectedVolunteer: z.number().min(0, "تعداد داوطلب جذب شده نمی‌تواند منفی باشد.").optional(),
  deadline: z
    .string()
    .pipe(z.iso.datetime({ message: "فرمت تاریخ مهلت پروژه نامعتبر است." }))
    .transform((val) => new Date(val)),
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
