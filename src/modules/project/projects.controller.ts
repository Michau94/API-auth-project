import { FastifyReply, FastifyRequest } from "fastify";
import {
  addMember,
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
} from "./projects.service";
import {
  AddMemberBody,
  CreateProjectBody,
  ProjectParams,
  UpdateProjectBody,
} from "./projects.types";

export async function createProjectHandler(
  request: FastifyRequest<{ Body: CreateProjectBody }>,
  reply: FastifyReply,
) {
  const { id } = request.user;

  try {
    const project = await createProject(id, request.body);
    return reply.status(201).send(project);
  } catch (e: any) {
    if (e.statusCode) {
      return reply.status(e.statusCode).send({
        message: e.message,
      });
    }
    throw e;
  }
}

export async function listProjectsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.user;

  try {
    const projects = await listProjects(id);
    return reply.status(201).send({ data: [...projects] });
  } catch (e: any) {
    if (e.statusCode) {
      return reply.status(e.statusCode).send({
        message: e.message,
      });
    }
    throw e;
  }
}

export async function getProjectHandler(
  request: FastifyRequest<{ Params: ProjectParams }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const { id } = request.params;

  try {
    const project = await getProjectById(id, userId);
    return reply.status(200).send(project);
  } catch (e: any) {
    if (e.statusCode) {
      return reply.status(e.statusCode).send({
        message: e.message,
      });
    }
    throw e;
  }
}

export async function updateProjectHandler(
  request: FastifyRequest<{ Params: ProjectParams; Body: UpdateProjectBody }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const { id } = request.params;

  try {
    const project = await updateProject(id, userId, request.body);
    return reply.status(201).send(project);
  } catch (e: any) {
    if (e.statusCode) {
      return reply.status(e.statusCode).send({
        message: e.message,
      });
    }
    throw e;
  }
}

export async function deleteProjectHandler(
  request: FastifyRequest<{ Params: ProjectParams }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const { id } = request.params;

  try {
    await deleteProject(id, userId);
    return reply.status(204).send();
  } catch (e: any) {
    if (e.statusCode) {
      return reply.status(e.statusCode).send({
        message: e.message,
      });
    }
    throw e;
  }
}

export async function addMemberHandler(
  request: FastifyRequest<{ Params: ProjectParams; Body: AddMemberBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const userId = request.user.id;

  try {
    await addMember(id, userId, request.body);

    return reply.status(200).send();
  } catch (e: any) {
    if (e.statusCode) {
      return reply.status(e.statusCode).send({
        message: e.message,
      });
    }
    throw e;
  }
}
