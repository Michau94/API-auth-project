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

export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id) ?? null;
}

export function createTask(input: CreateTaskBody): Task {
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    status: input.status ?? "TODO",
    priority: input.priority ?? "MEDIUM",
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  return newTask;
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
