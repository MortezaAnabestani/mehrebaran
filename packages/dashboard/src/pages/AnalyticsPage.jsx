import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  UsersIcon,
  HeartIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

// --- UI COMPONENTS ---

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-3 border-b border-slate-200 pb-2">
    <h3 className="text-[13px] font-bold text-slate-800">{title}</h3>
    {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
  </div>
);

const StatBox = ({ label, value, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    amber: "text-amber-600",
    purple: "text-purple-600",
    slate: "text-slate-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-col justify-between h-full">
      <span className="text-[11px] font-medium text-slate-500 mb-1">{label}</span>
      <div className="flex items-end justify-between">
        <span className={`text-lg font-mono font-bold ${colorClasses[color]}`}>
          {typeof value === "number" ? value.toLocaleString("fa-IR") : value || "0"}
        </span>
        {trend && (
          <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

// Minimal Horizontal Bar Chart
const MinimalBarChart = ({ data, dataKey, xKey, title, color = "bg-blue-600" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center border border-dashed border-slate-200 rounded-md">
        <span className="text-[11px] text-slate-400">داده‌ای موجود نیست</span>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item[dataKey] || 0));

  return (
    <div className="bg-white border border-slate-200 rounded-md p-3 h-full">
      {title && <div className="text-[12px] font-bold text-slate-700 mb-3">{title}</div>}
      <div className="space-y-2">
        {data.map((item, index) => {
          const value = item[dataKey] || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <div key={index} className="flex items-center gap-2 text-[11px]">
              <div className="w-20 text-slate-500 truncate text-right pl-2" title={item[xKey]}>
                {item[xKey] || "-"}
              </div>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-10 text-left font-mono text-slate-700">{value.toLocaleString("fa-IR")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Histogram / Vertical Bar Chart
const HistogramChart = ({ data, dataKey, xKey, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center border border-dashed border-slate-200 rounded-md">
        <span className="text-[11px] text-slate-400">داده‌ای موجود نیست</span>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item[dataKey] || 0));

  return (
    <div className="bg-white border border-slate-200 rounded-md p-3 h-full flex flex-col">
      {title && <div className="text-[12px] font-bold text-slate-700 mb-3">{title}</div>}

      <div className="flex-1 flex items-end gap-1 pt-4 pb-2 min-h-[120px]">
        {data.map((item, index) => {
          const value = item[dataKey] || 0;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded transition-opacity z-10 font-mono">
                {value.toLocaleString("fa-IR")}
              </div>

              <div
                className="w-full bg-blue-500/80 hover:bg-blue-600 rounded-t-sm transition-all duration-300 min-h-[2px]"
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* X Axis Labels (Simplified) */}
      <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1 mt-1">
        <span>{data[0]?.[xKey]}</span>
        <span>{data[Math.floor(data.length / 2)]?.[xKey]}</span>
        <span>{data[data.length - 1]?.[xKey]}</span>
      </div>
    </div>
  );
};

// --- TABS CONTENT ---

const ContentAnalytics = ({ data }) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-12 gap-2">
      {/* Top Stats Row */}
      <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
        <StatBox label="کل نیازها" value={data.needs.totalNeeds || 0} color="blue" />
        <StatBox label="کل استوری‌ها" value={data.stories.totalStories || 0} color="purple" />
        <StatBox label="نظرات ثبت شده" value={data.comments.total || 0} color="amber" />
        <StatBox label="دسته‌بندی‌ها" value={data.needs.byCategory?.length || 0} color="slate" />
      </div>

      {/* Charts Row 1 */}
      <div className="col-span-12 md:col-span-4">
        <MinimalBarChart
          data={data.needs.byStatus}
          dataKey="count"
          xKey="status"
          title="وضعیت نیازها"
          color="bg-blue-500"
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <MinimalBarChart
          data={data.needs.byUrgency}
          dataKey="count"
          xKey="urgency"
          title="فوریت نیازها"
          color="bg-amber-500"
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <MinimalBarChart
          data={data.needs.byCategory}
          dataKey="count"
          xKey="category"
          title="دسته‌بندی‌ها"
          color="bg-emerald-500"
        />
      </div>

      {/* Timeline Row */}
      <div className="col-span-12 md:col-span-8">
        <HistogramChart
          data={data.needs.timeline}
          dataKey="count"
          xKey="date"
          title="روند ثبت نیازها (Timeline)"
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <div className="bg-white border border-slate-200 rounded-md p-3 h-full">
          <div className="text-[12px] font-bold text-slate-700 mb-3">وضعیت نظرات</div>
          <div className="space-y-2">
            <StatBox label="تایید شده" value={data.comments.approved} color="green" />
            <StatBox label="در انتظار" value={data.comments.pending} color="amber" />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserAnalytics = ({ data }) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-12 gap-2">
      {/* Growth Charts */}
      <div className="col-span-12 md:col-span-6">
        <HistogramChart data={data.growth} dataKey="count" xKey="date" title="رشد کاربران جدید" />
      </div>
      <div className="col-span-12 md:col-span-6">
        <HistogramChart data={data.activeUsers} dataKey="count" xKey="date" title="کاربران فعال روزانه" />
      </div>

      {/* Role Distribution */}
      <div className="col-span-12 md:col-span-4">
        <MinimalBarChart
          data={data.byRole}
          dataKey="count"
          xKey="role"
          title="توزیع نقش‌ها"
          color="bg-purple-500"
        />
      </div>

      {/* Top Contributors Table */}
      <div className="col-span-12 md:col-span-8">
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-[12px] font-bold text-slate-700">کاربران برتر (بیشترین فعالیت)</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-[11px] text-slate-500 font-medium">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">کاربر</th>
                  <th className="px-3 py-2">نام کاربری</th>
                  <th className="px-3 py-2 text-left">تعداد نیاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.topContributors?.map((user, index) => (
                  <tr key={user.userId} className="text-[11px] hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 py-2 font-mono text-slate-400">{index + 1}</td>
                    <td className="px-3 py-2 font-medium text-slate-700">{user.fullName || "ناشناس"}</td>
                    <td className="px-3 py-2 text-slate-500 font-mono">@{user.username}</td>
                    <td className="px-3 py-2 text-left font-mono font-bold text-blue-600">
                      {user.needsCount.toLocaleString("fa-IR")}
                    </td>
                  </tr>
                ))}
                {(!data.topContributors || data.topContributors.length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-3 py-4 text-center text-[11px] text-slate-400">
                      کاربری یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const EngagementAnalytics = ({ data }) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-12 gap-2">
      {/* Overview Stats */}
      <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatBox label="کل فالوها" value={data.follows.total} color="blue" />
        <StatBox label="مشاهده استوری" value={data.stories.totalViews} color="green" />
        <StatBox label="نرخ تعامل" value={`%${data.stories.engagementRate}`} color="amber" />
        <StatBox label="واکنش‌ها" value={data.stories.totalReactions} color="purple" />
      </div>

      {/* Follows Timeline */}
      <div className="col-span-12 md:col-span-8">
        <HistogramChart data={data.follows.timeline} dataKey="count" xKey="date" title="روند فالو کردن" />
      </div>

      {/* Top Followed */}
      <div className="col-span-12 md:col-span-4">
        <MinimalBarChart
          data={data.follows.topFollowed}
          dataKey="followersCount"
          xKey="username"
          title="بیشترین دنبال‌کننده"
          color="bg-blue-500"
        />
      </div>

      {/* Detailed Stats Grid */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-white border border-slate-200 rounded-md p-3">
          <div className="text-[12px] font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
            آمار استوری
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">میانگین مشاهده</span>
              <span className="font-mono font-medium">{data.stories.avgViews}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">میانگین واکنش</span>
              <span className="font-mono font-medium">{data.stories.avgReactions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3">
          <div className="text-[12px] font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
            آمار نیازها
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">کل مشاهدات</span>
              <span className="font-mono font-medium">{data.needs.totalViews}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">میانگین مشاهده</span>
              <span className="font-mono font-medium">{data.needs.avgViews}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3">
          <div className="text-[12px] font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
            آمار نظرات
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">کل نظرات</span>
              <span className="font-mono font-medium">{data.comments.totalComments}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">نرخ تایید</span>
              <span className="font-mono font-medium text-emerald-600">%{data.comments.approvalRate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [timeRange, setTimeRange] = useState("30");
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    content: null,
    users: null,
    engagement: null,
  });

  useEffect(() => {
    fetchAllAnalytics();
  }, [timeRange]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const [contentRes, usersRes, engagementRes] = await Promise.all([
        api.get(`/admin/analytics/content?days=${timeRange}`),
        api.get(`/admin/analytics/users?days=${timeRange}`),
        api.get(`/admin/analytics/engagement?days=${timeRange}`),
      ]);

      setAnalytics({
        content: contentRes.data.data,
        users: usersRes.data.data,
        engagement: engagementRes.data.data,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "content", label: "محتوا و نیازها", icon: ChartBarIcon },
    { id: "users", label: "کاربران", icon: UsersIcon },
    { id: "engagement", label: "تعاملات", icon: HeartIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">داشبورد آنالیز</h1>
          <p className="text-[12px] text-slate-500 mt-1">گزارش جامع عملکرد سیستم و رفتار کاربران</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarDaysIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-3 pr-9 py-2 bg-white border border-slate-300 rounded-md text-[12px] font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow appearance-none w-40"
            >
              <option value="7">۷ روز اخیر</option>
              <option value="30">۳۰ روز اخیر</option>
              <option value="90">۹۰ روز اخیر</option>
              <option value="180">۱۸۰ روز اخیر</option>
            </select>
          </div>

          <button
            onClick={fetchAllAnalytics}
            disabled={loading}
            className="flex items-center justify-center w-9 h-9 bg-white border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all disabled:opacity-50"
            title="به‌روزرسانی"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-[12px] cursor-pointer font-medium transition-all relative ${
                  isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-[11px] text-slate-400 animate-pulse">در حال دریافت داده‌ها...</span>
            </div>
          ) : (
            <div className="animate-fade-in">
              {activeTab === "content" && <ContentAnalytics data={analytics.content} />}
              {activeTab === "users" && <UserAnalytics data={analytics.users} />}
              {activeTab === "engagement" && <EngagementAnalytics data={analytics.engagement} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
