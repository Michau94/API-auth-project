import { FastifyInstance } from "fastify";
import {
  loginUserHandler,
  logoutHandler,
  refreshTokenHandler,
  registerUserHandler,
} from "./auth.controller";
import { createUserSchema, loginUserSchema } from "./auth.schema";

export default function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", { schema: loginUserSchema }, loginUserHandler);

  app.post("/auth/register", { schema: createUserSchema }, registerUserHandler);

  app.post("/auth/refresh", refreshTokenHandler);

  app.post("/auth/logout", { onRequest: [app.authenticate] }, logoutHandler);
}
