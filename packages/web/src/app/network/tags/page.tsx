import type { Metadata } from "next";
import TagsClient from "./TagsClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "کاوش تگ‌ها | کانون مهرباران",
  description: "موضوعات داغ و تگ‌های مرتبط با شبکه نیازسنجی کانون مهرباران را کشف کنید.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TagsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f7fa]"></div>}>
      <TagsClient />
    </Suspense>
  );
}
