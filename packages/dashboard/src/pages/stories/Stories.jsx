import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyStories, fetchStoryStats, deleteStory } from "../../features/storiesSlice";
import { Card, Button, Typography, Chip, IconButton } from "@material-tailwind/react";
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  HeartIcon,
  ClockIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import ConfirmDelete from "../../components/createContent/ConfirmDelete";

const Stories = () => {
  const dispatch = useDispatch();
  const { myStories, storyStats, loading } = useSelector((state) => state.stories);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    storyId: null,
  });

  // بارگذاری استوری‌ها و آمار
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchMyStories()).unwrap(),
          dispatch(fetchStoryStats()).unwrap(),
        ]);
      } catch (error) {
        console.error("خطا در بارگذاری استوری‌ها:", error);
      }
    };

    loadData();
  }, [dispatch]);

  // حذف استوری
  const handleDelete = (id) => {
    setDeleteModal({
      isOpen: true,
      storyId: id,
    });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteStory(deleteModal.storyId)).unwrap();
      setDeleteModal({ isOpen: false, storyId: null });
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

  // رنگ chip برای type
  const getTypeColor = (type) => {
    const colorMap = {
      image: "blue",
      video: "purple",
      text: "green",
    };
    return colorMap[type] || "gray";
  };

  // محاسبه زمان باقی‌مانده
  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return "منقضی شده";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours} ساعت باقی‌مانده`;
    return `${minutes} دقیقه باقی‌مانده`;
  };

  return (
    <div className="p-6">
      {/* Stats Card */}
      {storyStats && (
        <Card className="p-6 mb-6">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            آمار استوری‌های شما
          </Typography>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                تعداد کل
              </Typography>
              <Typography variant="h4" color="blue-gray">
                {storyStats.totalStories || 0}
              </Typography>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                تعداد بازدید
              </Typography>
              <Typography variant="h4" color="green">
                {storyStats.totalViews || 0}
              </Typography>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                تعداد ری‌اکشن
              </Typography>
              <Typography variant="h4" color="red">
                {storyStats.totalReactions || 0}
              </Typography>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Typography variant="small" color="gray">
                میانگین بازدید
              </Typography>
              <Typography variant="h4" color="purple">
                {Math.round(storyStats.averageViews || 0)}
              </Typography>
            </div>
          </div>
        </Card>
      )}

      {/* Stories List Card */}
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" color="blue-gray">
            استوری‌های من
          </Typography>
          <Button color="blue" className="flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            ایجاد استوری جدید
          </Button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stories Grid */}
            {myStories && Array.isArray(myStories) && myStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {myStories.map((story) => (
                  <Card
                    key={story._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Story Preview */}
                    <div className="relative h-48 bg-gray-100">
                      {story.type === "image" && story.media?.url ? (
                        <img
                          src={story.media.url}
                          alt="story"
                          className="w-full h-full object-cover"
                        />
                      ) : story.type === "video" && story.media?.thumbnail ? (
                        <img
                          src={story.media.thumbnail}
                          alt="story"
                          className="w-full h-full object-cover"
                        />
                      ) : story.type === "text" ? (
                        <div
                          className="w-full h-full flex items-center justify-center p-4"
                          style={{
                            backgroundColor: story.backgroundColor || "#3B82F6",
                            color: story.textColor || "#FFFFFF",
                          }}
                        >
                          <Typography
                            variant="h6"
                            className="text-center"
                            style={{ color: story.textColor || "#FFFFFF" }}
                          >
                            {story.text?.substring(0, 100)}
                            {story.text?.length > 100 ? "..." : ""}
                          </Typography>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PhotoIcon className="w-16 h-16 text-gray-400" />
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-2 right-2">
                        <Chip
                          value={getTypeLabel(story.type)}
                          color={getTypeColor(story.type)}
                          size="sm"
                        />
                      </div>

                      {/* Expired Badge */}
                      {new Date(story.expiresAt) < new Date() && (
                        <div className="absolute top-2 left-2">
                          <Chip value="منقضی شده" color="red" size="sm" />
                        </div>
                      )}
                    </div>

                    {/* Story Info */}
                    <div className="p-4">
                      {/* Caption */}
                      {story.caption && (
                        <Typography variant="small" color="blue-gray" className="mb-3">
                          {story.caption.substring(0, 80)}
                          {story.caption.length > 80 ? "..." : ""}
                        </Typography>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4 text-gray-500" />
                          <Typography variant="small" color="gray">
                            {story.viewsCount || 0}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4 text-red-500" />
                          <Typography variant="small" color="gray">
                            {story.reactionsCount || 0}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4 text-blue-500" />
                          <Typography variant="small" color="gray">
                            {getTimeRemaining(story.expiresAt)}
                          </Typography>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 border-t pt-3">
                        <Link to={`/dashboard/stories/${story._id}`} className="flex-1">
                          <Button color="blue" size="sm" className="w-full" variant="outlined">
                            جزئیات
                          </Button>
                        </Link>
                        <IconButton
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(story._id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </IconButton>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <PhotoIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <Typography variant="h6" color="gray">
                  هنوز استوری ایجاد نکرده‌اید
                </Typography>
                <Typography variant="small" color="gray" className="mb-4">
                  با ایجاد استوری، لحظات خود را با دیگران به اشتراک بگذارید
                </Typography>
                <Button color="blue" className="flex items-center gap-2 mx-auto">
                  <PlusIcon className="w-5 h-5" />
                  ایجاد اولین استوری
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, storyId: null })}
        onConfirm={confirmDelete}
        title="حذف استوری"
        message="آیا از حذف این استوری اطمینان دارید؟"
      />
    </div>
  );
};

export default Stories;
