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
  const refreshHash = createHash("sha256").update(refreshToken).digest("hex");

  await prisma.session.create({
    data: {
      refreshTokenHash: refreshHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    },
  });

  const { passwordHash, ...safeUser } = user;
  return { user: safeUser, refreshToken };
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

export async function refreshToken(token: string) {
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const session = await prisma.session.findUnique({
    where: { refreshTokenHash: tokenHash },
    select: {
      usedAt: true,
      expiresAt: true,
      user: { select: { id: true, email: true } },
    },
  });

  if (!session) {
    const err = new Error("UNAUTHORIZED");
    (err as any).statusCode = 401;
    throw err;
  }

  if (session.expiresAt < new Date()) {
    const err = new Error("UNAUTHORIZED");
    (err as any).statusCode = 401;
    throw err;
  }

  if (!session.user) {
    const err = new Error("UNAUTHORIZED");
    (err as any).statusCode = 401;
    throw err;
  }

  if (session.usedAt !== null) {
    await prisma.session.deleteMany({ where: { userId: session.user.id } });
    const err = new Error("UNAUTHORIZED");
    (err as any).statusCode = 401;
    throw err;
  }

  // ROTATION

  await prisma.session.update({
    where: { refreshTokenHash: tokenHash },
    data: {
      usedAt: new Date(),
    },
  });

  // new session generate

  const newToken = randomBytes(64).toString("hex");

  const newHash = createHash("sha256").update(newToken).digest("hex");

  await prisma.session.create({
    data: {
      refreshTokenHash: newHash,
      userId: session.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user: session.user, newToken };
}

export async function revokeToken(token: string) {
  const tokenHash = createHash("sha256").update("token").digest("hex");

  await prisma.session.updateMany({
    where: {
      refreshTokenHash: tokenHash,
    },
    data: {
      usedAt: new Date(),
    },
  });
}
