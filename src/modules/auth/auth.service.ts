import argon2, { argon2id } from "argon2";
import { prisma } from "../../lib/prisma";
import { createUserInput, loginUserInput } from "./auth.types";
import { createHash, randomBytes } from "crypto";

export async function loginUser(userData: loginUserInput) {
  const { email, password } = userData;

  if (!password) {
    throw new Error("Password is required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const err = new Error("INVALID_CREDENTIALS");
    (err as any).statusCode = 401;
    throw err;
  }

  const isValid = await argon2.verify(user.passwordHash, password);

  if (!isValid) {
    const err = new Error("INVALID_CREDENTIALS");
    (err as any).statusCode = 401;
    throw err;
  }

  const refreshToken = randomBytes(64).toString("hex");

  // hashing refresh token
  const refreshHash = await argon2.hash(password, { type: argon2id });

  await prisma.session.create({
    data: {
      refreshTokenHash: refreshHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    },
  });

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
    const err = new Error("EMAIL_ALREADY_IN_USE");
    (err as any).statusCode = 409;
    throw err;
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

export async function refreshToken() {}

export async function revokeToken() {}
