export interface IImageUploadCenter {
  _id: string;
  title: string;
  imageUrl: string;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IImageUploadCenterModel extends Document, IImageUploadCenter {}
