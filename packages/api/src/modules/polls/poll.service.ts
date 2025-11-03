import { PollModel } from "./poll.model";
import { IPoll } from "common-types";
import ApiError from "../../core/utils/apiError";
import { Types } from "mongoose";

class PollService {
  public async create(
    needId: string,
    data: { question: string; options: string[]; expiresAt?: Date }
  ): Promise<IPoll> {
    const options = data.options.map((text) => ({ text, votes: [] }));
    return PollModel.create({ ...data, options, need: needId });
  }

  public async findByNeed(needId: string): Promise<IPoll[]> {
    return PollModel.find({ need: needId }).sort({ createdAt: -1 });
  }

  public async vote(pollId: string, optionId: string, userId: string): Promise<IPoll> {
    const poll = await PollModel.findById(pollId);
    if (!poll) throw new ApiError(404, "نظرسنجی یافت نشد.");

    if (poll.expiresAt && poll.expiresAt < new Date()) {
      throw new ApiError(400, "زمان شرکت در این نظرسنجی به پایان رسیده است.");
    }

    // Check if user has already voted
    const hasVoted = poll.options.some((opt) =>
      opt.votes.some((voterId) => voterId.toString() === userId)
    );
    if (hasVoted) {
      throw new ApiError(409, "شما قبلاً در این نظرسنجی شرکت کرده‌اید.");
    }

    // Find the option by comparing string IDs
    const option = poll.options.find((opt) => opt._id.toString() === optionId);
    if (!option) throw new ApiError(404, "گزینه مورد نظر یافت نشد.");

    option.votes.push(new Types.ObjectId(userId) as any);
    await poll.save();
    return poll;
  }
}

export const pollService = new PollService();
