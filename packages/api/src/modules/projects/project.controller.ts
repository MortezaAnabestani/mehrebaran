import { Request, Response } from "express";
import { projectService } from "./project.service";
import { createProjectSchema, updateProjectSchema } from "./project.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class ProjectController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createProjectSchema.parse({ body: req.body });
    const project = await projectService.create(validatedData.body);
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
