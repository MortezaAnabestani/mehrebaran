import { useState, useEffect, useRef } from "react";
import UploadImageList from "./UploadImagesList";
import { useDispatch, useSelector } from "react-redux";
import { createImageUploadCenter, fetchImageUploadCenter } from "../../features/imageUploadCenter";

const UploadImage = () => {
  const dispatch = useDispatch();

  // State Management
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [dragActive, setDragActive] = useState(false); // برای حالت Drag & Drop
  const [notification, setNotification] = useState({ type: "", message: "" }); // جایگزین alert

  const { imageUploadCenter, loading } = useSelector((state) => state.imageUploadCenter);
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);

  // بارگذاری اولیه
  useEffect(() => {
    dispatch(fetchImageUploadCenter());
  }, [dispatch]);

  useEffect(() => {
    setImages(imageUploadCenter);
  }, [imageUploadCenter]);

  // Cleanup URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // مدیریت نمایش نوتیفیکیشن (پاک شدن خودکار)
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // اعتبارسنجی و تنظیم فایل
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setNotification({ type: "error", message: "❌ فقط فایل‌های تصویری مجاز هستند!" });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setNotification({ type: "error", message: "❌ حداکثر حجم فایل ۵ مگابایت است!" });
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setImageUrl(null);
    setNotification({ type: "", message: "" });
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  // توابع Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setNotification({ type: "error", message: "لطفاً یک فایل انتخاب کنید!" });
      return;
    }
    if (!title.trim()) {
      setNotification({ type: "error", message: "لطفاً عنوان عکس را وارد کنید!" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("imageUrl", file);
    formData.append("title", title);

    try {
      await dispatch(createImageUploadCenter(formData)).unwrap();
      await dispatch(fetchImageUploadCenter()).unwrap();

      setNotification({ type: "success", message: "تصویر با موفقیت آپلود شد!" });
      // ریست کردن فرم اما نگه داشتن لیست جدید
      setPreview(null);
      setFile(null);
      setTitle("");
      // فرض بر این است که بک‌اند URL را برمی‌گرداند، اگر نه، باید از استیت ریداکس بگیرید
      // در اینجا برای نمایش موفقیت از نوتیفیکیشن استفاده کردیم
    } catch (error) {
      console.error(error);
      setNotification({ type: "error", message: "خطا در آپلود تصویر!" });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setNotification({ type: "success", message: "لینک کپی شد!" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-[#001f3f] to-slate-900 p-4 md:p-8 font-sans text-white flex flex-col items-center">
      {/* Glass Card Container */}
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-6 md:p-10 relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#007acc] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-600 opacity-20 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#007acc]/20 rounded-xl border border-[#007acc]/30">
              <img
                src="/assets/images/dashboard/icons/cloud_development.svg"
                alt="cloud"
                className="w-8 h-8 invert brightness-0 filter" // سفید کردن آیکون اگر سیاه است
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">مرکز فضای ابری</h2>
          </div>
          <div className="hidden md:block p-2 bg-white/5 rounded-full animate-pulse">
            <img
              src="/assets/images/dashboard/icons/cloud_database.svg"
              alt="db"
              className="w-6 h-6"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </div>

        {/* Notification Toast */}
        {notification.message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium text-center transition-all duration-300 transform ${
              notification.type === "error"
                ? "bg-red-500/20 text-red-200 border border-red-500/30"
                : "bg-green-500/20 text-green-200 border border-green-500/30"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Upload Area (Drag & Drop) */}
        <div
          className={`relative group flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
            dragActive
              ? "border-[#007acc] bg-[#007acc]/10 scale-[1.02]"
              : "border-white/20 bg-white/5 hover:border-[#007acc]/50 hover:bg-white/10"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />

          <div className="flex flex-col items-center gap-3 z-10 pointer-events-none">
            <div
              className={`p-4 rounded-full bg-white/5 transition-transform duration-300 ${
                dragActive ? "scale-110" : "group-hover:scale-110"
              }`}
            >
              <img
                src="/assets/images/dashboard/icons/upload_to_cloud_blue.svg"
                alt="upload"
                className="w-10 h-10"
                // اگر آیکون رنگی است نیازی به فیلتر نیست، اگر سیاه است فیلتر زیر را فعال کنید
                // style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-lg">
                برای آپلود کلیک کنید <span className="text-white/50 text-sm">یا فایل را اینجا رها کنید</span>
              </p>
              <p className="text-white/40 text-xs mt-1">(JPEG, PNG, GIF, WebP - Max 5MB)</p>
            </div>
          </div>
        </div>

        {/* Title Input */}
        <div className="mt-6 relative z-10">
          <label className="block text-sm text-white/70 mb-2 mr-1">عنوان تصویر:</label>
          <input
            type="text"
            placeholder="مثلاً: بنر تبلیغاتی نوروز..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007acc] focus:bg-white/10 transition-all"
          />
        </div>

        {/* Preview Area */}
        {preview && (
          <div className="mt-6 relative rounded-xl overflow-hidden border border-white/10 shadow-lg group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  setFile(null);
                }}
                className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-transform hover:scale-110"
                title="حذف تصویر"
              >
                <img src="/assets/images/dashboard/icons/close.svg" className="w-6 h-6 invert" alt="close" />
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`mt-8 w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            uploading
              ? "bg-gray-600/50 cursor-not-allowed"
              : "bg-gradient-to-r from-[#007acc] to-blue-600 hover:shadow-[#007acc]/40 hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>در حال پردازش...</span>
            </>
          ) : (
            "آپلود در فضای ابری"
          )}
        </button>

        {/* Success / Result Area */}
        {imageUrl && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm font-semibold">آپلود موفقیت‌آمیز!</span>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007acc] text-xs hover:text-white transition-colors"
              >
                مشاهده در تب جدید &rarr;
              </a>
            </div>
            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
              <input
                type="text"
                value={imageUrl}
                readOnly
                className="bg-transparent w-full text-xs text-white/80 outline-none font-mono ltr"
              />
              <button
                onClick={() => copyToClipboard(imageUrl)}
                className="p-1.5 bg-white/10 hover:bg-[#007acc] rounded-md transition-colors"
                title="کپی لینک"
              >
                <img src="/assets/images/dashboard/icons/copy.svg" alt="copy" className="w-4 h-4 invert" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List Component Wrapper */}
      <div className="w-full max-w-6xl mt-12">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
          <h3 className="text-white/80 text-lg mb-4 border-b border-white/10 pb-2">گالری تصاویر آپلود شده</h3>
          <UploadImageList images={images} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
