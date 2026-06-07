import React from "react";
import { Metadata } from "next";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "کاوش | شبکه مهرباران",
  description: "دنیایی از فرصت‌ها و ارتباطات جدید را کشف کنید",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExplorePage() {
  return <ExploreClient />;
}
