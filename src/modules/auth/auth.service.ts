import argon2, { argon2id } from "argon2";
import { prisma } from "../../lib/prisma";
import { createUserInput } from "./auth.types";

export function loginUser() {}

export async function registerUser(userData: createUserInput) {
  const { name, email, password } = userData;

  if (!password) {
    throw new Error("Password is required");
  }

  const userExist = await prisma.user.findUnique({ where: { email } });

  if (userExist) {
    return null;
  }

  const passwordHash = await argon2.hash(password, { type: argon2id });

  const newUser = await prisma.user.create({
    data: {
      name,
      passwordHash,
      email,
    },
    select: {
      name: true,
      email: true,
    },
  });

  return newUser;
}
