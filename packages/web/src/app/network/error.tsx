"use client";

import React, { useEffect } from "react";
import SmartButton from "@/components/ui/SmartButton";

export default function NetworkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Network Route Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-red-50 rounded-2xl p-8 border border-red-100 mx-4 my-8 shadow-sm">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-inner">
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">خطایی رخ داد</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        متأسفانه در دریافت اطلاعات شبکه خطایی رخ داد. لطفاً دوباره تلاش کنید.
      </p>
      <SmartButton variant="mblue" size="md" onClick={() => reset()}>
        تلاش مجدد
      </SmartButton>
    </div>
  );
}
