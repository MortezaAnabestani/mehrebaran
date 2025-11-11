import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, fetchEventBySlug, updateEvent } from "../features/eventsSlice";
import { convertToGregorian } from "../utils/convertTimeToGregorian";

// اسکیمای اعتبارسنجی فرم
const schema = yup.object().shape({
  title: yup.string().required("عنوان رویداد اجباری است"),
  metaTitle: yup.string(),
  description: yup.string().required("توضیحات رویداد اجباری است"),
  metaDescription: yup.string(),
  images: yup.array(),
});

const useEventForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { selectedEvent, loading, error } = useSelector((state) => state.events);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [approved, setApproved] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [removedServerImages, setRemovedServerImages] = useState([]);
  const [dateOfEvent, setDateOfEvent] = useState(null);
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
      dispatch(fetchEventBySlug(slug));
    }
    return () => {
      ignore = true;
    };
  }, [dispatch, isEdit, slug]);

  // پر کردن فرم با داده‌های رویداد در حالت ویرایش
  useEffect(() => {
    if (isEdit && selectedEvent) {
      if (selectedEvent.date) {
        setApproved(true);
        setDateOfEvent(new Date(selectedEvent.date)); // یا تاریخ شمسی که باید تبدیل شود
      }
      // بقیه مقادیر
      setValue("title", selectedEvent.title || "");
      setValue("metaTitle", selectedEvent.metaTitle || "");
      setValue("description", selectedEvent.description || "");
      setValue("metaDescription", selectedEvent.metaDescription || "");
      setApproved(true);

      if (selectedEvent.images) {
        const mappedImages = selectedEvent.images.map((url) => ({
          file: null, // چون فایل نداریم
          preview: `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${url}`, // لینک کامل برای نمایش
        }));

        setSelectedImages(mappedImages);
        setValue("images", selectedEvent.images); // همچنان می‌تونی فقط رشته‌ها رو ذخیره کنی
      }
    }
  }, [selectedEvent, isEdit, setValue]);

  // مدیریت ارسال داده‌ها
  const onSubmit = async (data) => {
    setAlerts(null);

    try {
      setSubmitError(null);
      if (!approved) {
        setAlerts("لطفاً تاریخ برگزاری رویداد را تأیید کنید!");
        return;
      }

      const formData = new FormData();

      // افزودن فیلدهای متنی
      formData.append("title", data.title.trim());
      formData.append("metaTitle", data.metaTitle?.trim() || data.title.trim());
      formData.append("description", data.description.trim() || "");
      formData.append("metaDescription", data.metaDescription?.trim() || "");

      let convertedReleaseDate;
      if (dateOfEvent) {
        if (dateOfEvent instanceof Date) {
          convertedReleaseDate = dateOfEvent;
        } else {
          convertedReleaseDate = convertToGregorian(dateOfEvent?.format("YYYY/MM/DD"));
        }
      }
      formData.append("date", new Date(convertedReleaseDate).toISOString());

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
        response = dispatch(updateEvent({ slug, formData }));
        console.log("رویداد با موفقیت ویرایش شد:", response);
      } else {
        response = dispatch(createEvent(formData));
        console.log("رویداد با موفقیت ایجاد شد:", response);
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "رویداد با موفقیت اضافه شد!");

      setSubmitSuccess(true);

      // هدایت به صفحه لیست مقالات پس از 2 ثانیه
      setTimeout(() => {
        navigate("/dashboard/events");
      }, 2000);
    } catch (error) {
      console.error("🚨 خطا در ارسال رویداد:", error);
      setSubmitError(error?.message || "خطایی در ارسال رویداد رخ داد");
      setSubmitSuccess(false);
      setAlerts("مشکلی پیش آمده، لطفاً دوباره تلاش کنید.");
    }
  };
  // مدیریت انتخاب و حذف تصاویر گالری
  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files);

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
    setApproved,
    approved,
    dateOfEvent,
    setDateOfEvent,
    watch,
  };
};

export default useEventForm;
