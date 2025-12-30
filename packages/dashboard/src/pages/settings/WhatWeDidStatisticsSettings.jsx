import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettingByKey, updateSettingByKey } from "../../features/settingsSlice";
import { Link } from "react-router-dom";
import {
  Save,
  ArrowRight,
  Activity,
  Layers,
  Users,
  Clock,
  Building,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const WhatWeDidStatisticsSettings = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.settings);

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
        if (result && result.value) {
          const data = result.value;
          setFormData({
            totalProjects: data.totalProjects || 0,
            schoolsCovered: data.schoolsCovered || 0,
            budgetRaised: data.budgetRaised || 0,
            partnerOrganizations: data.partnerOrganizations || 0,
            volunteerHours: data.volunteerHours || 0,
            activeVolunteers: data.activeVolunteers || 0,
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

      setSaveMessage({ type: "success", text: "پارامترهای آماری با موفقیت به‌روزرسانی شدند." });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage({ type: "error", text: err || "خطا در پردازش درخواست" });
    }
  };

  // کامپوننت ورودی سفارشی برای یکپارچگی طراحی
  const StatInput = ({ label, name, value, icon: Icon, helper }) => (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
        {Icon && <Icon size={12} className="text-slate-400" />}
        {label}
      </label>
      <div className="relative group">
        <input
          type="number"
          name={name}
          value={value}
          onChange={handleChange}
          min="0"
          className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[13px] font-mono text-slate-700 focus:bg-white focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] transition-all outline-none placeholder-slate-400"
        />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-[#007acc]"></div>
        </div>
      </div>
      {helper && <span className="text-[10px] text-slate-400">{helper}</span>}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
            <Activity size={16} className="text-[#007acc]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">تنظیمات آمار عملکرد</h1>
            <p className="text-[11px] text-slate-500 font-medium">
              مدیریت داده‌های بخش «در کنار هم چه کردیم»
            </p>
          </div>
        </div>
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-[#007acc] hover:border-[#007acc]/30 transition-all"
        >
          <ArrowRight size={14} />
          <span>بازگشت</span>
        </Link>
      </div>

      {/* Status Messages */}
      {saveMessage && (
        <div
          className={`mb-6 p-3 rounded-md border flex items-center gap-3 text-[12px] font-medium ${
            saveMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {saveMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {saveMessage.text}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 flex items-center gap-3 text-[12px]">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-700">ورود داده‌های آماری</span>
              <span className="text-[10px] text-slate-400 font-mono">ID: STATS_CONFIG_V1</span>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <StatInput
                  label="تعداد کل پروژه‌ها"
                  name="totalProjects"
                  value={formData.totalProjects}
                  icon={Layers}
                  helper="تعداد پروژه‌های تکمیل شده یا در حال اجرا"
                />

                <StatInput
                  label="مناطق و مدارس تحت پوشش"
                  name="schoolsCovered"
                  value={formData.schoolsCovered}
                  icon={Building}
                  helper="مجموع تعداد مدارس و مناطق جغرافیایی"
                />

                <StatInput
                  label="بودجه جذب‌شده (تومان)"
                  name="budgetRaised"
                  value={formData.budgetRaised}
                  icon={DollarSign}
                  helper="مبلغ کل به تومان (بدون جداکننده)"
                />

                <StatInput
                  label="مجموعه‌های همکار"
                  name="partnerOrganizations"
                  value={formData.partnerOrganizations}
                  icon={Users}
                  helper="تعداد سازمان‌ها و نهادهای همکار"
                />

                <StatInput
                  label="ساعات فعالیت داوطلبانه"
                  name="volunteerHours"
                  value={formData.volunteerHours}
                  icon={Clock}
                  helper="مجموع نفر-ساعت فعالیت"
                />

                <StatInput
                  label="داوطلبان فعال"
                  name="activeVolunteers"
                  value={formData.activeVolunteers}
                  icon={Users}
                  helper="تعداد افراد فعال در حال حاضر"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-[12px] font-medium text-white transition-all shadow-sm ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-[#007acc] hover:bg-[#006bb3] hover:shadow-md active:translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      در حال پردازش...
                    </span>
                  ) : (
                    <>
                      <Save size={16} />
                      ذخیره تغییرات
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-200">
              <span className="text-[12px] font-semibold text-slate-700">پیش‌نمایش زنده</span>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { label: "پروژه‌ها", value: formData.totalProjects, icon: Layers },
                { label: "مدارس/مناطق", value: formData.schoolsCovered, icon: Building },
                { label: "بودجه (تومان)", value: formData.budgetRaised.toLocaleString(), icon: DollarSign },
                { label: "همکاران", value: formData.partnerOrganizations, icon: Users },
                { label: "ساعات داوطلبی", value: formData.volunteerHours, icon: Clock },
                { label: "داوطلبان فعال", value: formData.activeVolunteers, icon: Users },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-slate-100 text-slate-500">
                      <item.icon size={14} />
                    </div>
                    <span className="text-[12px] text-slate-600 font-medium">{item.label}</span>
                  </div>
                  <span className="text-[14px] font-mono font-bold text-[#007acc]">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                مقادیر فوق دقیقاً به همین صورت در بخش آمار صفحه اصلی نمایش داده خواهند شد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDidStatisticsSettings;
