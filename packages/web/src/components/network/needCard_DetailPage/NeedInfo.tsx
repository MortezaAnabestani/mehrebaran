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
    <div className="relative">
      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8 border-b border-[#c5c5c5]/40 pb-4 sm:pb-6 md:pb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-700 mb-4 sm:mb-5 md:mb-6 tracking-tight drop-shadow-sm">
            {need.title}
          </h1>

          {/* Neumorphic Badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* Status Badge */}
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]">
              {getStatusLabel(need.status)}
            </span>

            {/* Urgency Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] ${urgency.color}`}
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

            {/* Deadline Badge */}
            {need.deadline && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-[#007acc] bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]">
                <OptimizedImage
                  src="/icons/time_machine.svg"
                  alt="deadline icon"
                  width={18}
                  height={18}
                  className="inline-block"
                />
                {getDaysRemaining(need.deadline)}
              </span>
            )}
          </div>
        </div>

        {/* Description - Neumorphic Inset */}
        <div className="bg-[#f0f2f5] rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-8 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] mb-5 sm:mb-8 md:mb-10">
          <p className="text-slate-600 leading-relaxed text-justify text-sm sm:text-base font-medium">
            {need.description}
          </p>
        </div>

        {/* Tags */}
        {need.tags && need.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-8 md:mb-10">
            {need.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-xs font-semibold text-[#007acc] px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg bg-[#f0f2f5] shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] sm:shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:gap-8 mb-5 sm:mb-8 md:mb-10">
          {need.location && (
            <div className="bg-[#f0f2f5] rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <OptimizedImage
                  src="/icons/placeLocation.svg"
                  alt="location icon"
                  width={20}
                  height={20}
                  className="inline-block"
                />
                <h4 className="font-bold text-sm sm:text-base text-slate-700">
                  موقعیت مکانی
                </h4>
              </div>
              <div className="text-sm text-slate-500 pr-7">
                {need.location.address && <p className="mb-1">{need.location.address}</p>}
                {(need.location.city || need.location.province) && (
                  <p className="font-medium text-slate-600">
                    {need.location.city}، {need.location.province}
                  </p>
                )}
              </div>
            </div>
          )}
          {need.estimatedDuration && (
            <div className="bg-[#f0f2f5] rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <OptimizedImage
                  src="/icons/time_machine.svg"
                  alt="time icon"
                  width={20}
                  height={20}
                  className="inline-block"
                />
                <h4 className="font-bold text-sm sm:text-base text-slate-700">
                  مدت زمان
                </h4>
              </div>
              <p className="text-sm text-slate-500 pr-7 font-medium">
                {need.estimatedDuration}
              </p>
            </div>
          )}
        </div>

        {/* Attachments Section */}
        {need.attachments && need.attachments.length > 0 && (
          <div className="bg-[#f0f2f5] rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] sm:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
              <OptimizedImage
                src="/icons/attach.svg"
                alt="attachment icon"
                width={20}
                height={20}
                className="inline-block"
              />
              <h4 className="font-bold text-base sm:text-lg text-slate-700">
                فایل‌های پیوست
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 sm:gap-5">
              {need.attachments
                ?.filter((a: { url?: string }) => a?.url)
                ?.map((attachment: { url: string; fileName?: string; fileType?: string; fileSize?: number }, index: number) => {
                  const fileInfo = getFileInfo(attachment.url, attachment.fileName);

                  if (attachment.fileType === "image") {
                    return (
                      <div
                        key={attachment.url || index}
                        className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl sm:rounded-2xl overflow-hidden bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] p-1.5 sm:p-2 group"
                      >
                        <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden border border-white/60">
                          <OptimizedImage
                            src={attachment.url}
                            alt={fileInfo.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={attachment.url || index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 sm:gap-4 bg-[#f0f2f5] rounded-2xl p-3 sm:p-4 shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 group"
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-[inset_2px_2px_5px_#c5c5c5,inset_-2px_-2px_5px_#ffffff] ${fileInfo.color} bg-opacity-10`}
                      >
                        <OptimizedImage
                          src={fileInfo.icon}
                          alt={fileInfo.name}
                          width={24}
                          height={24}
                          className="inline-block"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-slate-700 group-hover:text-[#007acc] transition-colors">
                          {fileInfo.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          {formatFileSize(attachment.fileSize)}
                        </p>
                      </div>
                      <div className="text-slate-400 group-hover:text-[#007acc] transition-colors pr-2">
                        <OptimizedImage
                          src="/icons/download.svg"
                          alt="download icon"
                          width={20}
                          height={20}
                        />
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
