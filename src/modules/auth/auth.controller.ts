import { FastifyReply, FastifyRequest } from "fastify";
import { createUserInput } from "./auth.types";
import { registerUser } from "./auth.service";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: createUserInput }>,
  reply: FastifyReply,
) {
  const newUserData = request.body;

  const register = await registerUser(newUserData);

  if (!register) {
    return reply.status(409).send({
      message: "user already exist",
    });
  }

  return reply.status(201).send({
    user: register,
  });
}

export function loginUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {}
