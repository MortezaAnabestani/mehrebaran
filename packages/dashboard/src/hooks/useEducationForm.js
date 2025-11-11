import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createEducation, updateEducation, fetchEducationBySlug } from "../features/educationsSlice";
import { useNavigate, useParams } from "react-router-dom";

const schema = yup.object().shape({
  title: yup.string().required("عنوان اجباری است"),
  videoUrl: yup.string().url().required("آدرس ویدئو معتبر نیست"),
  metaTitle: yup.string().optional(),
  description: yup.string().optional(),
  metaDescription: yup.string().optional(),
  details: yup.string().optional(),
  order: yup.number().default(1),
  coverImage: yup
    .mixed()
    .test("fileSize", "حجم تصویر نباید بیشتر از 20MB باشد", (file) =>
      file.length > 0 ? file[0].size <= 20 * 1024 * 1024 : true
    ),
});

const useEducationForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const { selectedEducation, loading, error } = useSelector((state) => state.educations);
  const [alerts, setAlerts] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // مدیریت انتخاب عکس و نمایش پیش‌نمایش
  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("coverImage", file); // تنظیم مقدار برای `react-hook-form`
    }
  };

  useEffect(() => {
    if (isEdit && slug) {
      dispatch(fetchEducationBySlug(slug));
    }
  }, [dispatch, isEdit, slug]);

  useEffect(() => {
    if (isEdit && selectedEducation) {
      setValue("title", selectedEducation.title);
      setValue("description", selectedEducation.description);
      setValue("metaTitle", selectedEducation.metaTitle);
      setValue("metaDescription", selectedEducation.metaDescription);
      setValue("details", selectedEducation.details);
      setValue("videoUrl", selectedEducation.videoUrl);
      setValue("order", selectedEducation.order);

      if (selectedEducation.coverImage) {
        setPreviewImage(
          `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedEducation.coverImage}`
        );
      }
    }
  }, [selectedEducation, isEdit, setValue]);

  const onSubmit = async (data) => {
    setAlerts(null);
    try {
      const formData = new FormData();
      formData.append("title", data?.title?.trim());
      formData.append("description", data?.description?.trim() || "");
      formData.append("videoUrl", data?.videoUrl || "");
      formData.append("metaDescription", data?.metaDescription?.trim() || "");
      formData.append("metaTitle", data?.metaTitle?.trim() || "");
      formData.append("details", data?.details?.trim() || "");
      formData.append("order", data?.order);

      const imageFile = data?.coverImage;
      if (imageFile instanceof File) {
        formData.append("coverImage", imageFile);
      }

      if (isEdit) {
        dispatch(updateEducation({ slug, formData }));
      } else {
        dispatch(createEducation(formData));
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "ویدئوی آموزشی جدید با موفقیت اضافه شد!");
      setTimeout(() => navigate("/dashboard/educations"), 2000);
    } catch (error) {
      console.error("خطا در ارسال داده:", error.response?.data || error.message);
      setAlerts("مشکلی پیش آمده، لطفاً دوباره تلاش کنید.");
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    alerts,
    previewImage,
    handleImagePreview,
    loading,
    error,
    setAlerts,
    watch,
  };
};

export default useEducationForm;
