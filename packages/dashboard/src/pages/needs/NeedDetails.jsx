import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchNeedById } from "../../features/needsSlice";
import {
  ArrowRightIcon,
  PencilIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const NeedDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedNeed, loading } = useSelector((state) => state.needs);

  useEffect(() => {
    if (id) {
      dispatch(fetchNeedById(id));
    }
  }, [dispatch, id]);

  // Utility Functions
  const getStatusConfig = (status) => {
    const configs = {
      draft: { label: "پیش‌نویس", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
      pending: { label: "در انتظار", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
      under_review: {
        label: "در حال بررسی",
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      approved: {
        label: "تایید شده",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
      },
      in_progress: {
        label: "در حال انجام",
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
      },
      completed: {
        label: "تکمیل شده",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
      rejected: { label: "رد شده", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
      archived: {
        label: "آرشیو شده",
        bg: "bg-slate-100",
        text: "text-slate-500",
        border: "border-slate-200",
      },
      cancelled: { label: "لغو شده", bg: "bg-slate-50", text: "text-slate-400", border: "border-slate-200" },
    };
    return configs[status] || configs.draft;
  };

  const getUrgencyConfig = (level) => {
    const configs = {
      low: { label: "کم", color: "text-slate-600" },
      medium: { label: "متوسط", color: "text-amber-600" },
      high: { label: "زیاد", color: "text-orange-600" },
      critical: { label: "بحرانی", color: "text-red-600" },
    };
    return configs[level] || configs.low;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#007acc]"></div>
      </div>
    );
  }

  if (!selectedNeed) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-slate-300 rounded-md m-6 bg-slate-50">
        <DocumentTextIcon className="w-10 h-10 text-slate-400 mb-3" />
        <span className="text-slate-600 font-medium mb-4">نیازی یافت نشد</span>
        <Link to="/dashboard/needs" className="text-[#007acc] text-sm hover:underline">
          بازگشت به لیست نیازها
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(selectedNeed.status);
  const urgencyConfig = getUrgencyConfig(selectedNeed.urgencyLevel);

  return (
    <div className="max-w-screen-2xl mx-auto p-4 md:p-6 font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/needs"
            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                ID: {selectedNeed._id.slice(-6).toUpperCase()}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">{selectedNeed.title}</h1>
          </div>
        </div>

        <Link to={`/dashboard/needs/edit/${selectedNeed._id}`}>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium rounded-md transition-colors shadow-sm">
            <PencilIcon className="w-3.5 h-3.5" />
            <span>ویرایش نیاز</span>
          </button>
        </Link>
      </div>

      {/* KPI / Stats Bar - High Density */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-white p-3 flex flex-col">
          <span className="text-[11px] text-slate-500 font-medium mb-1 flex items-center gap-1">
            <UserGroupIcon className="w-3.5 h-3.5" /> حمایت‌کنندگان
          </span>
          <span className="text-lg font-semibold font-mono text-slate-800">
            {selectedNeed.supporters?.length || 0}
          </span>
        </div>
        <div className="bg-white p-3 flex flex-col">
          <span className="text-[11px] text-slate-500 font-medium mb-1 flex items-center gap-1">
            <ChartBarIcon className="w-3.5 h-3.5" /> پیشرفت کلی
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold font-mono text-emerald-600">
              {selectedNeed.overallProgress || 0}%
            </span>
            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${selectedNeed.overallProgress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 flex flex-col">
          <span className="text-[11px] text-slate-500 font-medium mb-1 flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5" /> تسک‌های تکمیل شده
          </span>
          <span className="text-lg font-semibold font-mono text-slate-800">
            {selectedNeed.completedTasksCount || 0}{" "}
            <span className="text-slate-400 text-sm">/ {selectedNeed.tasks?.length || 0}</span>
          </span>
        </div>
        <div className="bg-white p-3 flex flex-col">
          <span className="text-[11px] text-slate-500 font-medium mb-1 flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" /> مایلستون‌ها
          </span>
          <span className="text-lg font-semibold font-mono text-slate-800">
            {selectedNeed.milestones?.length || 0}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Description Panel */}
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <div className="bg-slate-50/50 px-4 py-2.5 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">توضیحات پروژه</h3>
            </div>
            <div className="p-5">
              <p className="text-[13px] leading-7 text-slate-600 whitespace-pre-wrap text-justify">
                {selectedNeed.description}
              </p>
            </div>
          </div>

          {/* Attachments Panel */}
          {selectedNeed.attachments && selectedNeed.attachments.length > 0 && (
            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
              <div className="bg-slate-50/50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-700">فایل‌های پیوست</h3>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md font-mono">
                  {selectedNeed.attachments.length}
                </span>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedNeed.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="group relative border border-slate-200 rounded-md overflow-hidden hover:border-[#007acc] transition-colors"
                  >
                    {attachment.fileType === "image" ? (
                      <div className="aspect-video bg-slate-100 relative">
                        <img
                          src={attachment.url}
                          alt={attachment.fileName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                        <DocumentTextIcon className="w-8 h-8 mb-1" />
                        <span className="text-[10px] uppercase font-mono">{attachment.fileType}</span>
                      </div>
                    )}
                    <div className="px-2 py-1.5 bg-white border-t border-slate-100">
                      <p className="text-[10px] truncate text-slate-600" title={attachment.fileName}>
                        {attachment.fileName || "بدون نام"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Metadata Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Property Sheet: Details */}
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <div className="bg-slate-50/50 px-4 py-2.5 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">اطلاعات تکمیلی</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11px] text-slate-500 font-medium">سطح فوریت</span>
                <span className={`text-xs font-semibold ${urgencyConfig.color}`}>{urgencyConfig.label}</span>
              </div>

              {selectedNeed.estimatedDuration && (
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11px] text-slate-500 font-medium">مدت زمان تخمینی</span>
                  <span className="text-xs text-slate-800 font-mono">{selectedNeed.estimatedDuration}</span>
                </div>
              )}

              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11px] text-slate-500 font-medium">تاریخ ایجاد</span>
                <span className="text-xs text-slate-800 font-mono">
                  {new Date(selectedNeed.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>

              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11px] text-slate-500 font-medium">آخرین بروزرسانی</span>
                <span className="text-xs text-slate-800 font-mono">
                  {new Date(selectedNeed.updatedAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            </div>
          </div>

          {/* Location Card */}
          {selectedNeed.location && (selectedNeed.location.address || selectedNeed.location.city) && (
            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
              <div className="bg-slate-50/50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700">موقعیت مکانی</h3>
              </div>
              <div className="p-4 space-y-3">
                {selectedNeed.location.locationName && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 mb-0.5">نام مکان</span>
                    <span className="text-xs text-slate-800 font-medium">
                      {selectedNeed.location.locationName}
                    </span>
                  </div>
                )}
                {selectedNeed.location.city && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 mb-0.5">شهر / استان</span>
                    <span className="text-xs text-slate-800">
                      {selectedNeed.location.city}، {selectedNeed.location.province}
                    </span>
                  </div>
                )}
                {selectedNeed.location.address && (
                  <div className="flex flex-col pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 mb-0.5">آدرس دقیق</span>
                    <span className="text-xs text-slate-600 leading-5">{selectedNeed.location.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags & Skills */}
          <div className="space-y-4">
            {selectedNeed.requiredSkills && selectedNeed.requiredSkills.length > 0 && (
              <div className="border border-slate-200 rounded-lg bg-white p-4">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  مهارت‌های مورد نیاز
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNeed.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedNeed.tags && selectedNeed.tags.length > 0 && (
              <div className="border border-slate-200 rounded-lg bg-white p-4">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">تگ‌ها</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNeed.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[11px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedDetails;
