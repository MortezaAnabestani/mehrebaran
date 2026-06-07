import React from "react";
import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "ورود | کانون مهرباران",
  description: "ورود به حساب کاربری کانون مهرباران برای استفاده از شبکه نیازسنجی و خدمات",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "ورود | کانون مهرباران",
    description: "ورود به حساب کاربری کانون مهرباران برای استفاده از شبکه نیازسنجی و خدمات",
    url: "https://mehrbaran.com/login",
  },
};

const LoginPage: React.FC = () => {
  return <LoginClient />;
};

export default LoginPage;
