import { FastifyInstance } from "fastify";
import {
  addProjectMemberSchema,
  createProjectSchema,
  deleteProjectSchema,
  getProjectByIdSchema,
  getProjectsSchema,
  updateProjectSchema,
} from "./projects.schema";
import {
  addMemberHandler,
  createProjectHandler,
  deleteProjectHandler,
  getProjectHandler,
  listProjectsHandler,
  updateProjectHandler,
} from "./projects.controller";
import {
  AddMemberBody,
  CreateProjectBody,
  ProjectParams,
  UpdateProjectBody,
} from "./projects.types";

export async function projectRoutes(app: FastifyInstance) {
  app.get(
    "/projects",
    { onRequest: [app.authenticate], schema: getProjectsSchema },
    listProjectsHandler,
  );

  app.post<{ Body: CreateProjectBody }>(
    "/projects",
    { onRequest: [app.authenticate], schema: createProjectSchema },
    createProjectHandler,
  );

  app.get<{ Params: ProjectParams }>(
    "/projects/:id",
    { onRequest: [app.authenticate], schema: getProjectByIdSchema },
    getProjectHandler,
  );

  app.patch<{ Params: ProjectParams; Body: UpdateProjectBody }>(
    "/projects/:id",
    { onRequest: [app.authenticate], schema: updateProjectSchema },
    updateProjectHandler,
  );

  app.delete<{ Params: ProjectParams }>(
    "/projects/:id",
    { onRequest: [app.authenticate], schema: deleteProjectSchema },
    deleteProjectHandler,
  );

  app.post<{ Params: ProjectParams; Body: AddMemberBody }>(
    "/projects/:id/members",
    { onRequest: [app.authenticate], schema: addProjectMemberSchema },
    addMemberHandler,
  );
}
