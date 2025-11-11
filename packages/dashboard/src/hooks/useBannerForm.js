import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateBanner, fetchBanners } from "../features/bannersSlice";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  title: yup.string(),
  description: yup.string().optional(),
  show: yup.boolean().default(false),
  textStyle: yup.object(),
  linkUrl: yup.string().optional(),
  coverImage: yup
    .mixed()
    .test("fileSize", "حجم تصویر نباید بیشتر از 20MB باشد", (file) =>
      file.length > 0 ? file[0].size <= 20 * 1024 * 1024 : true
    ),
});

const useBannerForm = (isEdit = true) => {
  const dispatch = useDispatch();

  const { selectedBanner, loading, error } = useSelector((state) => state.banners);
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
    if (isEdit) {
      dispatch(fetchBanners());
    }
  }, [dispatch, isEdit]);

  useEffect(() => {
    if (isEdit && selectedBanner) {
      setValue("title", selectedBanner.title);
      setValue("description", selectedBanner.description);
      setValue("show", selectedBanner.show);
      setValue("linkUrl", selectedBanner.linkUrl);
      setValue("textStyle", selectedBanner.textStyle ? selectedBanner.textStyle : {});

      if (selectedBanner.coverImage) {
        setPreviewImage(
          `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedBanner.coverImage}`
        );
      }
    }
  }, [selectedBanner, isEdit, setValue]);

  const onSubmit = async (data) => {
    setAlerts(null);
    try {
      const formData = new FormData();
      formData.append("title", data?.title?.trim());
      formData.append("description", data?.description?.trim() || "");
      formData.append("linkUrl", data?.linkUrl?.trim() || "");
      formData.append("show", data?.show || false);
      formData.append("textStyle", JSON.stringify(data?.textStyle));
      const imageFile = data?.coverImage;
      if (imageFile instanceof File) {
        formData.append("coverImage", imageFile);
      }
      if (isEdit) {
        dispatch(updateBanner({ formData }));
      }

      setAlerts(isEdit && "ویرایش انجام شد!");
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
    setValue,
  };
};

export default useBannerForm;
