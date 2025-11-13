import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey } from "../../features/settingsSlice";
import { Link } from "react-router-dom";

const WhatWeDidStatisticsSettings = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    totalProjects: 0,
    schoolsCovered: 0,
    budgetRaised: 0,
    partnerOrganizations: 0,
    volunteerHours: 0,
    activeVolunteers: 0,
  });

  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await dispatch(getSettingByKey("whatWeDidStatistics")).unwrap();
        if (result) {
          setFormData({
            totalProjects: result.totalProjects || 0,
            schoolsCovered: result.schoolsCovered || 0,
            budgetRaised: result.budgetRaised || 0,
            partnerOrganizations: result.partnerOrganizations || 0,
            volunteerHours: result.volunteerHours || 0,
            activeVolunteers: result.activeVolunteers || 0,
          });
        }
      } catch (err) {
        console.error("خطا در بارگذاری تنظیمات:", err);
      }
    };

    fetchSettings();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveMessage(null);

    try {
      await dispatch(
        updateSettingByKey({
          key: "whatWeDidStatistics",
          value: formData,
        })
      ).unwrap();

      setSaveMessage({ type: "success", text: "آمارها با موفقیت ذخیره شدند!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage({ type: "error", text: err || "خطا در ذخیره آمارها" });
    }
  };

  return (
    <div>
      <div className="bg-white rounded-md mb-6">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-medium">مدیریت آمارهای «در کنار هم چه کردیم»</h2>
          <Link
            rel="preconnect"
            to="/dashboard/settings"
            className="px-3 py-[6px] bg-gray-600 rounded-md hover:bg-gray-700 text-white"
          >
            بازگشت به تنظیمات
          </Link>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`mb-4 p-4 rounded-md ${
            saveMessage.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold ml-1">خطا!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">راهنما</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            این آمارها در بخش «در کنار هم چه کردیم» در صفحه اصلی سایت نمایش داده می‌شوند. تمامی اعداد باید مثبت
            باشند.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* تعداد پروژه‌ها */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعداد پروژه‌ها
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalProjects"
                value={formData.totalProjects}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">تعداد کل پروژه‌های انجام شده</p>
            </div>

            {/* مناطق و مدارس */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مناطق و مدارس تحت پوشش طرح‌ها
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="schoolsCovered"
                value={formData.schoolsCovered}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">تعداد مدارس و مناطق تحت پوشش</p>
            </div>

            {/* میزان بودجه */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                میزان بودجه جذب‌شده (تومان)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="budgetRaised"
                value={formData.budgetRaised}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">مجموع بودجه جذب شده (به تومان)</p>
            </div>

            {/* مجموعه‌های همکار */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مجموعه‌های همکار
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="partnerOrganizations"
                value={formData.partnerOrganizations}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">تعداد مجموعه‌های همکار</p>
            </div>

            {/* ساعات داوطلبی */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مجموع ساعات داوطلبی
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="volunteerHours"
                value={formData.volunteerHours}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">مجموع ساعات فعالیت داوطلبانه</p>
            </div>

            {/* داوطلبان فعال */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعداد داوطلبان فعال
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="activeVolunteers"
                value={formData.activeVolunteers}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">تعداد داوطلبان فعال فعلی</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-6 py-3 rounded-md text-white font-medium ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "در حال ذخیره..." : "ذخیره آمارها"}
            </button>
          </div>
        </form>

        {/* پیش‌نمایش */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">پیش‌نمایش نمایش در سایت</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
              <h2 className="text-3xl font-bold">{formData.totalProjects}</h2>
              <p className="text-sm mt-2">تعداد پروژه‌ها</p>
            </div>
            <div className="bg-gray-200 text-black p-4 rounded-lg text-center">
              <h2 className="text-3xl font-bold">{formData.schoolsCovered}</h2>
              <p className="text-sm mt-2">مناطق و مدارس</p>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
              <h2 className="text-3xl font-bold">{formData.budgetRaised.toLocaleString()}</h2>
              <p className="text-sm mt-2">بودجه جذب‌شده</p>
            </div>
            <div className="bg-gray-200 text-black p-4 rounded-lg text-center">
              <h2 className="text-3xl font-bold">{formData.partnerOrganizations}</h2>
              <p className="text-sm mt-2">مجموعه‌های همکار</p>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
              <h2 className="text-3xl font-bold">{formData.volunteerHours}</h2>
              <p className="text-sm mt-2">ساعات داوطلبی</p>
            </div>
            <div className="bg-gray-200 text-black p-4 rounded-lg text-center">
              <h2 className="text-3xl font-bold">{formData.activeVolunteers}</h2>
              <p className="text-sm mt-2">داوطلبان فعال</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDidStatisticsSettings;
