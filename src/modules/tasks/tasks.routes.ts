import { FastifyInstance } from "fastify";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} from "./tasks.schema";

import { CreateTaskBody, TaskParams, UpdateTaskBody } from "./tasks.types";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskByHandler,
  getTasksHandler,
  updateTaskHandler,
} from "./tasks.controller";

export async function taskRoutes(app: FastifyInstance) {
  // get TASK from store
  app.get("/tasks", { onRequest: [app.authenticate] }, getTasksHandler);

  app.post<{ Body: CreateTaskBody }>(
    "/tasks",
    { schema: createTaskSchema },
    createTaskHandler,
  );

  app.get<{ Params: TaskParams }>(
    "/tasks/:id",
    { schema: taskIdParamSchema },
    getTaskByHandler,
  );

  app.patch<{ Params: TaskParams; Body: UpdateTaskBody }>(
    "/tasks/:id",
    { schema: updateTaskSchema },
    updateTaskHandler,
  );

  app.delete<{ Params: TaskParams }>(
    "/tasks/:id",
    { schema: taskIdParamSchema },
    deleteTaskHandler,
  );
}
