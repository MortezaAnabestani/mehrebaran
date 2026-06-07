import type { Metadata } from "next";
import UserFollowClient from "./UserFollowClient";

export const metadata: Metadata = {
  title: "ارتباطات کاربر | روایت مهر",
  description: "لیست دنبال‌کنندگان و دنبال‌شوندگان کاربر را مشاهده کنید.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UserFollowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <UserFollowClient userId={resolvedParams.id} />;
}
