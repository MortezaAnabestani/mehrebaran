import { z } from "zod";

const featuredItemSchema = z.object({
  order: z.number().min(1, "ترتیب باید حداقل ۱ باشد."),
  item: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه آیتم معتبر نیست."),
  itemType: z.enum(["Article", "Video", "Gallery"], {
    message: "نوع آیتم باید یکی از مقادیر 'Article', 'Video', یا 'Gallery' باشد.",
  }),
});

export const updateFeaturedItemsSchema = z.object({
  body: z.object({
    items: z.array(featuredItemSchema).min(1, "حداقل یک آیتِم وِیژه اِلزامی است."),
  }),
});
