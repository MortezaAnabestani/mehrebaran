import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SmartButton from "@/components/ui/SmartButton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: "ایجاد تیم جدید | کانون مهرباران",
  description: "ایجاد و پیکربندی تیم جدید در شبکه نیازسنجی کانون مهرباران.",
  robots: {
    index: false,
    follow: false,
  },
};

// تعریف رنگ‌های برند و سایه‌ها به صورت ثابت برای استفاده مجدد و تمیزی کد
const BRAND_COLOR = "text-[#007acc]";
const BG_COLOR = "bg-[#eef2f6]"; // رنگ پس‌زمینه مناسب برای اسکیومورفیسم
const CARD_SHADOW = "shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"; // سایه برجسته
const INSET_SHADOW = "shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff]"; // سایه فرورفته

export default function CreateTeamPage() {
  return (
    <ProtectedRoute>
      <main
        className={`min-h-screen ${BG_COLOR} py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center`}
      >
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="w-full max-w-3xl mb-8">
          <ol className="flex items-center text-sm text-gray-500 font-medium">
            <li>
              <Link
                href="/network"
                className={`transition-colors duration-200 hover:${BRAND_COLOR} hover:scale-105 inline-block`}
              >
                شبکه نیازسنجی
              </Link>
            </li>
            <li className="mx-3 text-gray-400" aria-hidden="true">/</li>
            <li>
              <Link
                href="/network/teams"
                className={`transition-colors duration-200 hover:${BRAND_COLOR} hover:scale-105 inline-block`}
              >
                تیم‌ها
              </Link>
            </li>
            <li className="mx-3 text-gray-400" aria-hidden="true">/</li>
            <li className="text-gray-800 font-bold" aria-current="page">
              ایجاد تیم جدید
            </li>
          </ol>
        </nav>

        {/* Main Content Card - Skeuomorphic Style */}
        <section
          className={`w-full max-w-3xl rounded-3xl ${BG_COLOR} ${CARD_SHADOW} p-10 md:p-16 text-center transition-all duration-300`}
        >
          {/* Icon Container - Pressed/Inset Look */}
          <div
            className={`mx-auto w-32 h-32 rounded-full ${INSET_SHADOW} flex items-center justify-center mb-10`}
            aria-hidden="true"
          >
            <span className="text-6xl animate-pulse filter drop-shadow-sm">🚧</span>
          </div>

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
              صفحه ایجاد تیم در حال <span className={BRAND_COLOR}>توسعه</span> است
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
              ما در حال ساختن تجربه‌ای فوق‌العاده برای شما هستیم. این بخش به زودی با امکانات کامل در دسترس
              خواهد بود.
            </p>
          </header>

          {/* Action Buttons Area */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            <div className="transform transition-transform hover:-translate-y-1 active:translate-y-0">
              <Link href="/network/teams">
                <SmartButton
                  variant="mblue"
                  size="lg"
                  className="shadow-lg shadow-blue-500/30 font-bold px-8 w-full sm:w-auto"
                  tabIndex={-1}
                >
                  بازگشت به لیست تیم‌ها
                </SmartButton>
              </Link>
            </div>

            <div className="transform transition-transform hover:-translate-y-1 active:translate-y-0">
              <Link href="/network">
                <SmartButton
                  variant="mgray"
                  size="lg"
                  className="font-medium px-8 w-full sm:w-auto"
                  tabIndex={-1}
                >
                  بازگشت به شبکه
                </SmartButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

