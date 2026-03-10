import argon2, { argon2id } from "argon2";
import { prisma } from "../../lib/prisma";
import { createUserInput, loginUserInput } from "./auth.types";

export async function loginUser(userData: loginUserInput) {
  const { email, password } = userData;

  if (!password) {
    throw new Error("Password is required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, passwordHash: true },
  });

  if (!user) {
    return null;
  }

  const isValid = await argon2.verify(user.passwordHash, password);

  if (!isValid) {
    const err = new Error("INVALID_CREDENTIALS");
    (err as any).statusCode = 401;
    throw err;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

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
