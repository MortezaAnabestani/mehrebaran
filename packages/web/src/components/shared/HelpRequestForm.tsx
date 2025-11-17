"use client";

import { useState } from "react";

export default function HelpRequestForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("guestName", formData.guestName);
      formDataToSend.append("guestEmail", formData.guestEmail);

      if (formData.guestPhone) {
        formDataToSend.append("contactInfo", JSON.stringify({ phone: formData.guestPhone }));
      }

      // Add files if any
      files.forEach((file) => {
        formDataToSend.append("media", file);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/needs`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("خطا در ارسال درخواست");
      }

      setMessage({
        type: "success",
        text: "درخواست شما با موفقیت ثبت شد. پس از بررسی، با شما تماس خواهیم گرفت.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
      });
      setFiles([]);
    } catch (error) {
      setMessage({
        type: "error",
        text: "خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          درخواست کمک
        </h2>
        <p className="text-gray-600">
          آیا به کمک نیاز دارید؟ درخواست خود را برای ما ارسال کنید
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان درخواست <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="مثال: کمک به خانواده نیازمند"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شرح درخواست <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            maxLength={1000}
            placeholder="لطفاً وضعیت خود را به طور کامل توضیح دهید..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000 کاراکتر
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام و نام خانوادگی <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
              placeholder="نام خود را وارد کنید"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ایمیل <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره تماس
          </label>
          <input
            type="tel"
            name="guestPhone"
            value={formData.guestPhone}
            onChange={handleChange}
            placeholder="09123456789"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تصاویر یا ویدیوها (اختیاری - حداکثر 5 فایل)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={files.length >= 5}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-sm text-gray-600">
                {files.length >= 5
                  ? "حداکثر تعداد فایل انتخاب شده"
                  : "برای انتخاب فایل کلیک کنید"}
              </span>
            </label>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span className="text-sm text-gray-700 truncate flex-1">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 mr-2"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-medium text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "در حال ارسال..." : "ارسال درخواست"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          با ارسال درخواست، شما با{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            قوانین و مقررات
          </a>{" "}
          ما موافقت می‌کنید
        </p>
      </form>
    </div>
  );
}
