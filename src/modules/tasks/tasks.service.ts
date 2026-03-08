import { prisma } from "../../lib/prisma";
import { tasks } from "./tasks.store";
import { CreateTaskBody, UpdateTaskBody } from "./tasks.types";

export async function getAllTasks() {
  const tasks = await prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
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

export async function updateById(id: string, updates: UpdateTaskBody) {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    return null;
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      ...updates,
    },
  });

  return updatedTask;
}

export async function deleteTaskById(id: string) {
  const task = prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    return false;
  }

  await prisma.task.delete({
    where: {
      id,
    },
  });

  return true;
}
