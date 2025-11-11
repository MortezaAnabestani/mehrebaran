import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useProjectForm } from "../../hooks/useProjectForm";
import { fetchProjectById, updateProject } from "../../features/projectsSlice";
import {
  Card,
  Button,
  Typography,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const EditProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProject, loading: fetchLoading } = useSelector((state) => state.projects);
  const [loading, setLoading] = useState(false);

  const methods = useProjectForm();
  const { handleSubmit, register, formState: { errors }, setValue, watch, reset } = methods;

  // بارگذاری پروژه
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  // پر کردن فرم با داده‌های پروژه
  useEffect(() => {
    if (selectedProject) {
      reset({
        title: selectedProject.title || "",
        subtitle: selectedProject.subtitle || "",
        description: selectedProject.description || "",
        excerpt: selectedProject.excerpt || "",
        category: selectedProject.category?._id || selectedProject.category || "",
        status: selectedProject.status || "draft",
        targetAmount: selectedProject.targetAmount || 0,
        amountRaised: selectedProject.amountRaised || 0,
        targetVolunteer: selectedProject.targetVolunteer || 0,
        collectedVolunteer: selectedProject.collectedVolunteer || 0,
        deadline: selectedProject.deadline ? new Date(selectedProject.deadline).toISOString().split('T')[0] : "",
        featuredImage: {
          url: selectedProject.featuredImage?.url || "",
          alt: selectedProject.featuredImage?.alt || "",
          caption: selectedProject.featuredImage?.caption || "",
        },
        seo: {
          metaTitle: selectedProject.seo?.metaTitle || "",
          metaDescription: selectedProject.seo?.metaDescription || "",
          keywords: selectedProject.seo?.keywords || [],
          ogImage: selectedProject.seo?.ogImage || "",
        },
      });
    }
  }, [selectedProject, reset]);

  // ارسال فرم
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(updateProject({ id, projectData: data })).unwrap();
      console.log("پروژه با موفقیت ویرایش شد");
      navigate("/dashboard/projects");
    } catch (error) {
      console.error(error || "خطایی در ویرایش پروژه رخ داده است");
      alert(error || "خطایی در ویرایش پروژه رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <Typography variant="h5" color="red">
            پروژه یافت نشد
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard/projects">
            <Button variant="text" className="flex items-center gap-2">
              <ArrowRightIcon className="w-5 h-5" />
              بازگشت
            </Button>
          </Link>
          <Typography variant="h4" color="blue-gray">
            ویرایش پروژه: {selectedProject.title}
          </Typography>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <Input
                  label="عنوان پروژه *"
                  {...register("title")}
                  error={!!errors.title}
                />
                {errors.title && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.title.message}
                  </Typography>
                )}
              </div>

              {/* Subtitle */}
              <div className="md:col-span-2">
                <Input
                  label="زیرعنوان"
                  {...register("subtitle")}
                  error={!!errors.subtitle}
                />
                {errors.subtitle && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.subtitle.message}
                  </Typography>
                )}
              </div>

              {/* Category */}
              <div>
                <Select
                  label="دسته‌بندی *"
                  value={watch("category")}
                  onChange={(value) => setValue("category", value)}
                  error={!!errors.category}
                >
                  <Option value="">انتخاب دسته‌بندی</Option>
                  <Option value="health">بهداشت و سلامت</Option>
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

              {/* Status */}
              <div>
                <Select
                  label="وضعیت *"
                  value={watch("status") || "draft"}
                  onChange={(value) => setValue("status", value)}
                >
                  <Option value="draft">پیش‌نویس</Option>
                  <Option value="active">فعال</Option>
                  <Option value="completed">تکمیل شده</Option>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Textarea
                label="توضیحات کامل *"
                rows={6}
                {...register("description")}
                error={!!errors.description}
              />
              {errors.description && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.description.message}
                </Typography>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <Textarea
                label="خلاصه (Excerpt)"
                rows={3}
                {...register("excerpt")}
                error={!!errors.excerpt}
              />
              {errors.excerpt && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.excerpt.message}
                </Typography>
              )}
            </div>

            {/* Financial & Volunteer Targets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Typography variant="h6" color="blue-gray">
                  اهداف مالی
                </Typography>

                <div>
                  <Input
                    type="number"
                    label="مبلغ هدف (تومان) *"
                    {...register("targetAmount")}
                    error={!!errors.targetAmount}
                  />
                  {errors.targetAmount && (
                    <Typography variant="small" color="red" className="mt-1">
                      {errors.targetAmount.message}
                    </Typography>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    label="مبلغ جمع‌آوری شده (تومان)"
                    {...register("amountRaised")}
                    error={!!errors.amountRaised}
                  />
                  {errors.amountRaised && (
                    <Typography variant="small" color="red" className="mt-1">
                      {errors.amountRaised.message}
                    </Typography>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <Typography variant="h6" color="blue-gray">
                  اهداف داوطلب
                </Typography>

                <div>
                  <Input
                    type="number"
                    label="تعداد داوطلب هدف *"
                    {...register("targetVolunteer")}
                    error={!!errors.targetVolunteer}
                  />
                  {errors.targetVolunteer && (
                    <Typography variant="small" color="red" className="mt-1">
                      {errors.targetVolunteer.message}
                    </Typography>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    label="تعداد داوطلب جمع‌آوری شده"
                    {...register("collectedVolunteer")}
                    error={!!errors.collectedVolunteer}
                  />
                  {errors.collectedVolunteer && (
                    <Typography variant="small" color="red" className="mt-1">
                      {errors.collectedVolunteer.message}
                    </Typography>
                  )}
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <Input
                type="date"
                label="تاریخ پایان *"
                {...register("deadline")}
                error={!!errors.deadline}
              />
              {errors.deadline && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.deadline.message}
                </Typography>
              )}
            </div>

            {/* Featured Image */}
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray">
                تصویر شاخص *
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="URL تصویر *"
                    {...register("featuredImage.url")}
                    error={!!errors.featuredImage?.url}
                  />
                  {errors.featuredImage?.url && (
                    <Typography variant="small" color="red" className="mt-1">
                      {errors.featuredImage.url.message}
                    </Typography>
                  )}
                </div>
                <div>
                  <Input
                    label="متن جایگزین (Alt)"
                    {...register("featuredImage.alt")}
                  />
                </div>
              </div>
              {watch("featuredImage.url") && (
                <div className="mt-4">
                  <img
                    src={watch("featuredImage.url")}
                    alt="Preview"
                    className="h-48 w-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray">
                تنظیمات سئو
              </Typography>
              <div>
                <Input
                  label="عنوان سئو (Meta Title)"
                  {...register("seo.metaTitle")}
                  error={!!errors.seo?.metaTitle}
                />
                {errors.seo?.metaTitle && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.seo.metaTitle.message}
                  </Typography>
                )}
              </div>
              <div>
                <Textarea
                  label="توضیحات سئو (Meta Description)"
                  rows={3}
                  {...register("seo.metaDescription")}
                  error={!!errors.seo?.metaDescription}
                />
                {errors.seo?.metaDescription && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.seo.metaDescription.message}
                  </Typography>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end border-t pt-6">
              <Link to="/dashboard/projects">
                <Button variant="outlined" color="gray">
                  انصراف
                </Button>
              </Link>
              <Button type="submit" color="blue" loading={loading}>
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default EditProject;
