export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  projectId: string;
  updatedAt: string;
  assigneeId?: string;
};

export type CreateTaskBody = {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
};

export type UpdateTaskBody = Partial<CreateTaskBody>;

export type TaskParams = {
  id: string;
};
