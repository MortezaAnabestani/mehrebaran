import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createFaq, updateFaq, fetchFaqById } from "../features/faqsSlice";
import { useNavigate, useParams } from "react-router-dom";

const schema = yup.object().shape({
  question: yup.string().required("واردکردن پرسش ضروری است"),
  answer: yup.string().required("واردکردن پاسخ ضروری است"),
  order: yup.number().optional().default(0),
});

const useFaqForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedFaq, loading, error } = useSelector((state) => state.faqs);
  const [alerts, setAlerts] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchFaqById(id));
    }
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && selectedFaq) {
      setValue("question", selectedFaq.question);
      setValue("answer", selectedFaq.answer);
      setValue("order", selectedFaq.order);
    }
  }, [selectedFaq, isEdit, setValue]);

  const onSubmit = async (data) => {
    setAlerts(null);
    try {
      const formData = new FormData();
      formData.append("question", data.question.trim());
      formData.append("answer", data.answer.trim());
      formData.append("order", data.order);

      if (isEdit) {
        dispatch(updateFaq({ id, formData }));
      } else {
        dispatch(createFaq(formData));
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "شمارۀ جدید با موفقیت اضافه شد!");
      // setTimeout(() => navigate("/dashboard/faqs"), 3000);
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
    loading,
    error,
    setAlerts,
  };
};

export default useFaqForm;
