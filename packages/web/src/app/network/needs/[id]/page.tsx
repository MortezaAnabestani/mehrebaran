import React from "react";
import { Metadata } from "next";
import NeedDetailClient from "./NeedDetailClient";

export const metadata: Metadata = {
  title: "جزئیات نیاز | شبکه مهرباران",
  description: "مشاهده جزئیات نیاز در شبکه مسئولیت اجتماعی مهرباران",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NeedDetailPage() {
  return <NeedDetailClient />;
}
