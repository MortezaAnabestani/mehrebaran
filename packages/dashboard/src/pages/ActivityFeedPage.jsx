import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Select,
  Option,
  Chip,
  Avatar,
  Button,
  IconButton,
} from "@material-tailwind/react";
import OptimizedImage from "@/components/ui/OptimizedImage";

import api from "../services/api";

const ActivitySkeleton = () => (
  <div className="animate-pulse flex gap-4 mb-8 relative pr-8">
    <div className="absolute right-0 top-0 w-4 h-4 bg-gray-300 rounded-full"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-20 bg-gray-200 rounded-lg w-full"></div>
    </div>
  </div>
);

// 2. Modern Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");
    range.unshift(1);
    if (totalPages !== 1) range.push(totalPages);
    return range;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      <Button
        variant="text"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-gray-600 hover:bg-blue-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        قبلی
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              currentPage === page
                ? "bg-[#007acc] text-white shadow-md shadow-blue-500/20"
                : page === "..."
                ? "text-gray-400 cursor-default"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        variant="text"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 text-gray-600 hover:bg-blue-50"
      >
        بعدی
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 transform rotate-180"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </Button>
    </div>
  );
};

// 3. Icon Helper based on Activity Type
const getActivityIcon = (type) => {
  const icons = {
    need: (
      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </div>
    ),
    donation: (
      <div className="bg-green-100 text-green-600 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    ),
    comment: (
      <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </div>
    ),
    story: (
      <div className="bg-pink-100 text-pink-600 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    ),
    follow: (
      <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      </div>
    ),
    badge: (
      <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      </div>
    ),
  };
  return (
    icons[type] || (
      <div className="bg-gray-100 text-gray-600 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    )
  );
};

// 4. Enhanced Activity Card (Timeline Style)
const ActivityTimelineItem = ({ activity, isLast }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "همین الان";
    if (hours < 24) return `${hours} ساعت پیش`;
    if (days < 7) return `${days} روز پیش`;
    return d.toLocaleDateString("fa-IR", { month: "long", day: "numeric", year: "numeric" });
  };

  const renderContent = () => {
    const { activityType, details } = activity;

    // Common styles
    const contentBoxClass =
      "mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50/30 transition-colors";

    switch (activityType) {
      case "need":
        return (
          <div className={contentBoxClass}>
            <div className="flex justify-between items-start">
              <Typography className="font-bold text-gray-800 text-sm md:text-base">
                {details.title}
              </Typography>
              {details.urgencyLevel && (
                <Chip
                  value={details.urgencyLevel}
                  size="sm"
                  variant="ghost"
                  color="red"
                  className="rounded-full px-2"
                />
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">وضعیت:</span>
              <Chip value={details.status} size="sm" color="blue" className="rounded-md py-0.5" />
            </div>
          </div>
        );

      case "donation":
        return (
          <div className={`${contentBoxClass} border-l-4 border-l-green-500`}>
            <div className="flex items-center justify-between">
              <Typography className="font-bold text-green-700">
                {details.amount?.toLocaleString("fa-IR")} تومان
              </Typography>
              <Chip
                value={details.status === "completed" ? "موفق" : "در انتظار"}
                size="sm"
                variant="ghost"
                color={details.status === "completed" ? "green" : "orange"}
              />
            </div>
            {details.projectTitle && (
              <Typography className="text-xs text-gray-600 mt-2">
                بابت پروژه: <span className="font-medium text-gray-800">{details.projectTitle}</span>
              </Typography>
            )}
          </div>
        );

      case "comment":
        return (
          <div className={contentBoxClass}>
            <div className="flex gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                />
              </svg>
              <Typography className="text-gray-700 text-sm italic">"{details.content}"</Typography>
            </div>
            {details.needTitle && (
              <Typography className="text-xs text-gray-500 text-left dir-ltr">
                on {details.needTitle}
              </Typography>
            )}
          </div>
        );

      case "story":
        return (
          <div className="mt-3 relative group overflow-hidden rounded-lg border border-gray-200">
            {/* Placeholder for story media if available, otherwise styled box */}
            <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-between items-end">
              <span className="text-white text-xs">{details.mediaType}</span>
              <div className="flex gap-2">
                <span className="text-white text-xs flex items-center gap-1">👁️ {details.viewersCount}</span>
                <span className="text-white text-xs flex items-center gap-1">
                  ❤️ {details.reactionsCount}
                </span>
              </div>
            </div>
          </div>
        );

      case "badge":
        return (
          <div className="mt-3 bg-gradient-to-r from-amber-50 to-white p-4 rounded-lg border border-amber-100 flex items-center gap-4">
            <div className="text-3xl">
              {details.badgeIcon || (
                <OptimizedImage src="/icons/cup.svg" alt="cup icon" width={18} heieght={18} />
              )}
            </div>
            <div>
              <Typography className="font-bold text-gray-800 text-sm">
                نشان «{details.badgeName}» دریافت شد
              </Typography>
              {details.progress && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${details.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <Typography className="text-gray-600 text-sm mt-2">{activity.description}</Typography>;
    }
  };

  return (
    <div className="relative flex gap-6 pb-8 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute top-10 right-[1.65rem] bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-100 transition-colors"></div>
      )}

      {/* Avatar & Icon */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <Avatar
            src={activity.user?.profilePicture || "https://via.placeholder.com/40"}
            alt={activity.user?.fullName}
            size="md"
            className="border-2 border-white shadow-sm"
          />
          <div className="absolute -bottom-2 -left-2 bg-white rounded-full p-0.5 shadow-sm">
            {getActivityIcon(activity.activityType)}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 min-w-0">
        <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <CardBody className="p-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <Typography className="font-bold text-gray-900 text-sm">
                  {activity.user?.fullName || activity.user?.username || "کاربر ناشناس"}
                </Typography>
                <Typography className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatDate(activity.timestamp)}
                </Typography>
              </div>

              {/* Action Menu (Optional) */}
              <IconButton
                variant="text"
                size="sm"
                color="blue-gray"
                className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </IconButton>
            </div>

            {/* Main Description */}
            {activity.description && activity.activityType !== "comment" && (
              <Typography className="text-gray-700 text-sm mb-1">{activity.description}</Typography>
            )}

            {/* Dynamic Content */}
            {renderContent()}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const ActivityFeedPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    activityType: "",
    days: 7,
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 20,
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: filters.limit,
        days: filters.days,
      };

      if (filters.activityType) {
        params.activityType = filters.activityType;
      }

      const response = await api.get(`/admin/activity-feed`, { params });

      if (response.data.success) {
        setActivities(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  // Stats Calculation (Mock logic for UI demo, ideally comes from backend)
  const stats = [
    { label: "کل فعالیت‌ها", value: pagination.total, icon: "📊", color: "blue" },
    { label: "بازدید هفته", value: "1.2K", icon: "👁️", color: "orange" }, // Example static
    { label: "مشارکت", value: "+12%", icon: "📈", color: "green" }, // Example static
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans text-[#1e1e1e]">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Typography variant="h3" className="font-bold text-[#1e1e1e] tracking-tight">
              فید فعالیت‌ها
            </Typography>
            <Typography className="text-gray-500 mt-1 font-normal">
              رصد لحظه‌ای رویدادها و تعاملات کاربران در پلتفرم
            </Typography>
          </div>
          <Button
            className="flex items-center gap-2 bg-[#007acc] shadow-blue-500/20 hover:shadow-blue-500/40"
            onClick={fetchActivities}
            size="sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            بروزرسانی
          </Button>
        </div>

        {/* Stats & Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
              <Card key={idx} className="shadow-sm border border-gray-100">
                <CardBody className="p-4 flex items-center justify-between">
                  <div>
                    <Typography className="text-gray-500 text-xs font-bold uppercase mb-1">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" color="blue-gray" className="font-bold">
                      {stat.value.toLocaleString("fa-IR")}
                    </Typography>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-500 text-xl`}>
                    {stat.icon}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Filters Bar */}
          <Card className="lg:col-span-4 shadow-sm border border-gray-100">
            <CardBody className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-1/3">
                  <Select
                    label="نوع فعالیت"
                    value={filters.activityType}
                    onChange={(value) => setFilters({ ...filters, activityType: value || "", page: 1 })}
                    color="blue"
                    className="bg-white"
                  >
                    <Option value="">همه فعالیت‌ها</Option>
                    <Option value="need">نیازها</Option>
                    <Option value="donation"> کمک‌های مالی</Option>
                    <Option value="comment"> نظرات</Option>
                    <Option value="story"> استوری‌ها</Option>
                    <Option value="follow"> فالوها</Option>
                    <Option value="badge">نشان‌ها</Option>
                  </Select>
                </div>
                <div className="w-full md:w-1/3">
                  <Select
                    label="بازه زمانی"
                    value={filters.days.toString()}
                    onChange={(value) => setFilters({ ...filters, days: parseInt(value || "7"), page: 1 })}
                    color="blue"
                    className="bg-white"
                  >
                    <Option value="1">24 ساعت اخیر</Option>
                    <Option value="7">7 روز اخیر</Option>
                    <Option value="14">14 روز اخیر</Option>
                    <Option value="30">30 روز اخیر</Option>
                  </Select>
                </div>
                <div className="w-full md:w-1/3 flex justify-end">
                  <Typography className="text-sm text-gray-500">
                    نمایش {activities.length.toLocaleString("fa-IR")} مورد از{" "}
                    {pagination.total.toLocaleString("fa-IR")}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Timeline Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">
          {loading ? (
            <div className="py-4">
              {[1, 2, 3, 4].map((i) => (
                <ActivitySkeleton key={i} />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                فعالیتی یافت نشد
              </Typography>
              <Typography className="text-gray-500 max-w-xs">
                با تغییر فیلترها یا بازه زمانی، دوباره تلاش کنید.
              </Typography>
              <Button
                variant="text"
                color="blue"
                className="mt-4"
                onClick={() => setFilters({ activityType: "", days: 30, page: 1, limit: 20 })}
              >
                پاک کردن فیلترها
              </Button>
            </div>
          ) : (
            <div className="relative pr-2">
              {activities.map((activity, index) => (
                <ActivityTimelineItem
                  key={index}
                  activity={activity}
                  isLast={index === activities.length - 1}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && activities.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeedPage;
