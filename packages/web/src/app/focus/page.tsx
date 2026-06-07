import React from "react";
import FocusPageClient from "./FocusPageClient";
import { Metadata } from "next";
import { getFocusPageHeroSettings } from "@/services/setting.service";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "حوزه‌های فعالیت | کانون مهرباران",
  description: "فعالیت‌های داوطلبانه و عام‌المنفعه کانون مهرباران جهت فرهنگ‌سازی و توسعه پایدار.",
  alternates: {
    canonical: "https://mehrbaran.com/focus",
  },
  openGraph: {
    title: "حوزه‌های فعالیت | کانون مهرباران",
    description: "فعالیت‌های داوطلبانه و عام‌المنفعه کانون مهرباران جهت فرهنگ‌سازی و توسعه پایدار.",
    url: "https://mehrbaran.com/focus",
    siteName: "کانون مهرباران",
    locale: "fa_IR",
    type: "website",
    images: [{ url: "https://mehrbaran.com/images/default-og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "حوزه‌های فعالیت | کانون مهرباران",
    description: "فعالیت‌های داوطلبانه و عام‌المنفعه کانون مهرباران جهت فرهنگ‌سازی و توسعه پایدار.",
  },
};

export default async function FocusPage() {
  const heroSettings = await getFocusPageHeroSettings();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "inLanguage": "fa-IR",
            "name": "حوزه‌های فعالیت",
            "description": "فعالیت‌های داوطلبانه و عام‌المنفعه کانون مهرباران جهت فرهنگ‌سازی و توسعه پایدار.",
            "url": "https://mehrbaran.com/focus",
          }),
        }}
      />
      <FocusPageClient initialSettings={heroSettings} />
    </>
  );
}
