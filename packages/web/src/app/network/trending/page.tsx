import type { Metadata } from "next";
import TrendingClient from "./TrendingClient";

export const metadata: Metadata = {
  title: "اولویت‌های فوری | کانون مهرباران",
  description: "برترین نیازها و کاربران تاثیرگذار شبکه کانون مهرباران را مشاهده کنید.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrendingPage() {
  return <TrendingClient />;
}
