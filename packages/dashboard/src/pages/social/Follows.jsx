import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkFollowStats, getAllFollows } from "../../features/socialSlice";
import {
  Users,
  UserCheck,
  Heart,
  TrendingUp,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const Follows = () => {
  const dispatch = useDispatch();
  const { networkFollowStats, allFollows, loading, pagination } = useSelector((state) => state.social);

  const [activeTab, setActiveTab] = useState("users");
  const [filters, setFilters] = useState({
    followType: "",
    userId: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadFollows();
  }, [filters.page, filters.followType, filters.userId]);

  const loadStats = async () => {
    try {
      await dispatch(getNetworkFollowStats()).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  const loadFollows = async () => {
    try {
      await dispatch(getAllFollows(filters)).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری دنبال‌کنندگان:", error);
    }
  };

  const stats = useMemo(() => {
    if (!networkFollowStats) return [];
    return [
      {
        label: "کل دنبال‌کنندگان",
        value: networkFollowStats.totalFollows || 0,
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "دنبال‌کنندگان کاربران",
        value: networkFollowStats.totalUserFollows || 0,
        icon: UserCheck,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        label: "دنبال‌کنندگان نیازها",
        value: networkFollowStats.totalNeedFollows || 0,
        icon: Heart,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        label: "رشد ۳۰ روز اخیر",
        value: networkFollowStats.recentFollows || 0,
        icon: TrendingUp,
        color: "text-violet-600",
        bg: "bg-violet-50",
      },
    ];
  }, [networkFollowStats]);

  const topFollowedUsers = useMemo(() => {
    return networkFollowStats?.topFollowedUsers || [];
  }, [networkFollowStats]);

  const topFollowedNeeds = useMemo(() => {
    return networkFollowStats?.topFollowedNeeds || [];
  }, [networkFollowStats]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleRefresh = () => {
    loadStats();
    loadFollows();
  };

  // کامپوننت دکمه تب برای تمیزی کد
  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 text-[12px] font-medium transition-all border-b-2 ${
        active === id
          ? "border-[#007acc] text-[#007acc]"
          : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      {/* Header Section */}
      <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">مدیریت شبکه</h1>
          <p className="mt-1 text-[12px] text-slate-500 font-medium">
            بررسی و تحلیل وضعیت دنبال‌کنندگان و تعاملات شبکه
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 hover:text-[#007acc] transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>بروزرسانی داده‌ها</span>
        </button>
      </div>

      {/* Metrics Grid - Strict 12 Column */}
      <div className="grid grid-cols-12 gap-2 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-md border border-slate-300 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold font-mono text-slate-800 tracking-tight">
                    {stat.value.toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${stat.bg}`}>
                  <Icon size={16} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="rounded-md border border-slate-300 bg-white shadow-sm overflow-hidden">
        {/* Tabs Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-2">
          <div className="flex gap-1">
            <TabButton id="users" label="کاربران برتر" active={activeTab} onClick={setActiveTab} />
            <TabButton id="needs" label="نیازهای برتر" active={activeTab} onClick={setActiveTab} />
            <TabButton id="all" label="همه تراکنش‌ها" active={activeTab} onClick={setActiveTab} />
          </div>

          {/* Filter Controls (Visible only on 'all' tab) */}
          {activeTab === "all" && (
            <div className="flex items-center gap-2 py-1 pr-4">
              <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1">
                <Filter size={12} className="text-slate-400" />
                <select
                  value={filters.followType}
                  onChange={(e) => handleFilterChange("followType", e.target.value)}
                  className="border-none bg-transparent p-0 text-[11px] font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="">همه انواع</option>
                  <option value="user">کاربران</option>
                  <option value="need">نیازها</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content Rendering */}
        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#007acc]"></div>
            </div>
          )}

          {/* TAB: Top Users */}
          {activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">رتبه</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">کاربر</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">ایمیل</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">
                      دنبال‌کننده
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topFollowedUsers.length > 0 ? (
                    topFollowedUsers.map((user, index) => (
                      <tr key={user.userId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-2.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[11px] font-bold text-slate-600 font-mono">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[12px] font-medium text-slate-800">{user.name}</td>
                        <td className="px-4 py-2.5 text-[12px] text-slate-500 font-mono">{user.email}</td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-100">
                            {user.followerCount.toLocaleString("fa-IR")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-[12px] text-slate-400">
                        داده‌ای یافت نشد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: Top Needs */}
          {activeTab === "needs" && (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">رتبه</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">
                      عنوان نیاز
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">وضعیت</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">
                      دنبال‌کننده
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topFollowedNeeds.length > 0 ? (
                    topFollowedNeeds.map((need, index) => (
                      <tr key={need.needId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-2.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[11px] font-bold text-slate-600 font-mono">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[12px] font-medium text-slate-800">{need.title}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                              need.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {need.status === "active" ? "فعال" : need.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-100">
                            {need.followerCount.toLocaleString("fa-IR")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-[12px] text-slate-400">
                        داده‌ای یافت نشد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: All Follows */}
          {activeTab === "all" && (
            <div className="flex flex-col h-full">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">
                        دنبال‌کننده
                      </th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">
                        دنبال‌شونده
                      </th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">نوع</th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">تاریخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allFollows.length > 0 ? (
                      allFollows.map((follow) => (
                        <tr key={follow._id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-4 py-2.5">
                            <div className="flex flex-col">
                              <span className="text-[12px] font-medium text-slate-800">
                                {follow.follower?.name || "نامشخص"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {follow.follower?.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            {follow.followType === "user" ? (
                              <div className="flex flex-col">
                                <span className="text-[12px] font-medium text-slate-800">
                                  {follow.following?.name || "نامشخص"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {follow.following?.email}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[12px] font-medium text-slate-800">
                                {follow.followedNeed?.title || "نامشخص"}
                                <ArrowUpRight
                                  size={12}
                                  className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                                follow.followType === "user"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              }`}
                            >
                              {follow.followType === "user" ? "کاربر" : "نیاز"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-[11px] text-slate-500 font-mono">
                            {new Date(follow.createdAt).toLocaleDateString("fa-IR")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-[12px] text-slate-400">
                          هیچ موردی یافت نشد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-[11px] text-slate-500">
                    نمایش{" "}
                    <span className="font-medium text-slate-700">
                      {((pagination.page - 1) * pagination.limit + 1).toLocaleString("fa-IR")}
                    </span>{" "}
                    تا{" "}
                    <span className="font-medium text-slate-700">
                      {Math.min(pagination.page * pagination.limit, pagination.total).toLocaleString("fa-IR")}
                    </span>{" "}
                    از{" "}
                    <span className="font-medium text-slate-700">
                      {pagination.total.toLocaleString("fa-IR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="flex items-center justify-center rounded border border-slate-300 bg-white p-1 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={14} />
                    </button>
                    <span className="min-w-[24px] text-center text-[11px] font-medium text-slate-700">
                      {pagination.page.toLocaleString("fa-IR")}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="flex items-center justify-center rounded border border-slate-300 bg-white p-1 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Follows;
