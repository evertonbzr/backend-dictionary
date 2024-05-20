import "@fastify/cookie";
import "@fastify/jwt";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import z from "zod";

const jwtPayloadSchema = z.object({
  sub: z.string(),
  createdAt: z.string(),
  requestId: z.string().optional(),
});

type JwtPayload = z.infer<typeof jwtPayloadSchema>;

declare module "fastify" {
  interface FastifyRequest {
    getCurrentUser: () => Promise<{ session: any }>;
  }
}

const myPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", async (request, reply) => {
    request.getCurrentUser = async () => {
      const token = request.cookies.token;

      if (!token) {
        return reply.status(400).send({ message: "No token found" });
      }

      const payload = fastify.jwt.verify<JwtPayload>(token);

      if (!payload) {
        return reply.status(400).send({ message: "Invalid token" });
      }

      return {
        session: null,
      };
    };
  });
};

export default fp(myPluginAsync, {
  name: "myPlugin",
  fastify: "4.x",
  dependencies: ["@fastify/jwt", "@fastify/cookie"],
});
