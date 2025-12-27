import { ImageUploadCenterModel } from "./image-upload-center.model";
import { IImageUploadCenter } from "common-types";

class ImageUploadCenterService {
  public async createImage(imageData: Partial<IImageUploadCenter>): Promise<IImageUploadCenter> {
    const image = await ImageUploadCenterModel.create(imageData);
    return image;
  }

  public async findAllImages(): Promise<IImageUploadCenter[]> {
    return ImageUploadCenterModel.find().sort({ createdAt: -1 }).populate("uploadedBy", "name");
  }

  public async findImageById(id: string): Promise<IImageUploadCenter | null> {
    return ImageUploadCenterModel.findById(id).populate("uploadedBy", "name");
  }

  public async deleteImage(id: string): Promise<IImageUploadCenter | null> {
    return ImageUploadCenterModel.findByIdAndDelete(id);
  }
}

export const imageUploadCenterService = new ImageUploadCenterService();
