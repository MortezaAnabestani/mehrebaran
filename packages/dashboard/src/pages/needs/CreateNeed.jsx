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
} from "@material-tailwind/react";
import { ArrowRightIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import useNeedForm from "../../hooks/useNeedForm";

const CreateNeed = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    editorContent,
    handleContentChange,
    setValue,
    watch,
  } = useNeedForm(false);

  const status = watch("status");
  const urgencyLevel = watch("urgencyLevel");

  return (
    <div className="p-6">
      <Card className="p-6">
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
              ایجاد نیاز جدید
            </Typography>
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <Alert color="green" icon={<CheckCircleIcon className="w-6 h-6" />} className="mb-6">
            نیاز با موفقیت ایجاد شد!
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
          {/* عنوان */}
          <div>
            <Input
              label="عنوان نیاز *"
              {...register("title")}
              error={!!errors.title}
            />
            {errors.title && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.title.message}
              </Typography>
            )}
          </div>

          {/* توضیحات */}
          <div>
            <Textarea
              label="توضیحات *"
              {...register("description")}
              rows={6}
              error={!!errors.description}
            />
            {errors.description && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.description.message}
              </Typography>
            )}
          </div>

          {/* Grid for dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* دسته‌بندی */}
            <div>
              <Select
                label="دسته‌بندی *"
                value={watch("category")}
                onChange={(value) => setValue("category", value)}
                error={!!errors.category}
              >
                <Option value="">انتخاب کنید</Option>
                {/* TODO: Load categories from API */}
                <Option value="health">سلامت</Option>
                <Option value="education">آموزش</Option>
                <Option value="housing">مسکن</Option>
                <Option value="food">غذا</Option>
                <Option value="clothing">پوشاک</Option>
                <Option value="other">سایر</Option>
              </Select>
              {errors.category && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.category.message}
                </Typography>
              )}
            </div>

            {/* وضعیت */}
            <div>
              <Select
                label="وضعیت"
                value={status}
                onChange={(value) => setValue("status", value)}
              >
                <Option value="draft">پیش‌نویس</Option>
                <Option value="pending">در انتظار</Option>
                <Option value="under_review">در حال بررسی</Option>
                <Option value="approved">تایید شده</Option>
                <Option value="in_progress">در حال انجام</Option>
              </Select>
            </div>

            {/* سطح فوریت */}
            <div>
              <Select
                label="سطح فوریت"
                value={urgencyLevel}
                onChange={(value) => setValue("urgencyLevel", value)}
              >
                <Option value="low">کم</Option>
                <Option value="medium">متوسط</Option>
                <Option value="high">زیاد</Option>
                <Option value="critical">بحرانی</Option>
              </Select>
            </div>
          </div>

          {/* مدت زمان تخمینی */}
          <div>
            <Input
              label="مدت زمان تخمینی (مثال: 2 هفته، 1 ماه)"
              {...register("estimatedDuration")}
            />
          </div>

          {/* مکان */}
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-4">
              موقعیت مکانی
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="آدرس"
                {...register("location.address")}
              />
              <Input
                label="نام مکان"
                {...register("location.locationName")}
              />
              <Input
                label="شهر"
                {...register("location.city")}
              />
              <Input
                label="استان"
                {...register("location.province")}
              />
            </div>
          </div>

          {/* فایل‌های پیوست */}
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              فایل‌های پیوست (تصاویر، اسناد)
            </Typography>
            <input
              type="file"
              multiple
              {...register("attachments")}
              accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.attachments && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.attachments.message}
              </Typography>
            )}
            <Typography variant="small" color="gray" className="mt-1">
              حجم هر فایل نباید بیشتر از ۲۰ مگابایت باشد
            </Typography>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link to="/dashboard/needs">
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
              {isSubmitting ? "در حال ایجاد..." : "ایجاد نیاز"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateNeed;
