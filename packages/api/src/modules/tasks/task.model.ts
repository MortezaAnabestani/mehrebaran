import { Schema, model } from "mongoose";
import { ITodoTask, TodoTaskPriority, TodoTaskStatus, TodoTaskCategory } from "common-types";

const taskSchema = new Schema<ITodoTask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: Object.values(TodoTaskCategory),
      required: true,
      default: TodoTaskCategory.GENERAL,
    },
    priority: {
      type: String,
      enum: Object.values(TodoTaskPriority),
      required: true,
      default: TodoTaskPriority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TodoTaskStatus),
      required: true,
      default: TodoTaskStatus.TODO,
    },
    dueDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    relatedEntityId: { type: String },
    relatedEntityType: { type: String, enum: Object.values(TodoTaskCategory) },
    tags: [{ type: String }],
    notes: { type: String },
    completedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Index for efficient queries
taskSchema.index({ createdBy: 1, status: 1, dueDate: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ category: 1, status: 1 });

export const TaskModel = model<ITodoTask>("Task", taskSchema);
