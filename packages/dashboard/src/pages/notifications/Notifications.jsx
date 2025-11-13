import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getNotifications,
  getUnreadCount,
  getNotificationStats,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
} from "../../features/notificationsSlice";
import {
  Card,
  Button,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import {
  BellIcon,
  CheckCircleIcon,
  TrashIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, stats, loading } = useSelector(
    (state) => state.notifications
  );

  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all"); // all, mention, follow, etc.

  // بارگذاری اعلانات
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(getNotifications()).unwrap(),
          dispatch(getUnreadCount()).unwrap(),
          dispatch(getNotificationStats()).unwrap(),
        ]);
      } catch (error) {
        console.error("خطا در بارگذاری اعلانات:", error);
      }
    };

    loadData();
  }, [dispatch]);

  // علامت‌گذاری به عنوان خوانده شده
  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markAsRead(notificationId)).unwrap();
    } catch (error) {
      console.error("خطا در علامت‌گذاری اعلان:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // علامت‌گذاری همه به عنوان خوانده شده
  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
    } catch (error) {
      console.error("خطا در علامت‌گذاری همه اعلانات:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // حذف اعلان
  const handleDelete = async (notificationId) => {
    if (!window.confirm("آیا از حذف این اعلان اطمینان دارید؟")) return;

    try {
      await dispatch(deleteNotification(notificationId)).unwrap();
    } catch (error) {
      console.error("خطا در حذف اعلان:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // حذف همه اعلانات خوانده شده
  const handleDeleteAllRead = async () => {
    if (!window.confirm("آیا از حذف همه اعلانات خوانده شده اطمینان دارید؟")) return;

    try {
      await dispatch(deleteAllRead()).unwrap();
    } catch (error) {
      console.error("خطا در حذف اعلانات:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // فیلتر اعلانات
  const filteredNotifications = notifications.filter((notification) => {
    // فیلتر خوانده/نخوانده
    if (filter === "unread" && notification.isRead) return false;
    if (filter === "read" && !notification.isRead) return false;

    // فیلتر نوع
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;

    return true;
  });

  // تبدیل نوع به فارسی
  const getTypeLabel = (type) => {
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
  };

  // رنگ نوع
  const getTypeColor = (type) => {
    const colorMap = {
      mention: "blue",
      follow: "green",
      follow_need: "purple",
      badge_earned: "yellow",
      level_up: "orange",
      need_update: "cyan",
      need_completed: "green",
      need_support: "pink",
      task_assigned: "indigo",
      task_completed: "green",
      milestone_completed: "teal",
      team_invitation: "purple",
      team_joined: "green",
      team_left: "red",
      comment_posted: "blue",
      comment_reply: "cyan",
      direct_message: "purple",
      verification_approved: "green",
      verification_rejected: "red",
      admin_announcement: "red",
      system_alert: "red",
    };
    return colorMap[type] || "gray";
  };

  // رنگ اولویت
  const getPriorityColor = (priority) => {
    const colorMap = {
      low: "gray",
      normal: "blue",
      high: "orange",
      urgent: "red",
    };
    return colorMap[priority] || "gray";
  };

  return (
    <div className="p-6">
      {/* Stats Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              اعلانات
            </Typography>
            <Typography variant="small" color="gray">
              تعداد اعلانات خوانده نشده: {unreadCount}
            </Typography>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                color="blue"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleMarkAllAsRead}
              >
                <CheckCircleIcon className="w-5 h-5" />
                خواندن همه
              </Button>
            )}
            <Button
              color="red"
              size="sm"
              variant="outlined"
              className="flex items-center gap-2"
              onClick={handleDeleteAllRead}
            >
              <TrashIcon className="w-5 h-5" />
              حذف خوانده شده‌ها
            </Button>
            <Link to="/dashboard/notifications/settings">
              <Button size="sm" variant="outlined" className="flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5" />
                تنظیمات
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                کل اعلانات
              </Typography>
              <Typography variant="h4" color="blue">
                {stats.total || 0}
              </Typography>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                خوانده نشده
              </Typography>
              <Typography variant="h4" color="green">
                {stats.unread || 0}
              </Typography>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                امروز
              </Typography>
              <Typography variant="h4" color="purple">
                {stats.today || 0}
              </Typography>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                این هفته
              </Typography>
              <Typography variant="h4" color="orange">
                {stats.thisWeek || 0}
              </Typography>
            </div>
          </div>
        )}
      </Card>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2">
            <Button
              size="sm"
              color={filter === "all" ? "blue" : "gray"}
              variant={filter === "all" ? "filled" : "outlined"}
              onClick={() => setFilter("all")}
            >
              همه ({notifications?.length || 0})
            </Button>
            <Button
              size="sm"
              color={filter === "unread" ? "blue" : "gray"}
              variant={filter === "unread" ? "filled" : "outlined"}
              onClick={() => setFilter("unread")}
            >
              خوانده نشده ({unreadCount})
            </Button>
            <Button
              size="sm"
              color={filter === "read" ? "blue" : "gray"}
              variant={filter === "read" ? "filled" : "outlined"}
              onClick={() => setFilter("read")}
            >
              خوانده شده ({(notifications?.length || 0) - unreadCount})
            </Button>
          </div>

          <div className="flex-1" />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">همه انواع</option>
            <option value="mention">منشن</option>
            <option value="follow">دنبال کردن</option>
            <option value="badge_earned">دریافت نشان</option>
            <option value="task_assigned">تخصیص تسک</option>
            <option value="team_invitation">دعوت به تیم</option>
            <option value="admin_announcement">اعلان مدیر</option>
          </select>
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotifications && filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`relative p-4 rounded-lg border ${
                  notification.isRead
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}

                <div className="flex items-start gap-4">
                  {/* Actor Avatar */}
                  {notification.actor && (
                    <Avatar
                      src={notification.actor?.profilePicture || "/default-avatar.png"}
                      alt={notification.actor?.name || "کاربر"}
                      size="md"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Chip
                        value={getTypeLabel(notification.type)}
                        color={getTypeColor(notification.type)}
                        size="sm"
                      />
                      {notification.priority !== "normal" && (
                        <Chip
                          value={notification.priority}
                          color={getPriorityColor(notification.priority)}
                          size="sm"
                        />
                      )}
                    </div>

                    <Typography variant="h6" color="blue-gray" className="mb-1">
                      {notification.title}
                    </Typography>

                    <Typography variant="paragraph" color="gray" className="mb-2">
                      {notification.message}
                    </Typography>

                    <div className="flex items-center gap-4 mt-3">
                      <Typography variant="small" color="gray">
                        {new Date(notification.createdAt).toLocaleString("fa-IR")}
                      </Typography>

                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          className="text-blue-500 hover:underline text-sm"
                        >
                          {notification.actionLabel || "مشاهده"}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <IconButton
                        size="sm"
                        color="blue"
                        variant="text"
                        onClick={() => handleMarkAsRead(notification._id)}
                        title="علامت‌گذاری به عنوان خوانده شده"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </IconButton>
                    )}
                    <IconButton
                      size="sm"
                      color="red"
                      variant="text"
                      onClick={() => handleDelete(notification._id)}
                      title="حذف"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <BellIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <Typography variant="h6" color="gray">
              {filter === "unread"
                ? "اعلان خوانده نشده‌ای وجود ندارد"
                : filter === "read"
                ? "اعلان خوانده شده‌ای وجود ندارد"
                : typeFilter !== "all"
                ? "اعلانی با این نوع یافت نشد"
                : "هنوز اعلانی دریافت نکرده‌اید"}
            </Typography>
            <Typography variant="small" color="gray" className="mt-2">
              اعلانات شما در اینجا نمایش داده می‌شود
            </Typography>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
