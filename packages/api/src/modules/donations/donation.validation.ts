import { z } from "zod";

export const createDonationSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "شناسه پروژه الزامی است."),
    amount: z
      .number()
      .min(1000, "حداقل مبلغ کمک ۱۰۰۰ تومان است.")
      .max(1000000000, "حداکثر مبلغ کمک ۱ میلیارد تومان است."),
    paymentMethod: z.enum(["online", "bank_transfer", "cash"], {
      errorMap: () => ({ message: "روش پرداخت نامعتبر است." }),
    }),
    donorInfo: z
      .object({
        fullName: z.string().min(2, "نام باید حداقل ۲ حرف باشد.").optional(),
        email: z.string().email("ایمیل نامعتبر است.").optional(),
        mobile: z
          .string()
          .regex(/^09\d{9}$/, "شماره موبایل نامعتبر است.")
          .optional(),
        isAnonymous: z.boolean().default(false),
      })
      .optional(),
    message: z.string().max(500, "پیام نباید بیشتر از ۵۰۰ کاراکتر باشد.").optional(),
    dedicatedTo: z.string().max(200, "متن تقدیم نباید بیشتر از ۲۰۰ کاراکتر باشد.").optional(),
  }),
});

export const uploadReceiptSchema = z.object({
  body: z.object({
    receiptImage: z.string().url("آدرس تصویر نامعتبر است."),
    description: z.string().max(500).optional(),
  }),
  params: z.object({
    donationId: z.string().min(1, "شناسه کمک مالی الزامی است."),
  }),
});

export const verifyDonationSchema = z.object({
  body: z.object({
    approve: z.boolean(),
    rejectionReason: z.string().max(500).optional(),
  }),
  params: z.object({
    donationId: z.string().min(1, "شناسه کمک مالی الزامی است."),
  }),
});

export const getDonationsSchema = z.object({
  query: z.object({
    status: z
      .enum(["pending", "completed", "failed", "refunded", "verified", "rejected"])
      .optional(),
    paymentMethod: z.enum(["online", "bank_transfer", "cash"]).optional(),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  }),
  params: z.object({
    projectId: z.string().min(1, "شناسه پروژه الزامی است."),
  }),
});
