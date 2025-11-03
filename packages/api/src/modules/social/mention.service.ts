import { MentionModel } from "./mention.model";
import { IMention, MentionContext } from "common-types";
import { Types } from "mongoose";

class MentionService {
  // Create a mention
  public async createMention(data: {
    mentionedUser: string;
    mentionedBy: string;
    context: MentionContext;
    contextId: string;
    relatedModel: string;
    relatedId: string;
    text?: string;
  }): Promise<IMention> {
    const mention = await MentionModel.create({
      mentionedUser: new Types.ObjectId(data.mentionedUser),
      mentionedBy: new Types.ObjectId(data.mentionedBy),
      context: data.context,
      contextId: data.contextId,
      relatedModel: data.relatedModel,
      relatedId: data.relatedId,
      text: data.text,
      isRead: false,
    });

    await mention.populate("mentionedUser", "name email");
    await mention.populate("mentionedBy", "name email");
    return mention;
  }

  // Parse mentions from text and create them
  public async parseMentionsFromText(
    text: string,
    mentionedBy: string,
    context: MentionContext,
    contextId: string,
    relatedModel: string,
    relatedId: string
  ): Promise<IMention[]> {
    // Match @username or @userId patterns
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);

    if (!matches || matches.length === 0) {
      return [];
    }

    const mentions: IMention[] = [];

    // Import User model
    const { model } = await import("mongoose");
    const UserModel = model("User");

    for (const match of matches) {
      const username = match.substring(1); // Remove @

      // Try to find user by username or ID
      const user = await UserModel.findOne({
        $or: [{ name: new RegExp(`^${username}$`, "i") }, { _id: username }],
      });

      if (user && user._id.toString() !== mentionedBy) {
        // Don't mention self
        const mention = await this.createMention({
          mentionedUser: user._id.toString(),
          mentionedBy,
          context,
          contextId,
          relatedModel,
          relatedId,
          text: text.substring(0, 100), // First 100 chars
        });

        mentions.push(mention);
      }
    }

    return mentions;
  }

  // Get user's mentions
  public async getUserMentions(
    userId: string,
    filters?: {
      isRead?: boolean;
      context?: MentionContext;
    },
    limit: number = 50,
    skip: number = 0
  ): Promise<IMention[]> {
    const query: any = { mentionedUser: userId };

    if (filters?.isRead !== undefined) {
      query.isRead = filters.isRead;
    }

    if (filters?.context) {
      query.context = filters.context;
    }

    const mentions = await MentionModel.find(query)
      .populate("mentionedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return mentions;
  }

  // Mark mention as read
  public async markAsRead(mentionId: string, userId: string): Promise<IMention | null> {
    const mention = await MentionModel.findOne({
      _id: mentionId,
      mentionedUser: userId,
    });

    if (!mention) {
      return null;
    }

    mention.isRead = true;
    await mention.save();

    return mention;
  }

  // Mark all mentions as read
  public async markAllAsRead(userId: string): Promise<number> {
    const result = await MentionModel.updateMany({ mentionedUser: userId, isRead: false }, { isRead: true });

    return result.modifiedCount;
  }

  // Get unread mention count
  public async getUnreadCount(userId: string): Promise<number> {
    return MentionModel.countDocuments({
      mentionedUser: userId,
      isRead: false,
    });
  }

  // Delete mention
  public async deleteMention(mentionId: string): Promise<void> {
    await MentionModel.findByIdAndDelete(mentionId);
  }

  // Get mentions for a specific context item
  public async getMentionsForContext(contextId: string, context: MentionContext): Promise<IMention[]> {
    return MentionModel.find({
      contextId,
      context,
    }).populate(["mentionedUser", "mentionedBy"], "name email");
  }
}

export const mentionService = new MentionService();
