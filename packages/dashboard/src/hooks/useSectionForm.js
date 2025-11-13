import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSectionById, updateSection } from "../features/sectionsSlice"; // اکشن دریافت اطلاعات بخش

// اسکیما برای اعتبارسنجی فقط `description`
const schema = yup.object().shape({
  description: yup.string(),
});

const useSectionForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedSection, loading, error } = useSelector((state) => state.sections);
  const [alerts, setAlerts] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // دریافت اطلاعات بخش از سرور
  useEffect(() => {
    if (id) {
      dispatch(fetchSectionById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedSection) {
      setValue("title", selectedSection.title);
      setValue("template", selectedSection.template?.name);
      setValue("description", selectedSection.description);
    }
  }, [selectedSection, setValue]);

  //  تابع ارسال فرم برای ویرایش `description`
  const onSubmit = async (data) => {
    setAlerts(null);
    try {
      await dispatch(updateSection({ id, data }));
      setAlerts("✔ ویرایش با موفقیت انجام شد!");
      setTimeout(() => navigate("/dashboard/sections"), 3000); // بعد از ۲ ثانیه بازگشت به لیست بخش‌ها
    } catch (error) {
      console.error("❌ خطا در ارسال داده:", error);
      setAlerts("مشکلی پیش آمده، لطفاً دوباره تلاش کنید.");
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    alerts,
    loading,
    error,
    setAlerts,
    selectedSection,
  };
};

export default useSectionForm;
