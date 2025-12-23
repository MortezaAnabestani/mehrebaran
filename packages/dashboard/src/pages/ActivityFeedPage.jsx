import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Select,
  Option,
  Chip,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import api from "../services/api";

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-2 justify-center mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        قبلی
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        بعدی
      </button>
    </div>
  );
};

// Activity Type Badge
const ActivityTypeBadge = ({ type }) => {
  const typeConfig = {
    need: { color: "blue", label: "نیاز" },
    donation: { color: "green", label: "کمک مالی" },
    comment: { color: "purple", label: "نظر" },
    story: { color: "pink", label: "استوری" },
    follow: { color: "indigo", label: "فالو" },
    badge: { color: "amber", label: "نشان" },
  };

  const config = typeConfig[type] || { color: "gray", label: type };

  return (
    <Chip
      value={config.label}
      color={config.color}
      size="sm"
      className="rounded-full"
    />
  );
};

// Activity Card Component
const ActivityCard = ({ activity }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "همین الان";
    if (hours < 24) return `${hours} ساعت پیش`;
    if (days < 7) return `${days} روز پیش`;
    return d.toLocaleDateString("fa-IR");
  };

  const renderActivityDetails = () => {
    const { activityType, details } = activity;

    switch (activityType) {
      case "need":
        return (
          <div className="mt-2">
            <Typography className="font-semibold text-gray-800">
              {details.title}
            </Typography>
            <div className="flex gap-2 mt-1">
              <Chip value={details.status} size="sm" color="blue" />
              {details.urgencyLevel && (
                <Chip
                  value={`اولویت: ${details.urgencyLevel}`}
                  size="sm"
                  color="red"
                />
              )}
            </div>
          </div>
        );

      case "donation":
        return (
          <div className="mt-2">
            <Typography className="font-semibold text-gray-800">
              مبلغ: {details.amount?.toLocaleString("fa-IR")} تومان
            </Typography>
            {details.projectTitle && (
              <Typography className="text-sm text-gray-600 mt-1">
                برای پروژه: {details.projectTitle}
              </Typography>
            )}
            <Chip
              value={details.status}
              size="sm"
              color={details.status === "completed" ? "green" : "orange"}
              className="mt-1"
            />
          </div>
        );

      case "comment":
        return (
          <div className="mt-2">
            <Typography className="text-gray-700 text-sm">
              {details.content}
            </Typography>
            {details.needTitle && (
              <Typography className="text-sm text-gray-600 mt-1">
                در نیاز: {details.needTitle}
              </Typography>
            )}
          </div>
        );

      case "story":
        return (
          <div className="mt-2">
            <Typography className="text-gray-700 text-sm">
              نوع: {details.mediaType}
            </Typography>
            <div className="flex gap-2 mt-1">
              <Chip
                value={`${details.viewersCount} بازدید`}
                size="sm"
                color="blue"
              />
              <Chip
                value={`${details.reactionsCount} واکنش`}
                size="sm"
                color="pink"
              />
            </div>
          </div>
        );

      case "follow":
        return (
          <div className="mt-2">
            <Typography className="text-gray-700">
              <span className="font-semibold">
                {details.followedUser?.fullName || details.followedUser?.username}
              </span>{" "}
              را دنبال کرد
            </Typography>
          </div>
        );

      case "badge":
        return (
          <div className="mt-2">
            <Typography className="font-semibold text-gray-800">
              {details.badgeIcon} {details.badgeName}
            </Typography>
            {details.badgeDescription && (
              <Typography className="text-sm text-gray-600 mt-1">
                {details.badgeDescription}
              </Typography>
            )}
            {details.progress && (
              <Chip
                value={`پیشرفت: ${details.progress}%`}
                size="sm"
                color="green"
                className="mt-1"
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardBody>
        <div className="flex items-start gap-4">
          {/* Activity Icon */}
          <div className="text-3xl">{activity.icon}</div>

          {/* Activity Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {activity.user?.profilePicture ? (
                  <Avatar
                    src={activity.user.profilePicture}
                    alt={activity.user.fullName || activity.user.username}
                    size="sm"
                  />
                ) : (
                  <Avatar
                    src="https://via.placeholder.com/40"
                    alt="User"
                    size="sm"
                  />
                )}
                <div>
                  <Typography className="font-semibold text-sm">
                    {activity.user?.fullName || activity.user?.username || "کاربر ناشناس"}
                  </Typography>
                  <Typography className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </Typography>
                </div>
              </div>
              <ActivityTypeBadge type={activity.activityType} />
            </div>

            {/* Description */}
            <Typography className="text-gray-600 text-sm mb-2">
              {activity.description}
            </Typography>

            {/* Activity Details */}
            {renderActivityDetails()}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// Main Activity Feed Page
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

      const response = await api.get(
        `/admin/activity-feed`,
        { params }
      );

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          فید فعالیت‌ها 📊
        </Typography>
        <Typography className="text-gray-600">
          تمام فعالیت‌های اخیر سایت را مشاهده کنید
        </Typography>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Activity Type Filter */}
            <div>
              <Typography className="text-sm font-semibold mb-2">
                نوع فعالیت
              </Typography>
              <Select
                label="همه فعالیت‌ها"
                value={filters.activityType}
                onChange={(value) =>
                  setFilters({ ...filters, activityType: value || "", page: 1 })
                }
              >
                <Option value="">همه فعالیت‌ها</Option>
                <Option value="need">📝 نیازها</Option>
                <Option value="donation">💰 کمک‌های مالی</Option>
                <Option value="comment">💬 نظرات</Option>
                <Option value="story">📸 استوری‌ها</Option>
                <Option value="follow">👥 فالوها</Option>
                <Option value="badge">🏆 نشان‌ها</Option>
              </Select>
            </div>

            {/* Time Range Filter */}
            <div>
              <Typography className="text-sm font-semibold mb-2">
                بازه زمانی
              </Typography>
              <Select
                label="7 روز اخیر"
                value={filters.days.toString()}
                onChange={(value) =>
                  setFilters({ ...filters, days: parseInt(value || "7"), page: 1 })
                }
              >
                <Option value="1">24 ساعت اخیر</Option>
                <Option value="7">7 روز اخیر</Option>
                <Option value="14">14 روز اخیر</Option>
                <Option value="30">30 روز اخیر</Option>
              </Select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Typography className="text-2xl font-bold text-blue-500">
                  {pagination.total.toLocaleString("fa-IR")}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  فعالیت کل
                </Typography>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Activities Timeline */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner className="h-12 w-12" />
        </div>
      ) : activities.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Typography className="text-gray-500 text-lg">
              فعالیتی یافت نشد
            </Typography>
          </CardBody>
        </Card>
      ) : (
        <>
          {activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ActivityFeedPage;