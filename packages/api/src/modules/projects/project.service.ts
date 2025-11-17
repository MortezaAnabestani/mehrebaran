import { IProject, IResponsiveImage } from "common-types";
import { ProjectModel } from "./project.model";
import { Types } from "mongoose";
import ApiFeatures from "../../core/utils/apiFeatures";
import { createProjectSchema } from "./project.validation";
import { z } from "zod";
import fs from "fs";
import path from "path";

type CreateProjectData = z.infer<typeof createProjectSchema>["body"];
type UpdateProjectData = Partial<CreateProjectData> & {
  gallery?: IResponsiveImage[];
  featuredImage?: IResponsiveImage;
  seo?: { metaTitle: string; metaDescription?: string };
};

class ProjectService {
  public async create(data: CreateProjectData): Promise<IProject> {
    const project = await ProjectModel.create(data);
    return project.populate({ path: "category", select: "name slug" });
  }

  public async findAll(queryString: Record<string, any>): Promise<IProject[]> {
    const features = new ApiFeatures(
      ProjectModel.find().populate({ path: "category", select: "name slug" }),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const projects = await features.query;
    return projects;
  }

  public async findOne(identifier: string): Promise<IProject | null> {
    const isObjectId = Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    return ProjectModel.findOne(query).populate({ path: "category", select: "name slug" });
  }

  public async update(id: string, data: UpdateProjectData): Promise<IProject | null> {
    if (data.gallery || data.featuredImage) {
      const currentProject = await ProjectModel.findById(id).select("gallery featuredImage");
      if (currentProject) {
        if (data.gallery) {
          const newImageUrls = new Set(data.gallery.map((img) => img.desktop));
          currentProject.gallery.forEach((oldImage) => {
            if (!newImageUrls.has(oldImage.desktop)) {
              this.deleteImageFiles(oldImage);
            }
          });
        }
        if (data.featuredImage && currentProject.featuredImage.desktop !== data.featuredImage.desktop) {
          this.deleteImageFiles(currentProject.featuredImage);
        }
      }
    }
    return ProjectModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate({
      path: "category",
      select: "name slug",
    });
  }

  public async delete(id: string): Promise<void> {
    const projectToDelete = await ProjectModel.findById(id);

    if (projectToDelete) {
      this.deleteImageFiles(projectToDelete.featuredImage);

      projectToDelete.gallery.forEach((image) => {
        this.deleteImageFiles(image);
      });

      await ProjectModel.findByIdAndDelete(id);
    }
  }

  private deleteImageFiles(image: IResponsiveImage) {
    if (!image || !image.desktop || !image.mobile) return;

    try {
      const publicFolderPath = path.join(__dirname, "../../../public");

      const desktopPath = path.join(publicFolderPath, image.desktop);
      const mobilePath = path.join(publicFolderPath, image.mobile);

      if (fs.existsSync(desktopPath)) {
        fs.unlinkSync(desktopPath);
        console.log(`DELETED: ${desktopPath}`);
      }
      if (fs.existsSync(mobilePath)) {
        fs.unlinkSync(mobilePath);
        console.log(`DELETED: ${mobilePath}`);
      }
    } catch (error) {
      console.error(`Error deleting image files for desktop URL ${image.desktop}:`, error);
    }
  }

  public async incrementViews(id: string): Promise<void> {
    await ProjectModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
}

export const projectService = new ProjectService();
