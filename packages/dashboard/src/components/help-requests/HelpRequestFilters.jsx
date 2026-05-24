import React from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const STATUS_OPTIONS = [
  { label: "همه درخواست‌ها", value: "" },
  { label: "در انتظار بررسی", value: "pending" },
  { label: "تایید شده", value: "approved" },
  { label: "رد شده", value: "rejected" },
];

const HelpRequestFilters = ({ filters, onSearchChange, onStatusChange }) => {
  const activeStatus = STATUS_OPTIONS.find((opt) => opt.value === filters.status);

  return (
    <div className="w-full border-b border-slate-200 bg-slate-50/50 p-2">
      <div className="grid grid-cols-12 gap-2 items-center">
        {/* SECTION 1: Search Input (Engineering Style) */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="relative group">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-focus-within:text-[#007acc]">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={onSearchChange}
              placeholder="جستجو با شناسه، عنوان..."
              className="block w-full rounded-md border border-slate-300 bg-white py-1.5 pr-9 pl-3 text-[12px] font-mono text-slate-700 placeholder:text-slate-400 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all"
            />
            {/* Keyboard Shortcut Hint (Visual Only) */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <span className="text-[10px] font-mono text-slate-400 border border-slate-200 rounded px-1 bg-slate-50">
                Ctrl+K
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Segmented Status Control */}
        <div className="col-span-12 md:col-span-8 lg:col-span-7">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 p-1 bg-slate-200/40 rounded-md border border-slate-200/60">
              {STATUS_OPTIONS.map((option) => {
                const isActive = filters.status === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => onStatusChange(option.value)}
                    className={`
                      relative px-3 py-1 text-[11px] font-medium rounded-[4px] transition-all duration-200 whitespace-nowrap
                      ${
                        isActive
                          ? "bg-white text-[#007acc] shadow-sm ring-1 ring-slate-200"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007acc] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007acc]"></span>
                      </span>
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-300 mx-1 hidden md:block"></div>

            {/* Active Filter Indicator */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">فیلتر فعال:</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#007acc]/5 px-2 py-1 text-[11px] font-medium text-[#007acc] ring-1 ring-inset ring-[#007acc]/20">
                {activeStatus?.label || "همه"}
              </span>
              {(filters.status || filters.searchQuery) && (
                <button
                  onClick={() => {
                    onStatusChange("");
                    // Assuming parent handles clearing search via a separate prop or combined logic,
                    // but here we just reset status for the visual demo
                    const event = { target: { value: "" } };
                    onSearchChange(event);
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="پاک کردن فیلترها"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Advanced Actions (Right Aligned) */}
        <div className="col-span-12 lg:col-span-2 flex justify-end">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-slate-300 text-slate-500 hover:border-[#007acc] hover:text-[#007acc] transition-all bg-white">
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            <span className="text-[11px] font-medium">فیلتر پیشرفته</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpRequestFilters;
