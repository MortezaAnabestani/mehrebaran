import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { createNeed, updateNeed, fetchNeedById } from "../features/needsSlice";

const schema = yup.object().shape({
  title: yup.string().min(5, "عنوان باید حداقل 5 کاراکتر باشد").required("عنوان نیاز اجباری است"),
  description: yup.string().min(20, "توضیحات باید حداقل 20 کاراکتر باشد").required("توضیحات اجباری است"),
  category: yup.string().required("انتخاب دسته‌بندی اجباری است"),
  status: yup
    .string()
    .oneOf([
      "draft",
      "pending",
      "under_review",
      "approved",
      "in_progress",
      "completed",
      "rejected",
      "archived",
      "cancelled",
    ])
    .default("draft"),
  urgencyLevel: yup.string().oneOf(["low", "medium", "high", "critical"]).default("medium"),
  estimatedDuration: yup.string(),
  requiredSkills: yup.array().of(yup.string()),
  tags: yup.array().of(yup.string()),
  attachments: yup.array().test("fileSize", "هر فایل باید کمتر از ۲۰ مگابایت باشد", (files) => {
    if (!files || files.length === 0) return true;
    return files.every((file) => file.size <= 20 * 1024 * 1024);
  }),
  // Location fields
  "location.address": yup.string(),
  "location.locationName": yup.string(),
  "location.city": yup.string(),
  "location.province": yup.string(),
  "location.coordinates": yup.array().of(yup.number()),
});

const useNeedForm = (isEdit = false) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedAttachments, setSelectedAttachments] = useState([]);

  const { selectedNeed, loading, error } = useSelector((state) => state.needs);

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
      title: "",
      description: "",
      category: "",
      status: "draft",
      urgencyLevel: "medium",
      estimatedDuration: "",
      requiredSkills: [],
      tags: [],
      attachments: [],
      location: {
        address: "",
        locationName: "",
        city: "",
        province: "",
        coordinates: [],
      },
    },
  });

  // مدیریت مقداردهی اولیه هنگام ویرایش
  useEffect(() => {
    let ignore = false;

    if (isEdit && id && !ignore) {
      dispatch(fetchNeedById(id));
    }
    return () => {
      ignore = true;
    };
  }, [dispatch, isEdit, id]);

  // پر کردن فرم با داده‌های نیاز در حالت ویرایش
  useEffect(() => {
    if (isEdit && selectedNeed) {
      reset({
        title: selectedNeed.title || "",
        description: selectedNeed.description || "",
        category: selectedNeed.category?._id || "",
        status: selectedNeed.status || "draft",
        urgencyLevel: selectedNeed.urgencyLevel || "medium",
        estimatedDuration: selectedNeed.estimatedDuration || "",
        requiredSkills: selectedNeed.requiredSkills || [],
        tags: selectedNeed.tags || [],
        location: {
          address: selectedNeed.location?.address || "",
          locationName: selectedNeed.location?.locationName || "",
          city: selectedNeed.location?.city || "",
          province: selectedNeed.location?.province || "",
          coordinates: selectedNeed.location?.coordinates || [],
        },
      });

      if (selectedNeed.description) {
        setEditorContent(selectedNeed.description);
      }

      if (selectedNeed.tags) {
        setSelectedTags(selectedNeed.tags);
      }

      if (selectedNeed.requiredSkills) {
        setSelectedSkills(selectedNeed.requiredSkills);
      }
    }
  }, [isEdit, selectedNeed, reset]);

  // مدیریت تغییر محتوا
  const handleContentChange = (content) => {
    setEditorContent(content);
    setValue("description", content);
  };

  // مدیریت انتخاب تگ‌ها
  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
    setValue("tags", tags);
  };

  // مدیریت انتخاب مهارت‌ها
  const handleSkillsChange = (skills) => {
    setSelectedSkills(skills);
    setValue("requiredSkills", skills);
  };

  // مدیریت انتخاب فایل‌ها
  const handleAttachmentsChange = (files) => {
    setSelectedAttachments(files);
    setValue("attachments", files);
  };

  // ارسال فرم
  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      const formData = new FormData();

      // افزودن فیلدهای اصلی
      formData.append("title", data.title);
      formData.append("description", data.description || editorContent);
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("urgencyLevel", data.urgencyLevel);

      if (data.estimatedDuration) {
        formData.append("estimatedDuration", data.estimatedDuration);
      }

      // افزودن تگ‌ها و مهارت‌ها
      if (selectedTags && selectedTags.length > 0) {
        selectedTags.forEach((tag) => {
          formData.append("tags[]", tag);
        });
      }

      if (selectedSkills && selectedSkills.length > 0) {
        selectedSkills.forEach((skill) => {
          formData.append("requiredSkills[]", skill);
        });
      }

      // افزودن location
      if (data.location) {
        if (data.location.address) formData.append("location[address]", data.location.address);
        if (data.location.locationName) formData.append("location[locationName]", data.location.locationName);
        if (data.location.city) formData.append("location[city]", data.location.city);
        if (data.location.province) formData.append("location[province]", data.location.province);
        if (data.location.coordinates && data.location.coordinates.length === 2) {
          formData.append("location[coordinates][0]", data.location.coordinates[0]);
          formData.append("location[coordinates][1]", data.location.coordinates[1]);
          formData.append("location[type]", "Point");
        }
      }

      // افزودن فایل‌های پیوست
      if (data.attachments && data.attachments.length > 0) {
        for (let i = 0; i < data.attachments.length; i++) {
          formData.append("attachments", data.attachments[i]);
        }
      }

      let response;
      if (isEdit) {
        const needId = selectedNeed?._id;
        if (!needId) {
          throw new Error("شناسه نیاز یافت نشد");
        }
        response = await dispatch(updateNeed({ id: needId, formData })).unwrap();
      } else {
        response = await dispatch(createNeed(formData)).unwrap();
      }

      setSubmitSuccess(true);

      // هدایت به صفحه لیست نیازها پس از موفقیت
      setTimeout(() => {
        navigate("/dashboard/needs");
      }, 1500);

    } catch (err) {
      console.error("خطا در ارسال فرم:", err);
      setSubmitError(err.message || "خطایی در ارسال فرم رخ داده است");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    loading,
    error,
    submitSuccess,
    submitError,
    editorContent,
    handleContentChange,
    selectedTags,
    handleTagsChange,
    selectedSkills,
    handleSkillsChange,
    selectedAttachments,
    handleAttachmentsChange,
    setValue,
    getValues,
    watch,
    control,
    selectedNeed,
  };
};

export default useNeedForm;
