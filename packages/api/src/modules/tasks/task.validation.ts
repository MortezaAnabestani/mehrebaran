import { z } from "zod";
import { TodoTaskPriority, TodoTaskStatus, TodoTaskCategory } from "common-types";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "عنوان الزامی است").max(200, "عنوان نباید بیشتر از 200 کاراکتر باشد"),
    description: z.string().max(2000, "توضیحات نباید بیشتر از 2000 کاراکتر باشد").optional(),
    category: z.nativeEnum(TodoTaskCategory),
    priority: z.nativeEnum(TodoTaskPriority).default(TodoTaskPriority.MEDIUM),
    status: z.nativeEnum(TodoTaskStatus).default(TodoTaskStatus.TODO),
    dueDate: z.string().datetime().or(z.date()).optional(),
    assignedTo: z.string().optional(),
    relatedEntityId: z.string().optional(),
    relatedEntityType: z.nativeEnum(TodoTaskCategory).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().max(2000).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    category: z.nativeEnum(TodoTaskCategory).optional(),
    priority: z.nativeEnum(TodoTaskPriority).optional(),
    status: z.nativeEnum(TodoTaskStatus).optional(),
    dueDate: z.string().datetime().or(z.date()).optional(),
    assignedTo: z.string().optional(),
    relatedEntityId: z.string().optional(),
    relatedEntityType: z.nativeEnum(TodoTaskCategory).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().max(2000).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(TodoTaskStatus).optional(),
    category: z.nativeEnum(TodoTaskCategory).optional(),
    priority: z.nativeEnum(TodoTaskPriority).optional(),
    assignedTo: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
  }),
});
