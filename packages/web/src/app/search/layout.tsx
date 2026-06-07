import { Metadata } from "next";

export const metadata: Metadata = {
  title: "جستجو | کانون مهرباران",
  description: "جستجو در مطالب و پروژه‌های کانون خیریه مهرباران",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
