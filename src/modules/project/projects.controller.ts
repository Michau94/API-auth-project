import { FastifyReply, FastifyRequest } from "fastify";
import {
  createProject,
  getProjectById,
  listProjects,
} from "./projects.service";
import { CreateProjectBody, ProjectParams } from "./projects.types";

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

export async function updateProjectHandler() {}

export function deleteProjectHandler() {}

export function addMemberHandler() {}
