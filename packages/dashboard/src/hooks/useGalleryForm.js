import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGallery, fetchGalleryBySlug, updateGallery } from "../features/galleriesSlice";

// اسکیمای اعتبارسنجی فرم
const schema = yup.object().shape({
  title: yup.string().required("عنوان گالری اجباری است"),
  metaTitle: yup.string(),
  description: yup.string().required("توضیحات گالری اجباری است"),
  details: yup.string(),
  metaDescription: yup.string(),
  images: yup.array(),
});

const useGalleryForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { selectedGallery, loading, error } = useSelector((state) => state.galleries);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [removedServerImages, setRemovedServerImages] = useState([]);
  const [alerts, setAlerts] = useState(null);

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
    let ignore = false;

    if (isEdit && slug && !ignore) {
      dispatch(fetchGalleryBySlug(slug));
    }
    return () => {
      ignore = true;
    };
  }, [dispatch, isEdit, slug]);

  // پر کردن فرم با داده‌های گالری در حالت ویرایش
  useEffect(() => {
    if (isEdit && selectedGallery) {
      // بقیه مقادیر
      setValue("title", selectedGallery.title || "");
      setValue("metaTitle", selectedGallery.metaTitle || "");
      setValue("description", selectedGallery.description || "");
      setValue("details", selectedGallery.details || "");
      setValue("metaDescription", selectedGallery.metaDescription || "");

      if (selectedGallery.images) {
        const mappedImages = selectedGallery.images.map((url) => ({
          file: null, // چون فایل نداریم
          preview: `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${url}`, // لینک کامل برای نمایش
        }));

        setSelectedImages(mappedImages);
        setValue("images", selectedGallery.images); // همچنان می‌تونی فقط رشته‌ها رو ذخیره کنی
      }
    }
  }, [selectedGallery, isEdit, setValue]);

  // مدیریت ارسال داده‌ها
  const onSubmit = async (data) => {
    setAlerts(null);
    try {
      setSubmitError(null);
      const formData = new FormData();

      // افزودن فیلدهای متنی
      formData.append("title", data.title.trim());
      formData.append("metaTitle", data.metaTitle?.trim() || data.title.trim());
      formData.append("description", data.description.trim() || "");
      formData.append("details", data.details.trim() || "");
      formData.append("metaDescription", data.metaDescription?.trim() || "");

      if (removedServerImages.length > 0) {
        removedServerImages.forEach((imagePath) => {
          formData.append("removedServerImages", imagePath);
        });
      }

      // افزودن تصاویر گالری
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
        response = dispatch(updateGallery({ slug, formData }));
        console.log("گالری با موفقیت ویرایش شد:", response);
      } else {
        response = dispatch(createGallery(formData));
        console.log("گالری با موفقیت ایجاد شد:", response);
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "گالری با موفقیت اضافه شد!");

      setSubmitSuccess(true);

      // هدایت به صفحه لیست مقالات پس از 2 ثانیه
      setTimeout(() => {
        navigate("/dashboard/galleries");
      }, 2000);
    } catch (error) {
      console.error("🚨 خطا در ارسال گالری:", error);
      setSubmitError(error?.message || "خطایی در ارسال گالری رخ داد");
      setSubmitSuccess(false);
      setAlerts("مشکلی پیش آمده، لطفاً دوباره تلاش کنید.");
    }
  };
  // مدیریت انتخاب و حذف تصاویر گالری
  const handleImageSelection = (gallery) => {
    const files = Array.from(gallery.target.files);

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

export default useGalleryForm;
