import { FastifyInstance } from "fastify";
import {
  createTaskSchema,
  deleteTaskSchema,
  getTaskByIdSchema,
  getTasksSchema,
  updateTaskSchema,
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
  app.get<{ Params: { projectId: string } }>(
    "/projects/:projectId/tasks",
    { onRequest: [app.authenticate], schema: getTasksSchema },
    getTasksHandler,
  );

  app.post<{ Params: { projectId: string }; Body: CreateTaskBody }>(
    "/projects/:projectId/tasks",
    { onRequest: [app.authenticate], schema: createTaskSchema },
    createTaskHandler,
  );

  app.get<{ Params: TaskParams }>(
    "/projects/:projectId/tasks/:id",
    { onRequest: [app.authenticate], schema: getTaskByIdSchema },
    getTaskByHandler,
  );

  app.patch<{ Params: TaskParams; Body: UpdateTaskBody }>(
    "/projects/:projectId/tasks/:id",
    { onRequest: [app.authenticate], schema: updateTaskSchema },
    updateTaskHandler,
  );

  app.delete<{ Params: TaskParams }>(
    "/projects/:projectId/tasks/:id",
    { onRequest: [app.authenticate], schema: deleteTaskSchema },
    deleteTaskHandler,
  );
}
