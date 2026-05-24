import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  HashtagIcon,
  UserGroupIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import useTeamForm from "../../hooks/useTeamForm";

const EditTeam = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    loading,
    submitSuccess,
    submitError,
    setValue,
    watch,
    selectedTeam,
  } = useTeamForm(true);

  const focusArea = watch("focusArea");
  const status = watch("status");

  // Loading State - Minimal & Technical
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3 text-slate-400">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-[#007acc] rounded-full animate-spin"></div>
        <span className="text-xs font-mono">LOADING_DATA...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 font-sans">
      {/* Main Container: Bordered, No Shadow */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        {/* Header: Technical Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard/teams" className="text-slate-500 hover:text-[#007acc] transition-colors">
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
            <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CpuChipIcon className="w-4 h-4 text-slate-500" />
              ویرایش پیکربندی تیم
            </h1>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            ID: {selectedTeam?.id?.substring(0, 8) || "UNKNOWN"}
          </div>
        </div>

        {/* Status Banners */}
        {submitSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center gap-2 text-emerald-700 text-xs">
            <CheckCircleIcon className="w-4 h-4" />
            <span>تغییرات با موفقیت در سیستم ثبت شد.</span>
          </div>
        )}
        {submitError && (
          <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center gap-2 text-red-700 text-xs">
            <XCircleIcon className="w-4 h-4" />
            <span>خطا در پردازش درخواست: {submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          {/* Section 1: Core Identity */}
          <div className="p-5 grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8 space-y-4">
              {/* Name Input */}
              <div className="group">
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  نام تیم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`block w-full rounded-md border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder-slate-400 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all ${
                    errors.name ? "border-red-300 bg-red-50/30" : ""
                  }`}
                  placeholder="نام رسمی تیم را وارد کنید..."
                />
                {errors.name && (
                  <span className="text-[10px] text-red-500 mt-1 block font-mono">
                    Error: {errors.name.message}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  توضیحات عملیاتی
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="block w-full rounded-md border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder-slate-400 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] resize-none"
                  placeholder="شرح وظایف و اهداف تیم..."
                />
                {errors.description && (
                  <span className="text-[10px] text-red-500 mt-1 block font-mono">
                    Error: {errors.description.message}
                  </span>
                )}
              </div>
            </div>

            {/* Sidebar: Metadata */}
            <div className="col-span-12 md:col-span-4 bg-slate-50/50 rounded border border-slate-100 p-4 space-y-4">
              {/* Focus Area */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">حوزه فعالیت</label>
                <select
                  value={focusArea}
                  onChange={(e) => setValue("focusArea", e.target.value)}
                  className="block w-full rounded-md border-slate-300 bg-white py-1.5 pl-3 pr-8 text-[12px] focus:border-[#007acc] focus:ring-[#007acc]"
                >
                  <option value="">انتخاب کنید...</option>
                  <option value="fundraising">جمع‌آوری کمک مالی</option>
                  <option value="logistics">لجستیک</option>
                  <option value="communication">ارتباطات</option>
                  <option value="technical">فنی</option>
                  <option value="volunteer">داوطلبی</option>
                  <option value="coordination">هماهنگی</option>
                  <option value="documentation">مستندسازی</option>
                  <option value="general">عمومی</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">وضعیت فعلی</label>
                <select
                  value={status}
                  onChange={(e) => setValue("status", e.target.value)}
                  className="block w-full rounded-md border-slate-300 bg-white py-1.5 pl-3 pr-8 text-[12px] focus:border-[#007acc] focus:ring-[#007acc]"
                >
                  <option value="active">فعال (Active)</option>
                  <option value="paused">متوقف شده (Paused)</option>
                  <option value="completed">تکمیل شده (Completed)</option>
                  <option value="disbanded">منحل شده (Disbanded)</option>
                </select>
              </div>

              {/* Max Members */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  ظرفیت اعضا (Max)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("maxMembers")}
                    className="block w-full rounded-md border-slate-300 bg-white py-1.5 px-3 text-[12px] focus:border-[#007acc] focus:ring-[#007acc]"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserGroupIcon className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                {errors.maxMembers && (
                  <span className="text-[10px] text-red-500 mt-1 block font-mono">
                    {errors.maxMembers.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Tags & System Info */}
          <div className="p-5 bg-slate-50/30 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                <HashtagIcon className="w-3 h-3" />
                برچسب‌ها
              </label>
              <input
                type="text"
                {...register("tags")}
                className="block w-full rounded-md border-slate-300 bg-white px-3 py-2 text-[12px] focus:border-[#007acc] focus:ring-[#007acc]"
                placeholder="فوری، تخصصی، ..."
              />
              <p className="mt-1 text-[10px] text-slate-400">جداکننده: کاما (,)</p>
            </div>

            {/* Read Only Info Panel */}
            {selectedTeam && (
              <div className="border border-slate-200 rounded bg-white p-3">
                <h3 className="text-[11px] font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1">
                  SYSTEM_METADATA
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                  <div className="text-slate-500">تعداد اعضا:</div>
                  <div className="font-mono text-slate-800 text-left">
                    {selectedTeam.members?.length || 0} / {watch("maxMembers") || "∞"}
                  </div>

                  <div className="text-slate-500">تاریخ ایجاد:</div>
                  <div className="font-mono text-slate-800 text-left flex items-center justify-end gap-1">
                    {new Date(selectedTeam.createdAt).toLocaleDateString("fa-IR")}
                    <CalendarIcon className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
            <Link
              to="/dashboard/teams"
              className="text-[12px] text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              انصراف و بازگشت
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                flex items-center gap-2 px-4 py-2 rounded text-[12px] font-medium text-white shadow-sm transition-all
                ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#007acc] hover:bg-[#0062a3] hover:shadow"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>در حال پردازش...</span>
                </>
              ) : (
                <>
                  <span>ذخیره تغییرات</span>
                  <ArrowRightIcon className="w-3 h-3 rotate-180" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;
