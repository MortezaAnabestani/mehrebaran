import { useEffect, useRef, useState } from "react";

const ArticleGallery = ({
  register,
  watch,
  handleImageSelection,
  selectedImages = [],
  removeImage,
  errors,
  editMode,
  bannerMode
}) => {
  const [articleGalleryShow, setArticleGalleryShow] = useState(false);
  const fileInputRef = useRef(null); // ایجاد ref

  // نمایش گالری اگر تصویری وجود داشته باشد یا excerpt پر شده باشد
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.excerpt || selectedImages.length > 0) {
        setArticleGalleryShow(true);
      }
      if (editMode) {
        setArticleGalleryShow(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [selectedImages.length]);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.log("فایل input پیدا نشد!");
    }
  };

  return (
    <div className="mb-5">
      {!articleGalleryShow ? (
        <div className="flex items-center mr-2 mt-3">
          <input
            className="w-4 h-4 cursor-pointer hover:text-red-800"
            type="radio"
            onClick={() => setArticleGalleryShow(true)}
          />
          <p className="text-[11px] font-semibold pr-2">ایجاد گالری</p>
        </div>
      ) : (
        <div className="mb-10">
          <label className="text-[12px] mb-0" htmlFor="images">
            {bannerMode ? "عکس‌های بنر" : "عکس‌های گالری"}
          </label>

          <div className="bg-slate-100 rounded-md p-2 border border-gray-400 border-dotted">
            <div
              className="flex items-center justify-between text-xs font-medium cursor-pointer"
              onClick={handleDivClick}
            >
              <span className="block">برای انتخاب عکس‌ها کلیک کنید</span>
              <img
                className="w-8 h-8 animate-pulse animate-ease-in-out"
                src="/assets/images/dashboard/icons/gallery.svg"
                alt="images"
              />
            </div>

            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="hidden"
              {...register("images")}
              ref={fileInputRef}
              onChange={handleImageSelection}
            />

            {/* پیش‌نمایش تصاویر */}
            {selectedImages?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-medium mb-2">تصاویر انتخاب شده:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={
                          image.preview ||
                          (typeof image === "string"
                            ? `${import.meta.env.VITE_SERVER_PUBLIC_API_URL_WITHOUT_API}${image}`
                            : "")
                        }
                        alt={`تصویر ${index + 1}`}
                        className="h-35 w-full object-cover rounded-md border border-red-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors?.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
          </div>

          <div className="ltr mt-3" onClick={() => setArticleGalleryShow(false)}>
            <span className="flex gap-1 items-center text-[8px] ml-2 mt-[-12px] border border-gray-300 w-19 bg-gray-200 rounded-b-sm border-t-0 cursor-pointer">
              <img
                src="/assets/images/dashboard/icons/close.svg"
                className="w-6 h-6 cursor-pointer"
                alt="close icon"
              />
              بستن
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleGallery;
