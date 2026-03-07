import Fastify from "fastify";

export default function buildApp() {
  const app = Fastify({ logger: true });

  app.get("/health", async () => {
    return { status: "ok" };
  });
  return app;
}
