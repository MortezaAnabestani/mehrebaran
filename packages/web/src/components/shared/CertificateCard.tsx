"use client";

import React, { useState } from "react";
import SmartButton from "@/components/ui/SmartButton";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface Props {
  certificateUrl: string;
  type: "donation" | "volunteer";
  recipientName?: string;
  projectTitle?: string;
  onShare?: () => void;
}

const CertificateCard: React.FC<Props> = ({
  certificateUrl,
  type,
  recipientName,
  projectTitle,
  onShare,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    // Open in new tab for download
    window.open(certificateUrl, "_blank");
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator
          .share({
            title: `گواهی ${type === "donation" ? "کمک مالی" : "داوطلبی"}`,
            text: `گواهی ${type === "donation" ? "کمک مالی" : "داوطلبی"} من در پروژه ${projectTitle || "مهر باران"}`,
            url: certificateUrl,
          })
          .catch((error) => console.log("خطا در اشتراک‌گذاری:", error));
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(certificateUrl);
        alert("لینک گواهی‌نامه کپی شد!");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        {type === "donation" ? (
          <svg
            className="w-8 h-8 text-mblue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-pink-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            گواهی‌نامه {type === "donation" ? "کمک مالی" : "داوطلبی"}
          </h3>
          {recipientName && <p className="text-sm text-gray-600">{recipientName}</p>}
        </div>
      </div>

      {projectTitle && (
        <p className="text-sm text-gray-600 mb-4">
          پروژه: <span className="font-bold text-gray-800">{projectTitle}</span>
        </p>
      )}

      {/* Preview Toggle */}
      {showPreview && (
        <div className="mb-4 relative">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
            <OptimizedImage
              src={certificateUrl}
              alt="گواهی‌نامه"
              fill
              priority="up"
              rounded
            />
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {!showPreview && (
          <SmartButton variant="outline" onClick={() => setShowPreview(true)} fullWidth>
            پیش‌نمایش گواهی‌نامه
          </SmartButton>
        )}
        <div className="grid grid-cols-2 gap-2">
          <SmartButton variant="mblue" onClick={handleDownload}>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            دانلود
          </SmartButton>
          <SmartButton variant="outline" onClick={handleShare}>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            اشتراک
          </SmartButton>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 این گواهی‌نامه را در شبکه‌های اجتماعی به اشتراک بگذارید و دیگران را نیز به کمک
          تشویق کنید!
        </p>
      </div>
    </div>
  );
};

export default CertificateCard;
