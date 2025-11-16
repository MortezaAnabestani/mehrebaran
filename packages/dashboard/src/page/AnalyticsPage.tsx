import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  ChartBarIcon,
  UsersIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

// Simple Bar Chart Component
function SimpleBarChart({ data, dataKey, xKey, title, color = "blue" }) {
  if (!data || data.length === 0) {
    return (
      <Typography variant="small" className="text-gray-500 text-center py-8">
        داده‌ای موجود نیست
      </Typography>
    );
  }

  const maxValue = Math.max(...data.map((item) => item[dataKey] || 0));

  return (
    <div className="space-y-2">
      {title && (
        <Typography variant="small" className="font-semibold text-gray-700 mb-3">
          {title}
        </Typography>
      )}
      <div className="space-y-2">
        {data.map((item, index) => {
          const value = item[dataKey] || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <div key={index} className="flex items-center gap-2">
              <Typography variant="small" className="w-24 text-gray-600 text-xs">
                {item[xKey] || "-"}
              </Typography>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full bg-${color}-500 rounded-full transition-all duration-500 flex items-center justify-end px-2`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 20 && value > 0 && (
                    <Typography variant="small" className="text-white text-xs font-semibold">
                      {value.toLocaleString("fa-IR")}
                    </Typography>
                  )}
                </div>
                {percentage <= 20 && value > 0 && (
                  <Typography
                    variant="small"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-xs font-semibold"
                  >
                    {value.toLocaleString("fa-IR")}
                  </Typography>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Simple Line Chart Component
function SimpleLineChart({ data, dataKey, xKey, title }) {
  if (!data || data.length === 0) {
    return (
      <Typography variant="small" className="text-gray-500 text-center py-8">
        داده‌ای موجود نیست
      </Typography>
    );
  }

  const maxValue = Math.max(...data.map((item) => item[dataKey] || 0));
  const minValue = Math.min(...data.map((item) => item[dataKey] || 0));

  return (
    <div className="space-y-3">
      {title && (
        <Typography variant="small" className="font-semibold text-gray-700">
          {title}
        </Typography>
      )}
      <div className="relative h-48 border-b border-r border-gray-200">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{maxValue.toLocaleString("fa-IR")}</span>
          <span>{Math.round((maxValue + minValue) / 2).toLocaleString("fa-IR")}</span>
          <span>{minValue.toLocaleString("fa-IR")}</span>
        </div>

        {/* Chart area */}
        <div className="absolute right-0 left-12 top-0 bottom-0 flex items-end gap-1">
          {data.map((item, index) => {
            const value = item[dataKey] || 0;
            const height = maxValue > 0 ? ((value - minValue) / (maxValue - minValue)) * 100 : 0;

            return (
              <div key={index} className="flex-1 flex flex-col items-center group relative">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                />
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {value.toLocaleString("fa-IR")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="flex gap-1 text-xs text-gray-500 mr-12">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center">
            {index % Math.ceil(data.length / 5) === 0 && (item[xKey] || "-")}
          </div>
        ))}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color = "blue" }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <Typography variant="small" className="text-gray-600 mb-1">
        {label || "-"}
      </Typography>
      <Typography variant="h5" className={`font-bold text-${color}-700`}>
        {typeof value === "number" ? value.toLocaleString("fa-IR") : (value || "0")}
      </Typography>
    </div>
  );
}

// Content Analytics Tab
function ContentAnalyticsTab({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Needs Analytics */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
          <Typography variant="h6" className="font-bold">
            آنالیز نیازها
          </Typography>
        </CardHeader>
        <CardBody className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleBarChart
            data={data.needs.byStatus}
            dataKey="count"
            xKey="status"
            title="بر اساس وضعیت"
            color="blue"
          />
          <SimpleBarChart
            data={data.needs.byUrgency}
            dataKey="count"
            xKey="urgency"
            title="بر اساس فوریت"
            color="amber"
          />
          <div className="lg:col-span-2">
            <SimpleLineChart
              data={data.needs.timeline}
              dataKey="count"
              xKey="date"
              title="روند ایجاد نیازها"
            />
          </div>
        </CardBody>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
          <Typography variant="h6" className="font-bold">
            دسته‌بندی‌های پرکاربرد
          </Typography>
        </CardHeader>
        <CardBody>
          <SimpleBarChart
            data={data.needs.byCategory}
            dataKey="count"
            xKey="category"
            color="green"
          />
        </CardBody>
      </Card>

      {/* Stories & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
            <Typography variant="h6" className="font-bold">
              روند استوری‌ها
            </Typography>
          </CardHeader>
          <CardBody>
            <SimpleLineChart data={data.stories.timeline} dataKey="count" xKey="date" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
            <Typography variant="h6" className="font-bold">
              آمار نظرات
            </Typography>
          </CardHeader>
          <CardBody className="space-y-4">
            <StatCard label="کل نظرات" value={data.comments.total} color="blue" />
            <StatCard label="تایید شده" value={data.comments.approved} color="green" />
            <StatCard label="در انتظار" value={data.comments.pending} color="amber" />
            <SimpleLineChart data={data.comments.timeline} dataKey="count" xKey="date" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// User Analytics Tab
function UserAnalyticsTab({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* User Growth */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
          <Typography variant="h6" className="font-bold">
            رشد کاربران
          </Typography>
        </CardHeader>
        <CardBody>
          <SimpleLineChart data={data.growth} dataKey="count" xKey="date" title="کاربران جدید" />
        </CardBody>
      </Card>

      {/* Active Users */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
          <Typography variant="h6" className="font-bold">
            کاربران فعال
          </Typography>
        </CardHeader>
        <CardBody>
          <SimpleLineChart
            data={data.activeUsers}
            dataKey="count"
            xKey="date"
            title="فعالیت روزانه"
          />
        </CardBody>
      </Card>

      {/* Users by Role & Top Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
            <Typography variant="h6" className="font-bold">
              توزیع نقش‌ها
            </Typography>
          </CardHeader>
          <CardBody>
            <SimpleBarChart data={data.byRole} dataKey="count" xKey="role" color="purple" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
            <Typography variant="h6" className="font-bold">
              کاربران برتر (بیشترین نیاز)
            </Typography>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {data.topContributors && data.topContributors.length > 0 ? (
                data.topContributors.map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Typography variant="small" className="font-bold text-blue-700">
                          {index + 1}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="small" className="font-medium">
                          {user.fullName || user.username}
                        </Typography>
                        <Typography variant="small" className="text-gray-500">
                          @{user.username}
                        </Typography>
                      </div>
                    </div>
                    <Typography variant="small" className="font-semibold text-blue-600">
                      {user.needsCount.toLocaleString("fa-IR")} نیاز
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="small" className="text-gray-500 text-center py-4">
                  کاربری یافت نشد
                </Typography>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// Engagement Analytics Tab
function EngagementAnalyticsTab({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="کل فالوها" value={data.follows.total} color="blue" />
        <StatCard label="کل استوری‌ها" value={data.stories.totalStories} color="purple" />
        <StatCard label="مشاهده استوری‌ها" value={data.stories.totalViews} color="green" />
        <StatCard
          label="نرخ تعامل استوری"
          value={`${data.stories.engagementRate}%`}
          color="amber"
        />
      </div>

      {/* Follow Timeline */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
          <Typography variant="h6" className="font-bold">
            روند فالوها
          </Typography>
        </CardHeader>
        <CardBody>
          <SimpleLineChart data={data.follows.timeline} dataKey="count" xKey="date" />
        </CardBody>
      </Card>

      {/* Story & Need Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
            <Typography variant="h6" className="font-bold">
              تعامل استوری‌ها
            </Typography>
          </CardHeader>
          <CardBody className="space-y-3">
            <StatCard label="میانگین مشاهده" value={data.stories.avgViews} color="blue" />
            <StatCard label="میانگین واکنش" value={data.stories.avgReactions} color="purple" />
            <StatCard label="کل واکنش‌ها" value={data.stories.totalReactions} color="green" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
            <Typography variant="h6" className="font-bold">
              تعامل نیازها
            </Typography>
          </CardHeader>
          <CardBody className="space-y-3">
            <StatCard label="کل نیازها" value={data.needs.totalNeeds} color="blue" />
            <StatCard label="کل مشاهدات" value={data.needs.totalViews} color="green" />
            <StatCard label="میانگین مشاهده" value={data.needs.avgViews} color="amber" />
          </CardBody>
        </Card>
      </div>

      {/* Top Followed Users */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
          <Typography variant="h6" className="font-bold">
            کاربران پردنبال‌کننده
          </Typography>
        </CardHeader>
        <CardBody>
          <SimpleBarChart
            data={data.follows.topFollowed}
            dataKey="followersCount"
            xKey="username"
            color="blue"
          />
        </CardBody>
      </Card>

      {/* Comments Stats */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none bg-gray-50 p-4">
          <Typography variant="h6" className="font-bold">
            آمار نظرات
          </Typography>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="کل نظرات" value={data.comments.totalComments} color="blue" />
          <StatCard label="تایید شده" value={data.comments.approvedComments} color="green" />
          <StatCard label="نرخ تایید" value={`${data.comments.approvalRate}%`} color="amber" />
        </CardBody>
      </Card>
    </div>
  );
}

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
    { label: "محتوا", value: "content", icon: ChartBarIcon },
    { label: "کاربران", value: "users", icon: UsersIcon },
    { label: "تعامل", value: "engagement", icon: HeartIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h3" className="font-bold text-gray-800">
            آنالیز و گزارش‌گیری
          </Typography>
          <Typography variant="small" className="text-gray-600 mt-1">
            تحلیل جامع فعالیت‌های شبکه نیازسنجی
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Select
            label="بازه زمانی"
            value={timeRange}
            onChange={(val) => setTimeRange(val)}
            className="w-40"
          >
            <Option value="7">۷ روز اخیر</Option>
            <Option value="30">۳۰ روز اخیر</Option>
            <Option value="90">۹۰ روز اخیر</Option>
            <Option value="180">۱۸۰ روز اخیر</Option>
          </Select>
          <Button
            onClick={fetchAllAnalytics}
            size="sm"
            variant="outlined"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <ArrowTrendingUpIcon className="w-4 h-4" />
            {loading ? "در حال بارگذاری..." : "به‌روزرسانی"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
          <TabsHeader className="bg-gray-100">
            {tabs.map(({ label, value, icon: Icon }) => (
              <Tab key={value} value={value} className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {label}
              </Tab>
            ))}
          </TabsHeader>

          <TabsBody>
            <TabPanel value="content" className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                  <Typography variant="small" className="mt-4 text-gray-600">
                    در حال بارگذاری...
                  </Typography>
                </div>
              ) : (
                <ContentAnalyticsTab data={analytics.content} />
              )}
            </TabPanel>

            <TabPanel value="users" className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                  <Typography variant="small" className="mt-4 text-gray-600">
                    در حال بارگذاری...
                  </Typography>
                </div>
              ) : (
                <UserAnalyticsTab data={analytics.users} />
              )}
            </TabPanel>

            <TabPanel value="engagement" className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                  <Typography variant="small" className="mt-4 text-gray-600">
                    در حال بارگذاری...
                  </Typography>
                </div>
              ) : (
                <EngagementAnalyticsTab data={analytics.engagement} />
              )}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>
    </div>
  );
}
