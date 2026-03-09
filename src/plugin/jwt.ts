import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default fp(async function jwtPlugin(app: FastifyInstance) {
  app.register(jwt, {
    secret: process.env.JWT_SECRET as string,
    sign: {
      expiresIn: "15m",
    },
    formatUser: (payload) => ({
      id: payload.sub,
      email: payload.email,
    }),
  });

  app.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (e) {
        return reply.status(401).send({ message: "Unauthorized" });
      }
    },
  );
});
