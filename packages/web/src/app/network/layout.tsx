import type { Metadata } from "next";
import NetworkLayoutClient from "./NetworkLayoutClient";

export const metadata: Metadata = {
  title: "شبکه نیازسنجی | روایت مهر",
  description: "شبکه نیازسنجی روایت مهر، جایی برای ثبت نیازها و پیوستن به تیم‌های خیریه و فعالیت‌های داوطلبانه.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NetworkLayout({ children }: { children: React.ReactNode }) {
  return <NetworkLayoutClient>{children}</NetworkLayoutClient>;
}
