import asyncHandler from "../../core/utils/asyncHandler";
import { Request, Response } from "express";
import { pollService } from "./poll.service";
import { createPollSchema, voteOnPollSchema } from "./poll.validation";
import { getParam } from "../../core/utils/getParam";

class PollController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const { body } = createPollSchema.parse({ body: req.body, params: req.params });
    const poll = await pollService.create(getParam(needId), body);
    res.status(201).json({ message: "نظرسنجی با موفقیت ایجاد شد.", data: poll });
  });

  getAllForNeed = asyncHandler(async (req: Request, res: Response) => {
    const polls = await pollService.findByNeed(getParam(req.params.needId));
    res.status(200).json({ data: polls });
  });

  vote = asyncHandler(async (req: Request, res: Response) => {
    const { pollId, optionId } = voteOnPollSchema.parse({ params: req.params }).params;
    const poll = await pollService.vote(pollId, optionId, req.user!._id.toString());
    res.status(200).json({ message: "رأی شما با موفقیت ثبت شد.", data: poll });
  });
}

export const pollController = new PollController();
