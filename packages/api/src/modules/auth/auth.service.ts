import { OtpModel } from "./otp.model";
import { TRegisterUserData } from "common-types";
import { UserModel } from "../users/user.model";
import { generateToken } from "../../core/utils/token.utils";
import ApiError from "../../core/utils/apiError";

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

  public async verifyAndRegister(
    mobile: string,
    code: string,
    userData: Omit<TRegisterUserData, "mobile"> & { password?: string }
  ) {
    const otpEntry = await OtpModel.findOne({ mobile, code });

    if (!otpEntry) {
      throw new ApiError(400, "کد تایید وارد شده نامعتبر است.");
    }

    const existingUser = await UserModel.findOne({ mobile });
    if (existingUser) {
      throw new ApiError(409, "کاربری با این شماره موبایل از قبل ثبت‌نام کرده است.");
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

  public async login(mobile: string, password: string) {
    // یافتن کاربر با mobile و select کردن password
    const user = await UserModel.findOne({ mobile }).select("+password");

    if (!user) {
      throw new ApiError(401, "شماره موبایل یا رمز عبور نادرست است.");
    }

    // بررسی رمز عبور
    if (!user.password) {
      throw new ApiError(401, "این حساب کاربری فاقد رمز عبور است. لطفاً از روش OTP استفاده کنید.");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "شماره موبایل یا رمز عبور نادرست است.");
    }

    // تولید token
    const token = generateToken(user._id.toString());

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        nationalId: user.nationalId,
        profile: user.profile,
      },
    };
  }

  public async getCurrentUser(userId: string) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new ApiError(404, "کاربر یافت نشد.");
    }

    return {
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      nationalId: user.nationalId,
      profile: user.profile,
    };
  }

  public async signup(userData: {
    mobile: string;
    name: string;
    password: string;
    nationalId?: string;
    major?: string;
    yearOfAdmission?: string;
  }) {
    // بررسی وجود کاربر قبلی
    const existingUser = await UserModel.findOne({ mobile: userData.mobile });
    if (existingUser) {
      throw new ApiError(409, "کاربری با این شماره موبایل از قبل ثبت‌نام کرده است.");
    }

    // ایجاد کاربر جدید
    const newUser = await UserModel.create({
      mobile: userData.mobile,
      name: userData.name,
      password: userData.password,
      nationalId: userData.nationalId || `temp_${Date.now()}`,
      profile: {
        major: userData.major,
        yearOfAdmission: userData.yearOfAdmission,
      },
    });

    // تولید token
    const token = generateToken(newUser._id.toString());

    return {
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        mobile: newUser.mobile,
        role: newUser.role,
        nationalId: newUser.nationalId,
        profile: newUser.profile,
      },
    };
  }
}

export const authService = new AuthService();
