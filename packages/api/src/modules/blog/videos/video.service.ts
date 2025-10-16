import { IResponsiveImage, IVideo } from "common-types";
import { VideoModel } from "./video.model";
import { Types } from "mongoose";
import ApiFeatures from "../../../core/utils/apiFeatures";
import fs from "fs";
import path from "path";
import { createVideoSchema } from "./video.validation";
import { z } from "zod";

type CreateVideoData = z.infer<typeof createVideoSchema>["body"];
type UpdateVideoData = Partial<CreateVideoData>;

class VideoService {
  public async create(data: CreateVideoData): Promise<IVideo> {
    const video = await VideoModel.create(data);
    return this.populateVideo(video);
  }

  public async findAll(queryString: Record<string, any>): Promise<IVideo[]> {
    const features = new ApiFeatures(VideoModel.find(), queryString).filter().sort().limitFields().paginate();
    features.query = features.query.populate([
      { path: "category", select: "name slug" },
      { path: "cameraman", select: "name slug avatar" },
    ]);
    return features.query;
  }

  public async findOne(identifier: string): Promise<IVideo | null> {
    const isObjectId = Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    const video = await VideoModel.findOne(query);
    if (!video) return null;
    return this.populateVideo(video);
  }

  public async update(id: string, data: UpdateVideoData): Promise<IVideo | null> {
    if (data.coverImage) {
      const currentVideo = await VideoModel.findById(id).select("coverImage");
      if (currentVideo?.coverImage) {
        this.deleteImageFiles(currentVideo.coverImage);
      }
    }
    const updatedVideo = await VideoModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedVideo) return null;
    return this.populateVideo(updatedVideo);
  }

  public async delete(id: string): Promise<void> {
    const videoToDelete = await VideoModel.findById(id);
    if (videoToDelete?.coverImage) {
      this.deleteImageFiles(videoToDelete.coverImage);
    }
    await VideoModel.findByIdAndDelete(id);
  }

  private deleteImageFiles(image: IResponsiveImage) {
    if (!image) return;
    try {
      const publicFolderPath = path.join(__dirname, "../../../../public");
      const desktopPath = path.join(publicFolderPath, image.desktop);
      const mobilePath = path.join(publicFolderPath, image.mobile);
      if (fs.existsSync(desktopPath)) fs.unlinkSync(desktopPath);
      if (fs.existsSync(mobilePath)) fs.unlinkSync(mobilePath);
    } catch (error) {
      console.error(`Error deleting image files for ${image.desktop}:`, error);
    }
  }

  private populateVideo(doc: any): Promise<IVideo> {
    return doc.populate([
      { path: "category", select: "name slug" },
      { path: "tags", select: "name slug" },
      { path: "cameraman", select: "name slug avatar" },
      { path: "relatedVideos", select: "title slug coverImage" },
      { path: "comments" },
    ]);
  }
  public async incrementViews(id: string): Promise<void> {
    await VideoModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
}

export const videoService = new VideoService();
