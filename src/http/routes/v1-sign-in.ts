// Path: /auth/signup

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { comparePassword } from "@/utils/bcrypt";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const v1SignIn = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = bodySchema.parse(req.body);

  const userFromEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (userFromEmail.length === 0) {
    return reply.status(400).send({
      message: "Email or password is incorrect",
    });
  }

  const passwordMatch = await comparePassword(
    password,
    userFromEmail[0].password
  );

  if (!passwordMatch) {
    return reply.status(400).send({
      message: "Email or password is incorrect",
    });
  }

  const token = await reply.jwtSign({
    sub: userFromEmail[0].id,
    createdAt: new Date().toISOString(),
  });

  reply.setCookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 86400,
    path: "/",
  });
  const { id, name } = userFromEmail[0];

  return reply.send({ id, name, token });
};
