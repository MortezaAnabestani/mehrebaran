"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartButton from "@/components/ui/SmartButton";

interface CreateNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const CreateNeedModal: React.FC<CreateNeedModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: اطلاعات اولیه
    title: "",
    description: "",
    category: "",

    // Step 2: جزئیات
    urgencyLevel: "medium" as "low" | "medium" | "high" | "critical",
    estimatedDuration: "",
    requiredSkills: [] as string[],
    tags: [] as string[],

    // Step 3: موقعیت
    location: {
      address: "",
      city: "",
      province: "",
      coordinates: [0, 0],
    },

    // Step 4: زمان‌بندی
    deadline: "",

    // Step 5: بودجه
    budgetItems: [] as Array<{
      title: string;
      description: string;
      category: string;
      estimatedCost: number;
    }>,

    // Step 6: فایل‌ها
    attachments: [] as Array<{
      fileType: "image" | "video" | "audio" | "document";
      url: string;
      fileName?: string;
    }>,
  });

  const steps = [
    { id: 1, title: "اطلاعات اولیه", icon: "📝" },
    { id: 2, title: "جزئیات", icon: "⚙️" },
    { id: 3, title: "موقعیت", icon: "📍" },
    { id: 4, title: "زمان‌بندی", icon: "📅" },
    { id: 5, title: "بودجه", icon: "💰" },
    { id: 6, title: "فایل‌ها", icon: "📎" },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting need:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-mblue to-mblue/80 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">ثبت نیاز جدید</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center transition-all ${
                  index === currentStep
                    ? "opacity-100 scale-110"
                    : index < currentStep
                    ? "opacity-70"
                    : "opacity-40"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                    index === currentStep
                      ? "bg-white text-mblue shadow-lg"
                      : index < currentStep
                      ? "bg-white/30 text-white"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {index < currentStep ? "✓" : step.icon}
                </div>
                <span className="text-xs font-medium text-center hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 min-h-[400px] max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step Content */}
              {currentStep === 0 && (
                <Step1BasicInfo formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 1 && (
                <Step2Details formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 2 && (
                <Step3Location formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 3 && (
                <Step4Timeline formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 4 && (
                <Step5Budget formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 5 && (
                <Step6Files formData={formData} updateFormData={updateFormData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t">
          <SmartButton
            variant="mgray"
            size="md"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="disabled:opacity-50"
          >
            → مرحله قبل
          </SmartButton>

          <div className="text-sm text-gray-600">
            مرحله {currentStep + 1} از {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <SmartButton variant="mblue" size="md" onClick={nextStep}>
              مرحله بعد ←
            </SmartButton>
          ) : (
            <SmartButton
              variant="morange"
              size="md"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "در حال ارسال..." : "ثبت نیاز ✓"}
            </SmartButton>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Step 1: اطلاعات اولیه
const Step1BasicInfo: React.FC<any> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold mb-2 text-mblue">اطلاعات اولیه نیاز</h3>
        <p className="text-sm text-gray-600">عنوان و توضیحات کامل نیاز خود را وارد کنید</p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          عنوان نیاز <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          placeholder="مثال: کمک به خرید تجهیزات پزشکی برای بیمارستان"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          maxLength={100}
        />
        <div className="text-xs text-gray-500 mt-1">{formData.title.length}/100 کاراکتر</div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          توضیحات کامل <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="توضیحات جامع در مورد نیاز، اهداف، و چالش‌های موجود..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue min-h-[150px]"
          maxLength={2000}
        />
        <div className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 کاراکتر</div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          دسته‌بندی <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => updateFormData("category", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        >
          <option value="">انتخاب دسته‌بندی</option>
          <option value="آموزش">📚 آموزش</option>
          <option value="سلامت و درمان">🏥 سلامت و درمان</option>
          <option value="مسکن">🏠 مسکن</option>
          <option value="غذا و تغذیه">🍽️ غذا و تغذیه</option>
          <option value="اشتغال و کسب‌وکار">💼 اشتغال و کسب‌وکار</option>
          <option value="محیط زیست">🌱 محیط زیست</option>
          <option value="اضطراری">🚨 اضطراری</option>
          <option value="فرهنگ و هنر">🎨 فرهنگ و هنر</option>
        </select>
      </div>
    </div>
  );
};

// Step 2: جزئیات
const Step2Details: React.FC<any> = ({ formData, updateFormData }) => {
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      updateFormData("requiredSkills", [...formData.requiredSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    updateFormData(
      "requiredSkills",
      formData.requiredSkills.filter((s: string) => s !== skill)
    );
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    updateFormData(
      "tags",
      formData.tags.filter((t: string) => t !== tag)
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold mb-2 text-mblue">جزئیات پروژه</h3>
        <p className="text-sm text-gray-600">اطلاعات تکمیلی برای اجرای بهتر نیاز</p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">سطح فوریت</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: "low", label: "عادی", icon: "⚪", color: "bg-gray-100 hover:bg-gray-200" },
            { value: "medium", label: "متوسط", icon: "🔵", color: "bg-blue-100 hover:bg-blue-200" },
            { value: "high", label: "فوری", icon: "🟠", color: "bg-orange-100 hover:bg-orange-200" },
            { value: "critical", label: "بحرانی", icon: "🔴", color: "bg-red-100 hover:bg-red-200" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFormData("urgencyLevel", option.value)}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                formData.urgencyLevel === option.value
                  ? "border-mblue bg-mblue/10 scale-105"
                  : `border-gray-200 ${option.color}`
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-sm font-bold">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">مدت زمان تخمینی</label>
        <select
          value={formData.estimatedDuration}
          onChange={(e) => updateFormData("estimatedDuration", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        >
          <option value="">انتخاب مدت زمان</option>
          <option value="۱ هفته">۱ هفته</option>
          <option value="۲ هفته">۲ هفته</option>
          <option value="۱ ماه">۱ ماه</option>
          <option value="۲ ماه">۲ ماه</option>
          <option value="۳ ماه">۳ ماه</option>
          <option value="۶ ماه">۶ ماه</option>
          <option value="۱ سال">۱ سال</option>
          <option value="بیش از ۱ سال">بیش از ۱ سال</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">مهارت‌های مورد نیاز</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="مثال: پزشکی، برنامه‌نویسی، طراحی"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          />
          <SmartButton type="button" variant="mblue" size="sm" onClick={addSkill}>
            افزودن
          </SmartButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.requiredSkills.map((skill: string) => (
            <span
              key={skill}
              className="px-3 py-1 bg-mblue/10 text-mblue rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="text-red-500 hover:text-red-700">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">برچسب‌ها</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="مثال: فوری، کمک‌رسانی، آموزش"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          />
          <SmartButton type="button" variant="mblue" size="sm" onClick={addTag}>
            افزودن
          </SmartButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 bg-morange/10 text-morange rounded-full text-sm flex items-center gap-2"
            >
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-red-500 hover:text-red-700">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other steps (will implement next)
const Step3Location: React.FC<any> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold mb-2 text-mblue">موقعیت مکانی</h3>
        <p className="text-sm text-gray-600">محل اجرای نیاز را مشخص کنید</p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">استان</label>
        <input
          type="text"
          value={formData.location.province}
          onChange={(e) =>
            updateFormData("location", { ...formData.location, province: e.target.value })
          }
          placeholder="مثال: تهران"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">شهر</label>
        <input
          type="text"
          value={formData.location.city}
          onChange={(e) =>
            updateFormData("location", { ...formData.location, city: e.target.value })
          }
          placeholder="مثال: تهران"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">آدرس کامل</label>
        <textarea
          value={formData.location.address}
          onChange={(e) =>
            updateFormData("location", { ...formData.location, address: e.target.value })
          }
          placeholder="آدرس دقیق محل اجرای نیاز..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue min-h-[100px]"
        />
      </div>
    </div>
  );
};

const Step4Timeline: React.FC<any> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold mb-2 text-mblue">زمان‌بندی</h3>
        <p className="text-sm text-gray-600">مهلت اجرای نیاز را تعیین کنید</p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">مهلت اتمام (Deadline)</label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => updateFormData("deadline", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 انتخاب مهلت اتمام به مدیریت بهتر پروژه کمک می‌کند
        </p>
      </div>
    </div>
  );
};

const Step5Budget: React.FC<any> = ({ formData, updateFormData }) => {
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "",
    estimatedCost: 0,
  });

  const addBudgetItem = () => {
    if (newItem.title.trim() && newItem.estimatedCost > 0) {
      updateFormData("budgetItems", [...formData.budgetItems, { ...newItem }]);
      setNewItem({ title: "", description: "", category: "", estimatedCost: 0 });
    }
  };

  const removeBudgetItem = (index: number) => {
    updateFormData(
      "budgetItems",
      formData.budgetItems.filter((_: any, i: number) => i !== index)
    );
  };

  const totalBudget = formData.budgetItems.reduce(
    (sum: number, item: any) => sum + item.estimatedCost,
    0
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold mb-2 text-mblue">بودجه پروژه</h3>
        <p className="text-sm text-gray-600">اقلام بودجه مورد نیاز را مشخص کنید</p>
      </div>

      <div className="bg-morange/10 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">جمع کل بودجه:</div>
        <div className="text-2xl font-bold text-morange">
          {totalBudget.toLocaleString()} تومان
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <h4 className="font-bold">افزودن قلم بودجه</h4>
        <input
          type="text"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          placeholder="عنوان قلم بودجه"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        />
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        >
          <option value="">انتخاب دسته‌بندی</option>
          <option value="تجهیزات">تجهیزات</option>
          <option value="خدمات">خدمات</option>
          <option value="مواد اولیه">مواد اولیه</option>
          <option value="نیروی انسانی">نیروی انسانی</option>
          <option value="سایر">سایر</option>
        </select>
        <textarea
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          placeholder="توضیحات"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        />
        <input
          type="number"
          value={newItem.estimatedCost || ""}
          onChange={(e) => setNewItem({ ...newItem, estimatedCost: Number(e.target.value) })}
          placeholder="مبلغ تخمینی (تومان)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
        />
        <SmartButton type="button" variant="mblue" size="sm" onClick={addBudgetItem}>
          + افزودن قلم بودجه
        </SmartButton>
      </div>

      {formData.budgetItems.length > 0 && (
        <div className="space-y-3">
          {formData.budgetItems.map((item: any, index: number) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
              <div className="flex-1">
                <div className="font-bold">{item.title}</div>
                <div className="text-sm text-gray-600">{item.category}</div>
                <div className="text-sm text-morange font-bold mt-1">
                  {item.estimatedCost.toLocaleString()} تومان
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeBudgetItem(index)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Step6Files: React.FC<any> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold mb-2 text-mblue">فایل‌های پیوست</h3>
        <p className="text-sm text-gray-600">
          تصاویر، ویدیو یا اسناد مرتبط با نیاز را اضافه کنید
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">📎</div>
        <p className="text-gray-600 mb-2">فایل‌های خود را اینجا رها کنید</p>
        <p className="text-sm text-gray-500 mb-4">یا روی دکمه زیر کلیک کنید</p>
        <SmartButton type="button" variant="mblue" size="sm">
          انتخاب فایل
        </SmartButton>
        <p className="text-xs text-gray-400 mt-4">
          فرمت‌های مجاز: JPG, PNG, PDF, MP4 | حداکثر حجم: 10MB
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
        💡 <strong>نکته:</strong> افزودن تصاویر و اسناد، اعتبار نیاز شما را افزایش می‌دهد و احتمال
        حمایت را بیشتر می‌کند.
      </div>
    </div>
  );
};

export default CreateNeedModal;
