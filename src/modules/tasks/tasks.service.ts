import { prisma } from "../../lib/prisma";
import { CreateTaskBody, UpdateTaskBody } from "./tasks.types";

export async function getAllTasks(projectId: string) {
  const tasks = await prisma.task.findMany({
    where: { projectId },
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

export async function getTaskById(id: string, projectId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id,
      projectId,
    },
  });

  return task;
}

export async function createTask(input: CreateTaskBody, projectId: string) {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "TODO",
      priority: input.priority ?? "MEDIUM",
      projectId,
    },
  });

  return task;
}

export async function updateById(
  id: string,
  updates: UpdateTaskBody,
  projectId: string,
) {
  const updatedTask = await prisma.$transaction(async (tx) => {
    const result = await tx.task.updateMany({
      where: { id, projectId },
      data: {
        ...updates,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return tx.task.findFirst({
      where: { id, projectId },
    });
  });

  if (!updatedTask) {
    return null;
  }

  return updatedTask;
}

export async function deleteTaskById(id: string, projectId: string) {
  const deletedTask = await prisma.task.deleteMany({
    where: {
      id,
      projectId,
    },
  });

  if (deletedTask.count === 0) {
    return false;
  }

  return true;
}
