import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPushTokenStats, getAllPushTokens } from "../../features/notificationsSlice";
import {
  Smartphone,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Monitor,
  Tablet,
} from "lucide-react";

const PushTokens = () => {
  const dispatch = useDispatch();
  const { pushTokenStats, allPushTokens, loading, pagination } = useSelector((state) => state.notifications);

  const [filters, setFilters] = useState({
    platform: "",
    isActive: "",
    userId: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadTokens();
  }, [filters.page, filters.platform, filters.isActive, filters.userId]);

  const loadStats = async () => {
    try {
      await dispatch(getPushTokenStats()).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  const loadTokens = async () => {
    try {
      await dispatch(getAllPushTokens(filters)).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری توکن‌ها:", error);
    }
  };

  const stats = useMemo(() => {
    if (!pushTokenStats) return [];
    return [
      {
        label: "کل توکن‌ها",
        value: pushTokenStats.totalTokens || 0,
        icon: Smartphone,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "توکن‌های فعال",
        value: pushTokenStats.activeTokens || 0,
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        label: "توکن‌های غیرفعال",
        value: pushTokenStats.inactiveTokens || 0,
        icon: XCircle,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        label: "کاربران با بیشترین دستگاه",
        value: pushTokenStats.usersWithMostDevices?.length || 0,
        icon: Users,
        color: "text-violet-600",
        bg: "bg-violet-50",
      },
    ];
  }, [pushTokenStats]);

  const platformDistribution = useMemo(() => {
    return pushTokenStats?.byPlatform || [];
  }, [pushTokenStats]);

  const usersWithMostDevices = useMemo(() => {
    return pushTokenStats?.usersWithMostDevices || [];
  }, [pushTokenStats]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleRefresh = () => {
    loadStats();
    loadTokens();
  };

  function getPlatformLabel(platform) {
    const platformMap = {
      ios: "iOS",
      android: "Android",
      web: "Web",
    };
    return platformMap[platform] || platform;
  }

  function getPlatformColor(platform) {
    const colorMap = {
      ios: "#6b7280",
      android: "#10b981",
      web: "#3b82f6",
    };
    return colorMap[platform] || "#64748b";
  }

  function getPlatformIcon(platform) {
    const iconMap = {
      ios: Smartphone,
      android: Smartphone,
      web: Monitor,
    };
    return iconMap[platform] || Tablet;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">مدیریت Push Tokens شبکه</h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          مدیریت و نظارت بر توکن‌های Push Notification کل شبکه اجتماعی
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-md border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">{stat.label}</div>
                <div className="font-bold text-2xl text-slate-900">
                  {stat.value.toLocaleString("fa-IR")}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-md flex items-center justify-center ${stat.bg}`}>
                <Icon size={20} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Platform Distribution */}
        <div className="bg-white rounded-md border border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <BarChart3 size={16} className="text-[#007acc]" />
            <h2 className="text-sm font-semibold text-slate-800">توزیع پلتفرم‌ها</h2>
          </div>
          <div className="p-4 flex-1">
            {platformDistribution.length > 0 ? (
              <div className="space-y-2">
                {platformDistribution.map((item) => {
                  const PlatformIcon = getPlatformIcon(item._id);
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PlatformIcon size={16} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-700">{getPlatformLabel(item._id)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-bold"
                          style={{
                            backgroundColor: `${getPlatformColor(item._id)}15`,
                            color: getPlatformColor(item._id),
                          }}
                        >
                          {item.count.toLocaleString("fa-IR")}
                        </span>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-medium">
                          {item.active.toLocaleString("fa-IR")} فعال
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">داده‌ای یافت نشد</div>
            )}
          </div>
        </div>

        {/* Users with Most Devices */}
        <div className="bg-white rounded-md border border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Users size={16} className="text-violet-600" />
            <h2 className="text-sm font-semibold text-slate-800">کاربران با بیشترین دستگاه</h2>
          </div>
          <div className="p-4 flex-1">
            {usersWithMostDevices.length > 0 ? (
              <div className="space-y-2">
                {usersWithMostDevices.slice(0, 5).map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold text-white
                          ${
                            index === 0
                              ? "bg-amber-400"
                              : index === 1
                              ? "bg-slate-400"
                              : index === 2
                              ? "bg-orange-400"
                              : "bg-slate-300"
                          }
                        `}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded text-[11px] font-bold">
                        {user.deviceCount.toLocaleString("fa-IR")} دستگاه
                      </span>
                      {user.activeDevices > 0 && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[10px] font-medium">
                          {user.activeDevices.toLocaleString("fa-IR")} فعال
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">داده‌ای یافت نشد</div>
            )}
          </div>
        </div>
      </div>

      {/* All Tokens Table */}
      <div className="bg-white rounded-md border border-slate-200">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter size={16} className="text-slate-400" />
            <select
              value={filters.platform}
              onChange={(e) => handleFilterChange("platform", e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
            >
              <option value="">همه پلتفرم‌ها</option>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
              <option value="web">Web</option>
            </select>

            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange("isActive", e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="true">فعال</option>
              <option value="false">غیرفعال</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 bg-[#007acc] text-white rounded text-xs font-medium hover:bg-[#0062a3] transition-colors
              ${loading ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            بارگذاری مجدد
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#007acc] rounded-full animate-spin"></div>
            </div>
          ) : allPushTokens.length > 0 ? (
            <table className="w-full border-collapse text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">کاربر</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">دستگاه</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">پلتفرم</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">وضعیت</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">آخرین استفاده</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPushTokens.map((token) => {
                  const PlatformIcon = getPlatformIcon(token.platform);
                  return (
                    <tr key={token._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-3">
                        {token.user ? (
                          <div>
                            <div className="text-xs font-medium text-slate-800 group-hover:text-[#007acc] transition-colors">
                              {token.user.name || "نامشخص"}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{token.user.email || ""}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">حذف شده</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-700">
                          {token.deviceId || "دستگاه بدون نام"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono truncate max-w-[150px]">
                          {token.token.substring(0, 20)}...
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <PlatformIcon size={14} className="text-slate-500" />
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border"
                            style={{
                              backgroundColor: `${getPlatformColor(token.platform)}08`,
                              color: getPlatformColor(token.platform),
                              borderColor: `${getPlatformColor(token.platform)}20`,
                            }}
                          >
                            {getPlatformLabel(token.platform)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {token.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-medium">
                            <CheckCircle size={10} />
                            فعال
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            <XCircle size={10} />
                            غیرفعال
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">
                        {token.lastUsedAt ? new Date(token.lastUsedAt).toLocaleDateString("fa-IR") : "-"}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">
                        {new Date(token.createdAt).toLocaleDateString("fa-IR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Smartphone size={32} className="mx-auto text-slate-300 mb-3" />
              <div className="text-sm text-slate-500">هیچ توکنی یافت نشد</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="text-[11px] text-slate-500">
              نمایش {((pagination.page - 1) * pagination.limit + 1).toLocaleString("fa-IR")} تا{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total).toLocaleString("fa-IR")} از{" "}
              {pagination.total.toLocaleString("fa-IR")} مورد
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
                قبلی
              </button>

              <div className="text-[11px] font-medium text-slate-700">
                صفحه {pagination.page.toLocaleString("fa-IR")} از{" "}
                {pagination.totalPages.toLocaleString("fa-IR")}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                بعدی
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PushTokens;
