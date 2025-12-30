import { useState, useEffect } from "react";
import api from "../services/api";

// --- UI COMPONENTS (Functional Design System) ---

const Badge = ({ children, color = "slate", icon: Icon }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-blue-50 text-[#007acc] border-blue-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    red: "bg-rose-50 text-rose-600 border-rose-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
        colors[color] || colors.slate
      }`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

const StatMetric = ({ label, value, trend, icon: Icon }) => (
  <div className="flex flex-col p-3 border border-slate-200 bg-white rounded-md">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      {Icon && <Icon className="w-4 h-4 text-slate-400" />}
    </div>
    <div className="flex items-end gap-2">
      <span className="text-xl font-semibold text-slate-800 tracking-tight font-mono">{value}</span>
      {trend && (
        <span className="text-[10px] font-mono text-emerald-600 mb-1 bg-emerald-50 px-1 rounded border border-emerald-100">
          {trend}
        </span>
      )}
    </div>
  </div>
);

// --- ICONS ---
const Icons = {
  Refresh: (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  ),
  Download: (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  ),
  Filter: (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
      />
    </svg>
  ),
  ChevronLeft: (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  ),
  ChevronRight: (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  ),
  Activity: (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  ),
};

// --- LOG ROW COMPONENT (Replaces Timeline Item) ---
const ActivityLogRow = ({ activity }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString("fa-IR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "need":
        return { color: "blue", label: "نیاز", code: "REQ" };
      case "donation":
        return { color: "green", label: "کمک مالی", code: "DON" };
      case "comment":
        return { color: "slate", label: "نظر", code: "CMT" };
      case "story":
        return { color: "purple", label: "استوری", code: "STR" };
      case "badge":
        return { color: "amber", label: "نشان", code: "BDG" };
      case "follow":
        return { color: "slate", label: "فالو", code: "FLW" };
      default:
        return { color: "slate", label: "سایر", code: "MSC" };
    }
  };

  const typeConfig = getTypeConfig(activity.activityType);

  const renderDetails = () => {
    const { details, activityType } = activity;
    if (activityType === "donation") {
      return (
        <span className="font-mono text-emerald-600">
          {details.amount?.toLocaleString("fa-IR")} <span className="text-slate-400 text-[10px]">IRR</span>
        </span>
      );
    }
    if (activityType === "need") return details.title;
    if (activityType === "badge") return `نشان: ${details.badgeName}`;
    if (activityType === "comment")
      return <span className="italic text-slate-500">"{details.content?.substring(0, 30)}..."</span>;
    return activity.description || "-";
  };

  return (
    <div className="group flex items-center gap-3 p-2 border-b border-slate-100 hover:bg-slate-50 transition-colors text-[12px]">
      {/* Time Column */}
      <div className="w-24 shrink-0 font-mono text-slate-400 text-[11px] border-l border-slate-100 pl-2">
        {formatDate(activity.timestamp)}
      </div>

      {/* Type Badge */}
      <div className="w-20 shrink-0">
        <Badge color={typeConfig.color}>{typeConfig.code}</Badge>
      </div>

      {/* User */}
      <div className="w-32 shrink-0 font-medium text-slate-700 truncate">
        {activity.user?.fullName || "کاربر ناشناس"}
      </div>

      {/* Details (Main Content) */}
      <div className="flex-1 text-slate-600 truncate">{renderDetails()}</div>

      {/* Status/Meta */}
      <div className="w-24 shrink-0 text-right">
        {activity.details?.status && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border ${
              activity.details.status === "completed"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            {activity.details.status}
          </span>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const ActivityFeedPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    activityType: "",
    days: 7,
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 20,
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // Mock API call simulation if api service fails or for demo
      // Replace with actual api.get call
      const params = { ...filters };
      const response = await api.get(`/admin/activity-feed`, { params });

      if (response.data.success) {
        setActivities(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      // Fallback for demo visualization
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      // Fetch all activities without pagination for export
      const params = {
        activityType: filters.activityType,
        days: filters.days,
        limit: 10000, // Get all records
      };

      const response = await api.get(`/admin/activity-feed`, { params });

      if (!response.data.success || !response.data.data) {
        alert("خطا در دریافت داده‌ها");
        return;
      }

      const allActivities = response.data.data;

      // Convert to Persian date helper
      const toPersianDate = (date) => {
        return new Date(date).toLocaleDateString("fa-IR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      // Create CSV content
      const headers = ["زمان", "نوع فعالیت", "کاربر", "توضیحات", "جزئیات"];
      const rows = allActivities.map((activity) => {
        const activityTypeLabel = {
          need: "نیاز",
          donation: "کمک مالی",
          comment: "نظر",
          story: "استوری",
          badge: "نشان",
          follow: "فالو",
        }[activity.activityType] || "سایر";

        const userName = activity.user?.fullName || activity.user?.username || "کاربر ناشناس";
        const description = activity.description || "";

        let details = "";
        if (activity.details) {
          if (activity.activityType === "donation") {
            details = `${activity.details.amount?.toLocaleString("fa-IR")} تومان`;
          } else if (activity.activityType === "need") {
            details = activity.details.title || "";
          } else if (activity.activityType === "badge") {
            details = activity.details.badgeName || "";
          } else if (activity.activityType === "comment") {
            details = activity.details.content || "";
          }
        }

        return [
          toPersianDate(activity.timestamp),
          activityTypeLabel,
          userName,
          description,
          details,
        ];
      });

      // Convert to CSV format
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      // Add BOM for UTF-8 to support Persian characters in Excel
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

      // Create download link
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `activity-feed-${new Date().getTime()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("خطا در دریافت گزارش CSV");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto space-y-4">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Icons.Activity className="w-5 h-5 text-[#007acc]" />
              فید فعالیت‌های سیستم
            </h1>
            <p className="text-[11px] text-slate-500 font-mono mt-1">SYSTEM_LOGS // REALTIME_MONITORING</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchActivities}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[12px] font-medium rounded-md hover:border-[#007acc] hover:text-[#007acc] transition-colors"
            >
              <Icons.Refresh className="w-3.5 h-3.5" />
              بروزرسانی
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007acc] text-white text-[12px] font-medium rounded-md hover:bg-[#0062a3] transition-colors shadow-sm"
            >
              <Icons.Download className="w-3.5 h-3.5" />
              دریافت گزارش CSV
            </button>
          </div>
        </div>

        {/* Metrics Grid (High Density) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <StatMetric
            label="کل رویدادها"
            value={pagination.total.toLocaleString()}
            trend="+12%"
            icon={Icons.Activity}
          />
          <StatMetric label="تراکنش‌های مالی" value="452" trend="+5.2%" />
          <StatMetric label="کاربران فعال" value="1,205" trend="-1.1%" />
          <StatMetric label="نرخ خطا" value="0.02%" />
        </div>

        {/* Main Content Area: Filters + Data Grid */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          {/* Toolbar / Filters */}
          <div className="flex flex-wrap items-center gap-3 p-3 border-b border-slate-200 bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-500">
              <Icons.Filter className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase">فیلترها:</span>
            </div>

            <select
              className="h-8 pl-2 pr-8 text-[12px] bg-white border border-slate-200 rounded-md focus:border-[#007acc] focus:ring-0 text-slate-600"
              value={filters.activityType}
              onChange={(e) => setFilters({ ...filters, activityType: e.target.value, page: 1 })}
            >
              <option value="">همه فعالیت‌ها</option>
              <option value="need">نیازها (REQ)</option>
              <option value="donation">تراکنش‌ها (DON)</option>
              <option value="comment">نظرات (CMT)</option>
              <option value="badge">نشان‌ها (BDG)</option>
            </select>

            <select
              className="h-8 pl-2 pr-8 text-[12px] bg-white border border-slate-200 rounded-md focus:border-[#007acc] focus:ring-0 text-slate-600"
              value={filters.days}
              onChange={(e) => setFilters({ ...filters, days: e.target.value, page: 1 })}
            >
              <option value="1">24 ساعت اخیر</option>
              <option value="7">7 روز اخیر</option>
              <option value="30">30 روز اخیر</option>
            </select>

            <div className="mr-auto flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">
                PAGE {pagination.page} OF {pagination.totalPages}
              </span>
            </div>
          </div>

          {/* Data Header */}
          <div className="flex items-center gap-3 px-2 py-2 bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-24 pl-2">زمان</div>
            <div className="w-20">نوع</div>
            <div className="w-32">کاربر</div>
            <div className="flex-1">جزئیات</div>
            <div className="w-24 text-right">وضعیت</div>
          </div>

          {/* Data Rows */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="p-8 space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 rounded animate-pulse w-full" />
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Icons.Activity className="w-8 h-8 mb-2 opacity-20" />
                <span className="text-[12px]">داده‌ای برای نمایش وجود ندارد</span>
              </div>
            ) : (
              activities.map((activity, index) => <ActivityLogRow key={index} activity={activity} />)
            )}
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between p-3 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-1">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-500 hover:border-[#007acc] hover:text-[#007acc] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-500 hover:border-[#007acc] hover:text-[#007acc] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              نمایش {activities.length} از {pagination.total} رکورد
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeedPage;
