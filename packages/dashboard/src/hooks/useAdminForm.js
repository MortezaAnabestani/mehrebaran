import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createAdmin, updateAdmin, fetchAdminById } from "../features/adminsSlice";
import { useNavigate, useParams } from "react-router-dom";

const getSchema = (isEdit) =>
  yup.object().shape({
    name: yup.string().required("نام ادمین اجباری است"),
    email: yup.string().email("ایمیل معتبر نیست"),
    role: yup.string(),
    password: isEdit ? yup.string().notRequired() : yup.string().required("رمز عبور اجباری است"),
    username: yup.string().optional(),
    avatar: yup
      .mixed()
      .test("fileSize", "حجم تصویر نباید بیشتر از 20MB باشد", (file) =>
        file.length > 0 ? file[0].size <= 5 * 1024 * 1024 : true
      ),
  });

const useAdminForm = (isEdit = false, isProfile = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedAdmin, loading, error } = useSelector((state) => state.admins);
  const [alerts, setAlerts] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(getSchema(isEdit)),
  });

  // مدیریت انتخاب عکس و نمایش پیش‌نمایش
  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("avatar", file); // تنظیم مقدار برای `react-hook-form`
    }
  };

  // دریافت اطلاعات کاربر جاری از سرور برای حالت profile
  useEffect(() => {
    if (isProfile) {
      const fetchCurrentUser = async () => {
        try {
          // ابتدا از localStorage بخوان (برای نمایش سریع)
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const localUser = JSON.parse(userStr);
            setCurrentUser(localUser);
          }

          // سپس اطلاعات جدید را از سرور بگیر
          const api = (await import("../services/api")).default;
          const response = await api.get("/users/me");
          const freshUser = response.data.data;

          console.log("Fresh user data from server:", freshUser);

          // به‌روزرسانی localStorage و state
          localStorage.setItem("user", JSON.stringify(freshUser));
          setCurrentUser(freshUser);
        } catch (error) {
          console.error("خطا در دریافت اطلاعات کاربر:", error);
        }
      };

      fetchCurrentUser();
    }
  }, [isProfile]);

  useEffect(() => {
    if (isEdit && id && !isProfile) {
      dispatch(fetchAdminById(id));
    }
  }, [dispatch, isEdit, id, isProfile]);

  // پر کردن فرم با اطلاعات کاربر جاری (برای profile)
  useEffect(() => {
    if (isProfile && currentUser) {
      setValue("name", currentUser.name || "");
      setValue("email", currentUser.email || "");
      setValue("role", currentUser.role || "");
      setValue("username", currentUser.username || "");

      if (currentUser.avatar) {
        const avatarUrl = `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${currentUser.avatar}`;
        setPreviewImage(avatarUrl);
      }
    }
  }, [currentUser, isProfile, setValue]);

  // پر کردن فرم با اطلاعات ادمین انتخابی (برای ویرایش ادمین)
  useEffect(() => {
    if (isEdit && selectedAdmin && !isProfile) {
      setValue("name", selectedAdmin.name);
      setValue("email", selectedAdmin.email);
      setValue("role", selectedAdmin.role);
      setValue("password", selectedAdmin.password);
      setValue("username", selectedAdmin.username);

      if (selectedAdmin.avatar) {
        setPreviewImage(`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedAdmin.avatar}`);
      }
    }
  }, [selectedAdmin, isEdit, setValue, isProfile]);

  const onSubmit = async (data) => {
    setAlerts(null);
    setHasError(false);

    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("email", data.email.trim() || "");
      formData.append("role", data.role || "");
      formData.append("username", data.username.trim() || "");
      if (data.password?.trim()) {
        formData.append("password", data.password.trim());
      }
      const imageFile = data?.avatar;
      if (imageFile instanceof File) {
        formData.append("avatar", imageFile);
      }

      if (isEdit || isProfile) {
        const userId = isProfile ? currentUser?._id : id;
        const result = await dispatch(updateAdmin({ id: userId, formData }));

        // بررسی موفقیت عملیات
        if (result.error) {
          setHasError(true);
          setAlerts(result.error.message || "خطا در بروزرسانی اطلاعات!");
          return;
        }

        setHasError(false);
        setAlerts("ویرایش انجام شد!");

        // اگر profile است، اطلاعات localStorage را هم بروز کنیم
        if (isProfile && currentUser) {
          const updatedUser = {
            ...currentUser,
            name: data.name.trim(),
            email: data.email.trim() || currentUser.email,
            username: data.username.trim() || currentUser.username,
          };

          // اگر عکس جدید آپلود شد، آدرس آن را از response بگیریم
          if (result.payload?.avatar) {
            updatedUser.avatar = result.payload.avatar;
            setPreviewImage(`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${result.payload.avatar}`);
          }

          localStorage.setItem("user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);

          // به‌روزرسانی اطلاعات در سایر قسمت‌های dashboard
          window.dispatchEvent(new Event('userUpdated'));
        }

        if (!isProfile) {
          setTimeout(() => navigate("/dashboard/admins"), 3000);
        }
      } else {
        const result = await dispatch(createAdmin(formData));

        if (result.error) {
          setHasError(true);
          setAlerts(result.error.message || "خطا در افزودن ادمین!");
          return;
        }

        setHasError(false);
        setAlerts("ادمین با موفقیت اضافه شد!");
        setTimeout(() => navigate("/dashboard/admins"), 3000);
      }
    } catch (error) {
      console.error("خطا در ارسال داده:", error.response?.data || error.message);
      setHasError(true);
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
    error: hasError,
    setAlerts,
  };
};

export default useAdminForm;
