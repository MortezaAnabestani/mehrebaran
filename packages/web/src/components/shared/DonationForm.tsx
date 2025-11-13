"use client";

import React, { useState } from "react";
import { IProject } from "common-types";
import { createDonation, initiatePayment } from "@/services/donation.service";
import SmartButton from "@/components/ui/SmartButton";

interface Props {
  project: IProject;
  onSuccess?: (donationId: string) => void;
}

const DonationForm: React.FC<Props> = ({ project, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "online" as "online" | "bank_transfer" | "cash",
    fullName: "",
    mobile: "",
    email: "",
    isAnonymous: false,
    message: "",
    dedicatedTo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trackingCode, setTrackingCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate amount
      const amount = parseInt(formData.amount);
      if (isNaN(amount) || amount < (project.donationSettings.minimumAmount || 0)) {
        throw new Error(
          `حداقل مبلغ کمک ${(project.donationSettings.minimumAmount || 0).toLocaleString("fa-IR")} تومان است`
        );
      }

      // Validate donor info if not anonymous
      if (!formData.isAnonymous && !formData.fullName) {
        throw new Error("لطفاً نام خود را وارد کنید");
      }

      // Create donation
      const donation = await createDonation({
        projectId: project._id,
        amount,
        paymentMethod: formData.paymentMethod,
        donorInfo: formData.isAnonymous
          ? { isAnonymous: true }
          : {
              fullName: formData.fullName,
              mobile: formData.mobile,
              email: formData.email,
              isAnonymous: false,
            },
        message: formData.message || undefined,
        dedicatedTo: formData.dedicatedTo || undefined,
      });

      // Handle based on payment method
      if (formData.paymentMethod === "online") {
        // Initiate online payment
        const paymentData = await initiatePayment(donation._id);
        // Redirect to payment gateway
        window.location.href = paymentData.paymentUrl;
      } else if (formData.paymentMethod === "bank_transfer") {
        // Show tracking code for bank transfer
        setTrackingCode(donation.trackingCode || donation._id);
        if (onSuccess) onSuccess(donation._id);
      } else {
        // Cash donation registered
        if (onSuccess) onSuccess(donation._id);
      }
    } catch (err: any) {
      setError(err.message || "خطا در ثبت کمک مالی. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // If bank transfer tracking code shown
  if (trackingCode && formData.paymentMethod === "bank_transfer") {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-center mb-4">
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">درخواست کمک مالی ثبت شد</h3>
          <p className="text-gray-600 mb-4">
            کد پیگیری شما: <span className="font-bold text-mblue">{trackingCode}</span>
          </p>
        </div>

        {project.bankInfo && (
          <div className="bg-mgray p-4 rounded-lg mb-4">
            <h4 className="font-bold text-gray-800 mb-3">اطلاعات حساب بانکی</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">بانک:</span>
                <span className="font-bold">{project.bankInfo.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">شماره حساب:</span>
                <span className="font-mono" dir="ltr">
                  {project.bankInfo.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">شماره کارت:</span>
                <span className="font-mono" dir="ltr">
                  {project.bankInfo.cardNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">شبا:</span>
                <span className="font-mono text-xs" dir="ltr">
                  {project.bankInfo.iban}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">صاحب حساب:</span>
                <span className="font-bold">{project.bankInfo.accountHolderName}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
          <p className="text-sm text-yellow-800">
            لطفاً پس از واریز، رسید خود را از طریق بخش "کمک‌های من" آپلود کنید تا پس از بررسی، کمک شما تایید
            شود.
          </p>
        </div>

        <SmartButton
          variant="mblue"
          onClick={() => {
            setTrackingCode("");
            setFormData({
              amount: "",
              paymentMethod: "online",
              fullName: "",
              mobile: "",
              email: "",
              isAnonymous: false,
              message: "",
              dedicatedTo: "",
            });
          }}
          fullWidth
        >
          کمک جدید
        </SmartButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">فرم کمک مالی</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Amount */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-bold text-gray-700 mb-2">
          مبلغ کمک (تومان) *
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          placeholder={`حداقل ${(project.donationSettings.minimumAmount || 10000).toLocaleString(
            "fa-IR"
          )} تومان`}
          required
          min={project.donationSettings.minimumAmount || 0}
        />
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label htmlFor="paymentMethod" className="block text-sm font-bold text-gray-700 mb-2">
          روش پرداخت *
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          required
        >
          <option value="online">پرداخت آنلاین (زرین‌پال)</option>
          <option value="bank_transfer">واریز به حساب بانکی</option>
          <option value="cash">پرداخت نقدی (حضوری)</option>
        </select>
      </div>

      {/* Anonymous Checkbox */}
      {project.donationSettings.allowAnonymous && (
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="ml-2 w-4 h-4 text-mblue focus:ring-mblue"
            />
            <span className="text-sm text-gray-700">کمک ناشناس (نام من نمایش داده نشود)</span>
          </label>
        </div>
      )}

      {/* Donor Info */}
      {!formData.isAnonymous && (
        <>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">
              نام و نام خانوادگی *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
              required={!formData.isAnonymous}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="mobile" className="block text-sm font-bold text-gray-700 mb-2">
              شماره موبایل
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
              placeholder="09123456789"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
              placeholder="example@email.com"
            />
          </div>
        </>
      )}

      {/* Message */}
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
          پیام (اختیاری)
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          placeholder="پیام شما برای تیم پروژه..."
        />
      </div>

      {/* Dedicated To */}
      <div className="mb-6">
        <label htmlFor="dedicatedTo" className="block text-sm font-bold text-gray-700 mb-2">
          تقدیم به (اختیاری)
        </label>
        <input
          type="text"
          id="dedicatedTo"
          name="dedicatedTo"
          value={formData.dedicatedTo}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mblue"
          placeholder="مثال: به یاد مادرم"
        />
      </div>

      {/* Submit Button */}
      <SmartButton
        type="submit"
        variant="mblue"
        fullWidth
        disabled={loading || !project.donationSettings.enabled}
      >
        {loading
          ? "در حال پردازش..."
          : formData.paymentMethod === "online"
          ? "انتقال به درگاه پرداخت"
          : "ثبت درخواست کمک"}
      </SmartButton>

      {!project.donationSettings.enabled && (
        <p className="text-red-600 text-sm text-center mt-2">
          امکان کمک مالی برای این پروژه فعلاً غیرفعال است
        </p>
      )}
    </form>
  );
};

export default DonationForm;
