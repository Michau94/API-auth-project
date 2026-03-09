import { FastifyReply, FastifyRequest } from "fastify";
import {
  createTask,
  deleteTaskById,
  getAllTasks,
  getTaskById,
  updateById,
} from "./tasks.service";
import { CreateTaskBody, TaskParams, UpdateTaskBody } from "./tasks.types";

export async function getTasksHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tasks = await getAllTasks(request.user.id);

  return reply.status(200).send({
    data: tasks,
  });
}

export async function getTaskByHandler(
  request: FastifyRequest<{ Params: TaskParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const userId = request.user.id;

  const task = await getTaskById(id, userId);

  if (!task) {
    return reply.status(404).send({
      message: "Task not found",
    });
  }

  return reply.status(200).send({
    data: task,
  });
}

export async function createTaskHandler(
  request: FastifyRequest<{ Body: CreateTaskBody }>,
  reply: FastifyReply,
) {
  const newTask = await createTask(request.body, request.user.id);

  return reply.status(201).send({
    data: newTask,
  });
}

export async function updateTaskHandler(
  request: FastifyRequest<{ Body: UpdateTaskBody; Params: TaskParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const updatedTask = await updateById(id, request.body, request.user.id);

  if (!updatedTask) {
    return reply.status(404).send({
      message: "Task not found",
    });
  }

  return reply.status(200).send({
    data: updatedTask,
  });
}

export async function deleteTaskHandler(
  request: FastifyRequest<{ Params: TaskParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const deleted = await deleteTaskById(id, request.user.id);

  if (!deleted) {
    return reply.status(404).send({
      message: "Task not found",
    });
  }

  return reply.status(204).send();
}
