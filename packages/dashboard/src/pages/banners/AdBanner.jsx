import { useState, useEffect } from "react";
import ArticleGallery from "../../components/createContent/ArticleGallery";
import useAdBannerForm from "../../hooks/useAdBannerForm";

const AdBanner = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    selectedImages,
    handleImageSelection,
    removeImage,
    onSubmit,
    submitSuccess,
    submitError,
    watch,
  } = useAdBannerForm(true);

  const [imageCategories, setImageCategories] = useState({
    mobile: [],
    tablet: [],
    desktop: [],
    unknown: [],
  });

  useEffect(() => {
    if (selectedImages && selectedImages.length > 0) {
      categorizeImages();
    } else {
      setImageCategories({
        mobile: [],
        tablet: [],
        desktop: [],
        unknown: [],
      });
    }
  }, [selectedImages]);

  const categorizeImages = () => {
    const categories = {
      mobile: [],
      tablet: [],
      desktop: [],
      unknown: [],
    };
    
    const validImages = selectedImages.filter(img => img instanceof File || img instanceof Blob);

    validImages.forEach(image => {
      if (!image) return;

      const img = new Image();
      
      let objectUrl;
      try {
        objectUrl = URL.createObjectURL(image);
        img.src = objectUrl;
      } catch (error) {
        console.error("Error creating object URL:", error);
        return;
      }
      
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        
        if (width <= 600) {
          categories.mobile.push({ file: image, width, height });
        } else if (width <= 1024) {
          categories.tablet.push({ file: image, width, height });
        } else if (width > 1024) {
          categories.desktop.push({ file: image, width, height });
        } else {
          categories.unknown.push({ file: image, width, height });
        }

        setImageCategories({...categories});
        
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        console.error("Error loading image");
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    });
  };
  
  const renderImagePreview = (image) => {
    try {
      const url = URL.createObjectURL(image.file);
      return (
        <>
          <img 
            src={url} 
            alt={`پیشنمایش`}
            className="w-full h-auto max-h-40 object-contain"
            onLoad={() => URL.revokeObjectURL(url)}
          />
          <p className="text-xs mt-1 text-center">
            ابعاد: {image.width} × {image.height} پیکسل
          </p>
        </>
      );
    } catch (error) {
      console.error("Error rendering image:", error);
      return <p className="text-red-500 text-xs">خطا در نمایش تصویر</p>;
    }
  };

  return (
    <div className="my-5 border-b-2 border-red-500 p-2 bg-wite rounded-md">
      <div className="p-4">
        {submitSuccess && (
          <p className="text-sm p-3 font-semibold text-center border text-green-600 bg-green-50 mb-3 animate-fade-out rounded-sm text-gray-800">
            بنر با موفقیت ثبت شد
          </p>
        )}
        {submitError && (
          <p className="text-sm p-3 font-semibold text-center border text-red-600 bg-red-50 mb-3 animate-fade-out rounded-sm text-gray-800">
            خطا در ثبت بنر : {submitError}
          </p>
        )}
      </div>
      <h1 className="text-lg py-1 px-4 w-fit rounded-md bg-red-600 text-white font-bold mb-3">
        روش اول: بارگذاری بنر آماده
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mb-3 gap-4">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="seoContent" className="block text-xs font-medium text-gray-400">
              توضیحات بنر (مخفی و صرفاً برای سئو)
            </label>
            <input
              required
              type="text"
              name="seoContent"
              placeholder="همایش سالانه مجله"
              className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
              id="seoContent"
              {...register("seoContent")}
            />
            <p className="text-xs text-red-500">{errors.seoContent?.message}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="link" className="block text-xs font-medium text-gray-400" >
              پیوند بنر
            </label>
            <input
              required
              type="text"
              name="link"
              placeholder="https://..."
              className="px-3 py-2 text-sm text-left rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10" dir="ltr"
              id="link"
              {...register("link")}
            />
            <p className="text-xs text-red-500">{errors.link?.message}</p>
          </div>
          <ArticleGallery
            register={register}
            watch={watch}
            handleImageSelection={handleImageSelection}
            selectedImages={selectedImages}
            removeImage={removeImage}
            errors={errors}
            editMode={true}
            bannerMode={true}
          />
        </div>
        <div>
          {selectedImages && selectedImages.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-bold mb-4">پیشنمایش بنرها بر اساس ابعاد</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* موبایل */}
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold text-center mb-2">موبایل (عرض ≤ 600px)</h3>
              <div className="flex flex-col gap-2">
                {imageCategories.mobile.length > 0 ? (
                  imageCategories.mobile.map((img, index) => (
                    <div key={index} className="border p-2 rounded">
                      {renderImagePreview(img)}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center">عکسی برای موبایل بارگذاری نشده</p>
                )}
              </div>
            </div>

            {/* تبلت */}
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold text-center mb-2">تبلت (عرض ≤ 1024px)</h3>
              <div className="flex flex-col gap-2">
                {imageCategories.tablet.length > 0 ? (
                  imageCategories.tablet.map((img, index) => (
                    <div key={index} className="border p-2 rounded">
                      {renderImagePreview(img)}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center">عکسی برای تبلت بارگذاری نشده</p>
                )}
              </div>
            </div>

            {/* دسکتاپ */}
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold text-center mb-2">{`دسکتاپ (عرض > 1024px)`}</h3>
              <div className="flex flex-col gap-2">
                {imageCategories.desktop.length > 0 ? (
                  imageCategories.desktop.map((img, index) => (
                    <div key={index} className="border p-2 rounded">
                      {renderImagePreview(img)}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center">عکسی برای دسکتاپ بارگذاری نشده</p>
                )}
              </div>
            </div>
          </div>

          {/* تصاویر با ابعاد نامشخص */}
          {imageCategories.unknown.length > 0 && (
            <div className="mt-4 border rounded-lg p-3">
              <h3 className="font-semibold text-center mb-2">تصاویر با ابعاد نامشخص</h3>
              <div className="flex flex-wrap gap-2">
                {imageCategories.unknown.map((img, index) => (
                  <div key={index} className="border p-2 rounded">
                    {renderImagePreview(img)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
        </div>
        <div className="mt-4 text-left">
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="show" className="block text-right text-xs font-medium text-gray-400" dir="rtl">
              تعیین وضعیت نمایش بنر در سایت
            </label>
            <select
              {...register("show")}
              required
              name="show"
              id="show"
              className="px3 text-sm py-2 font-bold text-center bg-100 rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10 cursor-pointer"
            >
              {["نمایش بنر", "مخفی‌کردن بنر"].map((status, index) => (
                <option key={index} value={status === "نمایش بنر" ? true : false}>
                  {status}
                </option>
              ))}
            </select>
            <p className="text-xs text-red-500">{errors?.show?.message}</p>
          </div>
          <button
            type="submit"
            className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "در حال ارسال..." : "ویرایش"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdBanner;
