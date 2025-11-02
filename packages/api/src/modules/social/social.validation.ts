import { z } from "zod";

// Log share
export const logShareSchema = z.object({
  body: z.object({
    sharedItemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه معتبر نیست."),
    platform: z.enum([
      "telegram",
      "whatsapp",
      "twitter",
      "linkedin",
      "facebook",
      "instagram",
      "email",
      "copy_link",
      "other",
    ]),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});
