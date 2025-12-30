import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { createArticle, updateArticle, fetchArticleBySlug, fetchArticles } from "../features/articlesSlice";
import { fetchCategories } from "../features/categoriesSlice";
import { fetchAuthors } from "../features/authorsSlice";
import { fetchTags } from "../features/tagsSlice";

const schema = yup.object().shape({
  title: yup.string().required("عنوان مقاله اجباری است"),
  metaTitle: yup.string(),
  subtitle: yup.string(),
  excerpt: yup.string().required("خلاصه مقاله اجباری است"),
  content: yup.string().required("محتوای مقاله اجباری است"),
  metaDescription: yup.string(),
  status: yup.string().oneOf(["draft", "published", "archived"]).default("draft"),
  category: yup.string().required("انتخاب دسته‌بندی اجباری است"),
  author: yup.string().required("انتخاب نویسنده اجباری است"),
  tags: yup.array(),
  relatedArticles: yup.array(),
  images: yup.array().test("fileSize", "هر تصویر باید کمتر از ۲۰ مگابایت باشد", (files) => {
    if (!files || files.length === 0) return true;
    return files.every((file) => file.size <= 20 * 1024 * 1024);
  }),
  coverImage: yup.mixed().test("fileSize", "حجم تصویر نباید بیشتر از 20MB باشد", (file) => {
    if (!file || file.length === 0) return true;
    return file.length > 0 ? file[0].size <= 20 * 1024 * 1024 : true;
  }),
});

const useArticleForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedRelatedArticles, setSelectedRelatedArticles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [step2Data, setStep2Data] = useState({ ready: false, article: null });
  const [removedServerImages, setRemovedServerImages] = useState([]);

  const { selectedArticle, loading, error } = useSelector((state) => state.articles);
  const { categories } = useSelector((state) => state.categories);
  const { authors } = useSelector((state) => state.authors);
  const { tags } = useSelector((state) => state.tags);
  const { articles } = useSelector((state) => state.articles);

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
      category: "",
      title: "",
      metaTitle: "",
      subtitle: "",
      excerpt: "",
      content: "",
      metaDescription: "",
      author: "",
      tags: [],
      relatedArticles: [],
      coverImage: "",
      images: [],
    },
  });

  // مدیریت مقداردهی اولیه هنگام ویرایش
  useEffect(() => {
    let ignore = false;

    if (isEdit && slug && !ignore) {
      dispatch(fetchArticleBySlug(slug));
    }
    return () => {
      ignore = true;
    };
  }, [dispatch, isEdit, slug]);

  // بارگذاری داده‌های پایه
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCategories()),
          dispatch(fetchAuthors({limit: 1000})),
          dispatch(fetchTags()),
          dispatch(fetchArticles()),
        ]);
      } catch (err) {
        console.error("خطا در بارگذاری داده‌های اولیه:", err);
      }
    };

    loadInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (
      isEdit &&
      selectedArticle &&
      categories?.length > 0 // مطمئن شو که categories لود شده
    ) {
      // مرحله اول: فقط reset با category
      reset({
        category: selectedArticle?.category?._id || "",
        author: selectedArticle?.author?._id || "",
      });

      // مرحله دوم: پس از category لود شدن
      setStep2Data({
        ready: true,
        article: selectedArticle,
      });
    }
  }, [isEdit, selectedArticle, categories, reset, authors]);

  // پر کردن فرم با داده‌های مقاله در حالت ویرایش
  useEffect(() => {
    if (!step2Data.ready || !step2Data.article) return;

    const { article } = step2Data;

    // بقیه مقادیر
    setValue("status", article.status || "draft");
    setValue("title", article.title || "");
    setValue("metaTitle", article.metaTitle || "");
    setValue("subtitle", article.subtitle || "");
    setValue("excerpt", article.excerpt || "");
    setValue("content", article.content || "");
    setValue("metaDescription", article.metaDescription || "");
    setValue("category", article.category?._id || "");
    setValue("author", article.author?._id || "");
    setValue("tags", article.tags?.map((tag) => tag._id) || []);
    setValue("relatedArticles", article.relatedArticles || []);

    // بارگذاری تصاویر: coverImage + gallery
    const allImages = [];

    // افزودن coverImage به عنوان اولین تصویر
    if (article.featuredImage) {
      const coverImagePath = typeof article.featuredImage === 'object' && article.featuredImage.desktop
        ? article.featuredImage.desktop
        : article.featuredImage;
      allImages.push({
        file: null,
        preview: `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${coverImagePath}`,
        serverImage: article.featuredImage,
      });
      setPreviewImage(`${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${coverImagePath}`);
    }

    // افزودن تصاویر گالری
    if (article.gallery && article.gallery.length > 0) {
      article.gallery.forEach((img) => {
        const imagePath = typeof img === 'object' && img.desktop ? img.desktop : img;
        allImages.push({
          file: null,
          preview: `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${imagePath}`,
          serverImage: img,
        });
      });
    }

    setSelectedImages(allImages);

    setSelectedTags(article.tags?.map((tag) => tag._id) || []);
    setSelectedRelatedArticles(article.relatedArticles?.map((a) => typeof a === 'string' ? a : a._id) || []);
    setEditorContent(article.content || "");

    // یکبار اجرا بشه
    setStep2Data({ ready: false, article: null });
  }, [step2Data, setValue, categories]);

  // مدیریت تغییر تصویر اصلی
  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("coverImage", file);
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

  // مدیریت انتخاب و حذف تگ‌ها
  const handleTagSelection = (tagId, setSearchQuery) => {
    if (!selectedTags.includes(tagId)) {
      const newTags = [...selectedTags, tagId];
      setSelectedTags(newTags);
      setValue("tags", newTags);
      if (setSearchQuery) setSearchQuery(""); // پاک کردن جستجو بعد از انتخاب
    }
  };

  const removeTag = (tagId) => {
    const updatedTags = selectedTags.filter((id) => id !== tagId);
    setSelectedTags(updatedTags);
    setValue("tags", updatedTags);
  };

  // مدیریت انتخاب و حذف مقالات مرتبط
  const handleRelatedArticleSelection = (articleId) => {
    if (!selectedRelatedArticles.includes(articleId)) {
      const newRelatedArticles = [...selectedRelatedArticles, articleId];
      setSelectedRelatedArticles(newRelatedArticles);
      setValue("relatedArticles", newRelatedArticles);
    }
  };

  const removeRelatedArticle = (articleId) => {
    const updatedArticles = selectedRelatedArticles.filter((id) => id !== articleId);
    setSelectedRelatedArticles(updatedArticles);
    setValue("relatedArticles", updatedArticles);
  };

  // مدیریت ارسال داده‌ها
  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      const formData = new FormData();

      // افزودن فیلدهای متنی
      formData.append("title", data.title.trim());
      formData.append("metaTitle", data.metaTitle?.trim() || data.title.trim());
      formData.append("subtitle", data.subtitle?.trim() || "");
      formData.append("excerpt", data.excerpt?.trim() || "");
      formData.append("content", editorContent || "");
      formData.append("metaDescription", data.metaDescription?.trim() || "");
      formData.append("status", data.status || "draft");

      // افزودن فیلدهای ارتباطی
      if (data.category) formData.append("category", data.category);
      if (data.author) formData.append("author", data.author);

      if (removedServerImages.length > 0) {
        removedServerImages.forEach((imagePath) => {
          formData.append("removedServerImages", imagePath);
        });
      }
      const imageFile = data?.coverImage;
      if (imageFile instanceof File) {
        formData.append("images", imageFile);
      }

      // افزودن تگ‌ها
      if (selectedTags.length > 0) {
        selectedTags.forEach((tagId, index) => {
          formData.append(`tags[${index}]`, tagId);
        });
      }

      // افزودن مقالات مرتبط
      if (selectedRelatedArticles.length > 0) {
        selectedRelatedArticles.forEach((articleId, index) => {
          formData.append(`relatedArticles[${index}]`, articleId);
        });
      }

      // افزودن تصاویر گالری
      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          } else if (image.file instanceof File) {
            formData.append("images", image.file);
          } else if (image.serverImage) {
            // اگر تصویر از سرور است، اطلاعات کامل را به صورت JSON ارسال کن
            formData.append("existingImages", JSON.stringify(image.serverImage));
          } else if (typeof image === "string") {
            formData.append("existingImages", image);
          }
        });
      }

      // ارسال درخواست به سرور
      let response;
      if (isEdit) {
        // استفاده از _id به جای slug برای ویرایش
        const articleId = selectedArticle?._id;
        if (!articleId) {
          throw new Error("شناسه مقاله یافت نشد");
        }
        response = dispatch(updateArticle({ id: articleId, formData }));
        console.log("مقاله با موفقیت ویرایش شد:", response);
      } else {
        response = dispatch(createArticle(formData));
        console.log("مقاله با موفقیت ایجاد شد:", response);

        // پاک کردن فرم پس از ایجاد موفق
        reset();
        setEditorContent("");
        setSelectedTags([]);
        setSelectedImages([]);
        setSelectedRelatedArticles([]);
        setPreviewImage(null);
      }

      setSubmitSuccess(true);

      // هدایت به صفحه لیست مقالات پس از 2 ثانیه
      setTimeout(() => {
        navigate("/dashboard/articles");
      }, 2000);
    } catch (error) {
      console.error("🚨 خطا در ارسال مقاله:", error);
      setSubmitError(error?.message || "خطایی در ارسال مقاله رخ داد");
      setSubmitSuccess(false);
    }
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
    handleCoverImageChange,
    handleTagSelection,
    removeTag,
    selectedTags,
    selectedImages,
    handleImageSelection,
    removeImage,

    selectedRelatedArticles,
    handleRelatedArticleSelection,
    removeRelatedArticle,
    categories,
    authors,
    tags,
    loading,
    error,
    articles,
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

export default useArticleForm;
