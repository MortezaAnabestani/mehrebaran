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
import useTeamForm from "../../hooks/useTeamForm";

const EditTeam = () => {
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
    selectedTeam,
  } = useTeamForm(true); // isEdit = true

  const focusArea = watch("focusArea");
  const status = watch("status");

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
            <Link to="/dashboard/teams">
              <Button variant="text" className="flex items-center gap-2">
                <ArrowRightIcon className="w-5 h-5" />
                بازگشت
              </Button>
            </Link>
            <Typography variant="h4" color="blue-gray">
              ویرایش تیم
            </Typography>
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <Alert color="green" icon={<CheckCircleIcon className="w-6 h-6" />} className="mb-6">
            تیم با موفقیت ویرایش شد!
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
          {/* نام تیم */}
          <div>
            <Input
              label="نام تیم *"
              {...register("name")}
              error={!!errors.name}
            />
            {errors.name && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.name.message}
              </Typography>
            )}
          </div>

          {/* توضیحات */}
          <div>
            <Textarea
              label="توضیحات تیم"
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

          {/* Grid for focus area, status and max members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* حوزه فعالیت */}
            <div>
              <Select
                label="حوزه فعالیت"
                value={focusArea}
                onChange={(value) => setValue("focusArea", value)}
              >
                <Option value="">انتخاب کنید</Option>
                <Option value="education">آموزش</Option>
                <Option value="medical">پزشکی و درمان</Option>
                <Option value="construction">ساخت و ساز</Option>
                <Option value="financial">مالی و تامین بودجه</Option>
                <Option value="social">فعالیت‌های اجتماعی</Option>
                <Option value="coordination">هماهنگی و مدیریت</Option>
                <Option value="awareness">آگاهی‌رسانی</Option>
                <Option value="legal">حقوقی</Option>
                <Option value="logistics">لجستیک</Option>
                <Option value="other">سایر</Option>
              </Select>
            </div>

            {/* وضعیت */}
            <div>
              <Select
                label="وضعیت تیم"
                value={status}
                onChange={(value) => setValue("status", value)}
              >
                <Option value="active">فعال</Option>
                <Option value="paused">متوقف شده</Option>
                <Option value="completed">تکمیل شده</Option>
                <Option value="disbanded">منحل شده</Option>
              </Select>
            </div>

            {/* حداکثر اعضا */}
            <div>
              <Input
                type="number"
                label="حداکثر تعداد اعضا"
                {...register("maxMembers")}
                error={!!errors.maxMembers}
              />
              {errors.maxMembers && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.maxMembers.message}
                </Typography>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Input
              label="برچسب‌ها (با کاما جدا کنید)"
              {...register("tags")}
              placeholder="مثال: فوری، تخصصی، داوطلبانه"
            />
            <Typography variant="small" color="gray" className="mt-1">
              برچسب‌ها را با کاما از هم جدا کنید
            </Typography>
          </div>

          {/* اطلاعات تیم */}
          {selectedTeam && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                اطلاعات تیم
              </Typography>
              <div className="grid grid-cols-2 gap-2">
                <Typography variant="small" color="gray">
                  تعداد اعضا: <strong>{selectedTeam.members?.length || 0}</strong>
                </Typography>
                <Typography variant="small" color="gray">
                  تاریخ ایجاد: <strong>{new Date(selectedTeam.createdAt).toLocaleDateString("fa-IR")}</strong>
                </Typography>
              </div>
            </div>
          )}

          {/* دکمه‌های عملیات */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link to="/dashboard/teams">
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

export default EditTeam;
