import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdBanner, updateAdBanner } from "../features/adBannerSlice";

// اسکیمای اعتبارسنجی فرم
const schema = yup.object().shape({
  seoContent: yup.string(),
  link: yup.string(),
  show: yup.boolean(),
  images: yup.array(),
});

const useAdBannerForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAdBanner, loading, error } = useSelector((state) => state.adBanner);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [removedServerImages, setRemovedServerImages] = useState([]);
  const [alerts, setAlerts] = useState(null);
  
  console.log("banner: ", selectedAdBanner);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // مدیریت مقداردهی اولیه هنگام ویرایش
  useEffect(() => {

    if (isEdit) {
      dispatch(fetchAdBanner());
    }

  }, [dispatch, isEdit]);

  // پر کردن فرم با داده‌های بنر در حالت ویرایش
  useEffect(() => {
    if (isEdit && !loading && Array.isArray(selectedAdBanner) && selectedAdBanner.length > 0) {
      setValue("seoContent", selectedAdBanner[0].seoContent || "");
      setValue("link", selectedAdBanner[0].link || "");
      setValue("show", selectedAdBanner[0].show || false);

      if (selectedAdBanner[0].images) {
        const mappedImages = selectedAdBanner[0].images.map((url) => ({
          file: null, // چون فایل نداریم
          preview: `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${url}`, // لینک کامل برای نمایش
        }));

        setSelectedImages(mappedImages);
        setValue("images", selectedAdBanner[0].images); // همچنان می‌تونی فقط رشته‌ها رو ذخیره کنی
      }
    }
  }, [selectedAdBanner, isEdit,loading, setValue]);

  // مدیریت ارسال داده‌ها
  const onSubmit = async (data) => {
    setAlerts(null);
    try {
      setSubmitError(null);
      const formData = new FormData();

      // افزودن فیلدهای متنی
      formData.append("link", data.link.trim() || "");
      formData.append("seoContent", data.seoContent.trim());
      formData.append("show", data.show || false);

      if (removedServerImages.length > 0) {
        removedServerImages.forEach((imagePath) => {
          formData.append("removedServerImages", imagePath);
        });
      }

      // افزودن تصاویر بنر
      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image); //   تغییر نام فیلد به "images"
          } else if (image.file instanceof File) {
            formData.append("images", image.file); //   تغییر نام فیلد به "images"
          } else if (typeof image === "string") {
            formData.append("existingImages", image); // اگر مسیر عکس باشد، در `existingImages` ارسال شود
          }
        });
      }

      // ارسال درخواست به سرور
      let response;
      if (isEdit) {
        response = dispatch(updateAdBanner({ formData }));
        console.log("بنر با موفقیت ویرایش شد:", response);
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "بنر با موفقیت اضافه شد!");

      setSubmitSuccess(true);

      // هدایت به صفحه لیست مقالات پس از 2 ثانیه
      setTimeout(() => {
        navigate("/dashboard/banner");
      }, 2000);
    } catch (error) {
      console.error("🚨 خطا در ارسال بنر:", error);
      setSubmitError(error?.message || "خطایی در ارسال بنر رخ داد");
      setSubmitSuccess(false);
      setAlerts("مشکلی پیش آمده، لطفاً دوباره تلاش کنید.");
    }
  };
  // مدیریت انتخاب و حذف تصاویر بنر
  const handleImageSelection = (adBanner) => {
    const files = Array.from(adBanner.target.files);

    // بررسی حجم فایل‌ها
    const validFiles = files.filter((file) => file.size <= 20 * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert("برخی از تصاویر انتخاب شده بیشتر از 20 مگابایت هستند و حذف شدند");
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages([...selectedImages, ...newImages]);
    setValue("images", [...selectedImages, ...validFiles]);
  };

  // حذف تصویر
  const removeImage = (index) => {
    const updatedImages = [...selectedImages];

    const removedImage = updatedImages[index];
    // آزادسازی URL برای تصاویر آپلود شده جدید
    if (removedImage?.preview) {
      URL.revokeObjectURL(removedImage.preview);
    }

    // اگر تصویر موجود از نوع string بود یعنی از سرور بوده
    if (removedImage.file === null) {
      setRemovedServerImages([...removedServerImages, removedImage.preview]);
    }
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);

    // فقط فایل‌های واقعی (File) رو به فرم ارسال کن
    const formImages = updatedImages.filter((img) => img.file).map((img) => img.file);
    setValue("images", formImages);
  };

  // پاکسازی منابع هنگام خروج از کامپوننت
  useEffect(() => {
    return () => {
      // آزادسازی URL های ایجاد شده برای پیش‌نمایش تصاویر
      selectedImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [selectedImages]);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    selectedImages,
    handleImageSelection,
    removeImage,
    onSubmit,
    submitSuccess,
    submitError,
    watch,
  };
};

export default useAdBannerForm;
