import { IUser, INeed } from "./";
import { Types } from "mongoose";

// Message read status
export type MessageReadStatus = "sent" | "delivered" | "read";

// Direct message between supporters
export interface IDirectMessage {
  _id: string;
  conversation: IConversation | string | Types.ObjectId;
  sender: IUser | string | Types.ObjectId;
  content: string;
  readBy: Array<{
    user: IUser | string | Types.ObjectId;
    readAt: Date;
  }>;
  attachments?: IMessageAttachment[];
  replyTo?: IDirectMessage | string | Types.ObjectId;
  isEdited?: boolean;
  editedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Message attachment
export interface IMessageAttachment {
  type: "image" | "document" | "video" | "audio";
  url: string;
  filename: string;
  fileSize?: number;
  mimeType?: string;
}

// Conversation between supporters in a need context
export interface IConversation {
  _id: string;
  need: INeed | string | Types.ObjectId;
  participants: (IUser | string | Types.ObjectId)[];
  type: ConversationType;
  title?: string; // For group conversations
  lastMessage?: IDirectMessage | string | Types.ObjectId;
  lastMessageAt?: Date;
  unreadCount?: number;
  createdBy: IUser | string | Types.ObjectId;
  isArchived?: boolean;
  archivedBy?: (IUser | string | Types.ObjectId)[];
  createdAt: Date;
  updatedAt: Date;
}

// Conversation type
export type ConversationType = "one_to_one" | "group";
