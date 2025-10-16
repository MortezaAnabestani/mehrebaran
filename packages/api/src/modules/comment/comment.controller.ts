import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { createCommentSchema, updateCommentSchema } from "./comment.validation";
import { CommentStatus } from "common-types";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class CommentController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    let commentPayload = { ...req.body };
    if (req.user) {
      commentPayload.author = req.user._id;
    } else {
      if (!commentPayload.guestName || !commentPayload.guestEmail) {
        throw new ApiError(400, "برای ثبت نظر به عنوان مهمان، نام و ایمیل الزامی است.");
      }
    }
    const validatedData = createCommentSchema.parse({ body: commentPayload });
    const comment = await commentService.create(validatedData.body);
    res
      .status(201)
      .json({ message: "نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.", data: comment });
  });

  public getByPost = asyncHandler(async (req: Request, res: Response) => {
    const comments = await commentService.findByPost(req.params.postId);
    res.status(200).json({ data: comments });
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const filter: { status?: CommentStatus } = {};
    const { status } = req.query;

    if (status && Object.values(CommentStatus).includes(status as CommentStatus)) {
      filter.status = status as CommentStatus;
    }

    const comments = await commentService.findAll(filter);
    res.status(200).json({ data: comments });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateCommentSchema.parse({ body: req.body, params: req.params });
    const comment = await commentService.update(validatedData.params.id, validatedData.body);
    if (!comment) {
      throw new ApiError(404, "نظر یافت نشد.");
    }
    res.status(200).json({ message: "نظر با موفقیت به‌روزرسانی شد.", data: comment });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const deletedComment = await commentService.delete(req.params.id);
    if (!deletedComment) {
      throw new ApiError(404, "نظر یافت نشد.");
    }
    res.status(200).json({ message: "نظر با موفقیت حذف شد." });
  });
}

export const commentController = new CommentController();
