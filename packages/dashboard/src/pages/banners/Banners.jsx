import useBannerForm from "../../hooks/useBannerForm";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import AdBanner from "./AdBanner"
const Banners = () => {
  const [titleColor, setTitleColor] = useState("");
  const [descriptionColor, setDescriptionColor] = useState("");
	const [createBanner, setCreateBanner] = useState(false);
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    alerts,
    previewImage,
    handleImagePreview,
    loading,
    error,
    setAlerts,
    watch,
    setValue,
  } = useBannerForm(true);

  const watchTitle = watch("title");
  const watchDescription = watch("description");
  const watchTextStyle = watch("textStyle");

  useEffect(() => {
    setValue("textStyle.color.title", titleColor);
    setTitleColor(watchTextStyle?.color?.title);
  }, [titleColor, setTitleColor]);

  useEffect(() => {
    setValue("textStyle.color.description", descriptionColor);
    setDescriptionColor(watchTextStyle?.color?.description);
  }, [descriptionColor, setDescriptionColor]);

  return (
    <div>
    <AdBanner />
    <p className="font-bold text-base my-8 cursor-pointer text-red-500 animate-pulse px-4 py-2 bg-white rounded-sm" onClick={()=>setCreateBanner(!createBanner)}>{createBanner ? "لغو ایجاد بنر" : "◄ می‌خواهم بنر را همین‌جا بسازم "}</p>
    {createBanner && 
      <div className="p-4 my-5 bg-red-50 rounded-sm">
        <h1 className="text-lg py-1 w-fit rounded-sm px-4 bg-red-600 text-white font-bold">روش دوم: ساختن بنر</h1>
        {alerts && (
          <p
            className={`text-sm p-3 font-semibold text-center border ${
              error ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
            } mb-3 animate-fade-out rounded-sm text-gray-800`}
          >
            {alerts}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} onMouseDown={() => setAlerts(null)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mb-3 gap-4">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="title" className="block text-xs font-medium text-gray-400">
                عنوان اصلی بنر
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="یادگیری هنر خطاطی در سه مرحله"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="title"
                {...register("title")}
              />
              <p className="text-xs text-red-500">{errors.title?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="description" className="block text-xs font-medium text-gray-400">
                توضیحات
              </label>
              <input
                type="description"
                name="description"
                className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                placeholder="ده جلسه || استاد: غلامحسين اميرخانى || رسته: نستعلیق"
                id="description"
                {...register("description")}
              />
              <p className="text-xs text-red-500">{errors.description?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="linkUrl" className="block text-xs font-medium text-gray-600">
                لینک بنر
              </label>
              <input
                type="linkUrl"
                name="linkUrl"
                placeholder="https://..."
                className="px-3 py-2 text-sm rounded-md ltr outline-0 border border-gray-300 focus:border-gray-400 h-10"
                id="linkUrl"
                {...register("linkUrl")}
              />
            </div>

            <div className="flex flex-col lg:col-start-1 lg:col-end-3">
              <div className="bg-white rounded-md">
                <div className="w-full mx-auto mb-5">
                  <div className="bg-slate-100 rounded-md p-2 border lg:max-h-100 lg:max-w-600 border-gray-400 border-dotted">
                    <label
                      htmlFor="coverImage"
                      className="flex flex-row items-center justify-between text-xs font-medium cursor-pointer"
                    >
                      <span className="block">برای انتخاب عکس بنر کلیک کنید</span>
                      <img
                        className="w-8 h-8 animate-pulse animate-ease-in-out"
                        src="/assets/images/dashboard/icons/gallery.svg"
                        alt="image"
                      />
                    </label>
                    <input
                      {...register("coverImage")}
                      type="file"
                      accept="image/*"
                      name="coverImage"
                      className="hidden"
                      id="coverImage"
                      onChange={handleImagePreview}
                    />
                    {previewImage && (
                      <div className="relative h-[60px] w-full overflow-hidden">
                        <img
                          src={previewImage}
                          alt="پیش‌نمایش"
                          className="h-[60px] max-h-[60px] w-full object-cover rounded-md mt-3 border border-red-300"
                        />
                        <p
                          style={{
                            bottom: watchTextStyle?.position?.yAxis?.title + "px",
                            right: watchTextStyle?.position?.xAxis?.title + "px",
                            fontSize: watchTextStyle?.fontSize?.title + "px",
                            fontWeight: watchTextStyle?.fontBold?.title,
                            color: watchTextStyle?.color?.title,
                          }}
                          className={`absolute z-10`}
                        >
                          {watchTitle && watchTitle}
                        </p>
                        <p
                          style={{
                            bottom: watchTextStyle?.position?.yAxis?.description + "px",
                            right: watchTextStyle?.position?.xAxis?.description + "px",
                            fontSize: watchTextStyle?.fontSize?.description + "px",
                            fontWeight: watchTextStyle?.fontBold?.description,
                            color: watchTextStyle?.color?.description,
                          }}
                          className="absolute z-10"
                        >
                          {watchDescription && watchDescription}
                        </p>
                      </div>
                    )}
                    {errors.coverImage && <p className="error">{errors.coverImage.message}</p>}
                  </div>
                </div>
              </div>
              <label
                htmlFor="textStyle"
                className="block text-xs font-bold mb-2 pt-3 mt-2 border-t-4 border-red-100 text-gray-500"
              >
                سبک‌دهی نوشته‌های بنر
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 mb-3 gap-2 lg:gap-3">
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="textStyle.fontSize.title"
                    className="block text-xs font-medium text-gray-600"
                  >
                    اندازه فونت عنوان اصلی (px)
                  </label>
                  <input
                    type="textStyle.fontSize.title"
                    name="textStyle.fontSize.title"
                    placeholder="اندازه به پیکسل است"
                    className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                    id="textStyle.fontSize.title"
                    {...register("textStyle.fontSize.title")}
                  />
                  <p className="text-xs text-red-500">{errors?.textStyle?.fontSize?.title?.message}</p>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="linkUrl" className="block text-xs font-medium text-gray-600">
                    ضخامت فونت عنوان اصلی
                  </label>
                  <select
                    {...register("textStyle.fontBold.title")}
                    required
                    name="textStyle.fontBold.title"
                    id="textStyle.fontBold.title"
                    className="px3 text-sm py-2 font- text-center rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                  >
                    {["برجسته", "نیمه‌برجسته", "معمولی", "نازک"].map((status, index) => {
                      const fontWieght = ["bold", "semibold", "normal", "light"];
                      return (
                        <option key={index} value={fontWieght[index]}>
                          {status}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-xs text-red-500">{errors?.textStyle?.fontBold?.title?.message}</p>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="textStyle.position.xAxis.title"
                    className="block text-xs font-medium text-gray-600"
                  >
                    جانمایی عنوان اصلی در محور افقی (px)
                  </label>
                  <input
                    type="textStyle.position.xAxis.title"
                    name="textStyle.position.xAxis.title"
                    placeholder="اندازه به پیکسل است"
                    className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                    id="textStyle.position.xAxis.title"
                    {...register("textStyle.position.xAxis.title")}
                  />
                  <p className="text-xs text-red-500">{errors?.textStyle?.position?.xAxis?.title?.message}</p>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="textStyle.position.yAxis.title"
                    className="block text-xs font-medium text-gray-600"
                  >
                    جانمایی عنوان اصلی در محور عمودی (px)
                  </label>
                  <input
                    type="textStyle.position.yAxis.title"
                    name="textStyle.position.yAxis.title"
                    placeholder="اندازه به پیکسل است"
                    className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                    id="textStyle.position.yAxis.title"
                    {...register("textStyle.position.yAxis.title")}
                  />
                  <p className="text-xs text-red-500">{errors?.textStyle?.position?.yAxis?.title?.message}</p>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="textStyle.fontSize.description"
                    className="block text-xs font-medium text-gray-600"
                  >
                    اندازه فونت توضیحات (px)
                  </label>
                  <input
                    type="textStyle.fontSize.description"
                    name="textStyle.fontSize.description"
                    placeholder="اندازه به پیکسل است"
                    className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                    id="textStyle.fontSize.description"
                    {...register("textStyle.fontSize.description")}
                  />
                  <p className="text-xs text-red-500">{errors?.textStyle?.fontSize?.description?.message}</p>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="linkUrl" className="block text-xs font-medium text-gray-600">
                    ضخامت فونت توضیحات
                  </label>
                  <select
                    {...register("textStyle.fontBold.description")}
                    required
                    name="textStyle.fontBold.description"
                    id="textStyle.fontBold.description"
                    className="px3 text-sm py-2 font- text-center rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                  >
                    {["برجسته", "نیمه‌برجسته", "معمولی", "نازک"].map((status, index) => {
                      const fontWieght = ["bold", "bolder", "normal", "lighter"];
                      return (
                        <option key={index} value={fontWieght[index]}>
                          {status}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-xs text-red-500">{errors?.textStyle?.fontBold?.description?.message}</p>
                </div>

                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="textStyle.position.xAxis.description"
                    className="block text-xs font-medium text-gray-600"
                  >
                    جانمایی توضیحات در محور افقی (px)
                  </label>
                  <input
                    type="textStyle.position.xAxis.description"
                    name="textStyle.position.xAxis.description"
                    placeholder="اندازه به پیکسل است"
                    className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                    id="textStyle.position.xAxis.description"
                    {...register("textStyle.position.xAxis.description")}
                  />
                  <p className="text-xs text-red-500">
                    {errors?.textStyle?.position?.xAxis?.description?.message}
                  </p>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="textStyle.position.yAxis.description"
                    className="block text-xs font-medium text-gray-600"
                  >
                    جانمایی توضیحات در محور عمودی (px)
                  </label>
                  <input
                    type="textStyle.position.yAxis.description"
                    name="textStyle.position.yAxis.description"
                    placeholder="اندازه به پیکسل است"
                    className="px-3 py-2 text-sm rounded-md outline-0 border border-gray-300 focus:border-gray-400 h-10"
                    id="textStyle.position.yAxis.description"
                    {...register("textStyle.position.yAxis.description")}
                  />
                  <p className="text-xs text-red-500">
                    {errors?.textStyle?.position?.yAxis?.description?.message}
                  </p>
                </div>
                <div className="flex flex-col col-start-1 col-end-3 gap-y-2">
                  <label htmlFor="textStyle.color.title" className="block text-xs font-medium text-gray-600">
                    رنگ فونت عنوان اصلی
                  </label>
                  <HexColorPicker color={titleColor} onChange={setTitleColor} />
                  <p className="text-xs text-red-500">
                    {errors?.textStyle?.position?.yAxis?.description?.message}
                  </p>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="textStyle.color.title" className="block text-xs font-medium text-gray-600">
                    رنگ فونت توضیحات
                  </label>
                  <HexColorPicker color={descriptionColor} onChange={setDescriptionColor} />
                  <p className="text-xs text-red-500">
                    {errors?.textStyle?.position?.yAxis?.description?.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-start-1 lg:col-end-3">
              <div className="flex flex-col gap-y-2">
                <label htmlFor="show" className="block text-xs font-medium text-gray-400">
                  تعیین وضعیت نمایش بنر در سایت
                </label>
                <select
                  {...register("show")}
                  required
                  name="show"
                  id="show"
                  className="px3 text-sm py-2 font-bold text-center rounded-md outline-0 border border-gray-300 focus:border-gray-600 h-10"
                >
                  {["نمایش بنر", "مخفی‌کردن بنر"].map((status, index) => (
                    <option key={index} value={status === "نمایش بنر" ? true : false}>
                      {status}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-red-500">{errors?.show?.message}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-left">
            <button
              type="submit"
              className="px-3 py-[10px] w-full bg-gray-600 rounded-md hover:bg-gray-700 text-white cursor-pointer"
            >
              {loading ? "در حال ارسال..." : "به‌روزرسانی"}
            </button>
          </div>
        </form>
      </div>
    }
    </div>
  );
};

export default Banners;
