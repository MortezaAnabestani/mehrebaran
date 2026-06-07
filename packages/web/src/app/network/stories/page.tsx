import type { Metadata } from "next";
import StoriesClient from "./StoriesClient";

export const metadata: Metadata = {
  title: "روایت مهر | استوری‌ها",
  description: "استوری‌های 24 ساعته از دوستان و همکاران در روایت مهر.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StoriesPage() {
  return <StoriesClient />;
}

