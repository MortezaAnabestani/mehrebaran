"use client";

import React, { useState, useRef } from "react";
import SmartButton from "@/components/ui/SmartButton";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      setError("فرمت فایل پشتیبانی نمی‌شود. لطفاً عکس یا ویدئو انتخاب کنید.");
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("حجم فایل نباید بیشتر از 50 مگابایت باشد.");
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(selectedFile);
      handleClose();
    } catch (err: any) {
      setError(err.message || "خطا در ایجاد استوری");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">ایجاد استوری جدید</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!preview ? (
            // Upload Area
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-mblue hover:bg-blue-50/50 transition-colors"
            >
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-lg font-semibold mb-2">انتخاب عکس یا ویدئو</h3>
              <p className="text-gray-500 text-sm mb-4">
                فایل خود را انتخاب کنید یا اینجا بکشید
              </p>
              <SmartButton variant="mblue" size="md">
                انتخاب فایل
              </SmartButton>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            // Preview Area
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black">
                {selectedFile?.type.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                )}
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{selectedFile?.name}</span>
                <span>{((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <SmartButton
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="flex-1"
                >
                  تغییر فایل
                </SmartButton>
                <SmartButton
                  variant="mblue"
                  size="md"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "در حال آپلود..." : "انتشار استوری"}
                </SmartButton>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Guidelines */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">راهنما:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• فرمت‌های پشتیبانی شده: JPG, PNG, GIF, MP4, MOV</li>
              <li>• حداکثر حجم فایل: 50 مگابایت</li>
              <li>• استوری شما برای 24 ساعت نمایش داده می‌شود</li>
              <li>• توصیه می‌شود از تصاویر عمودی استفاده کنید</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
