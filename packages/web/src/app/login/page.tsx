"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SmartButton from "@/components/ui/SmartButton";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (!formData.mobile.trim()) {
        setError("لطفاً شماره موبایل را وارد کنید.");
        setIsLoading(false);
        return;
      }

      if (!formData.password.trim()) {
        setError("لطفاً رمز عبور را وارد کنید.");
        setIsLoading(false);
        return;
      }

      // ورود به سیستم
      await login({
        mobile: formData.mobile,
        password: formData.password,
      });

      // Redirect به شبکه نیازسنجی
      router.push("/network");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "خطا در ورود به سیستم. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-mblue">
      <form
        className="flex flex-col justify-between gap-5 p-8 w-90 md:w-100 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="font-extrabold text-2xl text-center">ورود</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <input
          name="mobile"
          type="tel"
          placeholder="شماره موبایل"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
          disabled={isLoading}
        />

        <input
          name="password"
          type="password"
          placeholder="رمز عبور"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
          disabled={isLoading}
        />

        <SmartButton
          type="submit"
          variant="mblue"
          className="cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "در حال ورود..." : "ورود"}
        </SmartButton>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            حساب کاربری ندارید؟{" "}
            <Link href="/signup" className="text-mblue font-bold hover:underline">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
