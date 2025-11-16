import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Typography, Button } from "@material-tailwind/react";
import {
  UsersIcon,
  DocumentTextIcon,
  NewspaperIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color, trend }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="small" className="font-normal text-gray-600">
              {title}
            </Typography>
            <Typography variant="h4" className="mt-1 font-bold" color={color}>
              {value?.toLocaleString("fa-IR") || "0"}
            </Typography>
            {trend && (
              <Typography variant="small" className="mt-1 text-gray-500">
                {trend}
              </Typography>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${color}-50`}>
            <Icon className={`w-8 h-8 text-${color}-500`} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, count, icon: Icon, color, onClick }) {
  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardBody className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${color}-50`}>
            <Icon className={`w-6 h-6 text-${color}-500`} />
          </div>
          <div className="flex-1">
            <Typography variant="small" className="font-medium text-gray-700">
              {title}
            </Typography>
            <Typography variant="h6" className="font-bold" color={color}>
              {count?.toLocaleString("fa-IR") || "0"}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Top Tag Item Component
function TopTagItem({ tag, count, index }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Typography variant="small" className="font-bold text-blue-700">
            {index + 1}
          </Typography>
        </div>
        <Typography variant="small" className="font-medium text-gray-700">
          #{tag}
        </Typography>
      </div>
      <Typography variant="small" className="font-semibold text-gray-600">
        {count?.toLocaleString("fa-IR")}
      </Typography>
    </div>
  );
}

// Recent Activity Item Component
function RecentActivityItem({ title, status, createdAt }) {
  const statusColors = {
    pending: "amber",
    active: "green",
    completed: "blue",
    rejected: "red",
  };

  const statusLabels = {
    pending: "در انتظار",
    active: "فعال",
    completed: "تکمیل شده",
    rejected: "رد شده",
  };

  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <Typography variant="small" className="font-medium text-gray-800">
          {title}
        </Typography>
        <Typography variant="small" className="text-gray-500 mt-1">
          {new Date(createdAt).toLocaleDateString("fa-IR")}
        </Typography>
      </div>
      <span
        className={`px-2 py-1 rounded text-xs font-medium bg-${statusColors[status]}-100 text-${statusColors[status]}-700`}
      >
        {statusLabels[status] || status}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/admin/dashboard/overview");

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <Typography variant="small" className="mt-4 text-gray-600">
            در حال بارگذاری...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <Typography variant="h5" className="mb-2 text-red-700">
              خطا
            </Typography>
            <Typography variant="small" className="text-gray-600 mb-4">
              {error}
            </Typography>
            <Button onClick={fetchDashboardOverview} size="sm" color="blue">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h3" className="font-bold text-gray-800">
            داشبورد مدیریت
          </Typography>
          <Typography variant="small" className="text-gray-600 mt-1">
            نمای کلی از فعالیت‌های شبکه نیازسنجی
          </Typography>
        </div>
        <Button
          onClick={fetchDashboardOverview}
          size="sm"
          variant="outlined"
          className="flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          به‌روزرسانی
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="کل نیازها"
          value={stats.needs?.total}
          icon={DocumentTextIcon}
          color="blue"
          trend={`${stats.needs?.pending || 0} در انتظار بررسی`}
        />
        <StatsCard
          title="کاربران فعال"
          value={stats.users?.active}
          icon={UsersIcon}
          color="green"
          trend={`از مجموع ${stats.users?.total?.toLocaleString("fa-IR") || 0} کاربر`}
        />
        <StatsCard
          title="استوری‌های امروز"
          value={stats.stories?.today}
          icon={NewspaperIcon}
          color="purple"
          trend={`کل: ${stats.stories?.total?.toLocaleString("fa-IR") || 0}`}
        />
        <StatsCard
          title="مجموع کمک‌ها"
          value={
            stats.donations?.totalAmount
              ? `${(stats.donations.totalAmount / 1000000).toFixed(1)}M`
              : "0"
          }
          icon={CurrencyDollarIcon}
          color="amber"
          trend={`${stats.donations?.total?.toLocaleString("fa-IR") || 0} کمک`}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <Typography variant="h5" className="font-bold text-gray-800 mb-4">
          اقدامات سریع
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="نیازهای در انتظار"
            count={quickActions.pendingNeeds}
            icon={ClockIcon}
            color="amber"
            onClick={() => console.log("Navigate to pending needs")}
          />
          <QuickActionCard
            title="نظرات در انتظار تایید"
            count={quickActions.pendingComments}
            icon={ChatBubbleLeftIcon}
            color="blue"
            onClick={() => console.log("Navigate to pending comments")}
          />
          <QuickActionCard
            title="تاییدیه‌های در انتظار"
            count={quickActions.pendingVerifications}
            icon={CheckCircleIcon}
            color="green"
            onClick={() => console.log("Navigate to pending verifications")}
          />
          <QuickActionCard
            title="کمک‌های در انتظار"
            count={quickActions.pendingDonations}
            icon={CurrencyDollarIcon}
            color="purple"
            onClick={() => console.log("Navigate to pending donations")}
          />
        </div>
      </div>

      {/* Charts and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tags */}
        <Card className="shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            className="rounded-none bg-gray-50 p-4"
          >
            <Typography variant="h6" className="font-bold text-gray-800">
              تگ‌های پرکاربرد
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            {topTags.length > 0 ? (
              <div className="space-y-1">
                {topTags.map((item, index) => (
                  <TopTagItem
                    key={item.tag}
                    tag={item.tag}
                    count={item.count}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <Typography variant="small" className="text-gray-500 text-center py-8">
                هیچ تگی یافت نشد
              </Typography>
            )}
          </CardBody>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            className="rounded-none bg-gray-50 p-4"
          >
            <Typography variant="h6" className="font-bold text-gray-800">
              آخرین نیازها
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            {recentActivities.length > 0 ? (
              <div className="space-y-1">
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
              <Typography variant="small" className="text-gray-500 text-center py-8">
                هیچ فعالیتی یافت نشد
              </Typography>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
