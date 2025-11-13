import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createBadge, updateBadge, fetchBadgeById } from "../features/gamificationSlice";

// Schema validation با Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "نام نشان باید حداقل ۳ کاراکتر باشد")
    .max(100, "نام نشان نباید بیشتر از ۱۰۰ کاراکتر باشد")
    .required("نام فارسی نشان اجباری است"),
  nameEn: yup
    .string()
    .min(3, "نام انگلیسی نشان باید حداقل ۳ کاراکتر باشد")
    .max(100, "نام انگلیسی نشان نباید بیشتر از ۱۰۰ کاراکتر باشد")
    .required("نام انگلیسی نشان اجباری است"),
  description: yup
    .string()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد")
    .required("توضیحات اجباری است"),
  category: yup
    .string()
    .oneOf([
      "contributor",
      "supporter",
      "creator",
      "helper",
      "communicator",
      "leader",
      "expert",
      "milestone",
      "special",
      "seasonal",
    ], "دسته‌بندی معتبر نیست")
    .required("دسته‌بندی اجباری است"),
  rarity: yup
    .string()
    .oneOf(["common", "rare", "epic", "legendary"], "کمیابی معتبر نیست")
    .default("common"),
  icon: yup.string().required("آیکون نشان اجباری است"),
  color: yup.string(),
  points: yup
    .number()
    .min(0, "امتیاز نمی‌تواند منفی باشد")
    .default(0),
  isActive: yup.boolean().default(true),
  isSecret: yup.boolean().default(false),
  order: yup.number().min(0).default(0),
});

const useBadgeForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { badgeId } = useParams();

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { selectedBadge } = useSelector((state) => state.gamification);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      nameEn: "",
      description: "",
      category: "contributor",
      rarity: "common",
      icon: "",
      color: "#3B82F6",
      points: 0,
      isActive: true,
      isSecret: false,
      order: 0,
    },
  });

  // بارگذاری نشان برای ویرایش
  useEffect(() => {
    if (isEdit && badgeId) {
      const loadBadge = async () => {
        setLoading(true);
        try {
          const result = await dispatch(fetchBadgeById(badgeId)).unwrap();

          // پر کردن فرم با داده‌های نشان
          if (result.data) {
            reset({
              name: result.data.name || "",
              nameEn: result.data.nameEn || "",
              description: result.data.description || "",
              category: result.data.category || "contributor",
              rarity: result.data.rarity || "common",
              icon: result.data.icon || "",
              color: result.data.color || "#3B82F6",
              points: result.data.points || 0,
              isActive: result.data.isActive ?? true,
              isSecret: result.data.isSecret ?? false,
              order: result.data.order || 0,
            });
          }
        } catch (error) {
          console.error("خطا در بارگذاری نشان:", error);
          setSubmitError(error.message || "خطا در بارگذاری نشان");
        } finally {
          setLoading(false);
        }
      };

      loadBadge();
    }
  }, [isEdit, badgeId, dispatch, reset]);

  // مدیریت ارسال فرم
  const handleSubmit = rhfHandleSubmit(async (data) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // آماده‌سازی داده‌ها
      const badgeData = {
        name: data.name,
        nameEn: data.nameEn,
        description: data.description,
        category: data.category,
        rarity: data.rarity,
        icon: data.icon,
        color: data.color || undefined,
        points: parseInt(data.points),
        isActive: data.isActive,
        isSecret: data.isSecret,
        order: parseInt(data.order),
      };

      if (isEdit) {
        // ویرایش نشان
        await dispatch(updateBadge({ badgeId, badgeData })).unwrap();
        setSubmitSuccess(true);

        setTimeout(() => {
          navigate("/dashboard/gamification/badges");
        }, 1500);
      } else {
        // ایجاد نشان جدید
        await dispatch(createBadge(badgeData)).unwrap();
        setSubmitSuccess(true);

        setTimeout(() => {
          navigate("/dashboard/gamification/badges");
        }, 1500);
      }
    } catch (error) {
      console.error("خطا در ارسال فرم:", error);
      setSubmitError(error.message || "خطایی در ارسال فرم رخ داده است");
    }
  });

  return {
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
  };
};

export default useBadgeForm;
