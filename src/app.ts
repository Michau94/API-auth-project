import Fastify from "fastify";
import { taskRoutes } from "./modules/tasks/tasks.routes";
import authRoutes from "./modules/auth/auth.router";
import jwtPlugin from "./plugin/jwt";
import cookie from "@fastify/cookie";

export default function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cookie);
  app.register(jwtPlugin);

  app.register(authRoutes);
  app.register(taskRoutes);

  app.get("/health", async () => {
    return { status: "ok" };
  });
  return app;
}
