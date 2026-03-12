import { assertProjectAccess } from "../../lib/permissions";
import { prisma } from "../../lib/prisma";
import {
  AddMemberBody,
  CreateProjectBody,
  UpdateProjectBody,
} from "./projects.types";

export async function createProject(userId: string, input: CreateProjectBody) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name: input.name,
        description: input.description,
        ownerId: userId,
      },
    });

    await tx.projectMember.create({
      data: {
        userId,
        projectId: project.id,
        role: "ADMIN",
      },
    });

    return project;
  });
}

export async function listProjects(userId: string) {
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId } } },
  });

  return projects;
}

export async function getProjectById(projectId: string, userId: string) {
  await assertProjectAccess(prisma, projectId, userId);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  return project;
}

export async function updateProject(
  projectId: string,
  userId: string,
  input: UpdateProjectBody,
) {
  const member = await assertProjectAccess(prisma, projectId, userId);

  const isAdmin = member.role === "ADMIN";

  if (!isAdmin) {
    const error = new Error("FORBIDDEN");
    (error as any).statusCode = 403;
    throw error;
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...input,
    },
  });

  return updatedProject;
}

export async function deleteProject(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    const err = new Error("NOT_FOUND");
    (err as any).statusCode = 404;
    throw err;
  }

  if (project.ownerId !== userId) {
    const err = new Error("FORBIDDEN");
    (err as any).statusCode = 403;
    throw err;
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.deleteMany({
      where: { projectId },
    });

    await tx.project.delete({
      where: { id: projectId },
    });
  });
}

export async function addMember(
  projectId: string,
  requesterId: string,
  input: AddMemberBody,
) {
  const member = await assertProjectAccess(prisma, projectId, requesterId);

  if (member.role !== "ADMIN") {
    const err = new Error("FORBIDDEN");
    (err as any).statusCode = 403;
    throw err;
  }

  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      email: true,
      id: true,
    },
  });

  if (!user) {
    const err = new Error("NOT_FOUND");
    (err as any).statusCode = 404;
    throw err;
  }

  await prisma.projectMember.create({
    data: {
      projectId,
      userId: user.id,
      role: input.role,
    },
  });
}
