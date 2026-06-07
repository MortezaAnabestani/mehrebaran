import type { Metadata } from "next";
import NetworkPageClient from "./NetworkPageClient";

export const metadata: Metadata = {
  title: "فید شبکه | روایت مهر",
  description: "جدیدترین نیازها و فعالیت‌های شبکه روایت مهر را اینجا ببینید.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NetworkPage() {
  return <NetworkPageClient />;
}
