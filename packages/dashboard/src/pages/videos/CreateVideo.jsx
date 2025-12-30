import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createVideo } from "../../features/videosSlice";
import { fetchTags } from "../../features/tagsSlice";
import VideoForm from "../../components/videos/VideoForm";

const schema = yup.object().shape({
  title: yup.string().required("عنوان ویدئو اجباری است"),
  subtitle: yup.string(),
  description: yup.string().required("توضیحات ویدئو اجباری است"),
  videoUrl: yup.string().url("آدرس ویدئو باید معتبر باشد").required("آدرس ویدئو اجباری است"),
  metaTitle: yup.string(),
  metaDescription: yup.string(),
  status: yup.string().oneOf(["draft", "published"]).default("draft"),
  category: yup.string(),
  cameraman: yup.string(),
  tags: yup.array(),
  coverImage: yup
    .mixed()
    .test("fileSize", "حجم تصویر نباید بیشتر از 20MB باشد", (file) => {
      if (!file || file.length === 0) return true;
      return file.length > 0 ? file[0].size <= 20 * 1024 * 1024 : true;
    })
    .required("تصویر کاور اجباری است"),
});

const CreateVideo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const { tags } = useSelector((state) => state.tags);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "draft",
      title: "",
      subtitle: "",
      description: "",
      videoUrl: "",
      metaTitle: "",
      metaDescription: "",
      cameraman: "",
      tags: [],
    },
  });

  const watchedVideoUrl = watch("videoUrl");

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    setVideoUrl(watchedVideoUrl);
  }, [watchedVideoUrl]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagSelection = (tagId, setSearchQuery) => {
    if (tagId && !selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
    if (setSearchQuery) {
      setSearchQuery("");
    }
  };

  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      formData.append("description", data.description);
      formData.append("videoUrl", data.videoUrl);
      if (data.metaTitle) formData.append("seo[metaTitle]", data.metaTitle);
      if (data.metaDescription) formData.append("seo[metaDescription]", data.metaDescription);
      formData.append("status", data.status);
      if (data.cameraman) formData.append("cameraman", data.cameraman);

      selectedTags.forEach((tagId) => {
        formData.append("tags[]", tagId);
      });

      if (data.coverImage?.[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }

      await dispatch(createVideo(formData)).unwrap();
      setSubmitSuccess(true);
      setSubmitError(null);

      setTimeout(() => {
        navigate("/dashboard/videos");
      }, 1500);
    } catch (error) {
      setSubmitError(error || "خطایی در ایجاد ویدئو رخ داد");
      setSubmitSuccess(false);
    }
  };

  return (
    <VideoForm
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      isEdit={false}
      tags={tags}
      selectedTags={selectedTags}
      setSelectedTags={setSelectedTags}
      handleTagSelection={handleTagSelection}
      removeTag={removeTag}
      previewImage={previewImage}
      videoUrl={videoUrl}
      submitSuccess={submitSuccess}
      submitError={submitError}
      handleCoverImageChange={handleCoverImageChange}
    />
  );
};

export default CreateVideo;
