import { FastifyReply, FastifyRequest } from "fastify";
import { createUserInput, loginUserInput } from "./auth.types";
import {
  loginUser,
  refreshToken,
  registerUser,
  revokeToken,
} from "./auth.service";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: createUserInput }>,
  reply: FastifyReply,
) {
  const newUserData = request.body;

  const register = await registerUser(newUserData);

  if (!register) {
    return reply.status(409).send({
      message: "User Already Exist",
    });
  }

  return reply.status(201).send(register);
}

export async function loginUserHandler(
  request: FastifyRequest<{ Body: loginUserInput }>,
  reply: FastifyReply,
) {
  const { user, refreshToken } = await loginUser(request.body);

  if (!user) {
    return reply.status(401).send({
      message: "Invalid Credentials",
      error: 401,
    });
  }

  const accessToken = await reply.jwtSign({
    sub: user.id,
    email: user.email,
  });

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return reply.status(200).send({
    accessToken,
    user,
  });
}

export async function refreshTokenHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.cookies.refreshToken;

  if (!token) return reply.status(401).send({ message: "Unauthorized" });

  try {
    const { user, newToken } = await refreshToken(token);

    const accessToken = await reply.jwtSign({
      sub: user.id,
      email: user.email,
    });

    reply.setCookie("refreshToken", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return reply.status(200).send({ accessToken });
  } catch {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.cookies.refreshToken;

  if (token) {
    await revokeToken(token);
  }

  reply.clearCookie("refreshToken", { path: "/" });

  return reply.status(200).send();
}
