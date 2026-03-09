import { prisma } from "../../lib/prisma";
import { CreateTaskBody, UpdateTaskBody } from "./tasks.types";

export async function getAllTasks(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      status: true,
      priority: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
}

export async function getTaskById(id: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: {
      id,
      userId,
    },
  });

  return task;
}

export async function createTask(input: CreateTaskBody, userId: string) {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "TODO",
      priority: input.priority ?? "MEDIUM",
      userId,
    },
  });

  return task;
}

export async function updateById(
  id: string,
  updates: UpdateTaskBody,
  userId: string,
) {
  const task = await prisma.task.findUnique({
    where: { id, userId },
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

export async function deleteTaskById(id: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id, userId },
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
