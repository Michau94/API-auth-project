// src/lib/permissions.ts
import { PrismaClient } from "../generated/prisma";

export async function assertProjectAccess(
  prisma: PrismaClient,
  projectId: string,
  userId: string,
) {
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
  });

  if (!projectMember) {
    const err = new Error("NOT_FOUND");
    (err as any).statusCode = 404;
    throw err;
  }

  return projectMember;
}
