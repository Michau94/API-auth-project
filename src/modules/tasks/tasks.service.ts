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
  const task = await prisma.task.findFirst({
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
  const updatedTask = await prisma.$transaction(async (tx) => {
    const result = await tx.task.updateMany({
      where: { id, userId },
      data: {
        ...updates,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return tx.task.findFirst({
      where: { id, userId },
    });
  });

  if (!updatedTask) {
    return null;
  }

  return updatedTask;
}

export async function deleteTaskById(id: string, userId: string) {
  const deletedTask = await prisma.task.deleteMany({
    where: {
      id,
      userId,
    },
  });

  if (deletedTask.count === 0) {
    return false;
  }

  return true;
}
