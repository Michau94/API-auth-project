import { prisma } from "../../lib/prisma";
import { tasks } from "./tasks.store";
import { CreateTaskBody, Task, UpdateTaskBody } from "./tasks.types";

export async function getAllTasks() {
  return await prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTaskById(id: string) {
  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  return task;
}

export async function createTask(input: CreateTaskBody) {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "TODO",
      priority: input.priority ?? "MEDIUM",
    },
  });

  return task;
}

export function updateById(id: string, updates: UpdateTaskBody) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return null;
  }
  const updatedTask: Task = {
    ...tasks[taskIndex],
    ...updates,
  };

  tasks[taskIndex] = updatedTask;

  return updatedTask;
}

export function deleteTaskById(id: string) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);

  return true;
}
