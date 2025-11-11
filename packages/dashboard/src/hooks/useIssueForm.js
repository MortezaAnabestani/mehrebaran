import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createIssue, updateIssue, fetchIssueById } from "../features/issuesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTemplates } from "../features/templatesSlice";
import { fetchAuthors } from "../features/authorsSlice";
import { convertToGregorian } from "../utils/convertTimeToGregorian";

const schema = yup.object().shape({
  title: yup.string().required("عنوان شماره اجباری است"),
  titleEn: yup.string(),
  subTitle: yup.string(),
  subTitleEn: yup.string(),
  description: yup.string(),
  template: yup.string(),
  authors: yup.array(),
  issueNumber: yup.string().required("شماره نشریه ضروری است"),
  coverImage: yup
    .mixed()
    .test("fileSize", "حجم تصویر نباید بیشتر از 5MB باشد", (file) =>
      file.length > 0 ? file[0].size <= 5 * 1024 * 1024 : true
    ),
});

const useIssueForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const [selectedAuthors, setSelectedAuthors] = useState([]); // لیست نویسندگان انتخاب‌شده
  const { templates } = useSelector((state) => state.templates);
  const { authors } = useSelector((state) => state.authors);
  const { selectedIssue, loading, error } = useSelector((state) => state.issues);
  const navigate = useNavigate();
  const { id } = useParams();
    console.log("authors_useForm: ", authors)

  const [approved, setApproved] = useState(false);
  const [release, setRelease] = useState(null);
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
      setValue("coverImage", file); // تنظیم مقدار برای `react-hook-form`
    }
  };

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchAuthors({ limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchIssueById(id));
    }
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && selectedIssue) {
      setValue("template", selectedIssue?.template._id);
      setValue("title", selectedIssue?.title);
      setValue("titleEn", selectedIssue?.titleEn);
      setValue("subTitle", selectedIssue?.subTitle);
      setValue("subTitleEn", selectedIssue?.subTitleEn);
      setValue("description", selectedIssue?.description);
      setValue("issueNumber", selectedIssue?.issueNumber);
      setSelectedAuthors(selectedIssue?.authors || []);
      setValue("authors", selectedIssue?.authors || []);
      if (selectedIssue?.releaseDate) {
        setApproved(true);
        setRelease(new Date(selectedIssue?.releaseDate)); // یا تاریخ شمسی که باید تبدیل شود
      }
      // مقداردهی اولیه `previewImage`
      if (selectedIssue.coverImage) {
        setPreviewImage(
          `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}/${selectedIssue.coverImage}`
        );
      }
    }
  }, [selectedIssue, isEdit, setValue, templates]);

  function authorHandler(authorId) {
    if (!authorId || selectedAuthors.some((a) => a._id === authorId)) return;

    const author = authors.authors.find((a) => a._id === authorId);
    if (author) {
      const updatedAuthors = [...selectedAuthors, author];
      setSelectedAuthors(updatedAuthors);
      setValue(
        "authors",
        updatedAuthors.map((a) => a._id)
      ); 
    }
  }

  const removeAuthor = (authorId) => {
    const updatedAuthors = selectedAuthors.filter((author) => author._id !== authorId);
    setSelectedAuthors(updatedAuthors);
    setValue(
      "authors",
      updatedAuthors.map((a) => a._id)
    ); // بروزرسانی authors در فرم
  }; // بروزرسانی مقدار ثبت‌شده در فرم

  const onSubmit = async (data) => {
    setFaults(null);
    setAlerts(null);
    try {
      if (!approved) {
        setAlerts("لطفاً تاریخ انتشار را تأیید کنید!");
        return;
      }

      if (isEdit) {
        if (!previewImage) {
          setFaults("لطفاً ابتدا عکس را بارگذاری کنید ");
          return;
        }
      } else {
        if (!data.coverImage || !(data.coverImage instanceof File)) {
          setFaults("لطفاً ابتدا عکس را بارگذاری کنید ");
          return;
        }
      }

      if (!data.template || data.template === "انتخاب قالب") {
        setFaults("لطفاً قالب شماره انتخاب کنید ");
        return;
      }

      if (data.authors < 0) {
        setFaults("لطفاً نویسندگان شماره انتخاب کنید ");
        return;
      }
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("titleEn", data.titleEn.trim());
      formData.append("subTitle", data.subTitle.trim() || "");
      formData.append("subTitleEn", data.subTitleEn.trim() || "");
      formData.append("description", data.description.trim() || "");
      formData.append("template", data.template || "");
      formData.append("issueNumber", data.issueNumber.trim() || "");
      if (Array.isArray(data.authors) && data.authors.length > 0) {
        const authorIds = data.authors.map((author) => author._id || author); // استخراج فقط _id
        authorIds.forEach((authorId, index) => {
          formData.append(`authors[${index}]`, authorId);
        });
      }

      formData.append("coverImage", data.coverImage); // فقط فایل اول را ارسال کن

      let convertedReleaseDate;
      if (release) {
        if (release instanceof Date) {
          convertedReleaseDate = release;
        } else {
          convertedReleaseDate = convertToGregorian(release?.format("YYYY/MM/DD"));
        }
      }
      formData.append("releaseDate", convertedReleaseDate);

      // تبدیل تاریخ به فرمت استاندارد
      if (isEdit) {
        dispatch(updateIssue({ id, formData }));
      } else {
        dispatch(createIssue(formData));
      }
      setAlerts(isEdit ? " ویرایش انجام شد!" : "شمارۀ جدید با موفقیت اضافه شد!");
      setTimeout(() => navigate("/dashboard/issues"), 2000);
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
    release,
    setRelease,
    previewImage,
    handleImagePreview,
    loading,
    error,
    setAlerts,
    selectedAuthors,
    templates,
    authors,
    authorHandler,
    removeAuthor,
    faults,
    setFaults,
  };
};

export default useIssueForm;
