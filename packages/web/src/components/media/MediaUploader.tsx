"use client";

import React, { useState, useRef } from "react";
import type { MediaType, MediaCategory } from "@mehrebaran/common-types";
import mediaService from "@/services/media.service";
import SmartButton from "@/components/ui/SmartButton";

// ===========================
// Types & Interfaces
// ===========================

export interface MediaUploaderProps {
  category: MediaCategory;
  allowedTypes?: MediaType[];
  maxSize?: number; // bytes
  maxFiles?: number;
  multiple?: boolean;
  onUploadComplete?: (mediaIds: string[]) => void;
  onUploadError?: (error: string) => void;
  generateThumbnails?: boolean;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  mediaId?: string;
  previewUrl?: string;
}

// ===========================
// MediaUploader Component
// ===========================

/**
 * A drag-and-drop media uploader component
 * Supports multiple files, preview, and progress tracking
 */
const MediaUploader: React.FC<MediaUploaderProps> = ({
  category,
  allowedTypes = ["image", "video", "audio", "document", "file"],
  maxSize = 50 * 1024 * 1024, // 50MB default
  maxFiles = 10,
  multiple = true,
  onUploadComplete,
  onUploadError,
  generateThumbnails = true,
  className = "",
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===========================
  // File Validation
  // ===========================

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!mediaService.validateFileType(file, allowedTypes)) {
      return `نوع فایل ${file.name} مجاز نیست.`;
    }

    // Check file size
    if (!mediaService.validateFileSize(file, maxSize)) {
      return `حجم فایل ${file.name} بیشتر از حد مجاز است (حداکثر ${mediaService.formatFileSize(maxSize)}).`;
    }

    return null;
  };

  // ===========================
  // File Upload
  // ===========================

  const uploadFile = async (uploadingFile: UploadingFile) => {
    try {
      // Update status to uploading
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.file === uploadingFile.file
            ? { ...f, status: "uploading" as const, progress: 0 }
            : f
        )
      );

      // Upload file
      const response = await mediaService.uploadFile(uploadingFile.file, {
        category,
        isPublic: true,
        generateThumbnails,
      });

      // Update status to completed
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.file === uploadingFile.file
            ? {
                ...f,
                status: "completed" as const,
                progress: 100,
                mediaId: response.data.media._id,
              }
            : f
        )
      );

      return response.data.media._id;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "خطا در آپلود فایل";

      // Update status to error
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.file === uploadingFile.file
            ? { ...f, status: "error" as const, error: errorMessage }
            : f
        )
      );

      if (onUploadError) {
        onUploadError(errorMessage);
      }

      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Check max files limit
    if (uploadingFiles.length + fileArray.length > maxFiles) {
      if (onUploadError) {
        onUploadError(`حداکثر ${maxFiles} فایل می‌توانید آپلود کنید.`);
      }
      return;
    }

    // Validate and create preview URLs
    const newUploadingFiles: UploadingFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        if (onUploadError) {
          onUploadError(error);
        }
        continue;
      }

      // Create preview URL for images
      let previewUrl: string | undefined;
      if (file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      }

      newUploadingFiles.push({
        file,
        progress: 0,
        status: "pending",
        previewUrl,
      });
    }

    if (newUploadingFiles.length === 0) {
      return;
    }

    // Add to state
    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    // Upload files
    const uploadPromises = newUploadingFiles.map((f) => uploadFile(f));
    const mediaIds = await Promise.all(uploadPromises);

    // Filter out null values (failed uploads)
    const successfulMediaIds = mediaIds.filter(
      (id): id is string => id !== null
    );

    if (successfulMediaIds.length > 0 && onUploadComplete) {
      onUploadComplete(successfulMediaIds);
    }
  };

  // ===========================
  // Event Handlers
  // ===========================

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (file: File) => {
    setUploadingFiles((prev) => {
      const fileToRemove = prev.find((f) => f.file === file);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.file !== file);
    });
  };

  const handleClearAll = () => {
    // Revoke all preview URLs
    uploadingFiles.forEach((f) => {
      if (f.previewUrl) {
        URL.revokeObjectURL(f.previewUrl);
      }
    });
    setUploadingFiles([]);
  };

  // ===========================
  // Cleanup
  // ===========================

  React.useEffect(() => {
    return () => {
      // Cleanup preview URLs on unmount
      uploadingFiles.forEach((f) => {
        if (f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl);
        }
      });
    };
  }, []);

  // ===========================
  // Render
  // ===========================

  const hasFiles = uploadingFiles.length > 0;
  const completedCount = uploadingFiles.filter(
    (f) => f.status === "completed"
  ).length;
  const errorCount = uploadingFiles.filter((f) => f.status === "error").length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-mblue bg-blue-50"
            : "border-gray-300 hover:border-mblue hover:bg-gray-50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          accept={allowedTypes
            .map((type) => {
              if (type === "image") return "image/*";
              if (type === "video") return "video/*";
              if (type === "audio") return "audio/*";
              if (type === "document")
                return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";
              return "*";
            })
            .join(",")}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-4xl">
            📁
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-1">
              فایل‌ها را اینجا بکشید یا کلیک کنید
            </p>
            <p className="text-sm text-gray-500">
              حداکثر {maxFiles} فایل با حجم {mediaService.formatFileSize(maxSize)}
            </p>
          </div>
          <SmartButton variant="outline" size="sm">
            انتخاب فایل
          </SmartButton>
        </div>
      </div>

      {/* Files List */}
      {hasFiles && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              فایل‌های انتخاب شده ({uploadingFiles.length})
            </h3>
            <SmartButton
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              پاک کردن همه
            </SmartButton>
          </div>

          <div className="space-y-2">
            {uploadingFiles.map((uploadingFile, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {uploadingFile.previewUrl ? (
                    <img
                      src={uploadingFile.previewUrl}
                      alt={uploadingFile.file.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-2xl">
                      📄
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {uploadingFile.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {mediaService.formatFileSize(uploadingFile.file.size)}
                    </p>

                    {/* Progress */}
                    {uploadingFile.status === "uploading" && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-mblue transition-all duration-300"
                            style={{ width: `${uploadingFile.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    {uploadingFile.status === "completed" && (
                      <p className="text-sm text-green-600 mt-1">✓ آپلود موفق</p>
                    )}
                    {uploadingFile.status === "error" && (
                      <p className="text-sm text-red-600 mt-1">
                        ✗ {uploadingFile.error}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFile(uploadingFile.file)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    disabled={uploadingFile.status === "uploading"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-green-600">✓ {completedCount} موفق</div>
            {errorCount > 0 && (
              <div className="text-red-600">✗ {errorCount} ناموفق</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
