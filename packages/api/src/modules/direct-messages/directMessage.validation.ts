import { z } from "zod";

// Create or get conversation
export const createConversationSchema = z.object({
  body: z.object({
    participants: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست."))
      .min(1, "حداقل یک کاربر برای شروع گفتگو الزامی است."),
    type: z.enum(["one_to_one", "group"], { message: "نوع گفتگو معتبر نیست." }).optional().default("one_to_one"),
    title: z.string().min(3, "عنوان گفتگوی گروهی باید حداقل ۳ حرف باشد.").optional(),
  }),
  params: z.object({
    needId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نیاز معتبر نیست."),
  }),
});

// Send message
export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, "محتوای پیام الزامی است.").max(5000, "پیام نباید بیشتر از ۵۰۰۰ کاراکتر باشد."),
    attachments: z
      .array(
        z.object({
          type: z.enum(["image", "document", "video", "audio"], { message: "نوع فایل معتبر نیست." }),
          url: z.string().url("آدرس فایل معتبر نیست."),
          filename: z.string().min(1, "نام فایل الزامی است."),
          fileSize: z.number().min(0).optional(),
          mimeType: z.string().optional(),
        })
      )
      .optional(),
    replyTo: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه پیام معتبر نیست.").optional(),
  }),
  params: z.object({
    conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه گفتگو معتبر نیست."),
  }),
});

// Edit message
export const editMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, "محتوای پیام الزامی است.").max(5000, "پیام نباید بیشتر از ۵۰۰۰ کاراکتر باشد."),
  }),
  params: z.object({
    messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه پیام معتبر نیست."),
  }),
});
