import type { Metadata } from "next";
import TeamDetailClient from "./TeamDetailClient";

export const metadata: Metadata = {
  title: "جزئیات تیم | کانون مهرباران",
  description: "جزئیات، تسک‌ها و اعضای تیم در شبکه نیازسنجی کانون مهرباران.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeamPage() {
  return <TeamDetailClient />;
}
