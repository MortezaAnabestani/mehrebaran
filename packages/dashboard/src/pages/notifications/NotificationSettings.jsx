import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkNotificationStats } from "../../features/notificationsSlice";
import {
  Settings,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  TrendingUp,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
} from "lucide-react";

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const { networkStats, loading } = useSelector((state) => state.notifications);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      await dispatch(getNetworkNotificationStats()).unwrap();
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const channelStats = useMemo(() => {
    if (!networkStats?.byChannel) return [];
    const channels = networkStats.byChannel;
    const totalNotifications = networkStats.totalNotifications || 0;

    return [
      {
        id: "in_app",
        label: "درون برنامه",
        icon: Bell,
        color: "text-blue-600",
        bg: "bg-blue-50",
        borderColor: "border-blue-200",
        count: channels.find((c) => c._id === "in_app")?.count || 0,
        percentage: totalNotifications > 0
          ? ((channels.find((c) => c._id === "in_app")?.count || 0) / totalNotifications * 100).toFixed(1)
          : 0,
      },
      {
        id: "email",
        label: "ایمیل",
        icon: Mail,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        borderColor: "border-emerald-200",
        count: channels.find((c) => c._id === "email")?.count || 0,
        percentage: totalNotifications > 0
          ? ((channels.find((c) => c._id === "email")?.count || 0) / totalNotifications * 100).toFixed(1)
          : 0,
      },
      {
        id: "push",
        label: "پوش نوتیفیکیشن",
        icon: Smartphone,
        color: "text-violet-600",
        bg: "bg-violet-50",
        borderColor: "border-violet-200",
        count: channels.find((c) => c._id === "push")?.count || 0,
        percentage: totalNotifications > 0
          ? ((channels.find((c) => c._id === "push")?.count || 0) / totalNotifications * 100).toFixed(1)
          : 0,
      },
      {
        id: "sms",
        label: "پیامک",
        icon: MessageSquare,
        color: "text-amber-600",
        bg: "bg-amber-50",
        borderColor: "border-amber-200",
        count: channels.find((c) => c._id === "sms")?.count || 0,
        percentage: totalNotifications > 0
          ? ((channels.find((c) => c._id === "sms")?.count || 0) / totalNotifications * 100).toFixed(1)
          : 0,
      },
    ];
  }, [networkStats]);

  const deliveryStats = useMemo(() => {
    return networkStats?.deliveryStats || { email: {}, push: {}, sms: {} };
  }, [networkStats]);

  const overviewStats = useMemo(() => {
    if (!networkStats) return [];
    return [
      {
        label: "کل اعلانات ارسال شده",
        value: networkStats.totalNotifications || 0,
        icon: Bell,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "نرخ خوانده شدن",
        value: `${networkStats.readRate?.toFixed(1) || 0}%`,
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        isText: true,
      },
      {
        label: "رشد ۳۰ روز اخیر",
        value: networkStats.recentNotifications || 0,
        icon: TrendingUp,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        label: "کاربران فعال",
        value: networkStats.topRecipients?.length || 0,
        icon: Users,
        color: "text-violet-600",
        bg: "bg-violet-50",
      },
    ];
  }, [networkStats]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">تنظیمات اعلانات شبکه</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            مدیریت و پیکربندی سیستم اعلانات کل شبکه اجتماعی
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className={`flex items-center gap-2 px-3 py-1.5 bg-[#007acc] text-white rounded text-xs font-medium hover:bg-[#0062a3] transition-colors
            ${loading || refreshing ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          <RefreshCw size={14} className={loading || refreshing ? "animate-spin" : ""} />
          بارگذاری مجدد
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {overviewStats.map((stat, index) => {
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

      {/* Channel Statistics */}
      <div className="bg-white rounded-md border border-slate-200 mb-6">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <Settings size={16} className="text-[#007acc]" />
          <h2 className="text-sm font-semibold text-slate-800">آمار کانال‌های اعلان</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {channelStats.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.id}
                  className={`relative p-5 rounded-lg border-2 ${channel.borderColor} ${channel.bg} hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                      <Icon size={24} className={channel.color} />
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${channel.color} bg-white`}>
                      {channel.percentage}%
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-600 mb-1">{channel.label}</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {channel.count.toLocaleString("fa-IR")}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">اعلانات ارسال شده</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delivery Success Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Email Delivery */}
        <div className="bg-white rounded-md border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Mail size={16} className="text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-800">ارسال ایمیل</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-600">نرخ موفقیت</span>
              <span className="text-xl font-bold text-emerald-600">
                {deliveryStats.email.total > 0
                  ? ((deliveryStats.email.successful / deliveryStats.email.total) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all"
                style={{
                  width: `${
                    deliveryStats.email.total > 0
                      ? (deliveryStats.email.successful / deliveryStats.email.total) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{deliveryStats.email.successful?.toLocaleString("fa-IR") || 0} موفق</span>
              <span>{deliveryStats.email.total?.toLocaleString("fa-IR") || 0} کل</span>
            </div>
          </div>
        </div>

        {/* Push Delivery */}
        <div className="bg-white rounded-md border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Smartphone size={16} className="text-violet-600" />
            <h2 className="text-sm font-semibold text-slate-800">پوش نوتیفیکیشن</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-600">نرخ موفقیت</span>
              <span className="text-xl font-bold text-violet-600">
                {deliveryStats.push.total > 0
                  ? ((deliveryStats.push.successful / deliveryStats.push.total) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3">
              <div
                className="bg-violet-500 h-2.5 rounded-full transition-all"
                style={{
                  width: `${
                    deliveryStats.push.total > 0
                      ? (deliveryStats.push.successful / deliveryStats.push.total) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{deliveryStats.push.successful?.toLocaleString("fa-IR") || 0} موفق</span>
              <span>{deliveryStats.push.total?.toLocaleString("fa-IR") || 0} کل</span>
            </div>
          </div>
        </div>

        {/* SMS Delivery */}
        <div className="bg-white rounded-md border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <MessageSquare size={16} className="text-amber-600" />
            <h2 className="text-sm font-semibold text-slate-800">ارسال پیامک</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-600">نرخ موفقیت</span>
              <span className="text-xl font-bold text-amber-600">
                {deliveryStats.sms.total > 0
                  ? ((deliveryStats.sms.successful / deliveryStats.sms.total) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all"
                style={{
                  width: `${
                    deliveryStats.sms.total > 0
                      ? (deliveryStats.sms.successful / deliveryStats.sms.total) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{deliveryStats.sms.successful?.toLocaleString("fa-IR") || 0} موفق</span>
              <span>{deliveryStats.sms.total?.toLocaleString("fa-IR") || 0} کل</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Configuration */}
        <div className="bg-white rounded-md border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Settings size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-800">پیکربندی سیستم</h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded border border-blue-100">
                <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 mb-1">کانال‌های فعال</div>
                  <div className="text-[11px] text-slate-600">
                    {channelStats.filter(c => c.count > 0).length} کانال از {channelStats.length} کانال در حال استفاده هستند
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded border border-emerald-100">
                <CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 mb-1">نرخ تحویل کلی</div>
                  <div className="text-[11px] text-slate-600">
                    میانگین نرخ موفقیت در تمام کانال‌ها: {" "}
                    {(
                      (
                        (deliveryStats.email.total > 0 ? (deliveryStats.email.successful / deliveryStats.email.total) * 100 : 0) +
                        (deliveryStats.push.total > 0 ? (deliveryStats.push.successful / deliveryStats.push.total) * 100 : 0) +
                        (deliveryStats.sms.total > 0 ? (deliveryStats.sms.successful / deliveryStats.sms.total) * 100 : 0)
                      ) / 3
                    ).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-violet-50 rounded border border-violet-100">
                <Clock size={16} className="text-violet-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 mb-1">زمان پردازش</div>
                  <div className="text-[11px] text-slate-600">
                    اعلانات در زمان واقعی پردازش و ارسال می‌شوند
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-md border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <AlertCircle size={16} className="text-amber-600" />
            <h2 className="text-sm font-semibold text-slate-800">توصیه‌های سیستمی</h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                <div className="text-xs text-slate-700">
                  برای کاهش اسپم، از گروه‌بندی اعلانات مشابه استفاده کنید
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                <div className="text-xs text-slate-700">
                  نرخ موفقیت ایمیل را با استفاده از DKIM و SPF بهبود دهید
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                <div className="text-xs text-slate-700">
                  توکن‌های غیرفعال Push را به صورت دوره‌ای پاک‌سازی کنید
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                <div className="text-xs text-slate-700">
                  از اولویت‌بندی اعلانات برای مدیریت بهتر استفاده کنید
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                <div className="text-xs text-slate-700">
                  آمار ارسال را به صورت منظم بررسی و بهینه‌سازی کنید
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
