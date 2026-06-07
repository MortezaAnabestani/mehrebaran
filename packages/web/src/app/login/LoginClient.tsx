"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SmartButton from "@/components/ui/SmartButton";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const LoginClient: React.FC = () => {
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

      await login({
        mobile: formData.mobile,
        password: formData.password,
      });

      router.push("/network");
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "خطا در ورود به سیستم. لطفاً دوباره تلاش کنید.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full h-screen flex items-center justify-center bg-mblue px-4 md:px-0">
      <form
        className="flex flex-col justify-between gap-5 p-8 w-full max-w-md md:w-100 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="font-extrabold text-2xl text-center">ورود</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert">
            {error}
          </div>
        )}

        <input
          name="mobile"
          type="tel"
          placeholder="شماره موبایل"
          aria-label="شماره موبایل"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
          disabled={isLoading}
          dir="ltr"
        />

        <input
          name="password"
          type="password"
          placeholder="رمز عبور"
          aria-label="رمز عبور"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
          disabled={isLoading}
          dir="ltr"
        />

        <SmartButton type="submit" variant="mblue" className="cursor-pointer" disabled={isLoading}>
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
    </main>
  );
};

export default LoginClient;
