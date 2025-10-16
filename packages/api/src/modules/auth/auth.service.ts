import { OtpModel } from "./otp.model";
import { TRegisterUserData } from "common-types";
import { UserModel } from "../users/user.model";
import { generateToken } from "../../core/utils/token.utils";

class AuthService {
  public async requestOtp(mobile: string): Promise<string> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.findOneAndUpdate({ mobile }, { code: otpCode, expiresAt }, { upsert: true, new: true });

    console.log(`
      ------------------------------------
      OTP for ${mobile}: ${otpCode}
      (This is a simulation. No SMS was sent.)
      ------------------------------------
    `);

    return otpCode;
  }

  public async verifyAndRegister(mobile: string, code: string, userData: Omit<TRegisterUserData, "mobile">) {
    const otpEntry = await OtpModel.findOne({ mobile, code });

    if (!otpEntry) {
      throw { status: 400, message: "کد تایید وارد شده نامعتبر است." };
    }

    const existingUser = await UserModel.findOne({ mobile });
    if (existingUser) {
      throw { status: 409, message: "کاربری با این شماره موبایل از قبل ثبت‌نام کرده است." };
    }

    const newUser = await UserModel.create({
      mobile,
      ...userData,
    });

    await OtpModel.deleteOne({ _id: otpEntry._id });

    const token = generateToken(newUser._id.toString());

    return {
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        mobile: newUser.mobile,
        role: newUser.role,
      },
    };
  }
}

export const authService = new AuthService();
