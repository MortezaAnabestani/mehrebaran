import { Request, Response } from "express";
import { supporterMessageService } from "./supporterMessage.service";
import { createMessageSchema, likeMessageSchema } from "./supporterMessage.validation";
import asyncHandler from "../../../core/utils/asyncHandler";

class SupporterMessageController {
  public create = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const { content, parentMessage } = createMessageSchema.parse({ body: req.body, params: req.params }).body;
    const author = req.user!._id;

    const message = await supporterMessageService.create({ content, author, need: needId, parentMessage });
    res.status(201).json({ message: "پیام شما با موفقیت ثبت شد.", data: message });
  });

  public getAllForNeed = asyncHandler(async (req: Request, res: Response) => {
    const messages = await supporterMessageService.findByNeed(req.params.needId);
    res.status(200).json({ data: messages });
  });

  public toggleLike = asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = likeMessageSchema.parse({ params: req.params }).params;
    const author = req.user!._id;

    const message = await supporterMessageService.toggleLike(messageId, author);
    res
      .status(200)
      .json({ message: "عملیات لایک با موفقیت انجام شد.", data: { likesCount: message.likes.length } });
  });
}

export const supporterMessageController = new SupporterMessageController();
