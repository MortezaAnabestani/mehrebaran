import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkShareStats, getAllShares } from "../../features/socialSlice";
import {
  Share2,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Shares = () => {
  const dispatch = useDispatch();
  const { networkShareStats, allShares, loading, pagination } = useSelector((state) => state.social);

  const [filters, setFilters] = useState({
    platform: "",
    userId: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadShares();
  }, [filters.page, filters.platform, filters.userId]);

  const loadStats = async () => {
    try {
      await dispatch(getNetworkShareStats()).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  const loadShares = async () => {
    try {
      await dispatch(getAllShares(filters)).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری اشتراک‌گذاری‌ها:", error);
    }
  };

  const stats = useMemo(() => {
    if (!networkShareStats) return [];
    const topPlatform = networkShareStats.byPlatform?.[0];
    return [
      {
        label: "کل اشتراک‌گذاری‌ها",
        value: networkShareStats.totalShares || 0,
        icon: Share2,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "رشد ۳۰ روز اخیر",
        value: networkShareStats.recentShares || 0,
        icon: TrendingUp,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        label: "بیشترین پلتفرم",
        value: topPlatform ? getPlatformLabel(topPlatform._id) : "-",
        icon: BarChart3,
        color: "text-amber-600",
        bg: "bg-amber-50",
        isText: true,
      },
      {
        label: "تعداد اشتراک‌گذاران",
        value: networkShareStats.topSharers?.length || 0,
        icon: Users,
        color: "text-violet-600",
        bg: "bg-violet-50",
      },
    ];
  }, [networkShareStats]);

  const platformDistribution = useMemo(() => {
    return networkShareStats?.byPlatform || [];
  }, [networkShareStats]);

  const topSharers = useMemo(() => {
    return networkShareStats?.topSharers || [];
  }, [networkShareStats]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleRefresh = () => {
    loadStats();
    loadShares();
  };

  function getPlatformLabel(platform) {
    const platformMap = {
      telegram: "تلگرام",
      whatsapp: "واتساپ",
      twitter: "توییتر",
      linkedin: "لینکدین",
      facebook: "فیسبوک",
      instagram: "اینستاگرام",
      email: "ایمیل",
      copy_link: "کپی لینک",
      other: "سایر",
    };
    return platformMap[platform] || platform;
  }

  function getPlatformColor(platform) {
    const colorMap = {
      telegram: "#0088cc",
      whatsapp: "#25d366",
      twitter: "#1da1f2",
      linkedin: "#0077b5",
      facebook: "#1877f2",
      instagram: "#e4405f",
      email: "#ea4335",
      copy_link: "#64748b",
      other: "#94a3b8",
    };
    return colorMap[platform] || "#94a3b8";
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">مدیریت اشتراک‌گذاری‌ها</h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          مدیریت و نظارت بر اشتراک‌گذاری‌های شبکه اجتماعی
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
                <div className={`font-bold text-slate-900 ${stat.isText ? "text-lg" : "text-2xl"}`}>
                  {stat.isText ? stat.value : stat.value.toLocaleString("fa-IR")}
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
                {platformDistribution.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPlatformColor(item._id) }}
                      ></div>
                      <span className="text-xs font-medium text-slate-700">{getPlatformLabel(item._id)}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold"
                      style={{
                        backgroundColor: `${getPlatformColor(item._id)}15`,
                        color: getPlatformColor(item._id),
                      }}
                    >
                      {item.count.toLocaleString("fa-IR")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">داده‌ای یافت نشد</div>
            )}
          </div>
        </div>

        {/* Top Sharers */}
        <div className="bg-white rounded-md border border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Users size={16} className="text-violet-600" />
            <h2 className="text-sm font-semibold text-slate-800">بیشترین اشتراک‌گذاران</h2>
          </div>
          <div className="p-4 flex-1">
            {topSharers.length > 0 ? (
              <div className="space-y-2">
                {topSharers.slice(0, 5).map((user, index) => (
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
                    <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded text-[11px] font-bold">
                      {user.shareCount.toLocaleString("fa-IR")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">داده‌ای یافت نشد</div>
            )}
          </div>
        </div>
      </div>

      {/* All Shares Table */}
      <div className="bg-white rounded-md border border-slate-200">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-slate-400" />
            <select
              value={filters.platform}
              onChange={(e) => handleFilterChange("platform", e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
            >
              <option value="">همه پلتفرم‌ها</option>
              <option value="telegram">تلگرام</option>
              <option value="whatsapp">واتساپ</option>
              <option value="twitter">توییتر</option>
              <option value="linkedin">لینکدین</option>
              <option value="facebook">فیسبوک</option>
              <option value="instagram">اینستاگرام</option>
              <option value="email">ایمیل</option>
              <option value="copy_link">کپی لینک</option>
              <option value="other">سایر</option>
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
          ) : allShares.length > 0 ? (
            <table className="w-full border-collapse text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">کاربر</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">محتوا</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">پلتفرم</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">IP آدرس</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allShares.map((share) => (
                  <tr key={share._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3">
                      {share.user ? (
                        <div>
                          <div className="text-xs font-medium text-slate-800 group-hover:text-[#007acc] transition-colors">
                            {share.user.name || "نامشخص"}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{share.user.email || ""}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">مهمان</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-700 truncate max-w-[200px]">
                        {share.sharedItem?.title || "نامشخص"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border"
                        style={{
                          backgroundColor: `${getPlatformColor(share.platform)}08`,
                          color: getPlatformColor(share.platform),
                          borderColor: `${getPlatformColor(share.platform)}20`,
                        }}
                      >
                        {getPlatformLabel(share.platform)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-500">
                      {share.ipAddress || "-"}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      {new Date(share.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Share2 size={32} className="mx-auto text-slate-300 mb-3" />
              <div className="text-sm text-slate-500">هیچ اشتراک‌گذاری‌ای یافت نشد</div>
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

export default Shares;
