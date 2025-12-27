"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import SmartButton from "@/components/ui/SmartButton";
import FileUploader from "@/components/ui/FileUploader";
import { getProvinceNames, getCitiesByProvince } from "@/data/iranLocations";
import { modalSlideUp, backdropFade } from "@/utils/animations";
import OptimizedImage from "../ui/OptimizedImage";

// Dynamic Imports
const PersianDatePicker = dynamic(() => import("@/components/ui/PersianDatePicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 shadow-inner animate-pulse">
      <span className="text-gray-400 text-sm">باران که می‌بارد، تو در راهی...ویم...</span>
    </div>
  ),
});

const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-100 rounded-2xl shadow-inner flex items-center justify-center border border-gray-200">
      <p className="text-gray-500 font-medium">باران که می‌بارد، تو در راهی...شه...</p>
    </div>
  ),
});

// --- Skeuomorphic Utility Classes ---
const inputStyle =
  "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#007acc]/50 focus:bg-white focus:shadow-none transition-all duration-200 placeholder-gray-400 text-gray-700";
const labelStyle = "block text-sm font-bold mb-2 text-gray-700";
const cardStyle =
  "bg-white rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] border border-gray-100 p-6";

interface CreateNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const CreateNeedModal: React.FC<CreateNeedModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Form Data State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgencyLevel: "medium" as "low" | "medium" | "high" | "critical",
    estimatedDuration: "",
    requiredSkills: [] as string[],
    tags: [] as string[],
    location: {
      address: "",
      city: "",
      province: "",
      coordinates: { latitude: 35.6892, longitude: 51.389 },
    },
    deadline: "",
    budgetItems: [] as Array<{
      title: string;
      description: string;
      category: string;
      estimatedCost: number;
    }>,
    attachments: [] as any[],
  });

  const steps = [
    { id: 1, title: "اطلاعات پایه", icon: "📝" },
    { id: 2, title: "جزئیات فنی", icon: "⚡" },
    { id: 3, title: "موقعیت", icon: "/icons/placeLocation.svg" },
    { id: 4, title: "زمان‌بندی", icon: "📅" },
    { id: 5, title: "بودجه", icon: "/icons/rial.svg" },
    { id: 6, title: "مستندات", icon: "/icons/attach.svg" },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];
    if (currentStep === 0) {
      if (!formData.title.trim()) errors.push("عنوان نیاز الزامی است");
      else if (formData.title.trim().length < 10) errors.push("عنوان باید حداقل ۱۰ کاراکتر باشد");
      if (!formData.description.trim()) errors.push("توضیحات کامل الزامی است");
      if (!formData.category) errors.push("انتخاب دسته‌بندی الزامی است");
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setValidationErrors([]);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationErrors([]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#0f172a]/60 backdrop-blur-md"
      variants={backdropFade}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={modalSlideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] bg-[#f8fafc] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/50"
      >
        {/* Header Section */}
        <div className="bg-white px-8 py-6 border-b border-gray-200 shadow-sm z-10 relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                ثبت نیاز <span className="text-[#007acc]">جدید</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">لطفاً فرم زیر را با دقت تکمیل کنید</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all shadow-[0_2px_5px_rgba(0,0,0,0.05)] active:shadow-inner active:translate-y-0.5"
            >
              ✕
            </button>
          </div>

          {/* Skeuomorphic Progress Bar */}
          <div className="relative pt-2">
            <div className="flex justify-between mb-2 px-1">
              {steps.map((step, index) => (
                <span
                  key={step.id}
                  className={`text-xs font-bold transition-colors duration-300 ${
                    index <= currentStep ? "text-[#007acc]" : "text-gray-300"
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden border border-gray-300/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#007acc] to-[#60a5fa] shadow-[0_2px_4px_rgba(0,122,204,0.4)] relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              >
                {/* Glossy effect on progress bar */}
                <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/30 rounded-t-full"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc] custom-scrollbar">
          {validationErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl shadow-sm flex items-start gap-3"
            >
              <div className="w-1.5 h-full bg-red-500 rounded-full self-stretch"></div>
              <div>
                <h4 className="font-bold text-red-700 text-sm mb-1">توجه:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {currentStep === 0 && <Step1BasicInfo formData={formData} updateFormData={updateFormData} />}
              {currentStep === 1 && <Step2Details formData={formData} updateFormData={updateFormData} />}
              {currentStep === 2 && <Step3Location formData={formData} updateFormData={updateFormData} />}
              {currentStep === 3 && <Step4Timeline formData={formData} updateFormData={updateFormData} />}
              {currentStep === 4 && <Step5Budget formData={formData} updateFormData={updateFormData} />}
              {currentStep === 5 && <Step6Files formData={formData} updateFormData={updateFormData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Section */}
        <div className="bg-white p-6 border-t border-gray-200 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20">
          <SmartButton
            variant="mgray"
            size="md"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`shadow-sm border border-gray-300 ${
              currentStep === 0 ? "opacity-50" : "hover:shadow-md"
            }`}
          >
            <span className="ml-2">→</span> مرحله قبل
          </SmartButton>

          <div className="hidden md:flex items-center gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? "bg-[#007acc] scale-125 shadow-[0_0_8px_rgba(0,122,204,0.5)]"
                    : idx < currentStep
                    ? "bg-[#007acc]/40"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <SmartButton
              variant="mblue"
              size="md"
              onClick={nextStep}
              className="shadow-[0_4px_14px_rgba(0,122,204,0.3)] hover:shadow-[0_6px_20px_rgba(0,122,204,0.4)] hover:-translate-y-0.5 transition-all"
            >
              مرحله بعد <span className="mr-2">←</span>
            </SmartButton>
          ) : (
            <SmartButton
              variant="morange"
              size="md"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all"
            >
              {isSubmitting ? "در حال ارسال..." : "ثبت نهایی نیاز ✓"}
            </SmartButton>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Sub-Components with Skeuomorphic Design ---

const Step1BasicInfo: React.FC<any> = ({ formData, updateFormData }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl shadow-inner border border-blue-200">
        📝
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800">اطلاعات اولیه</h3>
        <p className="text-sm text-gray-500">مشخصات اصلی نیاز خود را وارد کنید</p>
      </div>
    </div>

    <div className={cardStyle}>
      <div className="grid gap-6">
        <div>
          <label className={labelStyle}>
            عنوان نیاز <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            placeholder="مثال: تامین تجهیزات هوشمندسازی مدرسه..."
            className={inputStyle}
            maxLength={100}
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400 font-mono">{formData.title.length}/100</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>
              دسته‌بندی <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => updateFormData("category", e.target.value)}
                className={`${inputStyle} appearance-none cursor-pointer`}
              >
                <option value="">انتخاب کنید...</option>
                <option value="آموزش">🎓 آموزش</option>
                <option value="سلامت و درمان">🏥 سلامت و درمان</option>
                <option value="مسکن">🏠 مسکن</option>
                <option value="غذا و تغذیه">🍲 غذا و تغذیه</option>
                <option value="اشتغال">💼 اشتغال و کارآفرینی</option>
                <option value="محیط زیست">🌳 محیط زیست</option>
                <option value="فرهنگ و هنر">🎨 فرهنگ و هنر</option>
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>
          {/* Placeholder for future field */}
          <div className="hidden md:block"></div>
        </div>

        <div>
          <label className={labelStyle}>
            توضیحات کامل <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            placeholder="شرح دقیق نیاز، اهداف پروژه و ذینفعان..."
            className={`${inputStyle} min-h-[160px] resize-none`}
            maxLength={2000}
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400 font-mono">{formData.description.length}/2000</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Step2Details: React.FC<any> = ({ formData, updateFormData }) => {
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      updateFormData("requiredSkills", [...formData.requiredSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-2xl shadow-inner border border-orange-200">
          ⚡
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">جزئیات اجرایی</h3>
          <p className="text-sm text-gray-500">سطح فوریت و مهارت‌های لازم را مشخص کنید</p>
        </div>
      </div>

      <div className={cardStyle}>
        <label className={labelStyle}>سطح فوریت</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              value: "low",
              label: "عادی",
              color: "bg-gray-100",
              active: "ring-gray-400 from-gray-50 to-gray-100",
            },
            {
              value: "medium",
              label: "متوسط",
              color: "bg-blue-100",
              active: "ring-[#007acc] from-blue-50 to-blue-100",
            },
            {
              value: "high",
              label: "فوری",
              color: "bg-orange-100",
              active: "ring-orange-400 from-orange-50 to-orange-100",
            },
            {
              value: "critical",
              label: "بحرانی",
              color: "bg-red-100",
              active: "ring-red-500 from-red-50 to-red-100",
            },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFormData("urgencyLevel", opt.value)}
              className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${
                  formData.urgencyLevel === opt.value
                    ? `bg-gradient-to-br ${opt.active} border-transparent ring-2 shadow-inner scale-[0.98]`
                    : "bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:-translate-y-1 hover:shadow-md"
                }
              `}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  formData.urgencyLevel === opt.value ? "bg-current opacity-100" : "bg-gray-300"
                }`}
              />
              <span
                className={`font-bold ${
                  formData.urgencyLevel === opt.value ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className={labelStyle}>مهارت‌های مورد نیاز</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                placeholder="افزودن مهارت..."
                className={inputStyle}
              />
              <button
                onClick={addSkill}
                className="px-4 rounded-xl bg-[#007acc] text-white shadow-[0_4px_10px_rgba(0,122,204,0.3)] hover:bg-[#006bb3] active:scale-95 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {formData.requiredSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-blue-50 text-[#007acc] border border-blue-100 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() =>
                      updateFormData(
                        "requiredSkills",
                        formData.requiredSkills.filter((s: string) => s !== skill)
                      )
                    }
                    className="hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className={labelStyle}>برچسب‌ها (Tags)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                placeholder="افزودن برچسب..."
                className={inputStyle}
              />
              <button
                onClick={addTag}
                className="px-4 rounded-xl bg-gray-800 text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:bg-gray-700 active:scale-95 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {formData.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  #{tag}
                  <button
                    onClick={() =>
                      updateFormData(
                        "tags",
                        formData.tags.filter((t: string) => t !== tag)
                      )
                    }
                    className="hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step3Location: React.FC<any> = ({ formData, updateFormData }) => {
  const provinces = getProvinceNames();
  const cities = formData.location.province ? getCitiesByProvince(formData.location.province) : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-2xl shadow-inner border border-green-200">
          <OptimizedImage
            src="/icons/placeLocation.svg"
            alt="download icon"
            width={18}
            height={18}
            className="inline-block"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">موقعیت مکانی</h3>
          <p className="text-sm text-gray-500">محل اجرای پروژه را مشخص کنید</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className={cardStyle}>
            <div className="space-y-4">
              <div>
                <label className={labelStyle}>استان</label>
                <select
                  value={formData.location.province}
                  onChange={(e) =>
                    updateFormData("location", { ...formData.location, province: e.target.value, city: "" })
                  }
                  className={inputStyle}
                >
                  <option value="">انتخاب استان</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyle}>شهر</label>
                <select
                  value={formData.location.city}
                  onChange={(e) => updateFormData("location", { ...formData.location, city: e.target.value })}
                  disabled={!formData.location.province}
                  className={`${inputStyle} disabled:bg-gray-100 disabled:text-gray-400`}
                >
                  <option value="">انتخاب شهر</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={cardStyle}>
            <label className={labelStyle}>آدرس دقیق</label>
            <textarea
              value={formData.location.address}
              onChange={(e) => updateFormData("location", { ...formData.location, address: e.target.value })}
              placeholder="خیابان، کوچه، پلاک..."
              className={`${inputStyle} min-h-[120px]`}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-2 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200 h-full min-h-[350px]">
            <LocationPicker
              value={formData.location.coordinates}
              onChange={(coords) => updateFormData("location", { ...formData.location, coordinates: coords })}
              label="موقعیت روی نقشه"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Step4Timeline: React.FC<any> = ({ formData, updateFormData }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center text-2xl shadow-inner border border-purple-200">
        📅
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800">زمان‌بندی</h3>
        <p className="text-sm text-gray-500">مهلت و بازه زمانی پروژه را تعیین کنید</p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className={cardStyle}>
        <div className="mb-6">
          <label className={labelStyle}>مدت زمان تخمینی اجرا</label>
          <select
            value={formData.estimatedDuration}
            onChange={(e) => updateFormData("estimatedDuration", e.target.value)}
            className={inputStyle}
          >
            <option value="">انتخاب مدت زمان</option>
            <option value="۱ هفته">۱ هفته</option>
            <option value="۲ هفته">۲ هفته</option>
            <option value="۱ ماه">۱ ماه</option>
            <option value="۳ ماه">۳ ماه</option>
            <option value="۶ ماه">۶ ماه</option>
            <option value="۱ سال">۱ سال</option>
          </select>
        </div>

        <div>
          <PersianDatePicker
            value={formData.deadline}
            onChange={(date) => updateFormData("deadline", date)}
            label="مهلت اتمام (Deadline)"
            placeholder="انتخاب تاریخ از تقویم"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#007acc]/5 to-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-3xl mb-4">
          💡
        </div>
        <h4 className="font-bold text-[#007acc] mb-2">چرا زمان‌بندی مهم است؟</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          تعیین یک مهلت واقع‌گرایانه به حامیان اطمینان می‌دهد که شما برنامه‌ریزی دقیقی دارید. پروژه‌هایی با
          زمان‌بندی مشخص، ۳۰٪ شانس موفقیت بیشتری دارند.
        </p>
      </div>
    </div>
  </div>
);

const Step5Budget: React.FC<any> = ({ formData, updateFormData }) => {
  const [newItem, setNewItem] = useState({ title: "", category: "", estimatedCost: 0 });
  const totalBudget = formData.budgetItems.reduce((sum: number, item: any) => sum + item.estimatedCost, 0);

  const addBudgetItem = () => {
    if (newItem.title && newItem.estimatedCost > 0) {
      updateFormData("budgetItems", [...formData.budgetItems, newItem]);
      setNewItem({ title: "", category: "", estimatedCost: 0 });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center text-2xl shadow-inner border border-yellow-200"></div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">برآورد بودجه</h3>
            <p className="text-sm text-gray-500">هزینه‌های پروژه را شفاف‌سازی کنید</p>
          </div>
        </div>

        {/* Digital Display for Total Budget */}
        <div className="bg-gray-900 text-green-400 px-6 py-3 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border-b-2 border-gray-700 font-mono text-xl tracking-wider">
          {totalBudget.toLocaleString()} <span className="text-xs text-gray-500">تومان</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className={`${cardStyle} md:col-span-1 h-fit`}>
          <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">افزودن قلم هزینه</h4>
          <div className="space-y-4">
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="عنوان هزینه (مثال: خرید سرور)"
              className={inputStyle}
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className={inputStyle}
            >
              <option value="">دسته‌بندی</option>
              <option value="تجهیزات">تجهیزات</option>
              <option value="نیروی انسانی">نیروی انسانی</option>
              <option value="تبلیغات">تبلیغات</option>
              <option value="سایر">سایر</option>
            </select>
            <input
              type="number"
              value={newItem.estimatedCost || ""}
              onChange={(e) => setNewItem({ ...newItem, estimatedCost: Number(e.target.value) })}
              placeholder="مبلغ (تومان)"
              className={inputStyle}
            />
            <button
              onClick={addBudgetItem}
              className="w-full py-3 bg-[#007acc] text-white rounded-xl font-bold shadow-[0_4px_14px_rgba(0,122,204,0.3)] hover:bg-[#006bb3] hover:shadow-lg active:scale-[0.98] transition-all"
            >
              + افزودن به لیست
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          {formData.budgetItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 min-h-[200px]">
              <span className="text-4xl mb-2">🧾</span>
              <p>هنوز هیچ هزینه‌ای ثبت نشده است</p>
            </div>
          ) : (
            formData.budgetItems.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">{item.title}</h5>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700">{item.estimatedCost.toLocaleString()} ت</span>
                  <button
                    onClick={() =>
                      updateFormData(
                        "budgetItems",
                        formData.budgetItems.filter((_: any, i: number) => i !== idx)
                      )
                    }
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Step6Files: React.FC<any> = ({ formData, updateFormData }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-2xl shadow-inner border border-indigo-200">
        <OptimizedImage
          src="/icons/attach.svg"
          alt="download icon"
          width={18}
          height={18}
          className="inline-block"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800">پیوست‌ها</h3>
        <p className="text-sm text-gray-500">تصاویر، ویدیو یا اسناد مرتبط را بارگذاری کنید</p>
      </div>
    </div>

    <div className="bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100">
      <FileUploader
        value={formData.attachments}
        onChange={(files) => updateFormData("attachments", files)}
        maxFiles={10}
        maxSize={10}
        acceptedTypes={["image/*", "video/*", ".pdf", ".doc", ".docx"]}
      />
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3">
        <span className="text-xl">ℹ️</span>
        <p>
          تصاویر با کیفیت و مستندات کامل، اعتماد حامیان را تا <strong>۲ برابر</strong> افزایش می‌دهد. لطفاً از
          تصاویر واقعی پروژه استفاده کنید.
        </p>
      </div>
    </div>
  </div>
);

export default CreateNeedModal;
