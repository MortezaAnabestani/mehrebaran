import { Request, Response } from "express";
import { authorService } from "./author.service";
import { createAuthorSchema, updateAuthorSchema } from "./author.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class AuthorController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createAuthorSchema.parse({ body: req.body });
    const author = await authorService.create(validatedData.body);
    res.status(201).json({ message: "نویسنده با موفقیت ایجاد شد.", data: author });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await authorService.findAll(req.query);
    res.status(200).json(result);
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const author = await authorService.findOne(req.params.identifier);
    if (!author) {
      throw new ApiError(404, "نویسنده یافت نشد.");
    }
    res.status(200).json({ data: author });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateAuthorSchema.parse({ body: req.body, params: req.params });
    const author = await authorService.update(req.params.identifier, validatedData.body);
    if (!author) {
      throw new ApiError(404, "نویسنده یافت نشد.");
    }
    res.status(200).json({ message: "نویسنده با موفقیت به‌روزرسانی شد.", data: author });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const deletedAuthor = await authorService.delete(req.params.identifier);
    if (!deletedAuthor) {
      throw new ApiError(404, "نویسنده یافت نشد.");
    }
    res.status(200).json({ message: "نویسنده با موفقیت حذف شد." });
  });
}

export const authorController = new AuthorController();
