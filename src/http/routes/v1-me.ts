import { FastifyReply, FastifyRequest } from "fastify";

export const v1Me = async (req: FastifyRequest, reply: FastifyReply) => {
  const { getCurrentUser } = req;

  const { user } = await getCurrentUser();

  reply.send({
    ...user,
    password: undefined,
  });
};
