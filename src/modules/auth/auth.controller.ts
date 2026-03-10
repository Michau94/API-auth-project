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
      message: "User Already Exist",
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
    return reply.status(401).send({
      message: "Invalid Credentials",
      error: 401,
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
