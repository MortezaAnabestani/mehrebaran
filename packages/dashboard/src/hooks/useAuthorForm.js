import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createAuthor, updateAuthor, fetchAuthorBySlug } from "../features/authorsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { convertToGregorian } from "../utils/convertTimeToGregorian";

const schema = yup.object().shape({
  name: yup.string().required("نام نویسنده اجباری است"),
  email: yup.string().email("ایمیل معتبر نیست").optional(),
  mobile: yup
    .string()
    .matches(/^\d{11}$/, "شماره موبایل معتبر نیست")
    .optional(),
  favoriteTemplate: yup.string(),
  bio: yup.string().optional(),
  metaDescription: yup.string().optional(),
  metaTitle: yup.string().optional(),
  instagramId: yup.string().optional(),
  avatar: yup
    .mixed()
    .test("fileSize", "حجم تصویر نباید بیشتر از 5MB باشد", (file) =>
      file.length > 0 ? file[0].size <= 5 * 1024 * 1024 : true
    )
    .required("انتخاب عکس اجباری است"),
});

const useAuthorForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const { selectedAuthor, loading, error } = useSelector((state) => state.authors);
  const [approved, setApproved] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [faults, setFaults] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
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
    if (isEdit && slug) {
      dispatch(fetchAuthorBySlug(slug));
    }
  }, [dispatch, isEdit, slug]);

  useEffect(() => {
    if (isEdit && selectedAuthor) {
      if (selectedAuthor.birthday) {
        setApproved(true);
        setDateOfBirth(new Date(selectedAuthor.birthday)); // یا تاریخ شمسی که باید تبدیل شود
      }
      setValue("name", selectedAuthor.name);
      setValue("email", selectedAuthor.email);
      setValue("mobile", selectedAuthor.mobile);
      setValue("favoriteTemplate", selectedAuthor.favoriteTemplate);
      setValue("bio", selectedAuthor.bio);
      setValue("metaTitle", selectedAuthor.metaTitle);
      setValue("metaDescription", selectedAuthor.metaDescription);
      setValue("instagramId", selectedAuthor.instagramId);
      setApproved(true);

      if (selectedAuthor.avatar) {
        setPreviewImage(`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedAuthor.avatar}`);
      }
    }
  }, [selectedAuthor, isEdit, setValue]);

  const onSubmit = async (data) => {
    setFaults(null);
    setAlerts(null);
    try {
      if (!approved) {
        setAlerts("لطفاً تاریخ تولد را تأیید کنید!");
        return;
      }

      if (isEdit) {
        if (!previewImage) {
          setFaults("لطفاً ابتدا عکس را بارگذاری کنید ");
          return;
        }
      } else {
        if (!data.avatar || !(data.avatar instanceof File)) {
          setFaults("لطفاً ابتدا عکس را بارگذاری کنید ");
          return;
        }
      }

      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("email", data.email.trim() || "");
      formData.append("mobile", data.mobile.trim());
      formData.append("favoriteTemplate", data.favoriteTemplate || "");
      formData.append("bio", data.bio.trim() || "");
      formData.append("metaDescription", data.metaDescription.trim() || "");
      formData.append("metaTitle", data.metaTitle.trim() || "");
      if (data.instagramId) formData.append("instagramId", data.instagramId.trim() || "");

      const imageFile = data?.avatar;
      if (imageFile instanceof File) {
        formData.append("avatar", imageFile);
      }
      let convertedReleaseDate;
      if (dateOfBirth) {
        if (dateOfBirth instanceof Date) {
          convertedReleaseDate = dateOfBirth;
        } else {
          convertedReleaseDate = convertToGregorian(dateOfBirth?.format("YYYY/MM/DD"));
        }
      }
      formData.append("birthday", convertedReleaseDate);

      if (isEdit) {
        dispatch(updateAuthor({ slug, formData }));
      } else {
        dispatch(createAuthor(formData));
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "نویسنده با موفقیت اضافه شد!");
      setTimeout(() => navigate("/dashboard/authors"), 2000);
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
    approved,
    setApproved,
    dateOfBirth,
    setDateOfBirth,
    previewImage,
    handleImagePreview,
    loading,
    error,
    setAlerts,
    faults,
    setFaults,
  };
};

export default useAuthorForm;
