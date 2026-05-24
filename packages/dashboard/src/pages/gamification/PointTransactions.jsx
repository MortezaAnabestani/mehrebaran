import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTransactions } from "../../features/gamificationSlice";
import {
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  ArrowPathIcon,
  BanknotesIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const PointTransactions = () => {
  const dispatch = useDispatch();
  const { allTransactions, loading, pagination } = useSelector((state) => state.gamification);

  const [filters, setFilters] = useState({
    search: "",
    action: "",
    userId: "",
    page: 1,
    limit: 20,
  });

  // بارگذاری اولیه
  useEffect(() => {
    loadData();
  }, [filters.page, filters.search, filters.action, filters.userId]);

  const loadData = async () => {
    try {
      const result = await dispatch(fetchAllTransactions(filters)).unwrap();
      console.log("✅ Transactions loaded:", result);
    } catch (error) {
      console.error("❌ Error loading transactions:", error);
    }
  };

  // محاسبه آمار (Memoized)
  const stats = useMemo(() => {
    const total = pagination.total || allTransactions.length;
    const totalPoints = allTransactions.reduce((sum, t) => sum + (t.points || 0), 0);
    const positivePoints = allTransactions
      .filter((t) => t.points > 0)
      .reduce((sum, t) => sum + t.points, 0);
    const negativePoints = allTransactions
      .filter((t) => t.points < 0)
      .reduce((sum, t) => sum + t.points, 0);

    return [
      { label: "TOTAL_TRANSACTIONS", value: total },
      { label: "NET_POINTS", value: totalPoints },
      { label: "EARNED", value: `+${positivePoints}` },
      { label: "DEDUCTED", value: negativePoints },
    ];
  }, [allTransactions, pagination.total]);

  // هندلر تغییر صفحه
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  // تبدیل action به برچسب فارسی
  const getActionLabel = (action) => {
    const actionMap = {
      daily_login: "ورود روزانه",
      post_create: "ایجاد پست",
      comment_create: "ثبت نظر",
      like_received: "دریافت لایک",
      share_content: "اشتراک‌گذاری",
      profile_complete: "تکمیل پروفایل",
      level_up: "ارتقا سطح",
      badge_earned: "کسب نشان",
      penalty: "جریمه",
      admin_award: "جایزه ادمین",
      admin_deduct: "کسر توسط ادمین",
    };
    return actionMap[action] || action;
  };

  // رنگ و آیکون بر اساس امتیاز
  const getPointStyle = (points) => {
    if (points > 0) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: <ArrowUpIcon className="w-3.5 h-3.5" />,
      };
    } else if (points < 0) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: <ArrowDownIcon className="w-3.5 h-3.5" />,
      };
    }
    return {
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      icon: null,
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4">
      {/* --- HEADER & METRICS BAR --- */}
      <div className="bg-white border border-slate-200 rounded-md mb-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-3 gap-4">
          {/* Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#007acc]/10 flex items-center justify-center rounded-md border border-[#007acc]/20">
              <BanknotesIcon className="w-4 h-4 text-[#007acc]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider">تراکنش‌های امتیاز</h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span>ادمین</span>
                <span>/</span>
                <span>مدیریت گیمیفیکیشن شبکه</span>
              </div>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}:</span>
                <span className="text-xs font-mono font-medium text-slate-700">{stat.value}</span>
                {index < stats.length - 1 && <div className="h-3 w-[1px] bg-slate-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="border-t border-slate-100 p-2 flex flex-col sm:flex-row gap-2 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by description, user ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all bg-white"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>

          {/* Action Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all bg-white appearance-none"
            >
              <option value="">All Actions</option>
              <option value="daily_login">ورود روزانه</option>
              <option value="post_create">ایجاد پست</option>
              <option value="comment_create">ثبت نظر</option>
              <option value="like_received">دریافت لایک</option>
              <option value="level_up">ارتقا سطح</option>
              <option value="penalty">جریمه</option>
              <option value="admin_award">جایزه ادمین</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => loadData()}
              className="p-1.5 text-slate-500 hover:text-[#007acc] hover:bg-[#007acc]/5 rounded border border-transparent hover:border-[#007acc]/20 transition-all"
              title="Refresh Data"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <div className="h-4 w-[1px] bg-slate-300 mx-1" />
            <span className="text-[11px] text-slate-500 font-mono">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-1.5 border border-slate-200 rounded bg-white disabled:opacity-50 hover:border-[#007acc] hover:text-[#007acc] transition-colors"
              >
                <ChevronRightIcon className="w-3 h-3" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 border border-slate-200 rounded bg-white disabled:opacity-50 hover:border-[#007acc] hover:text-[#007acc] transition-colors"
              >
                <ChevronLeftIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT TABLE --- */}
      {loading && allTransactions.length === 0 ? (
        <div className="flex justify-center items-center h-64 border border-dashed border-slate-300 rounded-md bg-slate-50/50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-[#007acc] rounded-full"></div>
            <span className="text-xs text-slate-500 font-mono">LOADING_DATA...</span>
          </div>
        </div>
      ) : allTransactions.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 bg-slate-100 border-b border-slate-200 p-2 text-[10px] font-bold text-slate-600 uppercase">
            <div className="col-span-3">کاربر</div>
            <div className="col-span-2">عملیات</div>
            <div className="col-span-4">توضیحات</div>
            <div className="col-span-2">تاریخ</div>
            <div className="col-span-1 text-center">امتیاز</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {allTransactions.map((transaction) => {
              const pointStyle = getPointStyle(transaction.points);
              return (
                <div
                  key={transaction._id}
                  className="grid grid-cols-12 gap-2 p-2 hover:bg-slate-50 transition-colors text-xs"
                >
                  {/* User Info */}
                  <div className="col-span-3 flex items-center gap-2 min-w-0">
                    {transaction.user?.avatar ? (
                      <img
                        src={transaction.user.avatar}
                        className="w-6 h-6 rounded-full shrink-0"
                        alt=""
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-700 truncate">
                        {transaction.user?.name || "Unknown User"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {transaction.user?.email || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 flex items-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-700">
                      {getActionLabel(transaction.action)}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="col-span-4 flex items-center">
                    <p className="text-slate-600 line-clamp-2 text-[11px]">
                      {transaction.description || "—"}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 flex items-center">
                    <div className="text-[10px] text-slate-500 font-mono">
                      {new Date(transaction.createdAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                      <br />
                      {new Date(transaction.createdAt).toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded ${pointStyle.bgColor} ${pointStyle.color}`}
                    >
                      {pointStyle.icon}
                      <span className="font-bold text-xs">
                        {transaction.points > 0 ? "+" : ""}
                        {transaction.points}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border border-slate-200 rounded-md bg-white">
          <BanknotesIcon className="w-10 h-10 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500 font-medium">No Transactions Found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default PointTransactions;
