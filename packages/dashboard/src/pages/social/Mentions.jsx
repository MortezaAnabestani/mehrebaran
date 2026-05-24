import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkMentionStats, getAllMentions } from "../../features/socialSlice";
import {
  AtSign,
  Mail,
  MailOpen,
  TrendingUp,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  MoreHorizontal,
  Search,
} from "lucide-react";

const Mentions = () => {
  const dispatch = useDispatch();
  const { networkMentionStats, allMentions, loading, pagination } = useSelector((state) => state.social);

  const [filters, setFilters] = useState({
    isRead: "",
    context: "",
    userId: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadMentions();
  }, [filters.page, filters.isRead, filters.context, filters.userId]);

  const loadStats = async () => {
    try {
      await dispatch(getNetworkMentionStats()).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  const loadMentions = async () => {
    try {
      await dispatch(getAllMentions(filters)).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری منشن‌ها:", error);
    }
  };

  const stats = useMemo(() => {
    if (!networkMentionStats) return [];
    return [
      {
        label: "کل منشن‌ها",
        value: networkMentionStats.totalMentions || 0,
        icon: AtSign,
        color: "text-[#007acc]",
        bg: "bg-blue-50",
        border: "border-blue-100",
      },
      {
        label: "خوانده نشده",
        value: networkMentionStats.unreadMentions || 0,
        icon: Mail,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100",
      },
      {
        label: "خوانده شده",
        value: networkMentionStats.readMentions || 0,
        icon: MailOpen,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
      },
      {
        label: "رشد ۳۰ روزه",
        value: networkMentionStats.recentMentions || 0,
        icon: TrendingUp,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
      },
    ];
  }, [networkMentionStats]);

  const contextDistribution = useMemo(() => {
    return networkMentionStats?.byContext || [];
  }, [networkMentionStats]);

  const mostMentionedUsers = useMemo(() => {
    return networkMentionStats?.mostMentioned || [];
  }, [networkMentionStats]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleRefresh = () => {
    loadStats();
    loadMentions();
  };

  const getContextLabel = (context) => {
    const contextMap = {
      comment: "کامنت",
      message: "پیام",
      need_update: "نیاز به آپدیت",
      task_description: "توضیحات تسک",
      team_invitation: "دعوت تیمی",
      direct_message: "دایرکت",
    };
    return contextMap[context] || context;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800" dir="rtl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">مدیریت منشن‌ها</h1>
          <p className="text-[12px] text-slate-500 mt-1 font-medium">پایش و مدیریت تعاملات شبکه اجتماعی</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 hover:text-[#007acc] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>بروزرسانی</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-12 gap-3 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white border border-slate-200 rounded-md p-4 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all"
            >
              <div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-slate-800 font-mono">
                  {stat.value.toLocaleString("fa-IR")}
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-md flex items-center justify-center ${stat.bg} ${stat.border} border`}
              >
                <Icon size={18} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column: Main Table (Takes 8 columns on large screens) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-[12px] font-semibold text-slate-700">فیلترها:</span>

                <select
                  value={filters.isRead}
                  onChange={(e) => handleFilterChange("isRead", e.target.value)}
                  className="h-8 pl-8 pr-2 bg-white border border-slate-300 rounded-md text-[11px] text-slate-700 focus:border-[#007acc] focus:ring-0 outline-none"
                >
                  <option value="">همه وضعیت‌ها</option>
                  <option value="false">خوانده نشده</option>
                  <option value="true">خوانده شده</option>
                </select>

                <select
                  value={filters.context}
                  onChange={(e) => handleFilterChange("context", e.target.value)}
                  className="h-8 pl-8 pr-2 bg-white border border-slate-300 rounded-md text-[11px] text-slate-700 focus:border-[#007acc] focus:ring-0 outline-none"
                >
                  <option value="">همه انواع</option>
                  <option value="comment">کامنت</option>
                  <option value="message">پیام</option>
                  <option value="need_update">نیاز به آپدیت</option>
                  <option value="task_description">توضیحات تسک</option>
                  <option value="team_invitation">دعوت تیمی</option>
                  <option value="direct_message">دایرکت</option>
                </select>
              </div>

              <div className="relative">
                <Search size={14} className="absolute right-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="h-8 w-48 pr-8 pl-2 bg-white border border-slate-300 rounded-md text-[11px] focus:border-[#007acc] focus:ring-0 outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-[#007acc] rounded-full animate-spin mb-2"></div>
                  <span className="text-[12px] text-slate-400">در حال بارگذاری...</span>
                </div>
              ) : allMentions.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        منشن‌شونده
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        منشن‌کننده
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-1/3">
                        متن
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        نوع
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        وضعیت
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        تاریخ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allMentions.map((mention) => (
                      <tr key={mention._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="text-[12px] font-medium text-slate-800">
                            {mention.mentionedUser?.name || "نامشخص"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {mention.mentionedUser?.email}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[12px] font-medium text-slate-800">
                            {mention.mentionedBy?.name || "نامشخص"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {mention.mentionedBy?.email}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="text-[12px] text-slate-600 truncate max-w-[200px]"
                            title={mention.text}
                          >
                            {mention.text || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {getContextLabel(mention.context)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                              mention.isRead
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {mention.isRead ? "خوانده شده" : "خوانده نشده"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">
                          {new Date(mention.createdAt).toLocaleDateString("fa-IR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <AtSign size={32} className="text-slate-300 mx-auto mb-3" />
                  <div className="text-[13px] text-slate-500">هیچ منشنی یافت نشد</div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
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
                    className="p-1 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 hover:border-slate-400 transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <span className="px-2 text-[11px] font-medium text-slate-600">
                    {pagination.page.toLocaleString("fa-IR")}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-1 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 hover:border-slate-400 transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Analysis Widgets (Takes 4 columns on large screens) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {/* Context Distribution Widget */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#007acc]" />
                <h2 className="text-[13px] font-bold text-slate-800">توزیع موضوعی</h2>
              </div>
              <MoreHorizontal size={14} className="text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>
            <div className="p-2">
              {contextDistribution.length > 0 ? (
                <div className="space-y-1">
                  {contextDistribution.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-[12px] text-slate-600 font-medium">
                        {getContextLabel(item._id)}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-[#007acc] rounded text-[11px] font-bold font-mono border border-blue-100">
                        {item.count.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[12px] text-slate-400">داده‌ای موجود نیست</div>
              )}
            </div>
          </div>

          {/* Most Mentioned Users Widget */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-amber-500" />
                <h2 className="text-[13px] font-bold text-slate-800">کاربران برتر</h2>
              </div>
              <MoreHorizontal size={14} className="text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>
            <div className="p-2">
              {mostMentionedUsers.length > 0 ? (
                <div className="space-y-1">
                  {mostMentionedUsers.slice(0, 5).map((user, index) => (
                    <div
                      key={user.userId}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${
                            index === 0
                              ? "bg-amber-400"
                              : index === 1
                              ? "bg-slate-400"
                              : index === 2
                              ? "bg-orange-400"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-slate-800">{user.name}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-600">
                        {user.mentionCount.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[12px] text-slate-400">داده‌ای موجود نیست</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentions;
