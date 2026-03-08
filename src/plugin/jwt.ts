import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default fp(async function jwtPlugin(app: FastifyInstance) {
  app.register(jwt, {
    secret: process.env.JWT_SECRET as string,
    sign: {
      expiresIn: "15m",
    },
  });

  app.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      await request.jwtVerify();
    },
  );
});
