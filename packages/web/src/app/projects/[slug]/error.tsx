"use client";

import { useEffect } from "react";
import SmartButton from "@/components/ui/SmartButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full flex flex-col justify-center items-center h-96 gap-4">
      <h2 className="text-2xl font-bold text-gray-800">خطایی رخ داد!</h2>
      <p className="text-mgray-dark">در بارگذاری اطلاعات پروژه مشکلی پیش آمده است.</p>
      <SmartButton onClick={() => reset()} variant="mblue">
        تلاش مجدد
      </SmartButton>
    </div>
  );
}
