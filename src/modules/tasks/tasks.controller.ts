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
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const tasks = await getAllTasks();

  return reply.status(200).send({
    data: tasks,
  });
}

export async function getTaskByHandler(
  request: FastifyRequest<{ Params: TaskParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const task = await getTaskById(id);

  if (!task) {
    return reply.status(404).send({
      message: "Task not found",
    });
  }

  return reply.status(200).send({
    task,
  });
}

export async function createTaskHandler(
  request: FastifyRequest<{ Body: CreateTaskBody }>,
  reply: FastifyReply,
) {
  const newTask = await createTask(request.body);

  return reply.status(201).send({
    data: newTask,
  });
}

export function updateTaskHandler(
  request: FastifyRequest<{ Body: UpdateTaskBody; Params: TaskParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const updatedTask = updateById(id, request.body);

  if (!updatedTask) {
    return reply.status(404).send({
      message: "Task not found",
    });
  }

  return reply.status(201).send({
    data: updatedTask,
  });
}

export async function deleteTaskHandler(
  request: FastifyRequest<{ Params: TaskParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const deleted = deleteTaskById(id);

  if (!deleted) {
    return reply.status(404).send({
      message: "Task not found",
    });
  }

  return reply.status(204).send();
}
