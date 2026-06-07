import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "پروفایل من | کانون مهرباران",
  description: "مدیریت پروفایل و نیازمندی‌های ثبت شده شما.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eef2f6]"></div>}>
      <ProfileClient />
    </Suspense>
  );
}
