import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createHonor, updateHonor, fetchHonorBySlug } from "../features/honorsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { convertToGregorian } from "../utils/convertTimeToGregorian";
import { fetchArticles } from "../features/articlesSlice";
import { fetchAuthors } from "../features/authorsSlice";

const schema = yup.object().shape({
  title: yup.string().required("نام افتخار اجباری است"),
  metaTitle: yup.string().optional(),
  subTitle: yup.string().optional(),
  description: yup.string().optional(),
  metaDescription: yup.string().optional(),
  article: yup.string().required("لطفاً توضیحاتی درباره افتخار بنویسید"),
  author: yup.string().optional(),
  honorDate: yup.date().optional(),
  coverImage: yup
    .mixed()
    .test("fileSize", "حجم تصویر نباید بیشتر از 20MB باشد", (file) =>
      file.length > 0 ? file[0].size <= 20 * 1024 * 1024 : true
    ),
});

const useHonorForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const { selectedHonor, loading, error } = useSelector((state) => state.honors);
  const [approved, setApproved] = useState(false);
  const [dateOfHonor, setDateOfHonor] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { authors } = useSelector((state) => state.authors);
  const { articles } = useSelector((state) => state.articles);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log("selectedHonor: ", selectedHonor);

  // مدیریت انتخاب عکس و نمایش پیش‌نمایش
  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("coverImage", file); // تنظیم مقدار برای `react-hook-form`
    }
  };

  useEffect(() => {
    dispatch(fetchArticles({ limit: 1000 })).unwrap();
    dispatch(fetchAuthors({ limit: 1000 })).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && slug) {
      dispatch(fetchHonorBySlug(slug));
    }
  }, [dispatch, isEdit, slug]);

  useEffect(() => {
    if (isEdit && selectedHonor) {
      if (selectedHonor?.honorDate) {
        setApproved(true);
        setDateOfHonor(new Date(selectedHonor?.honorDate)); // یا تاریخ شمسی که باید تبدیل شود
      }
      setValue("title", selectedHonor?.title);
      setValue("subTitle", selectedHonor?.subTitle);
      setValue("description", selectedHonor?.description);
      setValue("author", selectedHonor?.author?._id);
      setValue("article", selectedHonor?.article?._id);
      setValue("metaTitle", selectedHonor?.metaTitle);
      setValue("metaDescription", selectedHonor?.metaDescription);
      setApproved(true);

      if (selectedHonor.coverImage) {
        setPreviewImage(
          `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedHonor?.coverImage}`
        );
      }
    }
  }, [selectedHonor, isEdit, setValue]);

  const onSubmit = async (data) => {
    setAlerts(null);
    try {
      if (!approved) {
        setAlerts("لطفاً تاریخ تولد را تأیید کنید!");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("subTitle", data.subTitle.trim() || "");
      formData.append("description", data.description.trim());
      formData.append("author", data.author || "");
      formData.append("article", data.article.trim() || "");
      formData.append("metaDescription", data.metaDescription.trim() || "");
      formData.append("metaTitle", data.metaTitle.trim() || "");

      const imageFile = data?.coverImage;
      if (imageFile instanceof File) {
        formData.append("coverImage", imageFile);
      }
      let convertedHonorDate;
      if (dateOfHonor) {
        if (dateOfHonor instanceof Date) {
          convertedHonorDate = dateOfHonor;
        } else {
          convertedHonorDate = convertToGregorian(dateOfHonor?.format("YYYY/MM/DD"));
        }
      }
      formData.append("honorDate", convertedHonorDate);

      if (isEdit) {
        dispatch(updateHonor({ slug, formData }));
      } else {
        dispatch(createHonor(formData));
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "افتخار با موفقیت اضافه شد!");
      setTimeout(() => navigate("/dashboard/honors"), 2000);
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
    dateOfHonor,
    setDateOfHonor,
    previewImage,
    handleImagePreview,
    loading,
    error,
    setAlerts,
    authors,
    articles,
  };
};

export default useHonorForm;
