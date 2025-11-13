import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { createNews, updateNews, fetchNewsBySlug, fetchNews } from "../features/newsSlice";
import { fetchAuthors } from "../features/authorsSlice";
import { fetchTags } from "../features/tagsSlice";
import api from "../services/api";

const schema = yup.object().shape({
  title: yup.string().required("عنوان خبر اجباری است"),
  subtitle: yup.string(),
  excerpt: yup.string().required("خلاصه خبر اجباری است"),
  content: yup.string().required("محتوای خبر اجباری است"),
  metaTitle: yup.string().required("متاتایتل اجباری است"),
  metaDescription: yup.string(),
  status: yup.string().oneOf(["draft", "published", "archived"]).default("draft"),
  category: yup.string().required("انتخاب دسته‌بندی اجباری است"),
  author: yup.string().required("انتخاب نویسنده اجباری است"),
  tags: yup.array(),
  relatedNews: yup.array(),
  gallery: yup.array().test("fileSize", "هر تصویر باید کمتر از ۲۰ مگابایت باشد", (files) => {
    if (!files || files.length === 0) return true;
    return files.every((file) => file.size <= 20 * 1024 * 1024);
  }),
  featuredImage: yup.mixed().test("fileSize", "حجم تصویر نباید بیشتر از 20MB باشد", (file) => {
    if (!file || file.length === 0) return true;
    return file.length > 0 ? file[0].size <= 20 * 1024 * 1024 : true;
  }),
});

const useNewsForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedRelatedNews, setSelectedRelatedNews] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allNews, setAllNews] = useState([]);

  const { selectedNews, loading, error } = useSelector((state) => state.news);
  const { authors } = useSelector((state) => state.authors);
  const { tags } = useSelector((state) => state.tags);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "draft",
      title: "",
      subtitle: "",
      excerpt: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      category: "",
      author: "",
      tags: [],
      relatedNews: [],
      featuredImage: "",
      gallery: [],
    },
  });

  // بارگذاری خبر برای ویرایش
  useEffect(() => {
    let ignore = false;

    if (isEdit && id && !ignore) {
      dispatch(fetchNewsBySlug(id));
    }
    return () => {
      ignore = true;
    };
  }, [dispatch, isEdit, id]);

  // بارگذاری داده‌های پایه
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAuthors({ limit: 1000 })),
          dispatch(fetchTags()),
          dispatch(fetchNews()),
        ]);

        // بارگذاری دسته‌بندی‌ها
        const categoriesResponse = await api.get("/blog/categories");
        setCategories(categoriesResponse.data?.data || []);

        // بارگذاری تمام اخبار برای related news
        const newsResponse = await api.get("/news", { params: { limit: 1000 } });
        setAllNews(newsResponse.data?.data || []);
      } catch (err) {
        console.error("خطا در بارگذاری داده‌های اولیه:", err);
      }
    };

    loadInitialData();
  }, [dispatch]);

  // پر کردن فرم با داده‌های خبر در حالت ویرایش
  useEffect(() => {
    if (isEdit && selectedNews) {
      setValue("status", selectedNews.status || "draft");
      setValue("title", selectedNews.title || "");
      setValue("subtitle", selectedNews.subtitle || "");
      setValue("excerpt", selectedNews.excerpt || "");
      setValue("content", selectedNews.content || "");
      setValue("metaTitle", selectedNews.seo?.metaTitle || "");
      setValue("metaDescription", selectedNews.seo?.metaDescription || "");
      setValue("category", selectedNews.category?._id || "");
      setValue("author", selectedNews.author?._id || "");
      setValue("tags", selectedNews.tags?.map((tag) => tag._id) || []);
      setValue("relatedNews", selectedNews.relatedNews?.map((news) => news._id) || []);

      if (selectedNews.gallery) {
        const mappedImages = selectedNews.gallery.map((img) => ({
          file: null,
          preview: `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${img.desktop}`,
        }));
        setSelectedImages(mappedImages);
        setValue("gallery", selectedNews.gallery);
      }

      setSelectedTags(selectedNews.tags?.map((tag) => tag._id) || []);
      setSelectedRelatedNews(selectedNews.relatedNews?.map((news) => news._id) || []);
      setEditorContent(selectedNews.content || "");

      if (selectedNews.featuredImage) {
        setPreviewImage(
          `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${selectedNews.featuredImage.desktop}`
        );
      }
    }
  }, [isEdit, selectedNews, setValue]);

  // مدیریت تغییر تصویر اصلی
  const handleFeaturedImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("featuredImage", file);
    }
  };

  // مدیریت انتخاب و حذف تصاویر گالری
  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files);

    const validFiles = files.filter((file) => file.size <= 20 * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert("برخی از تصاویر انتخاب شده بیشتر از 20 مگابایت هستند و حذف شدند");
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages([...selectedImages, ...newImages]);
    setValue("gallery", [...selectedImages, ...validFiles]);
  };

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    const removedImage = updatedImages[index];

    if (removedImage?.preview && removedImage.preview.startsWith("blob:")) {
      URL.revokeObjectURL(removedImage.preview);
    }

    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);

    const formImages = updatedImages.filter((img) => img.file).map((img) => img.file);
    setValue("gallery", formImages);
  };

  // مدیریت انتخاب و حذف تگ‌ها
  const handleTagSelection = (tagId, setSearchQuery) => {
    if (!selectedTags.includes(tagId)) {
      const newTags = [...selectedTags, tagId];
      setSelectedTags(newTags);
      setValue("tags", newTags);
      if (setSearchQuery) setSearchQuery("");
    }
  };

  const removeTag = (tagId) => {
    const updatedTags = selectedTags.filter((id) => id !== tagId);
    setSelectedTags(updatedTags);
    setValue("tags", updatedTags);
  };

  // مدیریت انتخاب و حذف اخبار مرتبط
  const handleRelatedNewsSelection = (newsId) => {
    if (!selectedRelatedNews.includes(newsId)) {
      const newRelatedNews = [...selectedRelatedNews, newsId];
      setSelectedRelatedNews(newRelatedNews);
      setValue("relatedNews", newRelatedNews);
    }
  };

  const removeRelatedNews = (newsId) => {
    const updatedNews = selectedRelatedNews.filter((id) => id !== newsId);
    setSelectedRelatedNews(updatedNews);
    setValue("relatedNews", updatedNews);
  };

  // مدیریت ارسال داده‌ها
  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      const formData = new FormData();

      // افزودن فیلدهای متنی
      formData.append("title", data.title.trim());
      formData.append("subtitle", data.subtitle?.trim() || "");
      formData.append("excerpt", data.excerpt?.trim() || "");
      formData.append("content", editorContent || "");
      formData.append("status", data.status || "draft");

      // افزودن SEO
      formData.append("seo[metaTitle]", data.metaTitle?.trim() || data.title.trim());
      formData.append("seo[metaDescription]", data.metaDescription?.trim() || "");

      // افزودن فیلدهای ارتباطی
      if (data.category) formData.append("category", data.category);
      if (data.author) formData.append("author", data.author);

      // افزودن تصویر اصلی
      const imageFile = data?.featuredImage;
      if (imageFile instanceof File) {
        formData.append("featuredImage", imageFile);
      }

      // افزودن تگ‌ها
      if (selectedTags.length > 0) {
        selectedTags.forEach((tagId, index) => {
          formData.append(`tags[${index}]`, tagId);
        });
      }

      // افزودن اخبار مرتبط
      if (selectedRelatedNews.length > 0) {
        selectedRelatedNews.forEach((newsId, index) => {
          formData.append(`relatedNews[${index}]`, newsId);
        });
      }

      // افزودن تصاویر گالری
      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          if (image instanceof File) {
            formData.append("gallery", image);
          } else if (image.file instanceof File) {
            formData.append("gallery", image.file);
          } else if (typeof image === "string") {
            formData.append("existingGallery", image);
          }
        });
      }

      // ارسال درخواست به سرور
      let response;
      if (isEdit) {
        const newsId = selectedNews?._id;
        if (!newsId) {
          throw new Error("شناسه خبر یافت نشد");
        }
        response = await dispatch(updateNews({ id: newsId, formData })).unwrap();
        console.log("خبر با موفقیت ویرایش شد:", response);
      } else {
        response = await dispatch(createNews(formData)).unwrap();
        console.log("خبر با موفقیت ایجاد شد:", response);

        // پاک کردن فرم پس از ایجاد موفق
        reset();
        setEditorContent("");
        setSelectedTags([]);
        setSelectedImages([]);
        setSelectedRelatedNews([]);
        setPreviewImage(null);
      }

      setSubmitSuccess(true);

      // هدایت به صفحه لیست اخبار پس از 2 ثانیه
      setTimeout(() => {
        navigate("/dashboard/news");
      }, 2000);
    } catch (error) {
      console.error("🚨 خطا در ارسال خبر:", error);
      setSubmitError(error?.message || "خطایی در ارسال خبر رخ داد");
      setSubmitSuccess(false);
    }
  };

  // پاکسازی منابع هنگام خروج از کامپوننت
  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        if (image.preview && image.preview.startsWith("blob:")) {
          URL.revokeObjectURL(image.preview);
        }
      });

      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [selectedImages, previewImage]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    previewImage,
    handleFeaturedImageChange,
    handleTagSelection,
    removeTag,
    selectedTags,
    selectedImages,
    handleImageSelection,
    removeImage,
    selectedRelatedNews,
    handleRelatedNewsSelection,
    removeRelatedNews,
    categories,
    authors,
    tags,
    loading,
    error,
    allNews,
    watch,
    setSelectedTags,
    setValue,
    editorContent,
    setEditorContent,
    submitSuccess,
    submitError,
    isSubmitting,
    getValues,
    control,
  };
};

export default useNewsForm;
