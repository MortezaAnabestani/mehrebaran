import { ConversationModel } from "./conversation.model";
import { DirectMessageModel } from "./directMessage.model";
import { IConversation, IDirectMessage, ConversationType } from "common-types";
import { Types } from "mongoose";
import ApiError from "../../core/utils/apiError";

class DirectMessageService {
  // Create or get existing conversation
  public async createOrGetConversation(
    needId: string,
    createdBy: string,
    participants: string[],
    type: ConversationType = "one_to_one",
    title?: string
  ): Promise<IConversation> {
    // Ensure creator is in participants
    const allParticipants = Array.from(new Set([createdBy, ...participants]));

    // For one-to-one, check if conversation already exists
    if (type === "one_to_one") {
      if (allParticipants.length !== 2) {
        throw new ApiError(400, "گفتگوی یک به یک فقط باید دو نفر داشته باشد.");
      }

      const existing = await ConversationModel.findOne({
        need: needId,
        type: "one_to_one",
        participants: { $all: allParticipants, $size: 2 },
      });

      if (existing) return existing;
    }

    // Create new conversation
    const conversation = await ConversationModel.create({
      need: needId,
      participants: allParticipants.map((id) => new Types.ObjectId(id)),
      type,
      title,
      createdBy: new Types.ObjectId(createdBy),
    });

    return conversation.populate("participants", "name email");
  }

  // Get user's conversations in a need
  public async getUserConversations(needId: string, userId: string): Promise<any[]> {
    const conversations = await ConversationModel.find({
      need: needId,
      participants: userId,
      isArchived: false,
    })
      .populate("participants", "name email")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    // Calculate unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await DirectMessageModel.countDocuments({
          conversation: conv._id,
          sender: { $ne: userId },
          "readBy.user": { $ne: userId },
          isDeleted: false,
        });

        return {
          ...conv.toObject(),
          unreadCount,
        };
      })
    );

    return conversationsWithUnread;
  }

  // Send a message
  public async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    attachments?: any[],
    replyTo?: string
  ): Promise<IDirectMessage> {
    // Verify sender is participant
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, "گفتگو یافت نشد.");
    }

    const isParticipant = conversation.participants.some((p) => p.toString() === senderId);
    if (!isParticipant) {
      throw new ApiError(403, "شما عضو این گفتگو نیستید.");
    }

    // Create message with sender marked as read
    const message = await DirectMessageModel.create({
      conversation: conversationId,
      sender: senderId,
      content,
      attachments,
      replyTo: replyTo ? new Types.ObjectId(replyTo) : undefined,
      readBy: [{ user: new Types.ObjectId(senderId), readAt: new Date() }],
    });

    return message.populate("sender", "name email");
  }

  // Get messages in a conversation
  public async getMessages(
    conversationId: string,
    userId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<IDirectMessage[]> {
    // Verify user is participant
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, "گفتگو یافت نشد.");
    }

    const isParticipant = conversation.participants.some((p) => p.toString() === userId);
    if (!isParticipant) {
      throw new ApiError(403, "شما عضو این گفتگو نیستید.");
    }

    const messages = await DirectMessageModel.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate("sender", "name email")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return messages;
  }

  // Mark messages as read
  public async markAsRead(conversationId: string, userId: string): Promise<void> {
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, "گفتگو یافت نشد.");
    }

    const isParticipant = conversation.participants.some((p) => p.toString() === userId);
    if (!isParticipant) {
      throw new ApiError(403, "شما عضو این گفتگو نیستید.");
    }

    // Mark all unread messages in this conversation as read
    await DirectMessageModel.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        "readBy.user": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            user: new Types.ObjectId(userId),
            readAt: new Date(),
          },
        },
      }
    );
  }

  // Edit message
  public async editMessage(messageId: string, userId: string, newContent: string): Promise<IDirectMessage | null> {
    const message = await DirectMessageModel.findById(messageId);
    if (!message) {
      throw new ApiError(404, "پیام یافت نشد.");
    }

    if (message.sender.toString() !== userId) {
      throw new ApiError(403, "شما فقط می‌توانید پیام‌های خود را ویرایش کنید.");
    }

    message.content = newContent;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    return message.populate("sender", "name email");
  }

  // Delete message (soft delete)
  public async deleteMessage(messageId: string, userId: string): Promise<IDirectMessage | null> {
    const message = await DirectMessageModel.findById(messageId);
    if (!message) {
      throw new ApiError(404, "پیام یافت نشد.");
    }

    if (message.sender.toString() !== userId) {
      throw new ApiError(403, "شما فقط می‌توانید پیام‌های خود را حذف کنید.");
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = "این پیام حذف شده است.";
    await message.save();

    return message;
  }

  // Archive conversation for a user
  public async archiveConversation(conversationId: string, userId: string): Promise<IConversation | null> {
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, "گفتگو یافت نشد.");
    }

    const isParticipant = conversation.participants.some((p) => p.toString() === userId);
    if (!isParticipant) {
      throw new ApiError(403, "شما عضو این گفتگو نیستید.");
    }

    // Add user to archivedBy if not already there
    if (!conversation.archivedBy) conversation.archivedBy = [];
    const alreadyArchived = conversation.archivedBy.some((id) => id.toString() === userId);
    if (!alreadyArchived) {
      conversation.archivedBy.push(new Types.ObjectId(userId) as any);
    }

    // If all participants archived, mark conversation as archived
    if (conversation.archivedBy.length === conversation.participants.length) {
      conversation.isArchived = true;
    }

    await conversation.save();
    return conversation;
  }

  // Get total unread count for user in a need
  public async getUnreadCount(needId: string, userId: string): Promise<number> {
    // Get all user's conversations in this need
    const conversations = await ConversationModel.find({
      need: needId,
      participants: userId,
      isArchived: false,
    }).select("_id");

    const conversationIds = conversations.map((c) => c._id);

    // Count unread messages across all conversations
    const unreadCount = await DirectMessageModel.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: userId },
      "readBy.user": { $ne: userId },
      isDeleted: false,
    });

    return unreadCount;
  }
}

export const directMessageService = new DirectMessageService();
