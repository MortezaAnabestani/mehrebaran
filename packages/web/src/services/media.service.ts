import api from "@/lib/api";
import type {
  IMedia,
  IMediaGallery,
  MediaType,
  MediaCategory,
  IMediaUploadOptions,
  IMediaUploadResult,
} from "@mehrebaran/common-types";

// ===========================
// Request Types
// ===========================

export interface GetMediaParams {
  type?: MediaType;
  category?: MediaCategory;
  uploadedBy?: string;
  isPublic?: boolean;
  limit?: number;
  skip?: number;
}

export interface GetMediaGalleriesParams {
  owner?: string;
  isPublic?: boolean;
  category?: string;
  limit?: number;
  skip?: number;
}

// ===========================
// Response Types
// ===========================

export interface GetMediaResponse {
  success: boolean;
  data: IMedia[];
  message: string;
  total?: number;
}

export interface GetMediaByIdResponse {
  success: boolean;
  data: IMedia;
  message: string;
}

export interface UploadMediaResponse {
  success: boolean;
  data: IMediaUploadResult;
  message: string;
}

export interface DeleteMediaResponse {
  success: boolean;
  message: string;
}

export interface GetMediaGalleriesResponse {
  success: boolean;
  data: IMediaGallery[];
  message: string;
  total?: number;
}

export interface GetMediaGalleryByIdResponse {
  success: boolean;
  data: IMediaGallery;
  message: string;
}

export interface CreateMediaGalleryResponse {
  success: boolean;
  data: IMediaGallery;
  message: string;
}

// ===========================
// Media Service Class
// ===========================

class MediaService {
  // ===========================
  // Fetch Media
  // ===========================

  /**
   * Get all media with optional filters
   */
  public async getMedia(params?: GetMediaParams): Promise<GetMediaResponse> {
    const response = await api.get("/media", { params });
    return response.data;
  }

  /**
   * Get current user's media
   */
  public async getMyMedia(params?: GetMediaParams): Promise<GetMediaResponse> {
    const response = await api.get("/media/my", { params });
    return response.data;
  }

  /**
   * Get media by ID
   */
  public async getMediaById(id: string): Promise<GetMediaByIdResponse> {
    const response = await api.get(`/media/${id}`);
    return response.data;
  }

  /**
   * Get media by user ID
   */
  public async getUserMedia(
    userId: string,
    params?: GetMediaParams
  ): Promise<GetMediaResponse> {
    const response = await api.get(`/media/user/${userId}`, { params });
    return response.data;
  }

  /**
   * Get media by category
   */
  public async getMediaByCategory(
    category: MediaCategory,
    limit: number = 20
  ): Promise<GetMediaResponse> {
    const response = await api.get("/media", {
      params: { category, limit },
    });
    return response.data;
  }

  /**
   * Get media by type
   */
  public async getMediaByType(
    type: MediaType,
    limit: number = 20
  ): Promise<GetMediaResponse> {
    const response = await api.get("/media", {
      params: { type, limit },
    });
    return response.data;
  }

  // ===========================
  // Upload & Delete
  // ===========================

  /**
   * Upload a single file
   */
  public async uploadFile(
    file: File,
    options: IMediaUploadOptions
  ): Promise<UploadMediaResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", options.category);

    if (options.relatedModel) {
      formData.append("relatedModel", options.relatedModel);
    }
    if (options.relatedId) {
      formData.append("relatedId", options.relatedId);
    }
    if (options.isPublic !== undefined) {
      formData.append("isPublic", String(options.isPublic));
    }
    if (options.altText) {
      formData.append("altText", options.altText);
    }
    if (options.caption) {
      formData.append("caption", options.caption);
    }
    if (options.processImages !== undefined) {
      formData.append("processImages", String(options.processImages));
    }
    if (options.generateThumbnails !== undefined) {
      formData.append("generateThumbnails", String(options.generateThumbnails));
    }

    const response = await api.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Upload multiple files
   */
  public async uploadFiles(
    files: File[],
    options: IMediaUploadOptions
  ): Promise<UploadMediaResponse[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, options)
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Delete media
   */
  public async deleteMedia(id: string): Promise<DeleteMediaResponse> {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  }

  /**
   * Delete multiple media
   */
  public async deleteMultipleMedia(ids: string[]): Promise<DeleteMediaResponse> {
    const response = await api.post("/media/delete-multiple", { ids });
    return response.data;
  }

  // ===========================
  // Media Galleries
  // ===========================

  /**
   * Get all galleries
   */
  public async getMediaGalleries(
    params?: GetMediaGalleriesParams
  ): Promise<GetMediaGalleriesResponse> {
    const response = await api.get("/media/galleries", { params });
    return response.data;
  }

  /**
   * Get current user's galleries
   */
  public async getMyGalleries(): Promise<GetMediaGalleriesResponse> {
    const response = await api.get("/media/galleries/my");
    return response.data;
  }

  /**
   * Get gallery by ID
   */
  public async getGalleryById(
    id: string
  ): Promise<GetMediaGalleryByIdResponse> {
    const response = await api.get(`/media/galleries/${id}`);
    return response.data;
  }

  /**
   * Create a new gallery
   */
  public async createGallery(data: {
    title: string;
    description?: string;
    isPublic?: boolean;
    category?: string;
    tags?: string[];
  }): Promise<CreateMediaGalleryResponse> {
    const response = await api.post("/media/galleries", data);
    return response.data;
  }

  /**
   * Add media to gallery
   */
  public async addMediaToGallery(
    galleryId: string,
    mediaIds: string[]
  ): Promise<GetMediaGalleryByIdResponse> {
    const response = await api.post(`/media/galleries/${galleryId}/media`, {
      mediaIds,
    });
    return response.data;
  }

  /**
   * Remove media from gallery
   */
  public async removeMediaFromGallery(
    galleryId: string,
    mediaId: string
  ): Promise<GetMediaGalleryByIdResponse> {
    const response = await api.delete(
      `/media/galleries/${galleryId}/media/${mediaId}`
    );
    return response.data;
  }

  /**
   * Delete gallery
   */
  public async deleteGallery(id: string): Promise<DeleteMediaResponse> {
    const response = await api.delete(`/media/galleries/${id}`);
    return response.data;
  }

  // ===========================
  // Helper Methods
  // ===========================

  /**
   * Get media type icon
   */
  public getMediaTypeIcon(type: MediaType): string {
    const icons: Record<MediaType, string> = {
      image: "🖼️",
      video: "🎥",
      audio: "🎵",
      document: "📄",
      file: "📎",
    };
    return icons[type];
  }

  /**
   * Get media type label
   */
  public getMediaTypeLabel(type: MediaType): string {
    const labels: Record<MediaType, string> = {
      image: "تصویر",
      video: "ویدئو",
      audio: "صوت",
      document: "سند",
      file: "فایل",
    };
    return labels[type];
  }

  /**
   * Get category label
   */
  public getCategoryLabel(category: MediaCategory): string {
    const labels: Record<MediaCategory, string> = {
      profile: "پروفایل",
      cover: "کاور",
      need: "نیاز",
      story: "استوری",
      message: "پیام",
      comment: "کامنت",
      gallery: "گالری",
      document: "سند",
    };
    return labels[category];
  }

  /**
   * Format file size
   */
  public formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 بایت";

    const k = 1024;
    const sizes = ["بایت", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Validate file type
   */
  public validateFileType(file: File, allowedTypes: MediaType[]): boolean {
    const typeMap: Record<string, MediaType> = {
      "image/": "image",
      "video/": "video",
      "audio/": "audio",
      "application/pdf": "document",
      "application/msword": "document",
      "application/vnd.": "document",
    };

    for (const [mimePrefix, mediaType] of Object.entries(typeMap)) {
      if (file.type.startsWith(mimePrefix)) {
        return allowedTypes.includes(mediaType);
      }
    }

    return allowedTypes.includes("file");
  }

  /**
   * Validate file size
   */
  public validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  /**
   * Get file extension
   */
  public getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  }

  /**
   * Generate thumbnail URL for video
   */
  public getVideoThumbnail(media: IMedia): string {
    if (media.metadata.thumbnail) {
      return media.metadata.thumbnail;
    }
    if (media.metadata.thumbnailMedium) {
      return media.metadata.thumbnailMedium;
    }
    return media.url;
  }
}

// Export singleton instance
const mediaService = new MediaService();
export default mediaService;
