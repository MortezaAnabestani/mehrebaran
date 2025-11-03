"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SmartButton from "@/components/ui/SmartButton";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const Signup: React.FC = () => {
  const router = useRouter();
  const { signup } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    mobile: "",
    name: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
    major: "",
    yearOfAdmission: "",
  });

  // مرحله 1: شماره موبایل
  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.mobile.trim()) {
      setError("لطفاً شماره موبایل را وارد کنید.");
      return;
    }

    // رفتن به مرحله 2
    setStep(2);
  };

  // مرحله 2: اطلاعات کامل و ثبت‌نام
  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        setError("لطفاً نام و نام خانوادگی را وارد کنید.");
        setIsLoading(false);
        return;
      }

      if (!formData.password.trim()) {
        setError("لطفاً رمز عبور را وارد کنید.");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("رمز عبور و تکرار آن یکسان نیستند.");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("رمز عبور باید حداقل 6 کاراکتر باشد.");
        setIsLoading(false);
        return;
      }

      // ثبت‌نام
      await signup({
        mobile: formData.mobile,
        name: formData.name,
        password: formData.password,
        nationalId: formData.nationalId || undefined,
        major: formData.major || undefined,
        yearOfAdmission: formData.yearOfAdmission || undefined,
      });

      // Redirect به شبکه نیازسنجی
      router.push("/network");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-mblue py-10">
      {/* مرحله 1: شماره موبایل */}
      {step === 1 && (
        <form
          className="flex flex-col justify-between gap-5 p-8 w-90 md:w-100 bg-white rounded-lg shadow-lg"
          onSubmit={handleStep1Submit}
        >
          <h1 className="font-extrabold text-2xl text-center">ثبت‌نام</h1>

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
          />

          <SmartButton type="submit" variant="mblue" className="cursor-pointer">
            مرحله بعد
          </SmartButton>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <Link href="/login" className="text-mblue font-bold hover:underline">
                ورود
              </Link>
            </p>
          </div>
        </form>
      )}

      {/* مرحله 2: اطلاعات کامل */}
      {step === 2 && (
        <form
          className="flex flex-col justify-between gap-4 p-8 w-90 md:w-100 max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg"
          onSubmit={handleStep2Submit}
        >
          <h1 className="font-extrabold text-2xl text-center">تکمیل ثبت‌نام</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            name="name"
            placeholder="نام و نام خانوادگی *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
            disabled={isLoading}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="رمز عبور *"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
            disabled={isLoading}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="تکرار رمز عبور *"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
            disabled={isLoading}
            required
          />

          <input
            type="text"
            name="nationalId"
            placeholder="کد ملی (اختیاری)"
            value={formData.nationalId}
            onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
            className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
            disabled={isLoading}
          />

          <input
            type="text"
            name="major"
            placeholder="رشته تحصیلی (اختیاری)"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
            disabled={isLoading}
          />

          <input
            type="text"
            name="yearOfAdmission"
            placeholder="سال ورودی (اختیاری)"
            value={formData.yearOfAdmission}
            onChange={(e) => setFormData({ ...formData, yearOfAdmission: e.target.value })}
            className="bg-mgray p-3 rounded-lg text-center placeholder-gray-500 focus:outline-mblue/45"
            disabled={isLoading}
          />

          <div className="flex gap-3">
            <SmartButton
              type="button"
              variant="mgray"
              className="cursor-pointer flex-1"
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              بازگشت
            </SmartButton>

            <SmartButton type="submit" variant="mblue" className="cursor-pointer flex-1" disabled={isLoading}>
              {isLoading ? "در حال ثبت‌نام..." : "نهایی‌کردن ثبت‌نام"}
            </SmartButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
