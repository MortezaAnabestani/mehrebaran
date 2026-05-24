import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import useBadgeForm from "../../hooks/useBadgeForm";
import IconPicker from "../../components/IconPicker";

const CreateBadge = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    setValue,
    watch,
  } = useBadgeForm(false);

  const category = watch("category");
  const rarity = watch("rarity");
  const isActive = watch("isActive");
  const isSecret = watch("isSecret");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4">
      {/* --- HEADER --- */}
      <div className="bg-white border border-slate-200 rounded-md mb-4 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#007acc]/10 flex items-center justify-center rounded-md border border-[#007acc]/20">
              <TrophyIcon className="w-4 h-4 text-[#007acc]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider">ایجاد نشان جدید</h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <Link to="/dashboard/gamification/badges" className="hover:text-[#007acc]">
                  نشان‌ها
                </Link>
                <span>/</span>
                <span>ایجاد</span>
              </div>
            </div>
          </div>

          <Link to="/dashboard/gamification/badges">
            <button className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-medium rounded hover:bg-slate-100 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              بازگشت
            </button>
          </Link>
        </div>
      </div>

      {/* Success Alert */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-800">نشان با موفقیت ایجاد شد!</span>
        </div>
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-center gap-2">
          <XCircleIcon className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-800">{submitError}</span>
        </div>
      )}

      {/* --- FORM --- */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-slate-200 rounded-md p-4">
          <div className="space-y-4">
            {/* نام فارسی و انگلیسی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  نام فارسی نشان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-[#007acc] focus:ring-[#007acc]"
                  }`}
                  placeholder="مثال: قهرمان نیازها"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  نام انگلیسی نشان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("nameEn")}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all ${
                    errors.nameEn
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-[#007acc] focus:ring-[#007acc]"
                  }`}
                  placeholder="Example: Needs Champion"
                />
                {errors.nameEn && (
                  <p className="text-xs text-red-600 mt-1">{errors.nameEn.message}</p>
                )}
              </div>
            </div>

            {/* توضیحات */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                توضیحات نشان <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-[#007acc] focus:ring-[#007acc]"
                }`}
                placeholder="توضیحات کامل درباره نشان و شرایط دریافت آن..."
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* دسته‌بندی، کمیابی و امتیاز */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category")}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all ${
                    errors.category
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-[#007acc] focus:ring-[#007acc]"
                  }`}
                >
                  <option value="">انتخاب کنید</option>
                  <option value="contributor">مشارکت‌کننده</option>
                  <option value="supporter">حمایت‌کننده</option>
                  <option value="creator">سازنده</option>
                  <option value="helper">کمک‌کننده</option>
                  <option value="communicator">ارتباط‌گیر</option>
                  <option value="leader">رهبر</option>
                  <option value="expert">متخصص</option>
                  <option value="milestone">نقطه عطف</option>
                  <option value="special">ویژه</option>
                  <option value="seasonal">فصلی</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">کمیابی</label>
                <select
                  {...register("rarity")}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all"
                >
                  <option value="common">معمولی</option>
                  <option value="rare">نادر</option>
                  <option value="epic">حماسی</option>
                  <option value="legendary">افسانه‌ای</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">امتیاز</label>
                <input
                  type="number"
                  {...register("points")}
                  defaultValue={0}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all"
                />
              </div>
            </div>

            {/* آیکون و رنگ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IconPicker
                value={watch("icon")}
                onChange={(iconName) => setValue("icon", iconName)}
                error={errors.icon?.message}
              />

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">رنگ نشان</label>
                <input
                  type="color"
                  {...register("color")}
                  defaultValue="#3B82F6"
                  className="w-full h-10 px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">رنگ پس‌زمینه نشان را انتخاب کنید</p>
              </div>
            </div>

            {/* ترتیب */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ترتیب نمایش</label>
                <input
                  type="number"
                  {...register("order")}
                  defaultValue={0}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  ترتیب نمایش نشان در لیست (عدد کمتر = اولویت بیشتر)
                </p>
              </div>
            </div>

            {/* تنظیمات */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 mb-3">تنظیمات</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-700">وضعیت فعال</p>
                  <p className="text-xs text-slate-500">نشان فعال برای کاربران قابل دریافت است</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setValue("isActive", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#007acc] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-700">نشان مخفی</p>
                  <p className="text-xs text-slate-500">
                    نشان‌های مخفی تا زمان دریافت برای کاربران نمایش داده نمی‌شوند
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSecret}
                    onChange={(e) => setValue("isSecret", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#007acc] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>

            {/* نکته */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-800">
                <strong>نکته:</strong> پس از ایجاد نشان، می‌توانید شرایط دریافت آن را در بخش ویرایش تنظیم کنید.
              </p>
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <Link to="/dashboard/gamification/badges">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                انصراف
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#007acc] rounded hover:bg-[#005a9e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "در حال ایجاد..." : "ایجاد نشان"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBadge;
