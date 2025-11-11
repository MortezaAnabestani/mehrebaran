import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchStoryById, fetchViewers, deleteStory } from "../../features/storiesSlice";
import { Card, Button, Typography, Chip, Avatar } from "@material-tailwind/react";
import {
  ArrowRightIcon,
  TrashIcon,
  EyeIcon,
  HeartIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const StoryDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storyId } = useParams();

  const { selectedStory, storyViewers, loading } = useSelector((state) => state.stories);
  const [deleteModal, setDeleteModal] = useState(false);

  // بارگذاری استوری و بیننده‌ها
  useEffect(() => {
    if (storyId) {
      const loadData = async () => {
        try {
          await Promise.all([
            dispatch(fetchStoryById(storyId)).unwrap(),
            dispatch(fetchViewers(storyId)).unwrap(),
          ]);
        } catch (error) {
          console.error("خطا در بارگذاری استوری:", error);
        }
      };

      loadData();
    }
  }, [dispatch, storyId]);

  // حذف استوری
  const handleDelete = async () => {
    try {
      await dispatch(deleteStory(storyId)).unwrap();
      navigate("/dashboard/stories");
    } catch (error) {
      console.error("خطا در حذف استوری:", error);
    }
  };

  // تبدیل type به فارسی
  const getTypeLabel = (type) => {
    const typeMap = {
      image: "تصویر",
      video: "ویدیو",
      text: "متن",
    };
    return typeMap[type] || type;
  };

  // تبدیل privacy به فارسی
  const getPrivacyLabel = (privacy) => {
    const privacyMap = {
      public: "عمومی",
      followers: "دنبال‌کنندگان",
      close_friends: "دوستان نزدیک",
      custom: "سفارشی",
    };
    return privacyMap[privacy] || privacy;
  };

  // محاسبه زمان باقی‌مانده
  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return "منقضی شده";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours} ساعت`;
    return `${minutes} دقیقه`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedStory) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <Typography variant="h5" color="red">
            استوری یافت نشد
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/stories">
                <Button variant="text" className="flex items-center gap-2">
                  <ArrowRightIcon className="w-5 h-5" />
                  بازگشت
                </Button>
              </Link>
              <Typography variant="h4" color="blue-gray">
                جزئیات استوری
              </Typography>
            </div>

            <Button
              color="red"
              className="flex items-center gap-2"
              onClick={() => setDeleteModal(true)}
            >
              <TrashIcon className="w-5 h-5" />
              حذف استوری
            </Button>
          </div>

          {/* Story Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Story Preview */}
            <div>
              <div className="relative rounded-lg overflow-hidden bg-gray-100 h-96">
                {selectedStory.type === "image" && selectedStory.media?.url ? (
                  <img
                    src={selectedStory.media.url}
                    alt="story"
                    className="w-full h-full object-contain"
                  />
                ) : selectedStory.type === "video" && selectedStory.media?.url ? (
                  <video
                    src={selectedStory.media.url}
                    controls
                    className="w-full h-full"
                  />
                ) : selectedStory.type === "text" ? (
                  <div
                    className="w-full h-full flex items-center justify-center p-6"
                    style={{
                      backgroundColor: selectedStory.backgroundColor || "#3B82F6",
                      color: selectedStory.textColor || "#FFFFFF",
                    }}
                  >
                    <Typography
                      variant="h4"
                      className="text-center"
                      style={{ color: selectedStory.textColor || "#FFFFFF" }}
                    >
                      {selectedStory.text}
                    </Typography>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Story Details */}
            <div className="space-y-4">
              {/* Type & Privacy */}
              <div className="flex gap-2">
                <Chip
                  value={getTypeLabel(selectedStory.type)}
                  color="blue"
                  size="sm"
                />
                <Chip
                  value={getPrivacyLabel(selectedStory.privacy)}
                  color="green"
                  size="sm"
                />
                {new Date(selectedStory.expiresAt) < new Date() && (
                  <Chip value="منقضی شده" color="red" size="sm" />
                )}
              </div>

              {/* Caption */}
              {selectedStory.caption && (
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    عنوان:
                  </Typography>
                  <Typography variant="paragraph" color="gray">
                    {selectedStory.caption}
                  </Typography>
                </div>
              )}

              {/* Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  آمار
                </Typography>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <EyeIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <Typography variant="small" color="gray">
                        بازدید
                      </Typography>
                      <Typography variant="h6" color="blue-gray">
                        {selectedStory.viewsCount || 0}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartIcon className="w-5 h-5 text-red-500" />
                    <div>
                      <Typography variant="small" color="gray">
                        ری‌اکشن
                      </Typography>
                      <Typography variant="h6" color="blue-gray">
                        {selectedStory.reactionsCount || 0}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-green-500" />
                    <div>
                      <Typography variant="small" color="gray">
                        زمان باقی‌مانده
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        {getTimeRemaining(selectedStory.expiresAt)}
                      </Typography>
                    </div>
                  </div>
                  <div>
                    <Typography variant="small" color="gray">
                      تاریخ ایجاد
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      {new Date(selectedStory.createdAt).toLocaleDateString("fa-IR")}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  تنظیمات
                </Typography>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="small" color="gray">
                      اجازه پاسخ:
                    </Typography>
                    <Chip
                      value={selectedStory.allowReplies ? "بله" : "خیر"}
                      color={selectedStory.allowReplies ? "green" : "red"}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="small" color="gray">
                      اجازه اشتراک‌گذاری:
                    </Typography>
                    <Chip
                      value={selectedStory.allowSharing ? "بله" : "خیر"}
                      color={selectedStory.allowSharing ? "green" : "red"}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Viewers Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <UsersIcon className="w-6 h-6 text-blue-500" />
            <Typography variant="h5" color="blue-gray">
              بیننده‌ها ({storyViewers?.length || 0})
            </Typography>
          </div>

          {storyViewers && Array.isArray(storyViewers) && storyViewers.length > 0 ? (
            <div className="space-y-3">
              {storyViewers.map((view) => (
                <div
                  key={view._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={view.user?.profilePicture || "/assets/images/default-avatar.png"}
                      alt={view.user?.name || "کاربر"}
                      size="sm"
                    />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {view.user?.name || "کاربر"}
                      </Typography>
                      <Typography variant="small" color="gray">
                        @{view.user?.username || "username"}
                      </Typography>
                    </div>
                  </div>
                  <div className="text-left">
                    <Typography variant="small" color="gray">
                      {new Date(view.viewedAt).toLocaleString("fa-IR")}
                    </Typography>
                    {view.viewDuration && (
                      <Typography variant="small" color="gray">
                        مدت: {view.viewDuration}s
                      </Typography>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <UsersIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <Typography variant="h6" color="gray">
                هنوز کسی این استوری را مشاهده نکرده است
              </Typography>
            </div>
          )}
        </Card>

        {/* Reactions Card */}
        {selectedStory.reactions && selectedStory.reactions.length > 0 && (
          <Card className="p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              ری‌اکشن‌ها ({selectedStory.reactions.length})
            </Typography>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedStory.reactions.map((reaction) => (
                <div
                  key={reaction._id}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-2xl">{reaction.emoji}</span>
                  <Typography variant="small" color="blue-gray">
                    {reaction.user?.name || "کاربر"}
                  </Typography>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف استوری"
        message="آیا از حذف این استوری اطمینان دارید؟"
      />
    </div>
  );
};

export default StoryDetails;
