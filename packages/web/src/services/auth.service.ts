import api from "@/lib/api";
import { IUser } from "common-types";

/**
 * Response types for auth endpoints
 */
interface LoginResponse {
  message: string;
  data: {
    user: IUser;
    token: string;
  };
}

interface SignupResponse {
  message: string;
  data: {
    user: IUser;
    token: string;
  };
}

interface VerifyOtpResponse {
  message: string;
  data: {
    user: IUser;
    token: string;
  };
}

/**
 * Request types
 */
export interface LoginCredentials {
  email?: string;
  mobile?: string;
  password: string;
}

export interface SignupData {
  name: string;
  email?: string;
  mobile: string;
  password: string;
  nationalId?: string;
  major?: string;
  yearOfAdmission?: string;
}

export interface OtpData {
  mobile: string;
  otp: string;
}

/**
 * Auth Service - تمام درخواست‌های مربوط به احراز هویت
 */
class AuthService {
  /**
   * ورود با ایمیل/موبایل و رمز عبور
   */
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, credentials);

      // ذخیره token در localStorage
      if (response.data.data.token) {
        this.setToken(response.data.data.token);
        this.setUser(response.data.data.user);
      }

      return response.data;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ورود به سیستم");
    }
  }

  /**
   * ثبت‌نام کاربر جدید
   */
  public async signup(data: SignupData): Promise<SignupResponse> {
    try {
      const response = await api.post("/auth/signup", data);

      // ذخیره token در localStorage
      if (response.data.data.token) {
        this.setToken(response.data.data.token);
        this.setUser(response.data.data.user);
      }

      return response.data;
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ثبت‌نام");
    }
  }

  /**
   * ارسال OTP به موبایل
   */
  public async sendOtp(mobile: string): Promise<{ message: string }> {
    try {
      const response = await api.post("/auth/send-otp", { mobile });
      return response.data;
    } catch (error: any) {
      console.error("Send OTP failed:", error);
      throw new Error(error.response?.data?.message || "خطا در ارسال کد تأیید");
    }
  }

  /**
   * تأیید OTP
   */
  public async verifyOtp(data: OtpData): Promise<VerifyOtpResponse> {
    try {
      const response = await api.post("/auth/verify-otp", data);

      // ذخیره token در localStorage
      if (response.data.data.token) {
        this.setToken(response.data.data.token);
        this.setUser(response.data.data.user);
      }

      return response.data;
    } catch (error: any) {
      console.error("Verify OTP failed:", error);
      throw new Error(error.response?.data?.message || "کد تأیید نامعتبر است");
    }
  }

  /**
   * دریافت اطلاعات کاربر جاری
   */
  public async getCurrentUser(): Promise<IUser | null> {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await api.get("/auth/me");
      const user = response.data.data;

      this.setUser(user);
      return user;
    } catch (error: any) {
      console.error("Get current user failed:", error);
      this.logout();
      return null;
    }
  }

  /**
   * خروج از سیستم
   */
  public logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  }

  /**
   * ذخیره token در localStorage
   */
  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  /**
   * دریافت token از localStorage
   */
  public getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  /**
   * ذخیره اطلاعات کاربر در localStorage
   */
  private setUser(user: IUser): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  /**
   * دریافت اطلاعات کاربر از localStorage
   */
  public getUser(): IUser | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * بررسی اینکه آیا کاربر login است یا نه
   */
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
