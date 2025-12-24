"use client";

import React, { useState, useRef, DragEvent } from "react";
import { X, UploadCloud, Image as ImageIcon, Film, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const validateAndSetFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];

    if (!validTypes.includes(file.type)) {
      setError("فرمت فایل پشتیبانی نمی‌شود. لطفاً عکس (JPG, PNG) یا ویدئو (MP4) انتخاب کنید.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("حجم فایل نباید بیشتر از 50 مگابایت باشد.");
      return;
    }

    setError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Skeuomorphic Card */}
      <div className="relative w-full max-w-lg bg-[#eef2f5] rounded-3xl shadow-[20px_20px_60px_#caced1,-20px_-20px_60px_#ffffff] border border-white/50 overflow-hidden transform transition-all scale-100">
        {/* Header: Raised Surface */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-b from-white to-[#eef2f5] border-b border-gray-200 shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-gray-700 tracking-tight drop-shadow-sm">
              ایجاد استوری
            </h2>
          </div>

          {/* Close Button: Physical Feel */}
          <button
            onClick={handleClose}
            className="group w-10 h-10 rounded-full bg-[#eef2f5] flex items-center justify-center 
                       shadow-[5px_5px_10px_#caced1,-5px_-5px_10px_#ffffff] 
                       active:shadow-[inset_5px_5px_10px_#caced1,inset_-5px_-5px_10px_#ffffff] 
                       transition-all duration-200 text-gray-500 hover:text-red-500"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!preview ? (
            // Upload Area: Recessed/Sunken Look
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative group cursor-pointer rounded-2xl p-10 text-center transition-all duration-300
                border-2 border-dashed
                ${
                  isDragging
                    ? "border-[#007acc] bg-blue-50/50 shadow-[inset_0px_0px_20px_rgba(0,122,204,0.1)]"
                    : "border-gray-300 bg-[#eef2f5] shadow-[inset_6px_6px_12px_#caced1,inset_-6px_-6px_12px_#ffffff] hover:border-gray-400"
                }
              `}
            >
              <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.03)]" />

              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-[#007acc] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="text-white w-10 h-10 drop-shadow-md" />
              </div>

              <h3 className="text-lg font-bold text-gray-700 mb-2">فایل را اینجا رها کنید</h3>
              <p className="text-gray-500 text-sm mb-6 font-medium">
                یا برای انتخاب کلیک کنید (عکس یا ویدئو)
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-xs text-gray-400 font-mono">
                <ImageIcon size={14} /> JPG, PNG
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <Film size={14} /> MP4
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            // Preview Area: Framed Picture Look
            <div className="space-y-5">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-4 border-white ring-1 ring-gray-200">
                {selectedFile?.type.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-black/50 backdrop-blur-xl"
                  />
                ) : (
                  <video src={preview} controls className="w-full h-64 object-contain bg-black" />
                )}

                {/* File Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-2">
                  {selectedFile?.type.startsWith("image/") ? <ImageIcon size={12} /> : <Film size={12} />}
                  <span className="font-mono dir-ltr">
                    {((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              </div>

              {/* Action Buttons: Skeuomorphic 3D Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 
                             border-b-4 border-gray-300 hover:bg-gray-200 active:border-b-0 active:translate-y-1 active:mt-1
                             transition-all duration-100"
                >
                  <RefreshCw size={18} />
                  تغییر فایل
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white 
                             bg-gradient-to-b from-[#3399ff] to-[#007acc] 
                             border-b-4 border-[#005c99] 
                             shadow-[0_4px_10px_rgba(0,122,204,0.3)]
                             hover:brightness-110
                             active:border-b-0 active:translate-y-1 active:mt-1 active:shadow-none
                             disabled:opacity-70 disabled:cursor-not-allowed
                             transition-all duration-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>در حال آپلود...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      <span>انتشار استوری</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message: Engraved Plate */}
          {error && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 shadow-[inset_2px_2px_5px_rgba(220,38,38,0.05)] flex items-start gap-3">
              <div className="p-1 bg-red-100 rounded-full text-red-600 mt-0.5">
                <X size={14} strokeWidth={3} />
              </div>
              <p className="text-red-600 text-sm font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {/* Footer Guidelines */}
          <div className="pt-4 border-t border-gray-200/60">
            <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
              <span>مدت نمایش: ۲۴ ساعت</span>
              <span>حداکثر حجم: ۵۰ مگابایت</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
