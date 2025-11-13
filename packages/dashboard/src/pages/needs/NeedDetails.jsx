import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchNeedById } from "../../features/needsSlice";
import { Card, Button, Typography, Chip } from "@material-tailwind/react";
import { ArrowRightIcon, PencilIcon, UserGroupIcon, MapPinIcon } from "@heroicons/react/24/outline";

const NeedDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedNeed, loading } = useSelector((state) => state.needs);

  useEffect(() => {
    if (id) {
      dispatch(fetchNeedById(id));
    }
  }, [dispatch, id]);

  // تبدیل status به فارسی
  const getStatusLabel = (status) => {
    const statusMap = {
      draft: "پیش‌نویس",
      pending: "در انتظار",
      under_review: "در حال بررسی",
      approved: "تایید شده",
      in_progress: "در حال انجام",
      completed: "تکمیل شده",
      rejected: "رد شده",
      archived: "آرشیو شده",
      cancelled: "لغو شده",
    };
    return statusMap[status] || status;
  };

  // تبدیل urgencyLevel به فارسی
  const getUrgencyLabel = (level) => {
    const levelMap = {
      low: "کم",
      medium: "متوسط",
      high: "زیاد",
      critical: "بحرانی",
    };
    return levelMap[level] || level;
  };

  // رنگ chip برای urgencyLevel
  const getUrgencyColor = (level) => {
    const colorMap = {
      low: "green",
      medium: "yellow",
      high: "orange",
      critical: "red",
    };
    return colorMap[level] || "gray";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedNeed) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <Typography variant="h5" color="blue-gray">
            نیازی یافت نشد
          </Typography>
          <Link to="/dashboard/needs">
            <Button color="blue" className="mt-4">
              بازگشت به لیست نیازها
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/needs">
            <Button variant="text" className="flex items-center gap-2">
              <ArrowRightIcon className="w-5 h-5" />
              بازگشت
            </Button>
          </Link>
          <Typography variant="h4" color="blue-gray">
            جزئیات نیاز
          </Typography>
        </div>
        <Link to={`/dashboard/needs/edit/${selectedNeed._id}`}>
          <Button color="blue" className="flex items-center gap-2">
            <PencilIcon className="w-5 h-5" />
            ویرایش
          </Button>
        </Link>
      </div>

      {/* Main Card */}
      <Card className="p-6 mb-6">
        {/* عنوان و وضعیت */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <Typography variant="h3" color="blue-gray" className="mb-2">
              {selectedNeed.title}
            </Typography>
            <div className="flex gap-2">
              <Chip
                value={getStatusLabel(selectedNeed.status)}
                color={selectedNeed.status === "completed" ? "green" : selectedNeed.status === "rejected" ? "red" : "blue"}
              />
              <Chip
                value={getUrgencyLabel(selectedNeed.urgencyLevel)}
                color={getUrgencyColor(selectedNeed.urgencyLevel)}
              />
            </div>
          </div>
        </div>

        {/* توضیحات */}
        <div className="mb-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            توضیحات
          </Typography>
          <Typography color="gray" className="whitespace-pre-wrap">
            {selectedNeed.description}
          </Typography>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-blue-50">
            <Typography variant="small" color="blue-gray" className="mb-1">
              حمایت‌کنندگان
            </Typography>
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-6 h-6 text-blue-500" />
              <Typography variant="h5" color="blue">
                {selectedNeed.supporters?.length || 0}
              </Typography>
            </div>
          </Card>

          <Card className="p-4 bg-green-50">
            <Typography variant="small" color="blue-gray" className="mb-1">
              پیشرفت کلی
            </Typography>
            <Typography variant="h5" color="green">
              {selectedNeed.overallProgress || 0}%
            </Typography>
          </Card>

          <Card className="p-4 bg-purple-50">
            <Typography variant="small" color="blue-gray" className="mb-1">
              تعداد مایلستون‌ها
            </Typography>
            <Typography variant="h5" color="purple">
              {selectedNeed.milestones?.length || 0}
            </Typography>
          </Card>

          <Card className="p-4 bg-orange-50">
            <Typography variant="small" color="blue-gray" className="mb-1">
              تعداد تسک‌ها
            </Typography>
            <Typography variant="h5" color="orange">
              {selectedNeed.tasks?.length || 0} / {selectedNeed.completedTasksCount || 0}
            </Typography>
          </Card>
        </div>

        {/* مکان */}
        {selectedNeed.location && (selectedNeed.location.address || selectedNeed.location.city) && (
          <div className="mb-6">
            <Typography variant="h6" color="blue-gray" className="mb-2 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              موقعیت مکانی
            </Typography>
            <div className="bg-gray-50 p-4 rounded-md">
              {selectedNeed.location.locationName && (
                <Typography color="gray">
                  <strong>نام مکان:</strong> {selectedNeed.location.locationName}
                </Typography>
              )}
              {selectedNeed.location.address && (
                <Typography color="gray">
                  <strong>آدرس:</strong> {selectedNeed.location.address}
                </Typography>
              )}
              {selectedNeed.location.city && selectedNeed.location.province && (
                <Typography color="gray">
                  <strong>شهر و استان:</strong> {selectedNeed.location.city}، {selectedNeed.location.province}
                </Typography>
              )}
            </div>
          </div>
        )}

        {/* تگ‌ها و مهارت‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {selectedNeed.tags && selectedNeed.tags.length > 0 && (
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                تگ‌ها
              </Typography>
              <div className="flex flex-wrap gap-2">
                {selectedNeed.tags.map((tag, index) => (
                  <Chip key={index} value={tag} color="blue" variant="ghost" />
                ))}
              </div>
            </div>
          )}

          {selectedNeed.requiredSkills && selectedNeed.requiredSkills.length > 0 && (
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                مهارت‌های مورد نیاز
              </Typography>
              <div className="flex flex-wrap gap-2">
                {selectedNeed.requiredSkills.map((skill, index) => (
                  <Chip key={index} value={skill} color="green" variant="ghost" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* تصاویر و فایل‌های پیوست */}
        {selectedNeed.attachments && selectedNeed.attachments.length > 0 && (
          <div className="mb-6">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              فایل‌های پیوست
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedNeed.attachments.map((attachment, index) => (
                <div key={index} className="relative">
                  {attachment.fileType === "image" ? (
                    <img
                      src={attachment.url}
                      alt={attachment.fileName}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                      <Typography variant="small">{attachment.fileType}</Typography>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* زمان‌ها */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <Typography variant="small" color="blue-gray">
                تاریخ ایجاد: {new Date(selectedNeed.createdAt).toLocaleDateString("fa-IR")}
              </Typography>
            </div>
            <div>
              <Typography variant="small" color="blue-gray">
                آخرین بروزرسانی: {new Date(selectedNeed.updatedAt).toLocaleDateString("fa-IR")}
              </Typography>
            </div>
            {selectedNeed.estimatedDuration && (
              <div>
                <Typography variant="small" color="blue-gray">
                  مدت زمان تخمینی: {selectedNeed.estimatedDuration}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NeedDetails;
