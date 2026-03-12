import { FastifyReply, FastifyRequest } from "fastify";
import { createProject, listProjects } from "./projects.service";
import { CreateProjectBody } from "./projects.types";

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

export function listProjectsHandler() {}

export function getProjectHandler() {}

export function updateProjectHandler() {}

export function deleteProjectHandler() {}

export function addMemberHandler() {}
