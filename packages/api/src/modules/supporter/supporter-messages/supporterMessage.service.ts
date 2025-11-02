import { SupporterMessageModel } from "./supporterMessage.model";
import { ISupporterMessage } from "common-types";
import { Types } from "mongoose";
import ApiError from "../../../core/utils/apiError";

class SupporterMessageService {
  public async create(data: {
    content: string;
    author: string;
    need: string;
    parentMessage?: string;
  }): Promise<ISupporterMessage> {
    const message = await SupporterMessageModel.create(data);
    return message.populate({ path: "author", select: "name" });
  }

  public async findByNeed(needId: string): Promise<ISupporterMessage[]> {
    return SupporterMessageModel.find({ need: needId })
      .populate({ path: "author", select: "name" })
      .sort({ createdAt: "asc" });
  }

  public async toggleLike(messageId: string, userId: string): Promise<ISupporterMessage> {
    const message = await SupporterMessageModel.findById(messageId);
    if (!message) throw new ApiError(404, "پیام یافت نشد.");

    // Find like index by comparing string IDs
    const likeIndex = message.likes.findIndex((id) => id.toString() === userId);

    if (likeIndex > -1) {
      // Remove like
      message.likes.splice(likeIndex, 1);
    } else {
      // Add like
      message.likes.push(new Types.ObjectId(userId) as any);
    }

    await message.save();
    return message;
  }
}

export const supporterMessageService = new SupporterMessageService();
