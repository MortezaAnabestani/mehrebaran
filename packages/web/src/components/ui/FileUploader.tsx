"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OptimizedImage from "./OptimizedImage";

interface FileWithPreview {
  file: File;
  preview: string;
  type: "image" | "video" | "audio" | "document";
}

interface FileUploaderProps {
  value: FileWithPreview[];
  onChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ["image/*", "video/*", "audio/*", ".pdf", ".doc", ".docx"],
  label,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): "image" | "video" | "audio" | "document" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "document";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return "/icons/image.svg";
      case "video":
        return "/icons/video.svg";
      case "audio":
        return "/icons/music.svg";
      case "document":
        return "/icons/paper.svg";
      default:
        return "/icons/attach.svg";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const filesArray = Array.from(files);
    const validFiles: FileWithPreview[] = [];

    filesArray.forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`فایل ${file.name} بیش از ${maxSize}MB است`);
        return;
      }

      // Check max files
      if (value.length + validFiles.length >= maxFiles) {
        alert(`حداکثر ${maxFiles} فایل می‌توانید آپلود کنید`);
        return;
      }

      const fileType = getFileType(file);
      const fileWithPreview: FileWithPreview = {
        file,
        preview: URL.createObjectURL(file),
        type: fileType,
      };

      validFiles.push(fileWithPreview);
    });

    onChange([...value, ...validFiles]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold mb-2">{label}</label>}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging ? "border-mblue bg-mblue/5 scale-105" : "border-gray-300 hover:border-mblue/50"
        }`}
      >
        <OptimizedImage
          src="/icons/attach.svg"
          alt="download icon"
          width={18}
          height={18}
          className="inline-block"
        />{" "}
        <p className="text-gray-600 mb-2 font-bold">فایل‌های خود را اینجا رها کنید</p>
        <p className="text-sm text-gray-500 mb-4">یا روی دکمه زیر کلیک کنید</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-mblue text-white rounded-lg hover:bg-mblue/90 transition-colors"
        >
          انتخاب فایل
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-xs text-gray-400 mt-4">
          فرمت‌های مجاز: تصویر، ویدیو، صدا، PDF | حداکثر حجم: {maxSize}MB | حداکثر تعداد: {maxFiles} فایل
        </p>
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm">فایل‌های انتخاب شده ({value.length})</h4>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-red-500 hover:text-red-700"
            >
              حذف همه
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {value.map((fileWithPreview, index) => (
                <motion.div
                  key={fileWithPreview.preview}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    {/* Preview */}
                    {fileWithPreview.type === "image" && (
                      <OptimizedImage
                        src={fileWithPreview.preview}
                        alt={fileWithPreview.file.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    )}

                    {fileWithPreview.type === "video" && (
                      <video src={fileWithPreview.preview} className="w-full h-full object-cover" muted />
                    )}

                    {(fileWithPreview.type === "audio" || fileWithPreview.type === "document") && (
                      <div className="w-full h-full flex items-center justify-center">
                        <OptimizedImage
                          src={getFileIcon(fileWithPreview.type)}
                          alt="download icon"
                          width={18}
                          height={18}
                          className="inline-block"
                        />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center text-xl"
                      >
                        ×
                      </button>
                    </div>

                    {/* File Type Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-bold">
                      {fileWithPreview.type === "image" && "تصویر"}
                      {fileWithPreview.type === "video" && "ویدیو"}
                      {fileWithPreview.type === "audio" && "صدا"}
                      {fileWithPreview.type === "document" && "سند"}
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="mt-2">
                    <p className="text-xs font-bold truncate" title={fileWithPreview.file.name}>
                      {fileWithPreview.file.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(fileWithPreview.file.size)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Helpful Tips */}
      <div className="mt-4 bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
        <p className="font-bold mb-2">💡 نکات مهم:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>افزودن تصاویر واضح، اعتبار نیاز شما را افزایش می‌دهد</li>
          <li>ویدیوهای کوتاه توضیحی می‌توانند تأثیرگذار باشند</li>
          <li>اسناد پشتیبان (مدارک، نامه‌ها) احتمال تأیید را بیشتر می‌کند</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;
