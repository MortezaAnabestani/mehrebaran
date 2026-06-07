import type { Metadata } from "next";
import NotificationsClient from "./NotificationsClient";

export const metadata: Metadata = {
  title: "اعلان‌ها | کانون مهرباران",
  description: "تاریخچه اعلان‌ها و خبررسانی‌های شبکه کانون مهرباران.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}

