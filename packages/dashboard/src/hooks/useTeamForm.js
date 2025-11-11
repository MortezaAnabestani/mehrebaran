import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createTeam, updateTeam, fetchTeamById } from "../features/teamsSlice";

// Schema validation با Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "نام تیم باید حداقل ۳ کاراکتر باشد")
    .max(100, "نام تیم نباید بیشتر از ۱۰۰ کاراکتر باشد")
    .required("نام تیم اجباری است"),
  description: yup
    .string()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .max(1000, "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),
  focusArea: yup.string(),
  status: yup
    .string()
    .oneOf(["active", "paused", "completed", "disbanded"], "وضعیت معتبر نیست")
    .default("active"),
  maxMembers: yup
    .number()
    .min(2, "حداقل ۲ عضو مورد نیاز است")
    .max(100, "حداکثر ۱۰۰ عضو مجاز است")
    .default(10),
  tags: yup.array().of(yup.string()),
});

const useTeamForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { needId, teamId } = useParams();

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { selectedTeam } = useSelector((state) => state.teams);

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
      description: "",
      focusArea: "",
      status: "active",
      maxMembers: 10,
      tags: [],
    },
  });

  // بارگذاری تیم برای ویرایش
  useEffect(() => {
    if (isEdit && teamId) {
      const loadTeam = async () => {
        setLoading(true);
        try {
          const result = await dispatch(fetchTeamById({ needId: needId || selectedTeam?.need, teamId })).unwrap();

          // پر کردن فرم با داده‌های تیم
          if (result.data) {
            reset({
              name: result.data.name || "",
              description: result.data.description || "",
              focusArea: result.data.focusArea || "",
              status: result.data.status || "active",
              maxMembers: result.data.maxMembers || 10,
              tags: result.data.tags || [],
            });
          }
        } catch (error) {
          console.error("خطا در بارگذاری تیم:", error);
          setSubmitError(error.message || "خطا در بارگذاری تیم");
        } finally {
          setLoading(false);
        }
      };

      loadTeam();
    }
  }, [isEdit, teamId, needId, dispatch, reset, selectedTeam]);

  // مدیریت ارسال فرم
  const handleSubmit = rhfHandleSubmit(async (data) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // آماده‌سازی داده‌ها
      const teamData = {
        name: data.name,
        description: data.description,
        focusArea: data.focusArea || undefined,
        status: data.status,
        maxMembers: parseInt(data.maxMembers),
        tags: data.tags || [],
      };

      if (isEdit) {
        // ویرایش تیم
        const effectiveNeedId = needId || selectedTeam?.need;
        await dispatch(updateTeam({ needId: effectiveNeedId, teamId, teamData })).unwrap();
        setSubmitSuccess(true);

        setTimeout(() => {
          navigate(`/dashboard/teams/${teamId}`);
        }, 1500);
      } else {
        // ایجاد تیم جدید
        if (!needId) {
          setSubmitError("شناسه نیاز یافت نشد");
          return;
        }

        await dispatch(createTeam({ needId, teamData })).unwrap();
        setSubmitSuccess(true);

        setTimeout(() => {
          navigate("/dashboard/teams");
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
    selectedTeam,
  };
};

export default useTeamForm;
