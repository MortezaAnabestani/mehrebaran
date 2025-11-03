import { Request, Response } from "express";
import { authService } from "./auth.service";
import { requestOtpSchema, verifyAndRegisterSchema, loginSchema, signupSchema } from "./auth.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import { getAuthUser } from "../../core/utils/getAuthUser";

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

  public login = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse({ body: req.body });
    const { mobile, password } = validatedData.body;
    const result = await authService.login(mobile, password);
    res.status(200).json({ message: "ورود با موفقیت انجام شد.", data: result });
  });

  public signup = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = signupSchema.parse({ body: req.body });
    const result = await authService.signup(validatedData.body);
    res.status(201).json({ message: "ثبت‌نام با موفقیت انجام شد.", data: result });
  });

  public getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const result = await authService.getCurrentUser(user._id.toString());
    res.status(200).json({ message: "اطلاعات کاربر با موفقیت دریافت شد.", data: result });
  });
}

export const authController = new AuthController();
