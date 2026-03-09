export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  userId: string;
};

export type CreateTaskBody = {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};

export type UpdateTaskBody = Partial<CreateTaskBody>;

export type TaskParams = {
  id: string;
};
