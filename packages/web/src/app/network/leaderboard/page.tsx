import React, { Suspense } from "react";
import { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "رتبه‌بندی | شبکه مهرباران",
  description: "نمایش رتبه‌بندی و افراد برتر شبکه مسئولیت اجتماعی مهرباران",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eef2f6] flex items-center justify-center">درحال بارگذاری...</div>}>
      <LeaderboardClient />
    </Suspense>
  );
}
