import { z } from "zod";

export const requestOtpSchema = z.object({
  body: z.object({
    mobile: z
      .string()
      .regex(/^09\d{9}$/, "شماره موبایل وارد شده معتبر نیست. باید با 09 شروع شده و 11 رقم باشد."),
  }),
});

export const verifyAndRegisterSchema = z.object({
  body: z.object({
    mobile: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست."),
    verificationCode: z.string().length(6, "کد تایید باید 6 رقم باشد."),
    name: z.string().min(3, "نام و نام خانوادگی باید حداقل ۳ حرف باشد."),
    nationalId: z.string().length(10, "کد ملی باید 10 رقم باشد."),
    profile: z.object({
      major: z.string().min(2, "رشته تحصیلی باید حداقل ۲ حرف باشد."),
      yearOfAdmission: z.string().length(4, "سال ورود باید ۴ رقم باشد."),
    }),
  }),
});
