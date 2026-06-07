import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ثبت‌نام | کانون مهرباران",
  description: "ثبت‌نام در سایت کانون خیریه مهرباران",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
