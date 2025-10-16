import { z } from "zod";

const attachmentSchema = z.object({
  fileType: z.enum(["image", "audio", "video"]),
  url: z.string().url(),
});

const geoLocationSchema = z.object({
  type: z.literal("Point").default("Point"),
  coordinates: z.array(z.number()).length(2),
  address: z.string().optional(),
});

const needBodySchema = z.object({
  title: z.string().min(5, "عنوان نیاز باید حداقل ۵ حرف باشد."),
  description: z.string().min(20, "توضیحات نیاز باید حداقل ۲۰ حرف باشد."),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه حوزه معتبر نیست."),
  attachments: z.array(attachmentSchema).optional().default([]),
  location: geoLocationSchema.optional(),
  guestName: z.string().min(3).optional(),
  guestEmail: z.string().email().optional(),
});

export const createNeedSchema = z.object({
  body: needBodySchema,
});

export const updateNeedSchema = z.object({
  body: needBodySchema.partial().extend({
    status: z.enum(["pending", "approved", "in_progress", "completed", "rejected"]).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});
