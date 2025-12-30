export enum TodoTaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum TodoTaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TodoTaskCategory {
  ARTICLE = "article",
  VIDEO = "video",
  GALLERY = "gallery",
  PROJECT = "project",
  NEWS = "news",
  VOLUNTEER = "volunteer",
  DONATION = "donation",
  NEED = "need",
  COMMENT = "comment",
  USER = "user",
  GENERAL = "general",
  BUG = "bug",
  FEATURE = "feature",
  MEETING = "meeting",
  REVIEW = "review",
}

export interface ITodoTask {
  _id: string;
  title: string;
  description?: string;
  category: TodoTaskCategory;
  priority: TodoTaskPriority;
  status: TodoTaskStatus;
  dueDate?: Date;
  assignedTo?: any; // User ID or populated User object
  relatedEntityId?: string; // ID of related entity (article, project, etc.)
  relatedEntityType?: TodoTaskCategory;
  tags?: string[];
  notes?: string;
  completedAt?: Date;
  createdBy: any; // User ID or populated User object
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTodoTaskDTO {
  title: string;
  description?: string;
  category: TodoTaskCategory;
  priority: TodoTaskPriority;
  status?: TodoTaskStatus;
  dueDate?: Date | string;
  assignedTo?: string;
  relatedEntityId?: string;
  relatedEntityType?: TodoTaskCategory;
  tags?: string[];
  notes?: string;
}

export interface IUpdateTodoTaskDTO {
  title?: string;
  description?: string;
  category?: TodoTaskCategory;
  priority?: TodoTaskPriority;
  status?: TodoTaskStatus;
  dueDate?: Date | string;
  assignedTo?: string;
  relatedEntityId?: string;
  relatedEntityType?: TodoTaskCategory;
  tags?: string[];
  notes?: string;
}
