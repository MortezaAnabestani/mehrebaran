"use client";

import React, { useState } from "react";
import { IProject } from "common-types";
import { registerAsVolunteer } from "@/services/volunteer.service";
import SmartButton from "@/components/ui/SmartButton";
import { useRouter } from "next/navigation";

interface Props {
  project: IProject;
  onSuccess?: (registrationId: string) => void;
  isAuthenticated: boolean;
}

const DAYS = [
  { value: "saturday", label: "شنبه" },
  { value: "sunday", label: "یکشنبه" },
  { value: "monday", label: "دوشنبه" },
  { value: "tuesday", label: "سه‌شنبه" },
  { value: "wednesday", label: "چهارشنبه" },
  { value: "thursday", label: "پنجشنبه" },
  { value: "friday", label: "جمعه" },
];

const TIME_SLOTS = [
  { value: "morning", label: "صبح (۸-۱۲)" },
  { value: "afternoon", label: "عصر (۱۲-۱۶)" },
  { value: "evening", label: "شب (۱۶-۲۰)" },
];

const VolunteerForm: React.FC<Props> = ({ project, onSuccess, isAuthenticated }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    skills: [] as string[],
    availableHours: "",
    preferredRole: "",
    experience: "",
    motivation: "",
    availability: {
      days: [] as string[],
      timeSlots: [] as string[],
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="text-xl font-bold text-gray-800 mb-2">ورود به حساب کاربری</h3>
        <p className="text-gray-600 mb-4">برای ثبت‌نام به عنوان داوطلب، باید وارد حساب کاربری خود شوید</p>
        <SmartButton
          variant="mblue"
          onClick={() => router.push(`/auth/login?redirect=/projects/${project.slug}`)}
          fullWidth
        >
          ورود / ثبت‌نام
        </SmartButton>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validations
      if (formData.skills.length === 0) {
        throw new Error("لطفاً حداقل یک مهارت وارد کنید");
      }

      const hours = parseInt(formData.availableHours);
      if (isNaN(hours) || hours < 1 || hours > 168) {
        throw new Error("ساعات در دسترس باید بین ۱ تا ۱۶۸ باشد");
      }

      if (formData.availability.days.length === 0) {
        throw new Error("لطفاً حداقل یک روز انتخاب کنید");
      }

      if (formData.availability.timeSlots.length === 0) {
        throw new Error("لطفاً حداقل یک بازه زمانی انتخاب کنید");
      }

      // Register as volunteer
      const registration = await registerAsVolunteer({
        projectId: project._id,
        skills: formData.skills,
        availableHours: hours,
        preferredRole: formData.preferredRole || undefined,
        experience: formData.experience || undefined,
        motivation: formData.motivation || undefined,
        availability: formData.availability,
        emergencyContact:
          formData.emergencyContact.name && formData.emergencyContact.phone
            ? formData.emergencyContact
            : undefined,
      });

      setSuccess(true);
      if (onSuccess) onSuccess(registration._id);
    } catch (err: any) {
      setError(err.message || "خطا در ثبت‌نام داوطلب. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (category: "days" | "timeSlots", value: string) => {
    setFormData((prev) => {
      const array = prev.availability[category];
      const newArray = array.includes(value)
        ? array.filter((item) => item !== value)
        : [...array, value];

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [category]: newArray,
        },
      };
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  if (success) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-bold text-gray-800 mb-2">ثبت‌نام شما انجام شد!</h3>
        <p className="text-gray-600 mb-4">
          درخواست داوطلبی شما با موفقیت ثبت شد و در انتظار تایید مدیران پروژه است.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
          <p className="text-sm text-blue-800">
            پس از تایید، از طریق ایمیل یا پیامک به شما اطلاع‌رسانی خواهد شد.
          </p>
        </div>
        <SmartButton variant="mblue" onClick={() => router.push("/network")} fullWidth>
          مشاهده شبکه نیازسنجی
        </SmartButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">فرم ثبت‌نام داوطلب</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Skills */}
      <div className="mb-4">
        <label htmlFor="skills" className="block text-sm font-bold text-gray-700 mb-2">
          مهارت‌ها *
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
            placeholder="مثال: برنامه‌نویسی، طراحی، آموزش"
          />
          <SmartButton type="button" variant="mblue" onClick={addSkill}>
            افزودن
          </SmartButton>
        </div>
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="bg-mblue text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Available Hours */}
      <div className="mb-4">
        <label htmlFor="availableHours" className="block text-sm font-bold text-gray-700 mb-2">
          ساعات در دسترس در هفته *
        </label>
        <input
          type="number"
          id="availableHours"
          value={formData.availableHours}
          onChange={(e) => setFormData((prev) => ({ ...prev, availableHours: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          placeholder="مثال: 10"
          required
          min="1"
          max="168"
        />
      </div>

      {/* Preferred Role */}
      <div className="mb-4">
        <label htmlFor="preferredRole" className="block text-sm font-bold text-gray-700 mb-2">
          نقش مورد علاقه
        </label>
        <input
          type="text"
          id="preferredRole"
          value={formData.preferredRole}
          onChange={(e) => setFormData((prev) => ({ ...prev, preferredRole: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          placeholder="مثال: مربی، هماهنگ‌کننده، پشتیبانی فنی"
        />
      </div>

      {/* Days Available */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">روزهای در دسترس *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DAYS.map((day) => (
            <label key={day.value} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.availability.days.includes(day.value)}
                onChange={() => handleCheckboxChange("days", day.value)}
                className="ml-2 w-4 h-4 text-mblue focus:ring-mblue"
              />
              <span className="text-sm">{day.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">بازه‌های زمانی *</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => (
            <label key={slot.value} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.availability.timeSlots.includes(slot.value)}
                onChange={() => handleCheckboxChange("timeSlots", slot.value)}
                className="ml-2 w-4 h-4 text-mblue focus:ring-mblue"
              />
              <span className="text-sm">{slot.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <label htmlFor="experience" className="block text-sm font-bold text-gray-700 mb-2">
          تجربه مرتبط
        </label>
        <textarea
          id="experience"
          value={formData.experience}
          onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          placeholder="تجربیات کاری یا داوطلبانه مرتبط خود را شرح دهید..."
        />
      </div>

      {/* Motivation */}
      <div className="mb-4">
        <label htmlFor="motivation" className="block text-sm font-bold text-gray-700 mb-2">
          انگیزه شما
        </label>
        <textarea
          id="motivation"
          value={formData.motivation}
          onChange={(e) => setFormData((prev) => ({ ...prev, motivation: e.target.value }))}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          placeholder="چرا می‌خواهید در این پروژه مشارکت کنید؟"
        />
      </div>

      {/* Emergency Contact */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-gray-700 mb-2">تماس اضطراری (اختیاری)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="نام"
            value={formData.emergencyContact.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, name: e.target.value },
              }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          />
          <input
            type="text"
            placeholder="نسبت (مثال: پدر، مادر)"
            value={formData.emergencyContact.relationship}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value },
              }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          />
          <input
            type="tel"
            placeholder="شماره تماس"
            value={formData.emergencyContact.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, phone: e.target.value },
              }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          />
        </div>
      </div>

      {/* Submit Button */}
      <SmartButton
        type="submit"
        variant="mblue"
        fullWidth
        disabled={loading || !project.volunteerSettings.enabled}
      >
        {loading ? "در حال پردازش..." : "ثبت‌نام به عنوان داوطلب"}
      </SmartButton>

      {!project.volunteerSettings.enabled && (
        <p className="text-red-600 text-sm text-center mt-2">
          امکان ثبت‌نام داوطلب برای این پروژه فعلاً غیرفعال است
        </p>
      )}
    </form>
  );
};

export default VolunteerForm;
