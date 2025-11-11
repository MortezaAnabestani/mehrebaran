import { Link, useParams } from "react-router-dom";
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

const CreateTeam = () => {
  const { needId } = useParams();
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    setValue,
    watch,
  } = useTeamForm(false);

  const focusArea = watch("focusArea");
  const maxMembers = watch("maxMembers");

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
              ایجاد تیم جدید
            </Typography>
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <Alert color="green" icon={<CheckCircleIcon className="w-6 h-6" />} className="mb-6">
            تیم با موفقیت ایجاد شد!
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
            <Typography variant="small" color="gray" className="mt-1">
              توضیح مختصری درباره اهداف و وظایف تیم بنویسید
            </Typography>
          </div>

          {/* Grid for focus area and max members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Typography variant="small" color="gray" className="mt-1">
                حوزه‌ای که تیم روی آن تمرکز دارد
              </Typography>
            </div>

            {/* حداکثر اعضا */}
            <div>
              <Input
                type="number"
                label="حداکثر تعداد اعضا"
                {...register("maxMembers")}
                error={!!errors.maxMembers}
                defaultValue={10}
              />
              {errors.maxMembers && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.maxMembers.message}
                </Typography>
              )}
              <Typography variant="small" color="gray" className="mt-1">
                حداکثر تعداد اعضایی که می‌توانند به تیم بپیوندند
              </Typography>
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

          {/* توضیحات اضافی */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <Typography variant="small" color="blue-gray">
              <strong>نکته:</strong> پس از ایجاد تیم، شما به عنوان رهبر تیم تعیین می‌شوید و می‌توانید اعضای دیگر را به تیم دعوت کنید.
            </Typography>
          </div>

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
              {isSubmitting ? "در حال ایجاد..." : "ایجاد تیم"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateTeam;
