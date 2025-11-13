import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUserMentions,
  getUnreadMentionCount,
  markMentionAsRead,
  markAllMentionsAsRead,
} from "../../features/socialSlice";
import {
  Card,
  Button,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import {
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const Mentions = () => {
  const dispatch = useDispatch();
  const { mentions, unreadMentionCount, loading } = useSelector((state) => state.social);

  const [filter, setFilter] = useState("all"); // all, unread, read

  // بارگذاری منشن‌ها
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(getUserMentions()).unwrap(),
          dispatch(getUnreadMentionCount()).unwrap(),
        ]);
      } catch (error) {
        console.error("خطا در بارگذاری منشن‌ها:", error);
      }
    };

    loadData();
  }, [dispatch]);

  // علامت‌گذاری منشن به عنوان خوانده شده
  const handleMarkAsRead = async (mentionId) => {
    try {
      await dispatch(markMentionAsRead(mentionId)).unwrap();
    } catch (error) {
      console.error("خطا در علامت‌گذاری منشن:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // علامت‌گذاری همه منشن‌ها به عنوان خوانده شده
  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllMentionsAsRead()).unwrap();
    } catch (error) {
      console.error("خطا در علامت‌گذاری همه منشن‌ها:", error);
      alert(error || "خطایی رخ داده است");
    }
  };

  // فیلتر منشن‌ها
  const filteredMentions = mentions.filter((mention) => {
    if (filter === "unread") return !mention.isRead;
    if (filter === "read") return mention.isRead;
    return true;
  });

  // تبدیل context به فارسی
  const getContextLabel = (context) => {
    const contextMap = {
      comment: "کامنت",
      message: "پیام",
      need_update: "به‌روزرسانی نیاز",
      task_description: "توضیحات تسک",
      team_invitation: "دعوت به تیم",
      direct_message: "پیام مستقیم",
    };
    return contextMap[context] || context;
  };

  // رنگ context
  const getContextColor = (context) => {
    const colorMap = {
      comment: "blue",
      message: "green",
      need_update: "purple",
      task_description: "orange",
      team_invitation: "pink",
      direct_message: "cyan",
    };
    return colorMap[context] || "gray";
  };

  return (
    <div className="p-6">
      {/* Stats Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              منشن‌های شما
            </Typography>
            <Typography variant="small" color="gray">
              تعداد منشن‌های خوانده نشده: {unreadMentionCount}
            </Typography>
          </div>
          {unreadMentionCount > 0 && (
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={handleMarkAllAsRead}
            >
              <CheckCircleIcon className="w-5 h-5" />
              علامت‌گذاری همه به عنوان خوانده شده
            </Button>
          )}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-2">
          <Button
            size="sm"
            color={filter === "all" ? "blue" : "gray"}
            variant={filter === "all" ? "filled" : "outlined"}
            onClick={() => setFilter("all")}
          >
            همه ({mentions?.length || 0})
          </Button>
          <Button
            size="sm"
            color={filter === "unread" ? "blue" : "gray"}
            variant={filter === "unread" ? "filled" : "outlined"}
            onClick={() => setFilter("unread")}
          >
            خوانده نشده ({unreadMentionCount})
          </Button>
          <Button
            size="sm"
            color={filter === "read" ? "blue" : "gray"}
            variant={filter === "read" ? "filled" : "outlined"}
            onClick={() => setFilter("read")}
          >
            خوانده شده ({mentions?.length - unreadMentionCount || 0})
          </Button>
        </div>
      </Card>

      {/* Mentions List */}
      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMentions && filteredMentions.length > 0 ? (
          <div className="space-y-3">
            {filteredMentions.map((mention) => (
              <div
                key={mention._id}
                className={`relative p-4 rounded-lg border ${
                  mention.isRead
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                {/* Unread Indicator */}
                {!mention.isRead && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}

                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar
                    src={mention.mentionedBy?.profilePicture || "/default-avatar.png"}
                    alt={mention.mentionedBy?.name || "کاربر"}
                    size="md"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Typography variant="h6" color="blue-gray">
                        {mention.mentionedBy?.name || "کاربر"}
                      </Typography>
                      <Typography variant="small" color="gray">
                        @{mention.mentionedBy?.username || "username"}
                      </Typography>
                      <Chip
                        value={getContextLabel(mention.context)}
                        color={getContextColor(mention.context)}
                        size="sm"
                      />
                    </div>

                    {mention.text && (
                      <Typography variant="paragraph" color="gray" className="mb-2">
                        {mention.text}
                      </Typography>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <Typography variant="small" color="gray">
                        {new Date(mention.createdAt).toLocaleString("fa-IR")}
                      </Typography>

                      {mention.relatedModel && (
                        <Link
                          to={`/dashboard/${mention.relatedModel}s/${mention.relatedId}`}
                          className="text-blue-500 hover:underline text-sm"
                        >
                          مشاهده محتوا
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {!mention.isRead && (
                      <IconButton
                        size="sm"
                        color="blue"
                        variant="text"
                        onClick={() => handleMarkAsRead(mention._id)}
                        title="علامت‌گذاری به عنوان خوانده شده"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </IconButton>
                    )}
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
                ? "منشن خوانده نشده‌ای وجود ندارد"
                : filter === "read"
                ? "منشن خوانده شده‌ای وجود ندارد"
                : "هنوز منشنی دریافت نکرده‌اید"}
            </Typography>
            <Typography variant="small" color="gray" className="mt-2">
              وقتی کسی شما را در کامنت یا پیامی منشن کند، اینجا نمایش داده می‌شود
            </Typography>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Mentions;
