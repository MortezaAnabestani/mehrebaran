import { Link } from "react-router-dom";
import {
  Card,
  Input,
  Textarea,
  Select,
  Option,
  Button,
  Typography,
  Alert,
  Switch,
} from "@material-tailwind/react";
import { ArrowRightIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import useBadgeForm from "../../hooks/useBadgeForm";

const EditBadge = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    loading,
    submitSuccess,
    submitError,
    setValue,
    watch,
    selectedBadge,
  } = useBadgeForm(true); // isEdit = true

  const category = watch("category");
  const rarity = watch("rarity");
  const isActive = watch("isActive");
  const isSecret = watch("isSecret");

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/gamification/badges">
              <Button variant="text" className="flex items-center gap-2">
                <ArrowRightIcon className="w-5 h-5" />
                بازگشت
              </Button>
            </Link>
            <Typography variant="h4" color="blue-gray">
              ویرایش نشان
            </Typography>
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <Alert color="green" icon={<CheckCircleIcon className="w-6 h-6" />} className="mb-6">
            نشان با موفقیت ویرایش شد!
          </Alert>
        )}

        {/* Error Alert */}
        {submitError && (
          <Alert color="red" icon={<XCircleIcon className="w-6 h-6" />} className="mb-6">
            {submitError}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* نام فارسی و انگلیسی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="نام فارسی نشان *"
                {...register("name")}
                error={!!errors.name}
              />
              {errors.name && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.name.message}
                </Typography>
              )}
            </div>
            <div>
              <Input
                label="نام انگلیسی نشان *"
                {...register("nameEn")}
                error={!!errors.nameEn}
              />
              {errors.nameEn && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.nameEn.message}
                </Typography>
              )}
            </div>
          </div>

          {/* توضیحات */}
          <div>
            <Textarea
              label="توضیحات نشان *"
              {...register("description")}
              rows={4}
              error={!!errors.description}
            />
            {errors.description && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.description.message}
              </Typography>
            )}
          </div>

          {/* دسته‌بندی، کمیابی و امتیاز */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* دسته‌بندی */}
            <div>
              <Select
                label="دسته‌بندی *"
                value={category}
                onChange={(value) => setValue("category", value)}
                error={!!errors.category}
              >
                <Option value="contributor">مشارکت‌کننده</Option>
                <Option value="supporter">حمایت‌کننده</Option>
                <Option value="creator">سازنده</Option>
                <Option value="helper">کمک‌کننده</Option>
                <Option value="communicator">ارتباط‌گیر</Option>
                <Option value="leader">رهبر</Option>
                <Option value="expert">متخصص</Option>
                <Option value="milestone">نقطه عطف</Option>
                <Option value="special">ویژه</Option>
                <Option value="seasonal">فصلی</Option>
              </Select>
              {errors.category && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.category.message}
                </Typography>
              )}
            </div>

            {/* کمیابی */}
            <div>
              <Select
                label="کمیابی"
                value={rarity}
                onChange={(value) => setValue("rarity", value)}
              >
                <Option value="common">معمولی</Option>
                <Option value="rare">نادر</Option>
                <Option value="epic">حماسی</Option>
                <Option value="legendary">افسانه‌ای</Option>
              </Select>
            </div>

            {/* امتیاز */}
            <div>
              <Input
                type="number"
                label="امتیاز"
                {...register("points")}
                error={!!errors.points}
              />
              {errors.points && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.points.message}
                </Typography>
              )}
            </div>
          </div>

          {/* آیکون و رنگ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* آیکون */}
            <div>
              <Input
                label="آیکون (ایموجی) *"
                {...register("icon")}
                error={!!errors.icon}
              />
              {errors.icon && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.icon.message}
                </Typography>
              )}
              <Typography variant="small" color="gray" className="mt-1">
                می‌توانید از ایموجی‌ها استفاده کنید (مثال: 🏆 🎖️ ⭐ 💎)
              </Typography>
            </div>

            {/* رنگ */}
            <div>
              <Input
                type="color"
                label="رنگ نشان"
                {...register("color")}
              />
              <Typography variant="small" color="gray" className="mt-1">
                رنگ پس‌زمینه نشان را انتخاب کنید
              </Typography>
            </div>
          </div>

          {/* ترتیب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                label="ترتیب نمایش"
                {...register("order")}
              />
              <Typography variant="small" color="gray" className="mt-1">
                ترتیب نمایش نشان در لیست (عدد کمتر = اولویت بیشتر)
              </Typography>
            </div>
          </div>

          {/* تنظیمات */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <Typography variant="h6" color="blue-gray">
              تنظیمات
            </Typography>

            {/* فعال بودن */}
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-bold">
                  وضعیت فعال
                </Typography>
                <Typography variant="small" color="gray">
                  نشان فعال برای کاربران قابل دریافت است
                </Typography>
              </div>
              <Switch
                checked={isActive}
                onChange={(e) => setValue("isActive", e.target.checked)}
                color="green"
              />
            </div>

            {/* مخفی بودن */}
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="blue-gray" className="font-bold">
                  نشان مخفی
                </Typography>
                <Typography variant="small" color="gray">
                  نشان‌های مخفی تا زمان دریافت برای کاربران نمایش داده نمی‌شوند
                </Typography>
              </div>
              <Switch
                checked={isSecret}
                onChange={(e) => setValue("isSecret", e.target.checked)}
                color="blue"
              />
            </div>
          </div>

          {/* اطلاعات نشان */}
          {selectedBadge && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                اطلاعات نشان
              </Typography>
              <div className="grid grid-cols-2 gap-2">
                <Typography variant="small" color="gray">
                  تاریخ ایجاد: <strong>{new Date(selectedBadge.createdAt).toLocaleDateString("fa-IR")}</strong>
                </Typography>
                <Typography variant="small" color="gray">
                  آخرین بروزرسانی: <strong>{new Date(selectedBadge.updatedAt).toLocaleDateString("fa-IR")}</strong>
                </Typography>
              </div>
            </div>
          )}

          {/* دکمه‌های عملیات */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link to="/dashboard/gamification/badges">
              <Button variant="outlined" color="gray">
                انصراف
              </Button>
            </Link>
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditBadge;
