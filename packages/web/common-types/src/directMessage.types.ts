import { IUser, INeed } from "./";
import { ObjectId } from "./object-id.type";

// Message read status
export type MessageReadStatus = "sent" | "delivered" | "read";

// Direct message between supporters
export interface IDirectMessage {
  _id: string;
  conversation: IConversation | string | ObjectId;
  sender: IUser | string | ObjectId;
  content: string;
  readBy: Array<{
    user: IUser | string | ObjectId;
    readAt: Date;
  }>;
  attachments?: IMessageAttachment[];
  replyTo?: IDirectMessage | string | ObjectId;
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
  need: INeed | string | ObjectId;
  participants: (IUser | string | ObjectId)[];
  type: ConversationType;
  title?: string; // For group conversations
  lastMessage?: IDirectMessage | string | ObjectId;
  lastMessageAt?: Date;
  unreadCount?: number;
  createdBy: IUser | string | ObjectId;
  isArchived?: boolean;
  archivedBy?: (IUser | string | ObjectId)[];
  createdAt: Date;
  updatedAt: Date;
}

// Conversation type
export type ConversationType = "one_to_one" | "group";
