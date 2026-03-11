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
  request: FastifyRequest<{
    Params: { projectId: string };
  }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const projectId = request.params.projectId;

  const tasks = await getAllTasks(projectId, userId);

  return reply.status(200).send({
    data: tasks,
  });
}

export async function getTaskByHandler(
  request: FastifyRequest<{ Params: TaskParams }>,
  reply: FastifyReply,
) {
  const { id, projectId } = request.params;
  const userId = request.user.id;

  const task = await getTaskById(id, projectId, userId);

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
  request: FastifyRequest<{
    Params: { projectId: string };
    Body: CreateTaskBody;
  }>,
  reply: FastifyReply,
) {
  const projectId = request.params.projectId;

  const newTask = await createTask(request.body, projectId, request.user.id);

  return reply.status(201).send({
    data: newTask,
  });
}

export async function updateTaskHandler(
  request: FastifyRequest<{ Body: UpdateTaskBody; Params: TaskParams }>,
  reply: FastifyReply,
) {
  const { id, projectId } = request.params;

  const updatedTask = await updateById(
    id,
    request.body,
    projectId,
    request.user.id,
  );

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
  const { id, projectId } = request.params;

  const deleted = await deleteTaskById(id, projectId, request.user.id);

  if (!deleted) {
    return reply.status(404).send({
      message: "Task not found",
    });
  }

  return reply.status(204).send();
}
