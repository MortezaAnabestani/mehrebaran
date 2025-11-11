import { useState, useEffect } from "react";
import UploadImageList from "./UploadImagesList";
import { useDispatch, useSelector } from "react-redux";
import { createImageUploadCenter, fetchImageUploadCenter } from "../../features/imageUploadCenter";

const UploadImage = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const { imageUploadCenter, loading, error } = useSelector((state) => state.imageUploadCenter);
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(fetchImageUploadCenter()).unwrap();
    setImages(imageUploadCenter);
  }, [dispatch, images, imageUploadCenter.length]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setImageUrl(null); // پاک کردن `URL` قبلی
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("❌ لطفاً یک فایل انتخاب کنید!");

    setUploading(true);
    const formData = new FormData();
    formData.append("imageUrl", file);
    formData.append("title", title);

    try {
      if (title) {
        dispatch(createImageUploadCenter(formData)).unwrap();
        dispatch(fetchImageUploadCenter()).unwrap();
        setPreview(null);
        setTitle("");
      } else {
        alert("ابتدا عنوان عکس را وارد کنید");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-full p-5 bg-blue-50 shadow-lg rounded-lg mx-auto">
      {/* ناحیه انتخاب فایل */}
      <div className="flex justify-between w-full items-center mb-4">
        <img
          src="/assets/images/dashboard/icons/cloud_development.svg"
          alt="cloud_database"
          className="w-10 h-10 hover:animate-ping"
        />

        <h2 className="font-semibold ">مرکز فضای ابری وقایع اتفاقیه</h2>
        <img
          src="/assets/images/dashboard/icons/cloud_database.svg"
          alt="cloud_database"
          className="w-10 h-10 hover:animate-ping"
        />
      </div>
      <label
        htmlFor="imageUrl"
        className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
      >
        <img
          src="/assets/images/dashboard/icons/upload_to_cloud_blue.svg"
          alt="upload icon"
          className="w-12 h-12 text-gray-400 group-hover:text-blue-500"
        />
        <p className="mt-2 text-gray-600 text-sm">برای آپلود کلیک کنید</p>
        <input type="file" id="imageUrl" name="imageUrl" className="hidden" onChange={handleFileChange} />
      </label>
      <label htmlFor="title" className="text-sm mt-3 flex items-center gap-1 w-full">
        عنوان:
        <input
          type="text"
          placeholder="نامی برای عکس خود انتخاب کنید"
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-10 p-2 text-xs rounded-sm w-full bg-blue-50 border border-blue-200"
        />
      </label>

      {/* پیش‌نمایش تصویر */}
      {preview && (
        <div className="relative mt-4">
          <img
            loading="lazy"
            src={preview}
            alt="پیش‌نمایش"
            className="w-full h-80 object-cover rounded-md shadow-md"
          />
          <button
            onClick={() => {
              setPreview(null);
              setFile(null);
              setImageUrl(null);
            }}
            className="absolute top-0 right-0 p-1 bg-gray-100 rounded-full border border-red-600"
          >
            <img
              loading="lazy"
              src="/assets/images/dashboard/icons/close.svg"
              alt="close icon"
              className="w-6 h-6 cursor-pointer"
            />
          </button>
        </div>
      )}

      {/* دکمه آپلود */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`mt-4 w-full py-2 text-white rounded-lg transition cursor-pointer ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        }`}
      >
        {uploading ? "در حال آپلود..." : "آپلود تصویر"}
      </button>

      {/* نمایش URL پس از آپلود */}
      {imageUrl && (
        <div className="mt-4 w-full text-center text-sm text-gray-700">
          <p className="mb-2 font-semibold text-green-600">آپلود موفق!</p>

          {/* نمایش لینک تصویر */}
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block mb-2"
          >
            مشاهده تصویر
          </a>

          {/* نمایش URL با دکمه کپی */}
          <div className="flex items-center justify-center gap-2 bg-gray-100 p-2 rounded-md">
            <button
              onClick={() => {
                navigator.clipboard.writeText(imageUrl);
                alert("لینک کپی شد!");
              }}
            >
              <img
                src="/assets/images/dashboard/icons/copy.svg"
                alt="copy image"
                className="w-8 h-8 cursor-pointer rounded-xs p-1 bg-green-300 animate-pulse"
              />
            </button>
            <input
              type="text"
              value={imageUrl}
              readOnly
              className="w-full bg-transparent ltr text-gray-700 text-sm outline-none"
            />
          </div>
        </div>
      )}
      <UploadImageList images={images} loading={loading} />
    </div>
  );
};

export default UploadImage;
