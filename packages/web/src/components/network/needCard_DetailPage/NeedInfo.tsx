import React from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { INeed } from "common-types";
import {
  getDaysRemaining,
  getUrgencyInfo,
  getStatusLabel,
  getFileInfo,
  formatFileSize,
} from "@/utils/needUtils";

interface NeedInfoProps {
  need: INeed;
}

const NeedInfo: React.FC<NeedInfoProps> = ({ need }) => {
  const urgency = getUrgencyInfo(need.urgencyLevel);

  return (
    <div className="relative overflow-hidden rounded-3xl  border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.05)] p-8">
      {/* Background Texture Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-8 border-b border-gray-200/60 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-5 tracking-tight drop-shadow-sm">
            {need.title}
          </h1>

          {/* Skeuomorphic Badges */}
          <div className="flex flex-wrap gap-3">
            {/* Status Badge - Raised Look */}
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 bg-gradient-to-b from-gray-50 to-gray-200 border border-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)]">
              {getStatusLabel(need.status)}
            </span>

            {/* Urgency Badge - Colored Glass Look */}
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${urgency.color}`}
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" }}
            >
              <span className="drop-shadow-md">{urgency.icon}</span> {urgency.label}
            </span>

            {/* Deadline Badge - Inset/Pressed Look */}
            {need.deadline && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-[#007acc] bg-[#007acc]/5 border border-[#007acc]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]">
                <span>⏰</span> {getDaysRemaining(need.deadline)}
              </span>
            )}
          </div>
        </div>

        {/* Description - Paper Texture Feel */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(255,255,255,1)_inset] border border-gray-100 mb-8">
          <p className="text-gray-700 leading-8 text-justify text-base font-medium">{need.description}</p>
        </div>

        {/* Tags - Etched Slots */}
        {need.tags && need.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            {need.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs font-semibold text-[#007acc] px-4 py-1.5 rounded-lg bg-[#f0f7ff] border border-[#007acc]/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Info Grid - Raised Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {need.location && (
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-gray-800">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg border border-gray-100">
                  📍
                </span>
                موقعیت مکانی
              </h4>
              <div className="text-sm text-gray-600 pr-10">
                {need.location.address && <p className="mb-1">{need.location.address}</p>}
                {(need.location.city || need.location.province) && (
                  <p className="font-medium text-gray-800">
                    {need.location.city}، {need.location.province}
                  </p>
                )}
              </div>
            </div>
          )}
          {need.estimatedDuration && (
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-gray-800">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg border border-gray-100">
                  ⏳
                </span>
                مدت زمان
              </h4>
              <p className="text-sm text-gray-600 pr-10 font-medium">{need.estimatedDuration}</p>
            </div>
          )}
        </div>

        {/* Attachments Section */}
        {need.attachments && need.attachments.length > 0 && (
          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/60 shadow-inner">
            <h4 className="font-bold text-base mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-[#007acc]">📎</span> فایل‌های پیوست
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {need.attachments
                .filter((a: any) => a?.url)
                .map((attachment: any, index: number) => {
                  const fileInfo = getFileInfo(attachment.url, attachment.fileName);

                  if (attachment.fileType === "image") {
                    return (
                      <div
                        key={index}
                        className="relative w-full h-52 rounded-xl overflow-hidden border-4 border-white shadow-md group"
                      >
                        <OptimizedImage
                          src={attachment.url}
                          alt={fileInfo.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    );
                  }

                  return (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-[#007acc]/30 transition-all duration-300 group"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-black/5 ${fileInfo.color} bg-opacity-10`}
                      >
                        {fileInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-gray-800 group-hover:text-[#007acc] transition-colors">
                          {fileInfo.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {formatFileSize(attachment.fileSize)}
                        </p>
                      </div>
                      <div className="text-gray-300 group-hover:text-[#007acc] transition-colors">⬇</div>
                    </a>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedInfo;
