import { FastifyInstance } from "fastify";
import { loginUserHandler, registerUserHandler } from "./auth.controller";
import { createUserSchema } from "./auth.schema";

export default function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", {}, loginUserHandler);

  app.post("/auth/register", { schema: createUserSchema }, registerUserHandler);
}
