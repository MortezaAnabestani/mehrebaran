import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkNotificationStats, getAllNotifications } from "../../features/notificationsSlice";
import {
  Bell,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Mail,
  Smartphone,
  MessageSquare,
} from "lucide-react";

const Notifications = () => {
  const dispatch = useDispatch();
  const { networkStats, allNotifications, loading, pagination } = useSelector((state) => state.notifications);

  const [filters, setFilters] = useState({
    type: "",
    priority: "",
    isRead: "",
    recipientId: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [filters.page, filters.type, filters.priority, filters.isRead, filters.recipientId]);

  const loadStats = async () => {
    try {
      await dispatch(getNetworkNotificationStats()).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  const loadNotifications = async () => {
    try {
      await dispatch(getAllNotifications(filters)).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری اعلانات:", error);
    }
  };

  const stats = useMemo(() => {
    if (!networkStats) return [];
    return [
      {
        label: "کل اعلانات",
        value: networkStats.totalNotifications || 0,
        icon: Bell,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "خوانده نشده",
        value: networkStats.unreadNotifications || 0,
        icon: AlertCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        label: "رشد ۳۰ روز اخیر",
        value: networkStats.recentNotifications || 0,
        icon: TrendingUp,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        label: "اعلانات امروز",
        value: networkStats.todayNotifications || 0,
        icon: Info,
        color: "text-violet-600",
        bg: "bg-violet-50",
      },
    ];
  }, [networkStats]);

  const typeDistribution = useMemo(() => {
    return networkStats?.byType || [];
  }, [networkStats]);

  const priorityDistribution = useMemo(() => {
    return networkStats?.byPriority || [];
  }, [networkStats]);

  const channelDistribution = useMemo(() => {
    return networkStats?.byChannel || [];
  }, [networkStats]);

  const topRecipients = useMemo(() => {
    return networkStats?.topRecipients || [];
  }, [networkStats]);

  const deliveryStats = useMemo(() => {
    return networkStats?.deliveryStats || { email: {}, push: {}, sms: {} };
  }, [networkStats]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleRefresh = () => {
    loadStats();
    loadNotifications();
  };

  function getTypeLabel(type) {
    const typeMap = {
      mention: "منشن",
      follow: "دنبال کردن",
      follow_need: "دنبال کردن نیاز",
      badge_earned: "دریافت نشان",
      level_up: "ارتقای سطح",
      need_update: "به‌روزرسانی نیاز",
      need_completed: "تکمیل نیاز",
      need_support: "حمایت از نیاز",
      task_assigned: "تخصیص تسک",
      task_completed: "تکمیل تسک",
      milestone_completed: "تکمیل مایلستون",
      team_invitation: "دعوت به تیم",
      team_joined: "عضویت در تیم",
      team_left: "ترک تیم",
      comment_posted: "ثبت کامنت",
      comment_reply: "پاسخ به کامنت",
      direct_message: "پیام مستقیم",
      verification_approved: "تایید شده",
      verification_rejected: "رد شده",
      admin_announcement: "اعلان مدیر",
      system_alert: "هشدار سیستم",
    };
    return typeMap[type] || type;
  }

  function getPriorityLabel(priority) {
    const priorityMap = {
      low: "کم",
      normal: "عادی",
      high: "بالا",
      urgent: "فوری",
    };
    return priorityMap[priority] || priority;
  }

  function getChannelLabel(channel) {
    const channelMap = {
      in_app: "درون برنامه",
      email: "ایمیل",
      push: "پوش",
      sms: "پیامک",
    };
    return channelMap[channel] || channel;
  }

  function getTypeColor(type) {
    const colorMap = {
      mention: "#3b82f6",
      follow: "#10b981",
      badge_earned: "#f59e0b",
      task_assigned: "#6366f1",
      team_invitation: "#8b5cf6",
      admin_announcement: "#ef4444",
      system_alert: "#dc2626",
    };
    return colorMap[type] || "#64748b";
  }

  function getPriorityColor(priority) {
    const colorMap = {
      low: "#94a3b8",
      normal: "#3b82f6",
      high: "#f59e0b",
      urgent: "#ef4444",
    };
    return colorMap[priority] || "#64748b";
  }

  function getChannelIcon(channel) {
    const iconMap = {
      in_app: Bell,
      email: Mail,
      push: Smartphone,
      sms: MessageSquare,
    };
    return iconMap[channel] || Bell;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">مدیریت اعلانات شبکه</h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          مدیریت و نظارت بر اعلانات کل شبکه اجتماعی
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

      {/* Distribution Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Type Distribution */}
        <div className="bg-white rounded-md border border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <BarChart3 size={16} className="text-[#007acc]" />
            <h2 className="text-sm font-semibold text-slate-800">توزیع بر اساس نوع</h2>
          </div>
          <div className="p-4 flex-1">
            {typeDistribution.length > 0 ? (
              <div className="space-y-2">
                {typeDistribution.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getTypeColor(item._id) }}
                      ></div>
                      <span className="text-xs font-medium text-slate-700">{getTypeLabel(item._id)}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold"
                      style={{
                        backgroundColor: `${getTypeColor(item._id)}15`,
                        color: getTypeColor(item._id),
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

        {/* Priority Distribution */}
        <div className="bg-white rounded-md border border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <AlertTriangle size={16} className="text-amber-600" />
            <h2 className="text-sm font-semibold text-slate-800">توزیع بر اساس اولویت</h2>
          </div>
          <div className="p-4 flex-1">
            {priorityDistribution.length > 0 ? (
              <div className="space-y-2">
                {priorityDistribution.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPriorityColor(item._id) }}
                      ></div>
                      <span className="text-xs font-medium text-slate-700">{getPriorityLabel(item._id)}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold"
                      style={{
                        backgroundColor: `${getPriorityColor(item._id)}15`,
                        color: getPriorityColor(item._id),
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

        {/* Channel Distribution */}
        <div className="bg-white rounded-md border border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Bell size={16} className="text-violet-600" />
            <h2 className="text-sm font-semibold text-slate-800">توزیع بر اساس کانال</h2>
          </div>
          <div className="p-4 flex-1">
            {channelDistribution.length > 0 ? (
              <div className="space-y-2">
                {channelDistribution.map((item) => {
                  const ChannelIcon = getChannelIcon(item._id);
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ChannelIcon size={14} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-700">{getChannelLabel(item._id)}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded text-[11px] font-bold">
                        {item.count.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">داده‌ای یافت نشد</div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Top Recipients */}
        <div className="bg-white rounded-md border border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Users size={16} className="text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-800">بیشترین دریافت‌کنندگان</h2>
          </div>
          <div className="p-4 flex-1">
            {topRecipients.length > 0 ? (
              <div className="space-y-2">
                {topRecipients.slice(0, 5).map((user, index) => (
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
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold">
                        {user.notificationCount.toLocaleString("fa-IR")}
                      </span>
                      {user.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px] font-medium">
                          {user.unreadCount.toLocaleString("fa-IR")} خوانده نشده
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

        {/* Delivery Success Rates */}
        <div className="bg-white rounded-md border border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <CheckCircle size={16} className="text-green-600" />
            <h2 className="text-sm font-semibold text-slate-800">نرخ موفقیت ارسال</h2>
          </div>
          <div className="p-4 flex-1">
            <div className="space-y-3">
              {/* Email */}
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-600" />
                    <span className="text-xs font-medium text-slate-700">ایمیل</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {deliveryStats.email.total?.toLocaleString("fa-IR") || 0} کل
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        deliveryStats.email.total > 0
                          ? (deliveryStats.email.successful / deliveryStats.email.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  {deliveryStats.email.successful?.toLocaleString("fa-IR") || 0} موفق (
                  {deliveryStats.email.total > 0
                    ? ((deliveryStats.email.successful / deliveryStats.email.total) * 100).toFixed(1)
                    : 0}
                  %)
                </div>
              </div>

              {/* Push */}
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-slate-600" />
                    <span className="text-xs font-medium text-slate-700">پوش نوتیفیکیشن</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {deliveryStats.push.total?.toLocaleString("fa-IR") || 0} کل
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        deliveryStats.push.total > 0
                          ? (deliveryStats.push.successful / deliveryStats.push.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  {deliveryStats.push.successful?.toLocaleString("fa-IR") || 0} موفق (
                  {deliveryStats.push.total > 0
                    ? ((deliveryStats.push.successful / deliveryStats.push.total) * 100).toFixed(1)
                    : 0}
                  %)
                </div>
              </div>

              {/* SMS */}
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-slate-600" />
                    <span className="text-xs font-medium text-slate-700">پیامک</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {deliveryStats.sms.total?.toLocaleString("fa-IR") || 0} کل
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        deliveryStats.sms.total > 0
                          ? (deliveryStats.sms.successful / deliveryStats.sms.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  {deliveryStats.sms.successful?.toLocaleString("fa-IR") || 0} موفق (
                  {deliveryStats.sms.total > 0
                    ? ((deliveryStats.sms.successful / deliveryStats.sms.total) * 100).toFixed(1)
                    : 0}
                  %)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Notifications Table */}
      <div className="bg-white rounded-md border border-slate-200">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter size={16} className="text-slate-400" />
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
            >
              <option value="">همه انواع</option>
              <option value="mention">منشن</option>
              <option value="follow">دنبال کردن</option>
              <option value="badge_earned">دریافت نشان</option>
              <option value="task_assigned">تخصیص تسک</option>
              <option value="team_invitation">دعوت به تیم</option>
              <option value="admin_announcement">اعلان مدیر</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
            >
              <option value="">همه اولویت‌ها</option>
              <option value="low">کم</option>
              <option value="normal">عادی</option>
              <option value="high">بالا</option>
              <option value="urgent">فوری</option>
            </select>

            <select
              value={filters.isRead}
              onChange={(e) => handleFilterChange("isRead", e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="false">خوانده نشده</option>
              <option value="true">خوانده شده</option>
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
          ) : allNotifications.length > 0 ? (
            <table className="w-full border-collapse text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">گیرنده</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">عنوان</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">نوع</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">اولویت</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">وضعیت</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-slate-500">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allNotifications.map((notification) => (
                  <tr key={notification._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3">
                      {notification.recipient ? (
                        <div>
                          <div className="text-xs font-medium text-slate-800 group-hover:text-[#007acc] transition-colors">
                            {notification.recipient.name || "نامشخص"}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{notification.recipient.email || ""}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">حذف شده</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-700 truncate max-w-[250px]">
                        {notification.title || "بدون عنوان"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[250px] mt-0.5">
                        {notification.message || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border"
                        style={{
                          backgroundColor: `${getTypeColor(notification.type)}08`,
                          color: getTypeColor(notification.type),
                          borderColor: `${getTypeColor(notification.type)}20`,
                        }}
                      >
                        {getTypeLabel(notification.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border"
                        style={{
                          backgroundColor: `${getPriorityColor(notification.priority)}08`,
                          color: getPriorityColor(notification.priority),
                          borderColor: `${getPriorityColor(notification.priority)}20`,
                        }}
                      >
                        {getPriorityLabel(notification.priority)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {notification.isRead ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                          <CheckCircle size={10} />
                          خوانده شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">
                          <AlertCircle size={10} />
                          خوانده نشده
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      {new Date(notification.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Bell size={32} className="mx-auto text-slate-300 mb-3" />
              <div className="text-sm text-slate-500">هیچ اعلانی یافت نشد</div>
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

export default Notifications;
