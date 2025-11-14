import { z } from "zod";

const focusAreaBodySchema = z.object({
  title: z.string().min(3, "عنوان باید حداقل ۳ حرف باشد."),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ حرف باشد."),
  icon: z.string().min(1, "آیکون الزامی است."),
  gradient: z.string().min(3, "گرادینت الزامی است."),
  order: z.number().int().min(0, "ترتیب باید عدد مثبت باشد.").default(0),
  isActive: z.boolean().default(true),
});

export const createFocusAreaSchema = z.object({
  body: focusAreaBodySchema,
});

export const updateFocusAreaSchema = z.object({
  body: focusAreaBodySchema.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه حوزه فعالیت معتبر نیست."),
  }),
});

export const getFocusAreaSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه حوزه فعالیت معتبر نیست."),
  }),
});

export const deleteFocusAreaSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه حوزه فعالیت معتبر نیست."),
  }),
});
