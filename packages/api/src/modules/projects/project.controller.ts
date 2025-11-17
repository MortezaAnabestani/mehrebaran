import { Request, Response } from "express";
import { projectService } from "./project.service";
import { createProjectSchema, updateProjectSchema } from "./project.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";
import { CategoryModel } from "../categories/category.model";

class ProjectController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    let validatedData;
    try {
      validatedData = createProjectSchema.parse({ body: req.body });
    } catch (error: any) {
      console.error("❌ Validation error:", error.errors || error);
      throw new ApiError(400, "داده‌های ورودی نامعتبر است.", error.errors);
    }

    // Transform data to match model requirements
    const projectData: any = { ...validatedData.body };

    // Build seo object from metaTitle and metaDescription
    projectData.seo = {
      metaTitle: projectData.metaTitle || projectData.title,
      metaDescription: projectData.metaDescription || projectData.excerpt || "",
    };
    delete projectData.metaTitle;
    delete projectData.metaDescription;

    // Add featuredImage from processed file upload (handled by middleware)
    console.log("🖼️ req.processedFiles:", req.processedFiles);
    if (req.processedFiles) {
      projectData.featuredImage = req.processedFiles;
      console.log("✅ Added featuredImage to projectData:", projectData.featuredImage);
    } else {
      console.log("⚠️ No processedFiles found");
    }

    // Convert category slug to ObjectId (create if not exists)
    if (projectData.category && typeof projectData.category === "string") {
      let category = await CategoryModel.findOne({ slug: projectData.category });

      // Auto-create category if it doesn't exist
      if (!category) {
        const categoryNames: Record<string, string> = {
          health: "بهداشت و سلامت",
          education: "آموزش",
          housing: "مسکن",
          food: "غذا",
          clothing: "پوشاک",
          other: "سایر"
        };

        category = await CategoryModel.create({
          name: categoryNames[projectData.category] || projectData.category,
          slug: projectData.category,
          description: `دسته‌بندی ${categoryNames[projectData.category] || projectData.category}`,
        });
      }

      projectData.category = category._id;
    }

    const project = await projectService.create(projectData);
    res.status(201).json({ message: "پروژه با موفقیت ایجاد شد.", data: project });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const projects = await projectService.findAll(req.query);
    res.status(200).json({ results: projects.length, data: projects });
  });

  public getOne = asyncHandler(async (req: Request, res: Response) => {
    const { identifier } = req.params;
    const project = await projectService.findOne(identifier);
    if (!project) {
      throw new ApiError(404, "پروژه مورد نظر یافت نشد.");
    }
    res.status(200).json({ data: project });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateProjectSchema.parse({ body: req.body, params: req.params });
    const project = await projectService.update(validatedData.params.id, validatedData.body);
    if (!project) {
      throw new ApiError(404, "پروژه مورد نظر یافت نشد.");
    }
    res.status(200).json({ message: "پروژه با موفقیت به‌روزرسانی شد.", data: project });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await projectService.findOne(id);
    if (!project) {
      throw new ApiError(404, "پروژه مورد نظر یافت نشد.");
    }
    await projectService.delete(id);
    res.status(200).json({ message: "پروژه با موفقیت حذف شد." });
  });
  public incrementView = asyncHandler(async (req: Request, res: Response) => {
    await projectService.incrementViews(req.params.id);
    res.status(200).json({ message: "View count incremented." });
  });
}

export const projectController = new ProjectController();
