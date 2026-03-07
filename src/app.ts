import Fastify from "fastify";
import { taskRoutes } from "./modules/tasks/tasks.routes";

export default function buildApp() {
  const app = Fastify({ logger: true });

  app.register(taskRoutes);

  app.get("/health", async () => {
    return { status: "ok" };
  });
  return app;
}
