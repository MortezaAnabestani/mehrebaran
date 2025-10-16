import { Request, Response } from "express";
import { authService } from "./auth.service";
import { requestOtpSchema, verifyAndRegisterSchema } from "./auth.validation";
import asyncHandler from "../../core/utils/asyncHandler";

class AuthController {
  public requestOtp = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = requestOtpSchema.parse({ body: req.body });
    await authService.requestOtp(validatedData.body.mobile);
    res.status(200).json({ message: "کد تایید با موفقیت ارسال شد." });
  });

  public verifyAndRegister = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = verifyAndRegisterSchema.parse({ body: req.body });
    const { mobile, verificationCode, ...userData } = validatedData.body;
    const result = await authService.verifyAndRegister(mobile, verificationCode, userData);
    res.status(201).json({ message: "ثبت‌نام با موفقیت انجام شد.", data: result });
  });
}

export const authController = new AuthController();
