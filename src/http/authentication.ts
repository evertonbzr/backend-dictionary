import { redisInstance } from "@/db/redis";
import { redisGet, redisSet } from "@/utils/redis";
import "@fastify/cookie";
import "@fastify/jwt";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Redis } from "ioredis";
import z from "zod";

const jwtPayloadSchema = z.object({
  sub: z.string(),
  createdAt: z.string(),
});

type JwtPayload = z.infer<typeof jwtPayloadSchema>;

declare module "fastify" {
  interface FastifyRequest {
    getCurrentUser: () => Promise<{ user: any }>;
    signJwt: (payload: JwtPayload) => Promise<string>;
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

      const cachedUser = await getCachedUser({ id: payload.sub });

      if (!cachedUser.user) {
        return reply.status(400).send({ message: "User not found" });
      }

      return {
        user: cachedUser.user,
      };
    };
    request.signJwt = async (payload: JwtPayload) => {
      return fastify.jwt.sign(payload);
    };
  });
};

async function getCachedUser({
  id,
  redis = redisInstance,
}: {
  id: string;
  redis?: Redis;
}) {
  const key = `uid:${id}`;

  const cachedUser: { user: any } = await redisGet({
    key,
    redisClient: redis,
  });

  if (!cachedUser?.user) {
    const userId = id;

    const user = userId ? await {} : null;

    await redisSet({
      key,
      data: { user },
      cacheTimeSeconds: Number(process.env.JWT_USER_CACHE_TIME ?? 30000),
      redisClient: redis,
    });

    return { user };
  }

  return cachedUser;
}

export default fp(myPluginAsync, {
  name: "myPlugin",
  fastify: "4.x",
  dependencies: ["@fastify/jwt", "@fastify/cookie"],
});
