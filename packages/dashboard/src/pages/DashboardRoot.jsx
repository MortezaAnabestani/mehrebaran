import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Chip,
  Progress,
} from "@material-tailwind/react";
import {
  UsersIcon,
  DocumentTextIcon,
  NewspaperIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

// --- BRAND CONFIGURATION ---
const BRAND = {
  primary: "#007acc",
  secondary: "#f7891b",
  bg: "#f8f9fa", // Slightly off-white for dashboard background contrast
};

// --- HELPER COMPONENTS ---

// 1. Skeleton Loader for smoother UX
const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-64 bg-gray-200 rounded-lg"></div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

// 2. Modern Stats Card with Mini-Chart Visual
function StatsCard({ title, value, icon: Icon, type = "primary", trend }) {
  const isPrimary = type === "primary";
  const iconColor = isPrimary ? "text-[#007acc]" : "text-[#f7891b]";
  const bgSoft = isPrimary ? "bg-blue-50" : "bg-orange-50";
  const borderColor = isPrimary ? "border-blue-100" : "border-orange-100";

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-300 border ${borderColor}`}>
      <CardBody className="p-5 relative overflow-hidden">
        {/* Decorative Background Circle */}
        <div
          className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bgSoft} opacity-50 pointer-events-none`}
        />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <Typography variant="small" className="font-medium text-gray-500 mb-1">
              {title}
            </Typography>
            <Typography variant="h3" className="font-bold text-gray-800 tracking-tight">
              {value?.toLocaleString("fa-IR") || "0"}
            </Typography>
          </div>
          <div className={`p-3 rounded-xl ${bgSoft} shadow-sm`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center text-green-500 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">
            <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
            <span>+۱۲٪</span>
          </div>
          <Typography variant="small" className="text-gray-400 text-xs font-normal">
            {trend || "نسبت به ماه گذشته"}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

// 3. Action Tile (Interactive)
function QuickActionCard({ title, count, icon: Icon, colorClass, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-4 overflow-hidden"
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className={`p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors`}>
        <Icon className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
      </div>

      <div className="flex-1">
        <Typography
          variant="small"
          className="font-semibold text-gray-700 group-hover:text-[#007acc] transition-colors"
        >
          {title}
        </Typography>
        <Typography variant="small" className="text-gray-400 text-xs mt-0.5">
          {count > 0 ? `${count.toLocaleString("fa-IR")} مورد منتظر اقدام` : "همه چیز مرتب است"}
        </Typography>
      </div>

      {count > 0 && (
        <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs font-bold">
          {count.toLocaleString("fa-IR")}
        </div>
      )}
    </div>
  );
}

// 4. Enhanced Top Tag Item (Progress Bar Style)
function TopTagItem({ tag, count, total, index }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-500">
            {index + 1}
          </span>
          <Typography variant="small" className="font-bold text-gray-700">
            #{tag}
          </Typography>
        </div>
        <Typography variant="small" className="font-medium text-gray-900">
          {count?.toLocaleString("fa-IR")}
        </Typography>
      </div>
      <Progress
        value={percentage}
        size="sm"
        color={index === 0 ? "blue" : index === 1 ? "amber" : "gray"}
        className="bg-gray-100"
        barProps={{ className: index === 0 ? "bg-[#007acc]" : index === 1 ? "bg-[#f7891b]" : "bg-gray-400" }}
      />
    </div>
  );
}

// 5. Timeline Activity Item
function RecentActivityItem({ title, status, createdAt }) {
  const statusConfig = {
    pending: {
      label: "در انتظار",
      color: "amber",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    active: {
      label: "فعال",
      color: "green",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    completed: {
      label: "تکمیل",
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    rejected: {
      label: "رد شده",
      color: "red",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="flex gap-4 py-3 relative group hover:bg-gray-50 rounded-lg px-2 transition-colors">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className={`w-2 h-2 rounded-full mt-2 ${config.bg} border ${config.border}`}></div>
        <div className="w-px h-full bg-gray-100 my-1 group-last:hidden"></div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <Typography variant="small" className="font-semibold text-gray-800 line-clamp-1">
            {title}
          </Typography>
          <Chip
            value={config.label}
            size="sm"
            variant="ghost"
            className={`rounded-md py-0.5 px-2 min-w-[60px] text-center ${config.text} ${config.bg}`}
          />
        </div>
        <Typography variant="small" className="text-gray-400 text-xs mt-1 flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          {new Date(createdAt).toLocaleDateString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
        </Typography>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    fetchDashboardOverview();
    determineGreeting();
  }, []);

  const determineGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("صبح بخیر");
    else if (hour < 18) setGreeting("ظهر بخیر");
    else setGreeting("عصر بخیر");
  };

  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admins/dashboard/overview");

      if (response.data.success) {
        setOverview(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard overview:", err);
      setError(err.response?.data?.message || "خطا در دریافت اطلاعات داشبورد");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md w-full border border-red-100 shadow-lg">
          <CardBody className="text-center py-10">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BellAlertIcon className="w-10 h-10 text-red-500" />
            </div>
            <Typography variant="h5" className="mb-2 text-gray-800 font-bold">
              خطا در ارتباط
            </Typography>
            <Typography variant="small" className="text-gray-500 mb-6 px-4">
              {error}
            </Typography>
            <Button
              onClick={fetchDashboardOverview}
              className="bg-[#007acc] shadow-blue-100 hover:shadow-blue-200"
            >
              تلاش مجدد
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const stats = overview?.stats || {};
  const quickActions = overview?.quickActions || {};
  const topTags = overview?.topTags || [];
  const recentActivities = overview?.recentActivities || [];

  // Calculate max for progress bars
  const maxTagCount = Math.max(...topTags.map((t) => t.count), 1);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Typography variant="h4" className="font-bold text-gray-800">
              {greeting}، مدیر عزیز 👋
            </Typography>
          </div>
          <Typography variant="small" className="text-gray-500 font-normal">
            گزارش وضعیت کلی سیستم و فعالیت‌های اخیر شبکه نیازسنجی
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Typography variant="small" className="text-gray-400 hidden md:block">
            آخرین بروزرسانی: {new Date().toLocaleTimeString("fa-IR")}
          </Typography>
          <Button
            onClick={fetchDashboardOverview}
            size="sm"
            variant="outlined"
            className="flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#007acc] hover:text-[#007acc] transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span className="hidden sm:inline">به‌روزرسانی</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="کل نیازهای ثبت شده"
          value={stats.needs?.total}
          icon={DocumentTextIcon}
          type="primary"
          trend={`${stats.needs?.pending || 0} مورد در انتظار بررسی`}
        />
        <StatsCard
          title="کاربران فعال سیستم"
          value={stats.users?.active}
          icon={UsersIcon}
          type="secondary" // Using secondary brand color
          trend={`از مجموع ${stats.users?.total?.toLocaleString("fa-IR") || 0} کاربر`}
        />
        <StatsCard
          title="استوری‌های امروز"
          value={stats.stories?.today}
          icon={NewspaperIcon}
          type="primary"
          trend={`کل استوری‌ها: ${stats.stories?.total?.toLocaleString("fa-IR") || 0}`}
        />
        <StatsCard
          title="مجموع کمک‌های مالی"
          value={
            stats.donations?.totalAmount ? `${(stats.donations.totalAmount / 1000000).toFixed(1)}M` : "0"
          }
          icon={CurrencyDollarIcon}
          type="secondary"
          trend={`${stats.donations?.total?.toLocaleString("fa-IR") || 0} تراکنش موفق`}
        />
      </div>

      {/* Quick Actions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h5" className="font-bold text-gray-800">
            اقدامات فوری
          </Typography>
          {/* Optional: Add a 'View All' link here */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="نیازهای در انتظار"
            count={quickActions.pendingNeeds}
            icon={ClockIcon}
            colorClass="bg-[#f7891b]"
            onClick={() => navigate("/dashboard/needs")}
          />
          <QuickActionCard
            title="نظرات جدید"
            count={quickActions.pendingComments}
            icon={ChatBubbleLeftIcon}
            colorClass="bg-[#007acc]"
            onClick={() => navigate("/dashboard/comments")}
          />
          <QuickActionCard
            title="تاییدیه‌های مدارک"
            count={quickActions.pendingVerifications}
            icon={CheckCircleIcon}
            colorClass="bg-green-500"
            onClick={() => navigate("/dashboard/volunteers")}
          />
          <QuickActionCard
            title="تراکنش‌های مالی"
            count={quickActions.pendingDonations}
            icon={CurrencyDollarIcon}
            colorClass="bg-purple-500"
            onClick={() => navigate("/dashboard/donations")}
          />
        </div>
      </div>

      {/* Analytical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Tags - Takes 1/3 width on large screens */}
        <Card className="shadow-sm border border-gray-100 lg:col-span-1 h-full">
          <CardHeader floated={false} shadow={false} className="rounded-none bg-transparent px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <Typography variant="h6" className="font-bold text-gray-800">
                تگ‌های پرکاربرد
              </Typography>
              <div className="p-2 bg-blue-50 rounded-lg">
                <ArrowTrendingUpIcon className="w-5 h-5 text-[#007acc]" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-2">
            {topTags.length > 0 ? (
              <div className="space-y-4 mt-2">
                {topTags.map((item, index) => (
                  <TopTagItem
                    key={item.tag}
                    tag={item.tag}
                    count={item.count}
                    total={maxTagCount} // Passing max for relative progress bar
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <DocumentTextIcon className="w-12 h-12 mb-2 opacity-20" />
                <Typography variant="small">داده‌ای یافت نشد</Typography>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Activities - Takes 2/3 width on large screens */}
        <Card className="shadow-sm border border-gray-100 lg:col-span-2 h-full">
          <CardHeader floated={false} shadow={false} className="rounded-none bg-transparent px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <Typography variant="h6" className="font-bold text-gray-800">
                آخرین فعالیت‌های ثبت شده
              </Typography>
              <Button size="sm" variant="text" className="text-[#007acc]">
                مشاهده همه
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-2">
            {recentActivities.length > 0 ? (
              <div className="space-y-1 mt-2">
                {recentActivities.map((activity) => (
                  <RecentActivityItem
                    key={activity._id}
                    title={activity.title}
                    status={activity.status}
                    createdAt={activity.createdAt}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <ClockIcon className="w-12 h-12 mb-2 opacity-20" />
                <Typography variant="small">هیچ فعالیتی ثبت نشده است</Typography>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
