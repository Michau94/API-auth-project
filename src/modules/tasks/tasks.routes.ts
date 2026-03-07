import { FastifyInstance } from "fastify";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} from "./tasks.schema";

import { tasks } from "./tasks.store";

import {
  CreateTaskBody,
  Task,
  TaskParams,
  UpdateTaskBody,
} from "./tasks.types";

export async function taskRoutes(app: FastifyInstance) {
  // get TASK from store
  app.get("/tasks", async () => {
    return { data: tasks };
  });

  app.get<{ Params: TaskParams }>(
    "/tasks/:id",
    { schema: taskIdParamSchema },
    async (request, reply) => {
      const { id } = request.params;

      console.log(id, "ID");

      console.log(tasks, "TASK");
      const task = tasks.find((task) => task.id === id);

      if (!task) {
        return reply.status(404).send({
          message: "Task not found!_",
        });
      }

      return { data: task };
    },
  );

  app.post<{ Body: CreateTaskBody }>(
    "/tasks",
    { schema: createTaskSchema },
    async (request, reply) => {
      const { title, description, status, priority } = request.body;

      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        status: status ?? "TODO",
        priority: priority ?? "LOW",
        createdAt: new Date().toISOString(),
      };

      tasks.push(newTask);

      return reply.status(201).send({
        data: newTask,
      });
    },
  );

  app.patch<{ Params: TaskParams; Body: UpdateTaskBody }>(
    "/tasks/:id",
    { schema: updateTaskSchema },
    async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;

      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return reply.status(404).send({
          message: "Task not found!",
        });
      }

      const currentTask = tasks[taskIndex];
      const updatedTask: Task = {
        ...currentTask,
        ...updates,
      };

      tasks[taskIndex] = updatedTask;

      return {
        data: updatedTask,
      };
    },
  );

  app.delete<{ Params: TaskParams }>(
    "/tasks/:id",
    { schema: taskIdParamSchema },
    async (request, reply) => {
      const { id } = request.params;

      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return reply.status(404).send({ message: "Task not found" });
      }

      tasks.splice(taskIndex, 1);

      return reply.status(204).send();
    },
  );
}
