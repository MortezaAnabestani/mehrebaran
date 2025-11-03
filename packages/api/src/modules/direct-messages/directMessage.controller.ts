import { Request, Response } from "express";
import { directMessageService } from "./directMessage.service";
import {
  createConversationSchema,
  sendMessageSchema,
  editMessageSchema,
} from "./directMessage.validation";
import asyncHandler from "../../core/utils/asyncHandler";
import ApiError from "../../core/utils/apiError";

class DirectMessageController {
  // Create or get conversation
  public createConversation = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createConversationSchema.parse({ body: req.body, params: req.params });
    const { needId } = validatedData.params;
    const { participants, type, title } = validatedData.body;
    const createdBy = req.user!._id.toString();

    const conversation = await directMessageService.createOrGetConversation(
      needId,
      createdBy,
      participants,
      type,
      title
    );

    res.status(201).json({
      message: "گفتگو با موفقیت ایجاد شد.",
      data: conversation,
    });
  });

  // Get user's conversations
  public getUserConversations = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const userId = req.user!._id.toString();

    const conversations = await directMessageService.getUserConversations(needId, userId);

    res.status(200).json({
      results: conversations.length,
      data: conversations,
    });
  });

  // Send message
  public sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = sendMessageSchema.parse({ body: req.body, params: req.params });
    const { conversationId } = validatedData.params;
    const { content, attachments, replyTo } = validatedData.body;
    const senderId = req.user!._id.toString();

    const message = await directMessageService.sendMessage(conversationId, senderId, content, attachments, replyTo);

    res.status(201).json({
      message: "پیام با موفقیت ارسال شد.",
      data: message,
    });
  });

  // Get messages in conversation
  public getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const userId = req.user!._id.toString();
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const messages = await directMessageService.getMessages(conversationId, userId, limit, skip);

    res.status(200).json({
      results: messages.length,
      data: messages,
    });
  });

  // Mark messages as read
  public markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const userId = req.user!._id.toString();

    await directMessageService.markAsRead(conversationId, userId);

    res.status(200).json({
      message: "پیام‌ها به عنوان خوانده شده علامت‌گذاری شدند.",
    });
  });

  // Edit message
  public editMessage = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = editMessageSchema.parse({ body: req.body, params: req.params });
    const { messageId } = validatedData.params;
    const { content } = validatedData.body;
    const userId = req.user!._id.toString();

    const message = await directMessageService.editMessage(messageId, userId, content);

    res.status(200).json({
      message: "پیام با موفقیت ویرایش شد.",
      data: message,
    });
  });

  // Delete message
  public deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const userId = req.user!._id.toString();

    const message = await directMessageService.deleteMessage(messageId, userId);

    res.status(200).json({
      message: "پیام با موفقیت حذف شد.",
      data: message,
    });
  });

  // Archive conversation
  public archiveConversation = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const userId = req.user!._id.toString();

    const conversation = await directMessageService.archiveConversation(conversationId, userId);

    res.status(200).json({
      message: "گفتگو با موفقیت بایگانی شد.",
      data: conversation,
    });
  });

  // Get unread count
  public getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const { needId } = req.params;
    const userId = req.user!._id.toString();

    const unreadCount = await directMessageService.getUnreadCount(needId, userId);

    res.status(200).json({
      data: { unreadCount },
    });
  });
}

export const directMessageController = new DirectMessageController();
