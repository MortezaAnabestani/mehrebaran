"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SmartButton from "@/components/ui/SmartButton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

const CreateTeamPage: React.FC = () => {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-mgray/5 py-10">
        <div className="w-9/10 md:w-8/10 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link href="/network" className="text-mblue hover:underline">
              شبکه نیازسنجی
            </Link>
            <span className="mx-2 text-gray-500">←</span>
            <Link href="/network/teams" className="text-mblue hover:underline">
              تیم‌ها
            </Link>
            <span className="mx-2 text-gray-500">←</span>
            <span className="text-gray-700">ایجاد تیم جدید</span>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🚧</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                صفحه ایجاد تیم در حال توسعه است
              </h1>
              <p className="text-gray-600 mb-8">
                این بخش به زودی راه‌اندازی می‌شود. لطفاً بعداً دوباره تلاش کنید.
              </p>
              <div className="flex items-center justify-center gap-4">
                <SmartButton
                  variant="mblue"
                  size="md"
                  onClick={() => router.push("/network/teams")}
                >
                  بازگشت به لیست تیم‌ها
                </SmartButton>
                <SmartButton
                  variant="mgray"
                  size="md"
                  onClick={() => router.push("/network")}
                >
                  بازگشت به شبکه
                </SmartButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateTeamPage;
