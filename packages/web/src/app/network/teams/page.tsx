import React from "react";
import type { Metadata } from "next";
import TeamsClient from "./TeamsClient";

export const metadata: Metadata = {
  title: "لیست تیم‌ها | کانون مهرباران",
  description: "به شبکه‌ای از تیم‌های فعال بپیوندید، مهارت‌های خود را به اشتراک بگذارید و در پروژه‌های تأثیرگذار شرکت کنید.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeamsPage() {
  return (
    <React.Suspense>
      <TeamsClient />
    </React.Suspense>
  );
}