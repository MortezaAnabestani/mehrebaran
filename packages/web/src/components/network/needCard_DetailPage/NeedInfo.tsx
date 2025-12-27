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
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.05)] p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Background Texture Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 border-b border-gray-200/60 pb-3 sm:pb-4 md:pb-5 lg:pb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-800 mb-3 sm:mb-4 md:mb-5 tracking-tight drop-shadow-sm">
            {need.title}
          </h1>

          {/* Skeuomorphic Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
            {/* Status Badge - Raised Look */}
            <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full text-[10px] sm:text-xs font-bold text-gray-600 bg-gradient-to-b from-gray-50 to-gray-200 border border-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)]">
              {getStatusLabel(need.status)}
            </span>

            {/* Urgency Badge - Colored Glass Look */}
            <span
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full text-[10px] sm:text-xs font-bold border shadow-sm backdrop-blur-sm ${urgency.color}`}
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" }}
            >
              <OptimizedImage
                src={urgency.icon}
                alt={urgency.label}
                width={18}
                height={18}
                className="inline-block mr-1.5"
              />
              {urgency.label}
            </span>

            {/* Deadline Badge - Inset/Pressed Look */}
            {need.deadline && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full text-[10px] sm:text-xs font-bold text-[#007acc] bg-[#007acc]/5 border border-[#007acc]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]">
                <OptimizedImage
                  src="/icons/time_machine.svg"
                  alt="download icon"
                  width={18}
                  height={18}
                  className="inline-block"
                />
                {getDaysRemaining(need.deadline)}
              </span>
            )}
          </div>
        </div>

        {/* Description - Paper Texture Feel */}
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(255,255,255,1)_inset] border border-gray-100 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          <p className="text-gray-700 leading-6 sm:leading-7 md:leading-8 text-justify text-sm sm:text-base font-medium">
            {need.description}
          </p>
        </div>

        {/* Tags - Etched Slots */}
        {need.tags && need.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            {need.tags.map((tag, index) => (
              <span
                key={index}
                className="text-[10px] sm:text-xs font-semibold text-[#007acc] px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-md sm:rounded-lg bg-[#f0f7ff] border border-[#007acc]/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Info Grid - Raised Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          {need.location && (
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
              <OptimizedImage
                src="/icons/placeLocation.svg"
                alt="download icon"
                width={18}
                height={18}
                className="inline-block"
              />
              <h4 className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 text-gray-800 inline-block mr-1.5">
                موقعیت مکانی
              </h4>
              <div className="text-xs sm:text-sm text-gray-600 pr-8 sm:pr-9 md:pr-10">
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
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
              <OptimizedImage
                src="/icons/time_machine.svg"
                alt="download icon"
                width={18}
                height={18}
                className="inline-block"
              />
              <h4 className="font-bold text-xs sm:text-sm mb-2 sm:mb-3 text-gray-800 inline-block mr-1.5">
                مدت زمان
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 pr-8 sm:pr-9 md:pr-10 font-medium">
                {need.estimatedDuration}
              </p>
            </div>
          )}
        </div>

        {/* Attachments Section */}
        {need.attachments && need.attachments.length > 0 && (
          <div className="bg-gray-50/50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-200/60 shadow-inner">
            <OptimizedImage
              src="/icons/attach.svg"
              alt="download icon"
              width={18}
              height={18}
              className="inline-block"
            />
            <h4 className="font-bold text-sm sm:text-base mb-3 sm:mb-4 text-gray-800 inline-block mr-1.5">
              فایل‌های پیوست
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              {need.attachments
                .filter((a: any) => a?.url)
                .map((attachment: any, index: number) => {
                  const fileInfo = getFileInfo(attachment.url, attachment.fileName);

                  if (attachment.fileType === "image") {
                    return (
                      <div
                        key={index}
                        className="relative w-full h-32 sm:h-40 md:h-48 lg:h-52 rounded-lg sm:rounded-xl overflow-hidden border-2 sm:border-3 md:border-4 border-white shadow-md group"
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
                      className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-white rounded-lg sm:rounded-xl p-2.5  border border-gray-200 shadow-[0_2px_5px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-[#007acc]/30 transition-all duration-300 group"
                    >
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-inner border border-black/5 ${fileInfo.color} bg-opacity-10`}
                      >
                        <OptimizedImage
                          src={fileInfo.icon}
                          alt={fileInfo.name}
                          width={18}
                          height={18}
                          className="inline-block mr-1.5"
                        />{" "}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold truncate text-gray-800 group-hover:text-[#007acc] transition-colors">
                          {fileInfo.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 font-mono">
                          {formatFileSize(attachment.fileSize)}
                        </p>
                      </div>
                      <div className="text-gray-300 group-hover:text-[#007acc] transition-colors text-base sm:text-lg">
                        <OptimizedImage
                          src="/icons/download.svg"
                          alt="download icon"
                          width={18}
                          height={18}
                          className="inline-block mr-1.5"
                        />{" "}
                      </div>
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
