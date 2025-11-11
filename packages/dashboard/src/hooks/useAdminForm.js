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

const useAdminForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedAdmin, loading, error } = useSelector((state) => state.admins);
  const [alerts, setAlerts] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchAdminById(id));
    }
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && selectedAdmin) {
      setValue("name", selectedAdmin.name);
      setValue("email", selectedAdmin.email);
      setValue("role", selectedAdmin.role);
      setValue("password", selectedAdmin.password);
      setValue("username", selectedAdmin.username);

      if (selectedAdmin.avatar) {
        setPreviewImage(`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedAdmin.avatar}`);
      }
    }
  }, [selectedAdmin, isEdit, setValue]);

  const onSubmit = async (data) => {
    setAlerts(null);
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
      if (isEdit) {
        dispatch(updateAdmin({ id, formData }));
      } else {
        dispatch(createAdmin(formData));
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "ادمین با موفقیت اضافه شد!");
      setTimeout(() => navigate("/dashboard/admins"), 3000);
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
  };
};

export default useAdminForm;
