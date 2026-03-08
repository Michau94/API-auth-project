import { FastifyReply, FastifyRequest } from "fastify";
import { createUserInput, loginUserInput } from "./auth.types";
import { loginUser, registerUser } from "./auth.service";

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

  return reply.status(201).send(register);
}

export async function loginUserHandler(
  request: FastifyRequest<{ Body: loginUserInput }>,
  reply: FastifyReply,
) {
  const user = await loginUser(request.body);

  if (!user) {
    return reply.status(400).send({
      message: "Invalid Credentials",
    });
  }

  const accessToken = await reply.jwtSign({
    sub: user.id,
    email: user.email,
  });

  return reply.status(200).send({
    accessToken,
    user,
  });
}
