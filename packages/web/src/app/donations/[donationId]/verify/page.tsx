"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { verifyPayment } from "@/services/donation.service";
import SmartButton from "@/components/ui/SmartButton";
import Loading from "@/components/ui/Loading";

export default function PaymentVerificationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const donationId = params.donationId as string;
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [refId, setRefId] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!authority || !status || !donationId) {
        setError("اطلاعات تراکنش ناقص است");
        setVerifying(false);
        return;
      }

      if (status !== "OK") {
        setError("پرداخت توسط کاربر لغو شد یا با خطا مواجه شد");
        setVerifying(false);
        return;
      }

      try {
        const result = await verifyPayment(donationId, authority, status);
        setSuccess(true);
        setRefId(result.refId);
        if (result.certificateUrl) {
          setCertificateUrl(result.certificateUrl);
        }
      } catch (err: any) {
        setError(err.message || "خطا در تایید پرداخت");
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [authority, status, donationId]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">در حال تایید پرداخت...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">پرداخت ناموفق</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-2">
            <SmartButton variant="mblue" onClick={() => router.push("/projects")} fullWidth>
              بازگشت به پروژه‌ها
            </SmartButton>
            <SmartButton
              variant="outline"
              onClick={() => router.back()}
              fullWidth
            >
              تلاش مجدد
            </SmartButton>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <svg
            className="w-20 h-20 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">پرداخت موفق!</h2>
          <p className="text-gray-600 mb-6">
            از حمایت ارزشمند شما سپاسگزاریم. کمک شما در تحقق اهداف خیرخواهانه ما بسیار
            مؤثر است.
          </p>

          {refId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">کد پیگیری تراکنش:</p>
              <p className="text-lg font-bold text-mblue" dir="ltr">
                {refId}
              </p>
            </div>
          )}

          {certificateUrl && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800 mb-3">
                گواهی‌نامه شما آماده است! می‌توانید آن را دانلود کرده و در شبکه‌های اجتماعی
                به اشتراک بگذارید.
              </p>
              <SmartButton
                variant="mblue"
                onClick={() => window.open(certificateUrl, "_blank")}
                fullWidth
              >
                دانلود گواهی‌نامه
              </SmartButton>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-6">
            <SmartButton variant="mblue" onClick={() => router.push("/projects")} fullWidth>
              مشاهده پروژه‌های دیگر
            </SmartButton>
            <SmartButton
              variant="outline"
              onClick={() => router.push("/network")}
              fullWidth
            >
              ورود به شبکه نیازسنجی
            </SmartButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
