// Path: /auth/signup

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { hashPassword } from "@/utils/bcrypt";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const v1SignUp = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password } = bodySchema.parse(req.body);

  const userFromEmail = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, email));

  if (userFromEmail.length > 0) {
    return reply.status(400).send({
      message: "Email already in use",
    });
  }

  const passwordHash = await hashPassword(password);

  const [userCreated] = await db
    .insert(users)
    .values({
      email,
      name,
      password: passwordHash,
    })
    .returning({
      id: users.id,
      name: users.name,
    });

  const token = await reply.jwtSign({
    sub: userCreated.id,
    createdAt: new Date().toISOString(),
  });

  reply.setCookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 86400,
    path: "/",
  });

  reply.send({ ...userCreated, token });
};
